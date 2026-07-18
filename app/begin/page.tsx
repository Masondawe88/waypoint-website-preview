import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Begin a Journey",
  description: "Tell us where you are drawn to, and we will begin shaping the journey around you.",
};

export default function Page() {
  return <Client />;
}
