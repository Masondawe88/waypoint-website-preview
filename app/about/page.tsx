import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
export const metadata: Metadata = { title: "About" };
export default function Page() {
  return (
    <StubPage
      eyebrow="The House"
      title="One house. Three ways to move."
      lede="WAYPOINT & Co. is a precision travel house: private aviation, yacht charter and private residences, selected and coordinated around the complete journey. The full manifesto publishes with launch."
      links={[
        { title: "Begin a journey", href: "/begin?src=about", label: "Begin" },
        { title: "Speak with our concierge", href: "/enquire?src=about", label: "Enquire" },
      ]}
    />
  );
}
