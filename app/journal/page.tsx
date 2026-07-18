import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "The Journal" };

export default function Page() {
  return (
    <StubPage
      eyebrow="The Journal"
      title="Notes from the journey."
      lede="Field notes, places and passages — every story connected to the world it comes from. The first entries are being written."
      links={[
        { title: "The quieter side of Whitehaven", href: "/journal/quieter-side-of-whitehaven", label: "Soon" },
        { title: "Morning on Hook Island", href: "/journal/morning-on-hook-island", label: "Soon" },
        { title: "Meanwhile — enter the world", href: "/world/whitsundays", label: "Enter" },
      ]}
      note="ENTRIES PUBLISH FROM THE CMS · EVERY STORY CARRIES ITS RELATIONSHIPS"
    />
  );
}
