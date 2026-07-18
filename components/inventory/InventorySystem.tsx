"use client";
/* ============================================================
   WAYPOINT & Co. — Inventory system · v1.3
   Collection experience & commercial polish.
   One system, three characters. Editorial + Index viewing modes.
   Considered (add-to-journey) with quiet confirmation.
   ============================================================ */
import { useEffect, useMemo, useState } from "react";
import {
  InventoryItem, Category, STATUS_LABEL, CATEGORY_META,
} from "@/lib/inventory";
import { showInternalBriefs } from "@/lib/images";
import { InventoryImage } from "@/components/media/InventoryImage";

declare global {
  interface Window {
    WaypointJourney?: {
      add: (i: { kind: string; ref: string; title: string; meta?: Record<string, string> }) => void;
      open?: () => void;
    };
  }
}

export const inventoryCss = `
.wpi{--ivory:#F1EEE7;--deep:#EAE5DA;--ink:#211F1B;--metal:#B3B0A7;--soft:#6D6A61;--accent:#5E6B75;
  font-family:"Instrument Sans",-apple-system,sans-serif;color:var(--ink);}
.wpi *{box-sizing:border-box;margin:0;padding:0;}
.wpi a{color:inherit;text-decoration:none;}
/* ---- mode + filters bar ---- */
.wpi-bar{display:flex;flex-wrap:wrap;gap:12px 26px;align-items:baseline;
  padding:20px 0;border-top:1px solid var(--metal);border-bottom:1px solid var(--metal);margin-bottom:clamp(28px,4vh,44px);}
.wpi-modes{display:flex;gap:20px;margin-right:6px;}
.wpi-mode{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--soft);background:none;border:none;cursor:pointer;padding:8px 0;min-height:34px;
  border-bottom:1px solid transparent;transition:color .3s,border-color .3s;}
.wpi-mode.on{color:var(--ink);border-bottom-color:var(--ink);}
.wpi-mode:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}
.wpi-fgroup{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;}
.wpi-flabel{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:var(--accent);margin-right:6px;}
.wpi-chip{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--soft);background:none;border:1px solid transparent;border-bottom:1px solid var(--metal);
  padding:8px 2px;cursor:pointer;min-height:34px;transition:color .3s,border-color .3s;}
.wpi-chip:hover{color:var(--ink);}
.wpi-chip.on{color:var(--ink);border-bottom-color:var(--ink);}
.wpi-chip:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}
.wpi-reset{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--accent);background:none;border:none;cursor:pointer;padding:8px 0;min-height:34px;border-bottom:1px solid var(--metal);}
.wpi-reset:hover{color:var(--ink);border-bottom-color:var(--ink);}
.wpi-count{margin-left:auto;font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.22em;color:var(--soft);text-transform:uppercase;}
/* ---- editorial grid ---- */
.wpi-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:clamp(30px,3.6vw,56px);}
/* ---- card ---- */
.wpi-card{display:flex;flex-direction:column;transition:transform .7s cubic-bezier(.22,1,.36,1);}
.wpi-card:hover{transform:translateY(-6px);}
.wpi-frame{position:relative;aspect-ratio:16/10;overflow:hidden;display:block;}
.wpi-frame::after{content:"";position:absolute;inset:12px;border:1px solid rgba(241,238,231,.5);pointer-events:none;transition:inset .7s cubic-bezier(.22,1,.36,1);z-index:2;}
.wpi-frame .flag,.wpi-frame .brief{z-index:2;}
.wpi-card:hover .wpi-frame::after{inset:8px;}
.wpi-frame .brief{position:absolute;left:22px;bottom:18px;right:22px;
  font-family:"IBM Plex Mono",monospace;font-size:9px;font-weight:300;letter-spacing:.22em;
  text-transform:uppercase;color:rgba(241,238,231,.85);line-height:1.9;}
.wpi-frame .flag{position:absolute;left:22px;top:18px;
  font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.26em;
  text-transform:uppercase;color:rgba(241,238,231,.9);}
.wpi-body{padding:18px 2px 0;display:flex;flex-direction:column;gap:8px;flex:1;}
.wpi-name{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(23px,2vw,28px);line-height:1.12;}
.wpi-kind{font-family:"IBM Plex Mono",monospace;font-size:9.5px;font-weight:300;letter-spacing:.24em;text-transform:uppercase;color:var(--soft);}
.wpi-meta{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:300;letter-spacing:.16em;
  text-transform:uppercase;color:var(--accent);line-height:1.95;}
.wpi-essence{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:16.5px;color:var(--soft);line-height:1.5;max-width:38ch;margin:2px 0 0;}
.wpi-priceline{display:flex;justify-content:space-between;gap:14px;align-items:baseline;
  margin-top:4px;padding-top:12px;border-top:1px solid var(--metal);}
.wpi-price{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);}
.wpi-status{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);white-space:nowrap;}
.wpi-actions{display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center;margin-top:14px;padding-bottom:4px;}
.wpi-req{font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;
  border:1px solid var(--ink);background:none;color:var(--ink);padding:12px 18px;min-height:42px;
  transition:background .4s cubic-bezier(.22,1,.36,1),color .4s;}
.wpi-req:hover{background:var(--ink);color:var(--ivory);}
.wpi-view{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--accent);border-bottom:1px solid var(--metal);padding:8px 0 4px;min-height:34px;display:inline-flex;align-items:center;
  transition:color .3s,border-color .3s;}
.wpi-view:hover{color:var(--ink);border-bottom-color:var(--ink);}
.wpi-add{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--soft);background:none;border:none;cursor:pointer;padding:8px 0 4px;min-height:34px;
  border-bottom:1px solid transparent;transition:color .3s,border-color .3s;}
.wpi-add:hover{color:var(--ink);}
.wpi-add.done{color:var(--accent);border-bottom-color:var(--accent);cursor:default;}
.wpi-req:focus-visible,.wpi-view:focus-visible,.wpi-add:focus-visible,.wpi-mode:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}
/* ---- index view ---- */
.wpi-index{border-top:1px solid var(--metal);}
.wpi-row{display:grid;grid-template-columns:180px minmax(0,1.05fr) minmax(0,1.35fr) auto;
  gap:clamp(18px,2.6vw,40px);align-items:start;padding:22px 0;border-bottom:1px solid var(--metal);
  transition:background .4s;}
.wpi-row:hover{background:rgba(234,229,218,.5);}
.wpi-row .rframe{position:relative;aspect-ratio:16/10;}
.wpi-row .rframe::after{content:"";position:absolute;inset:8px;border:1px solid rgba(241,238,231,.5);pointer-events:none;}
.wpi-row .rname{font-family:"Instrument Serif",Georgia,serif;font-size:21px;line-height:1.2;display:block;padding-top:2px;}
.wpi-row .rkind{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--soft);margin-top:5px;display:block;}
.wpi-row .rmeta{font-family:"IBM Plex Mono",monospace;font-size:9.5px;font-weight:300;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);line-height:2.05;padding-top:4px;}
.wpi-row .racts{display:flex;flex-direction:column;gap:10px;align-items:flex-end;padding-top:2px;}
/* ---- zero state ---- */
.wpi-empty{padding:clamp(44px,7vh,72px) 0;}
.wpi-empty p{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:clamp(20px,2.2vw,26px);color:var(--soft);max-width:32ch;line-height:1.45;}
.wpi-empty a{display:inline-flex;margin-top:22px;font-size:11.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--ink);padding:14px 24px;transition:background .4s,color .4s;}
.wpi-empty a:hover{background:var(--ink);color:var(--ivory);}
/* ---- add-to-journey confirmation ---- */
.wpi-toast{position:fixed;left:50%;bottom:calc(22px + env(safe-area-inset-bottom));transform:translateX(-50%) translateY(12px);
  z-index:85;background:rgba(241,238,231,.97);backdrop-filter:blur(10px);color:#211F1B;border:1px solid #B3B0A7;
  display:flex;align-items:center;gap:16px;padding:11px 16px;max-width:min(480px,calc(100vw - 24px));
  opacity:0;pointer-events:none;transition:opacity .45s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1);}
.wpi-toast.show{opacity:1;transform:translateX(-50%);pointer-events:auto;}
.wpi-toast .t{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;line-height:1.9;color:#6D6A61;}
.wpi-toast .t b{font-weight:400;color:#211F1B;}
.wpi-toast button{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;
  color:#5E6B75;background:none;border:none;cursor:pointer;padding:8px 0;border-bottom:1px solid #B3B0A7;white-space:nowrap;}
.wpi-toast button:hover{color:#211F1B;border-bottom-color:#211F1B;}
.wpi-toast .x{border-bottom:none;font-size:13px;padding:6px 4px;color:#6D6A61;}
.wpi-toast .x:hover{color:#211F1B;}
@media (max-width:820px){
  .wpi-toast{bottom:calc(84px + env(safe-area-inset-bottom));} /* clear the Fast Lane bar */
}
@media (max-width:700px){
  .wpi-modes{display:none;} /* mobile keeps the single strongest format */
  .wpi-bar{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;gap:10px 22px;}
  .wpi-bar::-webkit-scrollbar{display:none;}
  .wpi-fgroup{flex-wrap:nowrap;}
  .wpi-chip,.wpi-flabel,.wpi-reset,.wpi-count{white-space:nowrap;}
  .wpi-count{margin-left:12px;}
  .wpi-grid{grid-template-columns:1fr;gap:34px;}
  .wpi-row{grid-template-columns:110px minmax(0,1fr);}
  .wpi-row .rmeta,.wpi-row .racts{grid-column:2;}
  .wpi-row .racts{align-items:flex-start;flex-direction:row;flex-wrap:wrap;}
}
@media (prefers-reduced-motion:reduce){
  .wpi-card,.wpi-frame::after,.wpi-toast{transition:none !important;}
}
`;

/* character-specific metadata — shared helpers */
import { kindLine, metaLines } from "@/lib/inventory-meta";
import { priceDisplay, CATEGORY_BANDS } from "@/lib/inventory";
export { metaLines };

/* ---------------- quiet confirmation ---------------- */
type ToastMsg = { title: string; cat: string } | null;
export function announceAdd(item: InventoryItem) {
  window.dispatchEvent(new CustomEvent("wp:considered", {
    detail: { title: item.name, cat: item.category.toUpperCase() },
  }));
}
export function JourneyToast() {
  const [msg, setMsg] = useState<ToastMsg>(null);
  useEffect(() => {
    let t: number;
    const on = (e: Event) => {
      setMsg((e as CustomEvent).detail);
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 3500);
    };
    window.addEventListener("wp:considered", on);
    return () => { window.removeEventListener("wp:considered", on); window.clearTimeout(t); };
  }, []);
  if (!msg) return null;
  return (
    <div className="wpi-toast show" role="status">
      <span className="t"><b>{msg.title}</b> — added · {msg.cat}</span>
      <button type="button" onClick={() => { window.WaypointJourney?.open?.(); setMsg(null); }}>View journey</button>
      <button type="button" className="x" aria-label="Dismiss" onClick={() => setMsg(null)}>×</button>
    </div>
  );
}

/* ---------------- Card (editorial) ---------------- */
export function InventoryCard({ item }: { item: InventoryItem }) {
  const meta = CATEGORY_META[item.category];
  const [added, setAdded] = useState(false);
  const detail = `${meta.browsePath}/${item.slug}`;
  const grad = `linear-gradient(165deg, ${item.tone[0]} 0%, ${item.tone[1]} 52%, ${item.tone[2]} 100%)`;
  const [l1, l2] = metaLines(item);

  const consider = () => {
    if (added) return;
    try {
      window.WaypointJourney?.add({
        kind: meta.kind, ref: item.slug, title: item.name,
        meta: { location: metaLines(item)[0], capacity: item.capacityLabel, price: priceDisplay(item).line, defining: item.essence, cat: item.category.toUpperCase() },
      });
      setAdded(true);
      announceAdd(item);
    } catch { /* module absent */ }
  };

  return (
    <article className="wpi-card" data-cms={meta.kind} data-ref={item.slug}>
      <a className="wpi-frame" href={detail} style={{ background: grad }} aria-label={`${meta.viewLabel}: ${item.name}`}>
        <InventoryImage slug={item.slug} alt={item.name} />
        {item.featured && <span className="flag">Featured</span>}
        {showInternalBriefs() && <span className="brief">{item.heroBrief}</span>}
      </a>
      <div className="wpi-body">
        <h3 className="wpi-name">{item.name}</h3>
        <span className="wpi-kind">{kindLine(item)}</span>
        <p className="wpi-meta">{l1}<br />{l2}</p>
        <div className="wpi-priceline">
          <span className="wpi-price">{priceDisplay(item).line}</span>
          <span className="wpi-status">{STATUS_LABEL[item.status]}</span>
        </div>
        {item.pricing?.seasonalNote && <p className="wpi-meta" style={{ opacity: .75 }}>{item.pricing.seasonalNote}</p>}
        <p className="wpi-essence">{item.essence}</p>
        <div className="wpi-actions">
          <button type="button" className="wpi-req"
            data-fastlane="" data-fastlane-kind={meta.kind}
            data-fastlane-ref={item.slug} data-fastlane-title={item.name}
            data-fastlane-rate={priceDisplay(item).line}
            data-fastlane-unit={item.pricing?.priceUnit || ""}
            data-fastlane-poa={item.priceConfirmed ? "false" : "true"}
            data-fastlane-loc={item.location}>
            Request availability
          </button>
          <a className="wpi-view" href={detail}>{meta.viewLabel} →</a>
          <button type="button" className={"wpi-add" + (added ? " done" : "")} onClick={consider} aria-pressed={added}>
            {added ? "Added to journey" : "Consider this"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Row (index) ---------------- */
function InventoryRow({ item }: { item: InventoryItem }) {
  const meta = CATEGORY_META[item.category];
  const detail = `${meta.browsePath}/${item.slug}`;
  const grad = `linear-gradient(165deg, ${item.tone[0]} 0%, ${item.tone[1]} 52%, ${item.tone[2]} 100%)`;
  const [l1, l2] = metaLines(item);
  return (
    <div className="wpi-row" data-cms={meta.kind} data-ref={item.slug}>
      <a className="rframe" href={detail} style={{ background: grad }} aria-label={item.name}><InventoryImage slug={item.slug} alt={item.name} /></a>
      <div>
        <a className="rname" href={detail}>{item.name}</a>
        <span className="rkind">{kindLine(item)} · {STATUS_LABEL[item.status]}</span>
      </div>
      <p className="rmeta">{l1}<br />{l2}<br />{priceDisplay(item).line}</p>
      <div className="racts">
        <button type="button" className="wpi-req" style={{ padding: "10px 14px", minHeight: 38 }}
          data-fastlane="" data-fastlane-kind={meta.kind}
          data-fastlane-ref={item.slug} data-fastlane-title={item.name}>
          Request availability
        </button>
        <a className="wpi-view" href={detail}>{meta.viewLabel} →</a>
      </div>
    </div>
  );
}

/* ---------------- Browser ---------------- */
type Filters = { dest: string | null; type: string | null; cap: string | null; band: string | null };
function capBand(item: InventoryItem): string {
  const nums = (item.capacityLabel.match(/\d+/g) || []).map(Number);
  const max = nums.length ? Math.max(...nums) : 0;
  if (!max) return "by-arrangement";
  if (max <= 6) return "up-to-6";
  if (max <= 9) return "7-9";
  return "10-plus";
}
const CAP_LABEL: Record<string, string> = {
  "up-to-6": "Up to 6", "7-9": "7–9", "10-plus": "10+", "by-arrangement": "By arrangement",
};
const WHERE_LABEL: Record<Category, string> = { air: "Base / region", sea: "Location", stay: "Destination" };
const TYPE_LABEL: Record<Category, string> = { air: "Class", sea: "Format", stay: "Character" };

export function FleetBrowser({ items, category }: { items: InventoryItem[]; category: Category }) {
  const [f, setF] = useState<Filters>({ dest: null, type: null, cap: null, band: null });
  const [mode, setMode] = useState<"editorial" | "index">("editorial");

  const dests = useMemo(() => Array.from(new Set(items.flatMap((i) => i.destinations))).sort(), [items]);
  const types = useMemo(() => Array.from(new Set(items.map(kindLine).filter(Boolean))), [items]);
  const caps = useMemo(() => Array.from(new Set(items.map(capBand))), [items]);
  const active = !!(f.dest || f.type || f.cap || f.band);

  const shown = items.filter((i) => {
    if (f.dest && !i.destinations.includes(f.dest)) return false;
    if (f.type && kindLine(i) !== f.type) return false;
    if (f.cap && capBand(i) !== f.cap) return false;
    if (f.band) {
      if (f.band === "poa") { if (!(i.pricing?.priceOnApplication || !i.priceConfirmed)) return false; }
      else {
        const b = CATEGORY_BANDS[category].find((x) => x.id === f.band);
        const p = i.priceConfirmed ? i.pricing?.priceFrom : undefined;
        if (!b || p === undefined || p < b.min || p >= b.max) return false;
      }
    }
    return true;
  });

  const chip = (on: boolean, label: string, cb: () => void, key: string) => (
    <button key={key} type="button" className={"wpi-chip" + (on ? " on" : "")} onClick={cb} aria-pressed={on}>{label}</button>
  );
  const deslug = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="wpi">
      <style dangerouslySetInnerHTML={{ __html: inventoryCss }} />
      <div className="wpi-bar" role="group" aria-label="Refine the collection">
        <span className="wpi-modes" role="group" aria-label="Viewing mode">
          {(["editorial", "index"] as const).map((m) =>
            <button key={m} type="button" className={"wpi-mode" + (mode === m ? " on" : "")}
              onClick={() => setMode(m)} aria-pressed={mode === m}>
              {m === "editorial" ? "Editorial" : "Index"}
            </button>
          )}
        </span>
        <span className="wpi-fgroup">
          <span className="wpi-flabel">{WHERE_LABEL[category]}</span>
          {chip(!f.dest, "All", () => setF({ ...f, dest: null }), "d-all")}
          {dests.map((x) => chip(f.dest === x, deslug(x), () => setF({ ...f, dest: f.dest === x ? null : x }), "d" + x))}
        </span>
        <span className="wpi-fgroup">
          <span className="wpi-flabel">{TYPE_LABEL[category]}</span>
          {chip(!f.type, "All", () => setF({ ...f, type: null }), "t-all")}
          {types.map((x) => chip(f.type === x, x, () => setF({ ...f, type: f.type === x ? null : x }), "t" + x))}
        </span>
        <span className="wpi-fgroup">
          <span className="wpi-flabel">Guests</span>
          {chip(!f.cap, "All", () => setF({ ...f, cap: null }), "c-all")}
          {caps.map((x) => chip(f.cap === x, CAP_LABEL[x], () => setF({ ...f, cap: f.cap === x ? null : x }), "c" + x))}
        </span>
        <span className="wpi-fgroup">
          <span className="wpi-flabel">Rate</span>
          {chip(!f.band, "All", () => setF({ ...f, band: null }), "b-all")}
          {CATEGORY_BANDS[category].map((b) =>
            chip(f.band === b.id, b.label, () => setF({ ...f, band: f.band === b.id ? null : b.id }), "b" + b.id))}
          {chip(f.band === "poa", "Price on application", () => setF({ ...f, band: f.band === "poa" ? null : "poa" }), "b-poa")}
        </span>
        {active && <button type="button" className="wpi-reset" onClick={() => setF({ dest: null, type: null, cap: null, band: null })}>Reset</button>}
        <span className="wpi-count">{shown.length} of {items.length} · curated</span>
      </div>

      {shown.length === 0 ? (
        <div className="wpi-empty">
          <p>Nothing listed matches — but the collection is smaller than the network. We may know something not yet listed.</p>
          <a href={`/enquire?src=fleet-zero-${category}`}>Speak with WAYPOINT →</a>
        </div>
      ) : mode === "editorial" ? (
        <div className="wpi-grid">{shown.map((i) => <InventoryCard key={i.slug} item={i} />)}</div>
      ) : (
        <div className="wpi-index">{shown.map((i) => <InventoryRow key={i.slug} item={i} />)}</div>
      )}
      <JourneyToast />
    </div>
  );
}
