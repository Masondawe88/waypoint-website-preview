import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
export const metadata: Metadata = { title: "Terms" };
export default function Page() {
  return (
    <StubPage
      eyebrow="Terms"
      title="Terms of engagement."
      lede="Charter, residence and experience terms are provided with every proposal and confirmed before any arrangement. The general terms document publishes here at launch."
      links={[{ title: "Questions — ask the concierge", href: "/enquire?src=terms", label: "Enquire" }]}
    />
  );
}
