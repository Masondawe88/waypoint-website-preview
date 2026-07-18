import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "SEA \u2014 Yacht Charter",
  description: "Let the coastline unfold. Private yacht charter through the Whitsundays, Noosa and Sydney.",
};

export default function Page() {
  return <Client />;
}
