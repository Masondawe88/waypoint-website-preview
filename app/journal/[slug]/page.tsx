import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

function deslug(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: deslug(params.slug) + " — The Journal" };
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <StubPage
      eyebrow="The Journal · In preparation"
      title={deslug(params.slug)}
      lede="This story is being written alongside its photography. It will publish with its relationships — the places, vessels and journeys it belongs to."
      links={[
        { title: "Enter the Whitsundays", href: "/world/whitsundays", label: "Enter" },
        { title: "Begin a journey", href: "/begin?src=journal", label: "Begin" },
      ]}
    />
  );
}
