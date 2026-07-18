import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
export const metadata: Metadata = { title: "Contact" };
export default function Page() {
  return (
    <StubPage
      eyebrow="Contact"
      title="A person replies. Always."
      lede="The fastest way to reach the concierge is a direct enquiry — it arrives with everything you were looking at, so you never repeat yourself."
      links={[
        { title: "Enquire now", href: "/enquire?src=contact", label: "Enquire" },
        { title: "Shape a journey instead", href: "/begin?src=contact", label: "Begin" },
      ]}
      note="PHONE AND POSTAL DETAILS PUBLISH WITH LAUNCH SETTINGS FROM THE CMS"
    />
  );
}
