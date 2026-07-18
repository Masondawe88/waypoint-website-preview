import type { Metadata } from "next";
import { InventoryDetail } from "@/components/inventory/FleetPages";
import { bySlug, byCategory } from "@/lib/inventory";

export function generateStaticParams() {
  return byCategory("stay").map((i) => ({ slug: i.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = bySlug("stay", params.slug);
  return { title: i ? `${i.name} — STAY` : "STAY Collection" };
}
export default function Page({ params }: { params: { slug: string } }) {
  return <InventoryDetail category="stay" slug={params.slug} />;
}
