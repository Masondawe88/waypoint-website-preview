import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allDestinations, destBySlug } from "@/lib/destinations";
import { byDestination } from "@/lib/inventory";
import { DestinationInventory } from "@/components/inventory/DestinationInventory";

export function generateStaticParams() {
  return allDestinations()
    .filter((x) => x.state !== "future" && !x.fullWorld)
    .map((x) => ({ slug: x.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const dd = destBySlug(params.slug);
  return { title: dd ? `${dd.name} — The World` : "The World" };
}

const css = `
.dw{--ivory:#F1EEE7;--ink:#211F1B;--metal:#B3B0A7;--soft:#6D6A61;--accent:#5E6B75;
  background:var(--ivory);color:var(--ink);min-height:100svh;
  font-family:"Instrument Sans",-apple-system,sans-serif;line-height:1.7;}
.dw *{box-sizing:border-box;margin:0;padding:0;}
.dw a{color:inherit;text-decoration:none;}
.dw .wrap{max-width:1360px;margin:0 auto;padding:0 clamp(20px,5vw,72px);}
.dw .nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:22px clamp(20px,5vw,72px);}
.dw .wordmark{font-family:"Instrument Serif",Georgia,serif;font-size:19px;letter-spacing:.04em;}
.dw .wordmark span{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;color:var(--accent);display:block;margin-top:1px;}
.dw .links{display:flex;gap:30px;}
.dw .links a{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--soft);}
.dw .links a:hover{color:var(--ink);}
.dw .hero{position:relative;min-height:52svh;display:flex;align-items:flex-end;color:#F1EEE7;overflow:hidden;}
.dw .hero::after{content:"";position:absolute;inset:16px;border:1px solid rgba(241,238,231,.4);pointer-events:none;}
.dw .hero .grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(33,31,27,.05),rgba(33,31,27,.4));}
.dw .hero .inner{position:relative;width:100%;padding:0 clamp(20px,5vw,72px) clamp(36px,6vh,64px);}
.dw .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:rgba(241,238,231,.8);}
.dw h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(38px,5.6vw,74px);line-height:1.05;margin-top:14px;text-shadow:0 1px 22px rgba(33,31,27,.25);}
.dw .essence{font-size:16.5px;color:rgba(241,238,231,.88);margin-top:12px;max-width:44ch;}
.dw section.block{padding:clamp(44px,7vh,84px) 0;border-top:1px solid var(--metal);}
.dw section.block:first-of-type{border-top:none;}
.dw .beyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);}
.dw h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(26px,3.2vw,42px);margin:14px 0 8px;}
.dw .bnote{font-size:14.5px;color:var(--soft);max-width:52ch;margin-bottom:26px;}
.dw .exp{font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:300;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);line-height:2.4;}
.dw .jrow{display:flex;justify-content:space-between;gap:18px;align-items:baseline;padding:16px 0;border-bottom:1px solid var(--metal);max-width:640px;}
.dw .jrow .t{font-family:"Instrument Serif",Georgia,serif;font-size:22px;}
.dw .quiet{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);border-bottom:1px solid var(--metal);padding-bottom:3px;white-space:nowrap;}
.dw .quiet:hover{color:var(--ink);border-bottom-color:var(--ink);}
.dw .horizon{padding:clamp(60px,10vh,120px) 0;text-align:left;}
.dw .horizon p{font-family:"Instrument Serif",Georgia,serif;font-size:clamp(22px,2.4vw,30px);font-style:italic;color:var(--soft);max-width:34ch;line-height:1.4;}
.dw .cta{display:inline-flex;align-items:center;gap:12px;margin-top:30px;
  font-size:12.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  border:1px solid var(--ink);padding:16px 28px;transition:background .4s,color .4s;}
.dw .cta:hover{background:var(--ink);color:var(--ivory);}
.dw footer{padding:26px clamp(20px,5vw,72px);border-top:1px solid var(--metal);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--soft);}
@media (max-width:700px){.dw .links{display:none;}}
`;

export default function Page({ params }: { params: { slug: string } }) {
  const dd = destBySlug(params.slug);
  if (!dd || dd.state === "future") notFound();
  const grad = `linear-gradient(165deg, ${dd.tone[0]} 0%, ${dd.tone[1]} 52%, ${dd.tone[2]} 100%)`;
  const inv = byDestination(dd.slug);

  return (
    <div className="dw">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <nav className="nav">
        <Link href="/" className="wordmark">WAYPOINT &amp; Co.<span>THE WORLD</span></Link>
        <div className="links">
          <a href="/world">All Worlds</a><a href="/air">Air</a><a href="/sea">Sea</a><a href="/stay">Stay</a>
        </div>
      </nav>

      <header className="hero" style={{ background: grad }}>
        <div className="grade" aria-hidden="true"></div>
        <div className="inner">
          <p className="eyebrow">The World · {dd.state === "open" ? "Open" : "On the horizon"}</p>
          <h1>{dd.name}</h1>
          <p className="essence">{dd.essence}</p>
        </div>
      </header>

      <main className="wrap">
        {dd.state === "horizon" ? (
          <section className="horizon">
            <p>
              This world is coming into view. The house is already flying here by arrangement —
              the full chapter opens when its residences, vessels and stories are ready.
            </p>
            <a className="cta" href={`/begin?dest=${dd.slug}&src=world-horizon`}>Speak with WAYPOINT →</a>
          </section>
        ) : (
          <>
            {inv.length > 0 && (
              <section className="block">
                <p className="beyebrow">In this world</p>
                <h2>Air, sea and stay — already here.</h2>
                <p className="bnote">
                  The house selects for the destination, not from a marketplace. Everything below is
                  available by enquiry, confirmed by people.
                </p>
                <DestinationInventory dest={dd.slug} />
              </section>
            )}
            {dd.journeys && dd.journeys.length > 0 && (
              <section className="block">
                <p className="beyebrow">Suggested journeys</p>
                <h2>Held as one course.</h2>
                <div>
                  {dd.journeys.map((j) => (
                    <div className="jrow" key={j.slug}>
                      <span className="t">{j.title}</span>
                      <a className="quiet" href={`/begin?journey=${j.slug}&dest=${dd.slug}&src=world-dest`}>Build this journey →</a>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {dd.experiences && dd.experiences.length > 0 && (
              <section className="block">
                <p className="beyebrow">Extraordinary moments</p>
                <h2>The days are made of these.</h2>
                <p className="exp">{dd.experiences.join(" · ")}</p>
              </section>
            )}
            <section className="block">
              <p className="beyebrow">Begin</p>
              <h2>Where will your journey begin?</h2>
              <a className="cta" href={`/begin?dest=${dd.slug}&src=world-dest`}>Build this journey →</a>{" "}
              <a className="cta" href={`/enquire?dest=${dd.slug}&src=world-dest`} style={{ marginLeft: 14 }}>Request availability →</a>
            </section>
          </>
        )}
      </main>
      <footer>
        <span>THE WORLD · {dd.name.toUpperCase()}</span>
        <span>© WAYPOINT &amp; CO.</span>
      </footer>
    </div>
  );
}
