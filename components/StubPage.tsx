/* Quiet placeholder surface — the house language (AIR/STAY family).
   Used for routes whose full editorial builds arrive with content, not code. */
import Link from "next/link";

const css = `
.wps{--ivory:#F1EEE7;--charcoal:#211F1B;--metal:#B3B0A7;--soft:#6D6A61;--accent:#5E6B75;
  background:var(--ivory);color:var(--charcoal);min-height:100svh;display:flex;flex-direction:column;
  font-family:"Instrument Sans",-apple-system,sans-serif;line-height:1.7;}
.wps *{margin:0;padding:0;box-sizing:border-box;}
.wps a{color:inherit;text-decoration:none;}
.wps .nav{display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:22px clamp(20px,5vw,72px);}
.wps .wordmark{font-family:"Instrument Serif",Georgia,serif;font-size:19px;letter-spacing:.04em;}
.wps .wordmark span{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;color:var(--accent);display:block;margin-top:1px;}
.wps .links{display:flex;gap:30px;}
.wps .links a{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--soft);}
.wps .links a:hover{color:var(--charcoal);}
.wps main{flex:1;display:flex;align-items:center;padding:clamp(56px,10vh,120px) clamp(20px,5vw,72px);}
.wps .inner{max-width:760px;}
.wps .eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);}
.wps h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:clamp(34px,5vw,60px);line-height:1.08;margin:18px 0 22px;max-width:16ch;}
.wps .lede{font-size:17px;color:var(--soft);max-width:52ch;}
.wps .rows{margin-top:38px;border-top:1px solid var(--metal);max-width:560px;}
.wps .row{display:flex;justify-content:space-between;gap:20px;align-items:baseline;
  padding:18px 0;border-bottom:1px solid var(--metal);}
.wps .row .t{font-family:"Instrument Serif",Georgia,serif;font-size:21px;}
.wps .row .go{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--accent);border-bottom:1px solid var(--metal);padding-bottom:3px;white-space:nowrap;}
.wps .row .go:hover{color:var(--charcoal);border-bottom-color:var(--charcoal);}
.wps .note{margin-top:34px;font-family:"IBM Plex Mono",monospace;font-size:10px;font-weight:300;
  letter-spacing:.22em;text-transform:uppercase;color:var(--soft);line-height:2.1;}
.wps footer{padding:26px clamp(20px,5vw,72px);border-top:1px solid var(--metal);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--soft);}
@media (max-width:700px){.wps .links{display:none;}}
`;

export type StubLink = { title: string; href: string; label?: string };

export default function StubPage(props: {
  eyebrow: string;
  title: string;
  lede: string;
  links?: StubLink[];
  note?: string;
}) {
  return (
    <div className="wps">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <nav className="nav">
        <Link href="/" className="wordmark">
          WAYPOINT &amp; Co.<span>SEA · STAY · AIR</span>
        </Link>
        <div className="links">
          <Link href="/world/whitsundays">The World</Link>
          <Link href="/sea">Sea</Link>
          <Link href="/stay">Stay</Link>
          <Link href="/air">Air</Link>
        </div>
      </nav>
      <main>
        <div className="inner">
          <p className="eyebrow">{props.eyebrow}</p>
          <h1>{props.title}</h1>
          <p className="lede">{props.lede}</p>
          {props.links && props.links.length > 0 && (
            <div className="rows">
              {props.links.map((l) => (
                <div className="row" key={l.href + l.title}>
                  <span className="t">{l.title}</span>
                  <a className="go" href={l.href}>
                    {l.label || "Continue"} →
                  </a>
                </div>
              ))}
            </div>
          )}
          {props.note && <p className="note">{props.note}</p>}
        </div>
      </main>
      <footer>
        <span>WAYPOINT &amp; CO. · ONE CONSIDERED JOURNEY</span>
        <span>© WAYPOINT &amp; CO.</span>
      </footer>
    </div>
  );
}
