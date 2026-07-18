import type { Metadata } from "next";
import { InventoryDetail } from "@/components/inventory/FleetPages";
import { bySlug, byCategory } from "@/lib/inventory";

export function generateStaticParams() {
  return byCategory("sea").map((i) => ({ slug: i.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = bySlug("sea", params.slug);
  return { title: i ? `${i.name} — SEA` : "SEA Fleet" };
}
export default function Page({ params }: { params: { slug: string } }) {
  return <InventoryDetail category="sea" slug={params.slug} />;
}
