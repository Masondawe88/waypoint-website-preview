/* "Continue the Journey" resolver — Ecosystem spec §2.
   Reads the CMS relationship graph over Sanity's HTTP GROQ API.
   Without Sanity configured it returns 404 so page fallbacks stand. */
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const QUERY = `*[_type == $kind && slug.current == $slug][0]{
  "items": related[]{
    "kind": target->_type,
    "ref": target->slug.current,
    "title": coalesce(target->title, target->name),
    "essence": coalesce(essence, target->essence),
    "url": coalesce(target->url, "/"),
    role, stage, order,
    "group": select(
      role == "canonical" => "next-chapter",
      stage == "after" => "further-along",
      role == "editorial" => "more-to-discover",
      "next-chapter"
    )
  } | order(order asc) [0...6]
}`;

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref") || "";
  const dot = ref.indexOf(".");
  if (dot < 1) return NextResponse.json({ items: [] }, { status: 400 });
  const kind = ref.slice(0, dot);
  const slug = ref.slice(dot + 1);

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!projectId) return NextResponse.json({ items: [] }, { status: 404 });

  const url =
    `https://${projectId}.apicdn.sanity.io/v2024-06-01/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}` +
    `&$kind=${encodeURIComponent(JSON.stringify(kind))}` +
    `&$slug=${encodeURIComponent(JSON.stringify(slug))}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return NextResponse.json({ items: [] }, { status: 404 });
    const data = (await res.json()) as { result?: { items?: unknown[] } };
    const items = data.result?.items?.filter(Boolean) ?? [];
    if (!items.length) return NextResponse.json({ items: [] }, { status: 404 });
    return NextResponse.json({ title: "Continue the Journey", items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 404 });
  }
}
