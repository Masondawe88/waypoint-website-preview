import type { Metadata } from "next";
import { FleetPage } from "@/components/inventory/FleetPages";
export const metadata: Metadata = { title: "The SEA Fleet" };
export default function Page() {
  return (
    <FleetPage
      category="sea"
      eyebrow="SEA · The Fleet"
      title="The water, by the right vessel."
      lede="The house flagship, the day-charter hero and selected partner vessels — each chosen for its waters and its way of spending a day. Availability is confirmed by people, to your dates."
      editorialHref="/sea"
      editorialLabel="The SEA story"
    />
  );
}
