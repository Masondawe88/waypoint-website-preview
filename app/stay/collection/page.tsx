import type { Metadata } from "next";
import { FleetPage } from "@/components/inventory/FleetPages";
export const metadata: Metadata = { title: "The STAY Collection" };
export default function Page() {
  return (
    <FleetPage
      category="stay"
      eyebrow="STAY · The Collection"
      title="One residence at a time."
      lede="A small collection, chosen for setting, character and the role each plays within the wider journey — never a marketplace. Final residence allocation depends on availability and journey requirements."
      editorialHref="/stay"
      editorialLabel="The STAY story"
    />
  );
}
