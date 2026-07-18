import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "STAY \u2014 Private Residences",
  description: "A place within the place. Private residences in the Whitsundays, Noosa and Tasmania.",
};

export default function Page() {
  return <Client />;
}
