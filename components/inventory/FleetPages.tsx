/* Fleet/collection page shell + inventory detail page — server components
   wrapping the client browser. House language throughout. */
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  byCategory, bySlug, Category, CATEGORY_META, STATUS_LABEL,
} from "@/lib/inventory";
import { destBySlug } from "@/lib/destinations";
import { FleetBrowser, inventoryCss, InventoryCard, JourneyToast } from "./InventorySystem";
import { metaLines } from "@/lib/inventory-meta";
import { showInternalBriefs } from "@/lib/images";
import { INVENTORY } from "@/lib/inventory";

const shellCss = `
.wpf{--ivory:#F1EEE7;--ink:#211F1B;--metal:#B3B0A7;--soft:#6D6A61;--accent:#5E6B75;
  background:var(--ivory);color:var(--ink);min-height:100svh;
  font-family:"Instrument Sans",-apple-system,sans-serif;line-height:1.7;}
.wpf *{box-sizing:border-box;margin:0;padding:0;}
.wpf a{color:inherit;text-decoration:none;}
.wpf .wrap{max-width:1360px;margin:0 auto;padding:0 clamp(20px,5vw,72px);}
.wpf .nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px clamp(20px,5vw,72px);}
.wpf .wordmark{font-family:"Instrument Serif",Georgia,serif;font-size:19px;letter-spacing:.04em;}
.wpf .wordmark span{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;color:var(--accent);display:block;margin-top:1px;}
.wpf .links{display:flex;gap:30px;}
.wpf .links a{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--soft);padding-bottom:3px;border-bottom:1px solid transparent;}
.wpf .links a:hover{color:var(--ink);}
.wpf .links a.current{color:var(--ink);border-bottom-color:var(--ink);}
.wpf header.fleet{padding:clamp(52px,9vh,100px) 0 clamp(30px,4vh,44px);}
.wpf .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);}
.wpf h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(34px,4.6vw,58px);line-height:1.08;margin:16px 0 18px;max-width:16ch;}
.wpf .lede{font-size:16.5px;color:var(--soft);max-width:56ch;}
.wpf main{padding-bottom:clamp(64px,10vh,120px);}
.wpf .backrow{padding:22px 0 0;}
.wpf .quiet{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--metal);padding-bottom:3px;}
.wpf .quiet:hover{color:var(--ink);border-bottom-color:var(--ink);}
.wpf footer{padding:26px clamp(20px,5vw,72px);border-top:1px solid var(--metal);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--soft);}
/* detail */
.wpf .detail{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(36px,5vw,90px);align-items:start;padding-top:clamp(30px,4vh,48px);}
.wpf .dframe{position:relative;aspect-ratio:16/10;}
.wpf .dframe::after{content:"";position:absolute;inset:14px;border:1px solid rgba(241,238,231,.55);pointer-events:none;}
.wpf .dframe .brief{position:absolute;left:26px;bottom:22px;right:26px;font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:300;letter-spacing:.24em;text-transform:uppercase;color:rgba(241,238,231,.85);line-height:1.9;}
.wpf .gallery{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px;}
.wpf .gframe{position:relative;aspect-ratio:4/3;}
.wpf .gframe::after{content:"";position:absolute;inset:10px;border:1px dashed rgba(241,238,231,.5);pointer-events:none;}
.wpf .gframe .brief{position:absolute;left:18px;bottom:14px;font-family:"IBM Plex Mono",monospace;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(241,238,231,.8);}
.wpf .dmeta{font-family:"IBM Plex Mono",monospace;font-size:10.5px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);line-height:2;margin:10px 0 18px;}
.wpf .desc{font-size:16px;color:var(--soft);max-width:52ch;line-height:1.8;}
.wpf .specs{margin-top:26px;border-top:1px solid var(--metal);max-width:520px;}
.wpf .spec{display:flex;justify-content:space-between;gap:18px;padding:13px 0;border-bottom:1px solid var(--metal);font-size:14px;}
.wpf .spec .l{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.24em;text-transform:uppercase;color:var(--accent);align-self:center;}
.wpf .spec .ind{font-family:"IBM Plex Mono",monospace;font-size:8.5px;letter-spacing:.14em;color:var(--soft);display:block;}
.wpf .priceline{margin-top:22px;display:flex;justify-content:space-between;gap:16px;align-items:baseline;max-width:520px;}
.wpf .price{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;}
.wpf .status{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);}
.wpf .dactions{display:flex;flex-wrap:wrap;gap:14px 22px;align-items:center;margin-top:30px;}
.wpf .attr{margin-top:30px;padding-top:20px;border-top:1px solid var(--metal);font-size:13px;color:var(--soft);max-width:52ch;line-height:1.8;}
.wpf .dests{margin-top:22px;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--soft);line-height:2.2;}
.wpf .dests a{color:var(--accent);border-bottom:1px solid var(--metal);}
.wpf .dests a:hover{color:var(--ink);border-bottom-color:var(--ink);}
/* featured moment */
.wpf .feature{position:relative;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(30px,4vw,70px);
  align-items:center;margin:clamp(10px,2vh,20px) 0 clamp(44px,6vh,72px);}
.wpf .fframe{position:relative;aspect-ratio:16/9;}
.wpf .fframe::after{content:"";position:absolute;inset:16px;border:1px solid rgba(241,238,231,.55);pointer-events:none;}
.wpf .fframe .brief{position:absolute;left:28px;bottom:24px;right:28px;font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:300;letter-spacing:.24em;text-transform:uppercase;color:rgba(241,238,231,.85);line-height:1.9;}
.wpf .fframe .flabel{position:absolute;left:28px;top:22px;font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:rgba(241,238,231,.9);}
.wpf .fname{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(28px,3.4vw,46px);line-height:1.08;}
.wpf .fdef{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:clamp(17px,1.6vw,22px);color:var(--soft);margin:12px 0 16px;max-width:32ch;}
.wpf .fmeta{font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);line-height:2;margin-bottom:20px;}
.wpf .browsehead{display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin:clamp(20px,3vh,32px) 0 6px;}
.wpf .browsehead h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(24px,2.8vw,36px);}
/* key facts strip */
.wpf .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;background:var(--metal);border:1px solid var(--metal);margin:22px 0 6px;max-width:640px;}
.wpf .fact{background:var(--ivory);padding:14px 16px;}
.wpf .fact .fl{font-family:"IBM Plex Mono",monospace;font-size:8.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;}
.wpf .fact .fv{font-size:14px;line-height:1.4;}
.wpf .fact .fi{font-family:"IBM Plex Mono",monospace;font-size:7.5px;letter-spacing:.12em;color:var(--soft);display:block;margin-top:3px;}
/* related strip + final band */
.wpf .relhead{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin:clamp(40px,6vh,64px) 0 18px;}
.wpf .finalband{margin-top:clamp(48px,7vh,80px);padding:clamp(30px,4vh,44px);background:#211F1B;color:#EDEAE1;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;}
.wpf .finalband .q{font-family:"Instrument Serif",Georgia,serif;font-size:clamp(20px,2.2vw,27px);max-width:26ch;line-height:1.3;}
@media (max-width:900px){.wpf .detail{grid-template-columns:1fr;}.wpf .links{display:none;}.wpf .feature{grid-template-columns:1fr;}}
`;

function Shell({ children, category }: { children: React.ReactNode; category?: Category }) {
  return (
    <div className="wpf">
      <style dangerouslySetInnerHTML={{ __html: shellCss + inventoryCss }} />
      <nav className="nav">
        <Link href="/" className="wordmark">WAYPOINT &amp; Co.<span>SEA · STAY · AIR</span></Link>
        <div className="links">
          <a href="/world" className={undefined}>Destinations</a>
          <a href="/air" className={category === "air" ? "current" : undefined}>Air</a>
          <a href="/sea" className={category === "sea" ? "current" : undefined}>Sea</a>
          <a href="/stay" className={category === "stay" ? "current" : undefined}>Stay</a>
          <a href="/journeys">Journeys</a>
        </div>
      </nav>
      {children}
      <footer>
        <span>ONE HOUSE · AIR · SEA · STAY</span>
        <span>© WAYPOINT &amp; CO.</span>
      </footer>
    </div>
  );
}

export function FleetPage({
  category, eyebrow, title, lede, editorialHref, editorialLabel,
}: {
  category: Category; eyebrow: string; title: string; lede: string;
  editorialHref: string; editorialLabel: string;
}) {
  const items = byCategory(category);
  const hero = items.find((i) => i.featured);
  const meta = CATEGORY_META[category];
  return (
    <Shell category={category}>
      <main>
        <div className="wrap">
          <header className="fleet">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
            <p className="backrow"><a className="quiet" href={editorialHref}>{editorialLabel} →</a></p>
          </header>

          {hero && (
            <section className="feature" aria-label={`Featured — ${hero.name}`}>
              <a className="fframe" href={`${meta.browsePath}/${hero.slug}`}
                 style={{ background: `linear-gradient(165deg, ${hero.tone[0]} 0%, ${hero.tone[1]} 52%, ${hero.tone[2]} 100%)` }}>
                <span className="flabel">Featured · {category.toUpperCase()}</span>
                {showInternalBriefs() && <span className="brief">{hero.heroBrief}</span>}
              </a>
              <div>
                <h2 className="fname">{hero.name}</h2>
                <p className="fdef">{hero.essence}</p>
                <p className="fmeta">{metaLines(hero)[0]}<br />{hero.capacityLabel} · {hero.useCase}<br />{hero.priceLabel}</p>
                <div className="dactions wpi" style={{ marginTop: 0 }}>
                  <button type="button" className="wpi-req"
                    data-fastlane="" data-fastlane-kind={meta.kind}
                    data-fastlane-ref={hero.slug} data-fastlane-title={hero.name}>
                    Request availability
                  </button>
                  <a className="wpi-view" href={`${meta.browsePath}/${hero.slug}`}>{meta.viewLabel} →</a>
                  {hero.destinations[0] && (
                    <a className="wpi-view" href={`/world/${hero.destinations[0]}`}>View destination →</a>
                  )}
                </div>
              </div>
            </section>
          )}

          <div className="browsehead">
            <h2>Browse the {category === "stay" ? "collection" : "fleet"}</h2>
            <span style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "#6D6A61" }}>
              CURATED · CONFIRMED BY PEOPLE
            </span>
          </div>
          <FleetBrowser items={items} category={category} />
        </div>
      </main>
    </Shell>
  );
}

export function InventoryDetail({ category, slug }: { category: Category; slug: string }) {
  const item = bySlug(category, slug);
  if (!item) notFound();
  const meta = CATEGORY_META[category];
  const grad = `linear-gradient(165deg, ${item.tone[0]} 0%, ${item.tone[1]} 52%, ${item.tone[2]} 100%)`;

  return (
    <Shell category={category}>
      <main>
        <div className="wrap">
          <p className="backrow" style={{ paddingTop: 26 }}>
            <a className="quiet" href={meta.browsePath}>← {meta.title}</a>
          </p>
          <div className="detail">
            <div>
              <div className="dframe" style={{ background: grad }}>
                {showInternalBriefs() && <span className="brief">{item.heroBrief}</span>}
              </div>
              <div className="gallery" aria-label="Gallery — photography in commission">
                <div className="gframe" style={{ background: grad, filter: "saturate(.9) brightness(1.04)" }}>
                  {showInternalBriefs() && <span className="brief">GALLERY 02 · DETAIL</span>}
                </div>
                <div className="gframe" style={{ background: grad, filter: "saturate(.85) brightness(.96)" }}>
                  {showInternalBriefs() && <span className="brief">GALLERY 03 · IN USE</span>}
                </div>
              </div>
            </div>
            <div>
              <p className="eyebrow" style={{ fontFamily: '"IBM Plex Mono",monospace', fontSize: 11, letterSpacing: ".32em", textTransform: "uppercase", color: "#5E6B75" }}>
                {category.toUpperCase()} · {item.featured ? "Featured" : "Collection"}
              </p>
              <h1 style={{ marginTop: 14 }}>{item.name}</h1>
              <p className="dmeta">{metaLines(item)[0]}<br />{metaLines(item)[1]}</p>
              <div className="facts" aria-label="Key facts">
                {item.specs.slice(0, 6).map((s2) => (
                  <div className="fact" key={s2.label}>
                    <div className="fl">{s2.label}</div>
                    <div className="fv">{s2.value}{s2.indicative && <span className="fi">TYPE DATA · INDICATIVE</span>}</div>
                  </div>
                ))}
              </div>
              <p className="desc">{item.description}</p>
              <div className="specs">
                {item.specs.map((s) => (
                  <div className="spec" key={s.label}>
                    <span className="l">{s.label}</span>
                    <span style={{ textAlign: "right" }}>
                      {s.value}
                      {s.indicative && <span className="ind">TYPE DATA · INDICATIVE</span>}
                    </span>
                  </div>
                ))}
              </div>
              <div className="priceline">
                <span className="price">{item.priceLabel}</span>
                <span className="status">{STATUS_LABEL[item.status]}</span>
              </div>
              <div className="dactions wpi">
                <button
                  type="button" className="wpi-req"
                  data-fastlane="" data-fastlane-kind={meta.kind}
                  data-fastlane-ref={item.slug} data-fastlane-title={item.name}
                >
                  Request availability
                </button>
                <a className="wpi-view" href={`/begin?${category === "air" ? "mode=air" : category === "sea" ? "vessel=" + item.slug : "residence=" + item.slug}&src=inventory-detail`}>
                  Build this journey →
                </a>
              </div>
              {item.attribution && <p className="attr">{item.attribution}</p>}
              {item.destinations.length > 0 && (
                <p className="dests">
                  Available in:{" "}
                  {item.destinations.map((dslug, i) => {
                    const dd = destBySlug(dslug);
                    return (
                      <span key={dslug}>
                        {i > 0 && " · "}
                        <a href={dd?.fullWorld || `/world/${dslug}`}>{dd?.name || dslug}</a>
                      </span>
                    );
                  })}
                </p>
              )}
              {item.relatedJourneys.length > 0 && (
                <p className="dests">
                  Suggested journeys:{" "}
                  {item.relatedJourneys.map((j, i) => (
                    <span key={j}>
                      {i > 0 && " · "}
                      <a href={`/begin?journey=${j}&src=inventory-detail`}>
                        {j.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </a>
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {(() => {
            const related = INVENTORY.filter(
              (x) => x.slug !== item.slug && x.category !== item.category &&
                x.destinations.some((dx) => item.destinations.includes(dx))
            ).slice(0, 3);
            if (!related.length) return null;
            return (
              <div className="wpi">
                <p className="relhead">Continue the journey · air, sea and stay together</p>
                <div className="wpi-grid">
                  {related.map((r) => <InventoryCard key={r.category + r.slug} item={r} />)}
                </div>
              </div>
            );
          })()}

          <div className="finalband">
            <p className="q">Availability is confirmed by people, to your dates — usually within the day.</p>
            <div className="wpi" style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <button type="button" className="wpi-req" style={{ borderColor: "#EDEAE1", color: "#EDEAE1" }}
                data-fastlane="" data-fastlane-kind={meta.kind}
                data-fastlane-ref={item.slug} data-fastlane-title={item.name}>
                Request availability
              </button>
            </div>
          </div>
          <JourneyToast />
        </div>
      </main>
    </Shell>
  );
}

export function relatedForDestination(dest: string) {
  return { InventoryCard };
}
