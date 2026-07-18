import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "The World" };

export default function Page() {
  return (
    <StubPage
      eyebrow="The World"
      title="Every destination is another world."
      lede="One world is open. Others sit on the horizon, arriving as they are ready — never before."
      links={[
        { title: "The Whitsundays", href: "/world/whitsundays", label: "Enter" },
        { title: "Noosa — horizon", href: "/begin?dest=noosa&src=world-index", label: "Enquire" },
        { title: "Tasmania — horizon", href: "/begin?dest=tasmania&src=world-index", label: "Enquire" },
        { title: "Sydney — horizon", href: "/begin?dest=sydney&src=world-index", label: "Enquire" },
      ]}
      note="HORIZON WORLDS OPEN FROM THE MASTER TEMPLATE AS CONTENT IS AUTHORED"
    />
  );
}
