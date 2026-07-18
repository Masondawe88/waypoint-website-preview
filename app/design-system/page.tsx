import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Design System (Internal)",
  description: "WAYPOINT & Co. living design system \u2014 internal reference.",
};

export default function Page() {
  return <Client />;
}
