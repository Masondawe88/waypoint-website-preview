import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "WAYPOINT & Co. \u2014 Air. Sea. Stay.",
  description: "A precision travel house. Private aviation, yacht charter and private residences, coordinated as one considered journey.",
};

export default function Page() {
  return <Client />;
}
