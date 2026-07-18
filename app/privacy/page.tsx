import type { Metadata } from "next";
import StubPage from "@/components/StubPage";
export const metadata: Metadata = { title: "Privacy" };
export default function Page() {
  return (
    <StubPage
      eyebrow="Privacy"
      title="Considered before arrival."
      lede="Browsing memory lives only in your session and can be forgotten in one click. Enquiries are read by people, used to plan your journey, and never sold. The full policy publishes here at launch."
      links={[{ title: "Questions — ask the concierge", href: "/enquire?src=privacy", label: "Enquire" }]}
    />
  );
}
