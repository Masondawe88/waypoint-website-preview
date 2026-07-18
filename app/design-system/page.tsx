import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Client from "./client";

export const metadata: Metadata = {
  title: "Design System (Internal)",
  description: "WAYPOINT & Co. living design system — internal reference.",
  robots: { index: false, follow: false },
};

export default function Page() {
  /* Internal reference. Hidden in production unless explicitly enabled. */
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_SHOW_DESIGN_SYSTEM !== "true"
  ) {
    notFound();
  }
  return <Client />;
}
