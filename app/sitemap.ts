import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://waypointandco.com";
  const routes = ["", "/sea", "/air", "/stay", "/world", "/world/whitsundays",
    "/world/sydney", "/world/noosa", "/world/tasmania",
    "/air/fleet", "/sea/fleet", "/stay/collection",
    "/journeys", "/journal", "/begin", "/enquire", "/about", "/contact"];
  const now = new Date();
  return routes.map((r) => ({
    url: base + r,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
