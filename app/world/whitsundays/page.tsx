import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "The Whitsundays \u2014 The World",
  description: "Some places are meant to be crossed slowly. The Whitsundays, experienced as one considered journey.",
};

export default function Page() {
  return <Client />;
}
