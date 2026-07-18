import type { Metadata } from "next";
import { InventoryDetail } from "@/components/inventory/FleetPages";
import { bySlug, byCategory } from "@/lib/inventory";

export function generateStaticParams() {
  return byCategory("air").map((i) => ({ slug: i.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = bySlug("air", params.slug);
  return { title: i ? `${i.name} — AIR` : "AIR Fleet" };
}
export default function Page({ params }: { params: { slug: string } }) {
  return <InventoryDetail category="air" slug={params.slug} />;
}
