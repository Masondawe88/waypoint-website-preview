/* Server-safe metadata helpers — shared by client cards and server detail pages. */
import { InventoryItem } from "./inventory";

export function kindLine(i: InventoryItem): string {
  if (i.air) return i.air.type;
  if (i.sea) return i.sea.dayCharter ? "Day charter" : "Overnight charter";
  return i.stay?.stayType || "";
}
export function locationLine(i: InventoryItem): string {
  if (i.seasons && i.seasons.length)
    return i.seasons.map((s) => `${s.when} · ${s.where}`).join("  /  ");
  /* v2.2.1 — this function is the single owner of location-prefix formatting.
     Data must contain the place only; any legacy prefix is stripped defensively. */
  const place = i.location.replace(/^(Based|Operating|By arrangement)\s*·\s*/i, "");
  const mode = i.locationMode === "arrangement" ? "By arrangement · " :
               i.locationMode === "seasonal" ? "" :
               i.locationMode === "operating" ? "Operating · " : "Based · ";
  return mode + place;
}
export function metaLines(i: InventoryItem): string[] {
  if (i.category === "air")
    return [locationLine(i), [i.capacityLabel, i.air?.rangeLabel, i.useCase].filter(Boolean).join(" · ")];
  if (i.category === "sea")
    return [locationLine(i), [i.capacityLabel, i.useCase].filter(Boolean).join(" · ")];
  return [locationLine(i), [i.capacityLabel, i.stay?.bedrooms, i.useCase].filter(Boolean).join(" · ")];
}
