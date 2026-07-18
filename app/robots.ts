import type { MetadataRoute } from "next";

/* Indexing opens only when NEXT_PUBLIC_SITE_LIVE=true (set at launch on the
   final domain). Previews and staging remain closed to crawlers. */
export default function robots(): MetadataRoute.Robots {
  const live = process.env.NEXT_PUBLIC_SITE_LIVE === "true";
  if (!live) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/design-system"] },
    sitemap: "https://waypointandco.com/sitemap.xml",
  };
}
