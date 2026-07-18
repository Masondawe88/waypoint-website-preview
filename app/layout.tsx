import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WAYPOINT & Co. — Air. Sea. Stay.",
    template: "%s | WAYPOINT & Co.",
  },
  description:
    "A precision travel house. Private aviation, yacht charter and private residences, coordinated as one considered journey.",
  metadataBase: new URL("https://waypointandco.com"),
  robots:
    process.env.NEXT_PUBLIC_SITE_LIVE === "true"
      ? undefined
      : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Platform modules — Ecosystem (Journey Memory) + Fast Lane, per the v1.0 freeze */}
        <Script src="/js/waypoint-ecosystem.js" strategy="afterInteractive" />
        <Script src="/js/waypoint-fastlane.js" strategy="afterInteractive" />
        <Script id="wp-configure" strategy="afterInteractive">{`
          (function wire(){
            if (window.WaypointJourney) window.WaypointJourney.configure({ continueEndpoint: '/api/continue' });
            if (window.WaypointFastLane) window.WaypointFastLane.configure({ endpoint: '/api/enquiry' });
            if (!window.WaypointJourney || !window.WaypointFastLane) setTimeout(wire, 150);
          })();
        `}</Script>
      </body>
    </html>
  );
}
