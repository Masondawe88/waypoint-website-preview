import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Journeys" };

export default function Page() {
  return (
    <StubPage
      eyebrow="Journeys"
      title="Complete courses, plotted end to end."
      lede="Each journey holds air, residence, sea and experience as one movement. Explore a course, or shape your own."
      links={[
        { title: "Island Passage", href: "/begin?journey=island-passage&src=journeys", label: "Explore" },
        { title: "Southern Latitude", href: "/begin?journey=southern-latitude&src=journeys", label: "Explore" },
        { title: "Coastal Interlude", href: "/begin?journey=coastal-interlude&src=journeys", label: "Explore" },
        { title: "Shape your own", href: "/begin?src=journeys", label: "Begin" },
      ]}
      note="FULL JOURNEY EDITORIALS RENDER FROM THE CMS AS CONTENT ARRIVES"
    />
  );
}
