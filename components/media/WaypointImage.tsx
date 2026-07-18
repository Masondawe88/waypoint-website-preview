/* WAYPOINT production image component · v1.4
   Renders real imagery when supplied; falls back to the approved tonal frame.
   Never renders internal production notes in production builds.
   Supports each existing composition — aspect is supplied per placement,
   never forced to a generic ratio. */
import Image from "next/image";
import { showInternalBriefs } from "@/lib/images";

type Props = {
  src?: string | null;            // local path or Sanity CDN URL (with crop/focal params baked by caller)
  alt: string;                    // required — build fails without it
  tone: [string, string, string]; // fallback gradient (approved aesthetic)
  aspectRatio?: string;           // e.g. "16/10" — matches the placement, not a global default
  sizes?: string;
  priority?: boolean;
  caption?: string | null;        // public caption (optional)
  internalBrief?: string | null;  // dev/CMS only
  focal?: { x: number; y: number } | "center";
  className?: string;
};

export default function WaypointImage({
  src, alt, tone, aspectRatio = "16/10", sizes = "(max-width: 700px) 100vw, 50vw",
  priority = false, caption = null, internalBrief = null, focal = "center", className = "",
}: Props) {
  const grad = `linear-gradient(165deg, ${tone[0]} 0%, ${tone[1]} 52%, ${tone[2]} 100%)`;
  const pos = focal === "center" || !focal ? "50% 50%" : `${focal.x * 100}% ${focal.y * 100}%`;
  return (
    <figure className={className} style={{ position: "relative", aspectRatio, margin: 0, overflow: "hidden", background: grad }}>
      {src ? (
        <Image
          src={src} alt={alt} fill priority={priority} sizes={sizes}
          style={{ objectFit: "cover", objectPosition: pos }}
          placeholder="empty"
        />
      ) : (
        /* Tonal fallback — the frame border matches the approved system */
        <span aria-hidden="true" style={{ position: "absolute", inset: 12, border: "1px solid rgba(241,238,231,.5)", pointerEvents: "none" }} />
      )}
      {!src && internalBrief && showInternalBriefs() && (
        <span style={{
          position: "absolute", left: 22, bottom: 18, right: 22,
          fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: ".22em",
          textTransform: "uppercase", color: "rgba(241,238,231,.85)", lineHeight: 1.9,
        }}>{internalBrief}</span>
      )}
      {caption && <figcaption style={{
        position: "absolute", left: 0, right: 0, bottom: 0, padding: "10px 16px",
        fontFamily: '"IBM Plex Mono",monospace', fontSize: 9, letterSpacing: ".18em",
        textTransform: "uppercase", color: "rgba(241,238,231,.9)",
        background: "linear-gradient(transparent, rgba(33,31,27,.45))",
      }}>{caption}</figcaption>}
    </figure>
  );
}
