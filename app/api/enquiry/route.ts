/* WAYPOINT & Co. — enquiry endpoint (Next.js port of api/enquiry.ts)
   One endpoint, two lanes: submissionType "FastLane" | "JourneyEngine".
   Philosophy: never lose an enquiry, never break the visitor's flow.
   With no env configured (local dev), submissions log to the server console
   and still return ok — so the site works out of the box. */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = {
  submissionType?: string;
  contact?: { name?: string | null; email?: string; phone?: string | null };
  state?: Record<string, unknown>; // Journey Engine sends its full state
  plans?: Record<string, unknown>;
  context?: { kind?: string | null; ref?: string | null; title?: string | null; cmsId?: string | null };
  session?: Record<string, unknown>;
  tracking?: Record<string, unknown>;
  antiSpam?: { website?: string; dwellMs?: number };
};

function extractEmail(p: Payload): string | null {
  const direct = p.contact?.email;
  if (direct) return String(direct);
  const st = p.state as Record<string, unknown> | undefined;
  if (st && typeof st.email === "string" && st.email) return st.email;
  return null;
}

async function persistToSanity(doc: Record<string, unknown>) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !token) return false;
  const url = `https://${projectId}.api.sanity.io/v2024-06-01/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ mutations: [{ create: { _type: "enquiry", status: "new", ...doc } }] }),
  });
  return res.ok;
}

async function notifyByEmail(subject: string, text: string) {
  const key = process.env.ENQUIRY_EMAIL_PROVIDER_KEY;
  const to = process.env.ENQUIRY_TO_ADDRESS || process.env.ENQUIRY_FAILSAFE_ADDRESS;
  const from = process.env.ENQUIRY_FROM_ADDRESS || "concierge@waypointandco.com";
  if (!key || !to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  let p: Payload;
  try {
    p = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  // Spam gates: honeypot filled or inhuman dwell time — pretend success, do nothing.
  const dwell = Number(p.antiSpam?.dwellMs ?? 0);
  if ((p.antiSpam?.website && p.antiSpam.website.length > 0) || (dwell > 0 && dwell < 1200)) {
    return NextResponse.json({ ok: true });
  }

  const email = extractEmail(p);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 422 });
  }

  const record = {
    submissionType: p.submissionType || "Unknown",
    email,
    contact: p.contact ?? null,
    plans: p.plans ?? null,
    engineState: p.state ?? null,
    context: p.context ?? null,
    session: p.session ?? null,
    tracking: { ...(p.tracking || {}), receivedAt: new Date().toISOString() },
    raw: JSON.stringify(p).slice(0, 20000),
  };

  const subject = `[WAYPOINT] ${record.submissionType} enquiry — ${
    p.context?.title || p.context?.cmsId || "General"
  }`;
  const text = JSON.stringify(record, null, 2);

  // Downstream failures must never surface to the visitor.
  const results = await Promise.allSettled([persistToSanity(record), notifyByEmail(subject, text)]);
  const persisted = results.some((r) => r.status === "fulfilled" && r.value === true);
  if (!persisted) {
    // Failsafe: at minimum, the enquiry exists in server logs.
    console.log("[WAYPOINT ENQUIRY — FAILSAFE LOG]", text);
  }

  return NextResponse.json({ ok: true });
}
