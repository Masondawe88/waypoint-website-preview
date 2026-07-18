"use client";
import { byDestination, CATEGORY_META, Category } from "@/lib/inventory";
import { InventoryCard, inventoryCss, JourneyToast } from "./InventorySystem";

const HEAD: Record<Category, string> = { air: "AIR access", sea: "SEA access", stay: "STAY collection" };
const ARRANGE: Record<Category, string> = {
  air: "Aircraft access into this world is arranged through WAYPOINT's selected operators — matched to runway, guests and mission.",
  sea: "On-water days here are arranged through the house's partner network — the right vessel, confirmed to the occasion.",
  stay: "Residences in this world are arranged through WAYPOINT's network of owners and managers — selected to the journey, never listed for the sake of it.",
};

export function DestinationInventory({ dest }: { dest: string }) {
  const items = byDestination(dest);
  const cats: Category[] = ["air", "sea", "stay"];
  return (
    <div className="wpi">
      <style dangerouslySetInnerHTML={{ __html: inventoryCss }} />
      {cats.map((c) => {
        const group = items.filter((i) => i.category === c);
        return (
          <div key={c} style={{ marginBottom: "clamp(34px,5vh,52px)" }}>
            <p style={{
              fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: ".3em",
              textTransform: "uppercase", color: "#5E6B75", margin: "0 0 18px",
            }}>
              {HEAD[c]} · <a href={CATEGORY_META[c].browsePath} style={{ color: "#6D6A61", borderBottom: "1px solid #B3B0A7" }}>{CATEGORY_META[c].browseLabel} →</a>
            </p>
            {group.length ? (
              <div className="wpi-grid">
                {group.map((i) => <InventoryCard key={i.slug} item={i} />)}
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #B3B0A7", borderBottom: "1px solid #B3B0A7", padding: "26px 0", maxWidth: 640 }}>
                <p style={{ fontFamily: '"Instrument Serif",Georgia,serif', fontStyle: "italic", fontSize: 19, color: "#6D6A61", lineHeight: 1.5, margin: 0 }}>
                  {ARRANGE[c]}
                </p>
                <a href={`/enquire?dest=${dest}&src=world-arrange-${c}`} style={{
                  display: "inline-flex", marginTop: 18, fontFamily: '"IBM Plex Mono",monospace',
                  fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase",
                  color: "#5E6B75", borderBottom: "1px solid #B3B0A7", paddingBottom: 3, textDecoration: "none",
                }}>Speak with WAYPOINT →</a>
              </div>
            )}
          </div>
        );
      })}
      <JourneyToast />
    </div>
  );
}
