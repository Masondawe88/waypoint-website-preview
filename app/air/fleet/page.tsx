import type { Metadata } from "next";
import { FleetPage } from "@/components/inventory/FleetPages";
export const metadata: Metadata = { title: "The AIR Fleet" };
export default function Page() {
  return (
    <FleetPage
      category="air"
      eyebrow="AIR · The Fleet"
      title="Selected for the journey."
      lede="A curated fleet accessed through selected operators — matched to mission, guests, luggage and runway, never to image. The category is the recommendation; the aircraft is confirmed to the journey."
      editorialHref="/air"
      editorialLabel="The AIR story"
    />
  );
}
