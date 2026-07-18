"use client";
/* Direct route into the Fast Lane. The module (loaded globally) intercepts
   /enquire links in-page; this route covers direct navigation and deep links. */
import { useEffect } from "react";
import StubPage from "@/components/StubPage";

declare global {
  interface Window {
    WaypointFastLane?: { open: (ctx?: unknown) => void };
  }
}

export default function EnquireClient() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    let ctx: { kind?: string; ref?: string } | null = null;
    if (ref) {
      const dot = ref.indexOf(".");
      ctx = dot > 0 ? { kind: ref.slice(0, dot), ref: ref.slice(dot + 1) } : { ref };
    } else if (params.get("dest")) {
      ctx = { kind: "destination", ref: params.get("dest") as string };
    }
    let tries = 0;
    const t = window.setInterval(() => {
      tries++;
      if (window.WaypointFastLane) {
        window.clearInterval(t);
        window.WaypointFastLane.open(ctx || undefined);
      } else if (tries > 40) window.clearInterval(t);
    }, 100);
    return () => window.clearInterval(t);
  }, []);

  return (
    <StubPage
      eyebrow="Enquire"
      title="Tell us a little about your plans."
      lede="The enquiry window is opening. If it doesn't appear, your browser may be blocking scripts — the Journey Engine below reaches the same concierge."
      links={[{ title: "Begin a journey instead", href: "/begin?src=enquire-fallback", label: "Begin" }]}
    />
  );
}
