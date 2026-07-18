import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "AIR \u2014 Private Charter",
  description: "Arrive on your own terms. Private fixed-wing and helicopter charter, Australia and international.",
};

export default function Page() {
  return <Client />;
}
