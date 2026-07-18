"use client";
/* V2.2 — layered inventory image: tries owner-verified, then preview, then the
   approved tonal frame beneath. Lazy by default; hero eager. No layout change:
   it fills the existing frame element. No public status indicator ever renders. */
import { useState } from "react";
import { inventoryImg } from "@/lib/images";

export function InventoryImage({ slug, name = "hero.jpg", alt, eager = false }:
  { slug: string; name?: string; alt: string; eager?: boolean }) {
  const [tier, setTier] = useState<0 | 1 | 2>(0); // 0 verified, 1 preview, 2 none
  if (tier === 2) return null; // tonal frame beneath remains visible
  const src = inventoryImg(slug, name, tier === 0);
  return (
    <img
      src={src} alt={alt}
      loading={eager ? "eager" : "lazy"} decoding="async"
      sizes="(max-width: 700px) 100vw, 50vw"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setTier((t) => (t + 1) as 0 | 1 | 2)}
    />
  );
}
