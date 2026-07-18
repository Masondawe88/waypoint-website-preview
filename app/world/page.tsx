import type { Metadata } from "next";
import Link from "next/link";
import { REGIONS } from "@/lib/destinations";

export const metadata: Metadata = { title: "The World" };

const css = `
.atlas{--ivory:#F1EEE7;--ink:#211F1B;--metal:#B3B0A7;--soft:#6D6A61;--accent:#5E6B75;
  background:var(--ivory);color:var(--ink);min-height:100svh;
  font-family:"Instrument Sans",-apple-system,sans-serif;line-height:1.7;}
.atlas *{box-sizing:border-box;margin:0;padding:0;}
.atlas a{color:inherit;text-decoration:none;}
.atlas .wrap{max-width:1360px;margin:0 auto;padding:0 clamp(20px,5vw,72px);}
.atlas .nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px clamp(20px,5vw,72px);}
.atlas .wordmark{font-family:"Instrument Serif",Georgia,serif;font-size:19px;letter-spacing:.04em;}
.atlas .wordmark span{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;color:var(--accent);display:block;margin-top:1px;}
.atlas .links{display:flex;gap:30px;}
.atlas .links a{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--soft);}
.atlas .links a:hover{color:var(--ink);}
.atlas header.page{padding:clamp(56px,9vh,110px) 0 clamp(36px,5vh,60px);}
.atlas .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);}
.atlas h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(36px,5vw,66px);line-height:1.06;margin:18px 0 20px;max-width:14ch;}
.atlas .lede{font-size:17px;color:var(--soft);max-width:56ch;}
.atlas .region{padding:clamp(40px,6vh,64px) 0;border-top:1px solid var(--metal);}
.atlas .rhead{display:flex;justify-content:space-between;align-items:baseline;gap:20px;flex-wrap:wrap;margin-bottom:26px;}
.atlas .rname{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(26px,3vw,38px);}
.atlas .rnote{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--soft);}
.atlas .dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:clamp(14px,2vw,24px);}
.atlas .dcard{position:relative;display:flex;flex-direction:column;justify-content:flex-end;
  aspect-ratio:4/3;padding:20px;overflow:hidden;
  transition:transform .7s cubic-bezier(.22,1,.36,1);}
.atlas a.dcard:hover{transform:translateY(-5px);}
.atlas .dcard::after{content:"";position:absolute;inset:10px;border:1px solid rgba(241,238,231,.5);pointer-events:none;}
.atlas .dname{position:relative;font-family:"Instrument Serif",Georgia,serif;font-size:clamp(20px,1.9vw,25px);color:#F1EEE7;line-height:1.15;text-shadow:0 1px 14px rgba(33,31,27,.25);}
.atlas .dessence{position:relative;font-size:12px;color:rgba(241,238,231,.85);margin-top:5px;max-width:26ch;line-height:1.5;}
.atlas .dstate{position:absolute;top:18px;left:20px;font-family:"IBM Plex Mono",monospace;font-size:8.5px;letter-spacing:.26em;text-transform:uppercase;color:rgba(241,238,231,.9);}
.atlas .dcard.future{opacity:.55;filter:saturate(.6);}
.atlas footer{padding:26px clamp(20px,5vw,72px);border-top:1px solid var(--metal);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--soft);}
@media (max-width:700px){.atlas .links{display:none;}}
@media (prefers-reduced-motion:reduce){.atlas .dcard{transition:none !important;}}
`;

export default function Page() {
  return (
    <div className="atlas">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <nav className="nav">
        <Link href="/" className="wordmark">WAYPOINT &amp; Co.<span>THE WORLD</span></Link>
        <div className="links">
          <a href="/air">Air</a><a href="/sea">Sea</a><a href="/stay">Stay</a><a href="/journeys">Journeys</a>
        </div>
      </nav>
      <main>
        <div className="wrap">
          <header className="page">
            <p className="eyebrow">The World</p>
            <h1>Every destination is another world.</h1>
            <p className="lede">
              Australia is where the house lives — the worlds below are open now. New Zealand and the
              Pacific are the natural next crossing. Europe and the United States arrive deliberately,
              never before they are ready.
            </p>
          </header>

          {REGIONS.map((r) => (
            <section className="region" key={r.slug} aria-label={r.name}>
              <div className="rhead">
                <h2 className="rname">{r.name}</h2>
                <span className="rnote">
                  {r.state === "open" ? "OPEN" : r.state === "horizon" ? "ON THE HORIZON" : "FUTURE WORLD"} · {r.note}
                </span>
              </div>
              <div className="dgrid">
                {r.destinations.map((dd) => {
                  const grad = `linear-gradient(165deg, ${dd.tone[0]} 0%, ${dd.tone[1]} 52%, ${dd.tone[2]} 100%)`;
                  const stateLabel =
                    dd.state === "open" ? "OPEN" : dd.state === "horizon" ? "ON THE HORIZON" : "FUTURE";
                  if (dd.state === "future") {
                    return (
                      <div className="dcard future" key={dd.slug} style={{ background: grad }} aria-label={`${dd.name} — future world`}>
                        <span className="dstate">{stateLabel}</span>
                        <span className="dname">{dd.name}</span>
                        <span className="dessence">{dd.essence}</span>
                      </div>
                    );
                  }
                  const href = dd.fullWorld || `/world/${dd.slug}`;
                  return (
                    <a className="dcard" key={dd.slug} href={href} style={{ background: grad }}>
                      <span className="dstate">{stateLabel}</span>
                      <span className="dname">{dd.name}</span>
                      <span className="dessence">{dd.essence}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <footer>
        <span>THE WORLD · AUSTRALIA FIRST · EXPANDING DELIBERATELY</span>
        <span>© WAYPOINT &amp; CO.</span>
      </footer>
    </div>
  );
}
