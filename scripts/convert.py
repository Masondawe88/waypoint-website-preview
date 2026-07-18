#!/usr/bin/env python3
"""HTML -> Next.js App Router converter for WAYPOINT & Co.
Preserves each page exactly: CSS + body markup as-is, scripts re-run on mount.
Applies the v1.0 freeze patches: remove page-local pills; wire engine POST."""
import re, json, os, sys

SRC = "design-source"  # in-repo source of truth

PAGES = [
    # (source, route_dir, component, title, description)
    ("waypoint-and-co-homepage.html", "", "HomePage",
     "WAYPOINT & Co. — Air. Sea. Stay.",
     "A precision travel house. Private aviation, yacht charter and private residences, coordinated as one considered journey."),
    ("waypoint-sea-flagship-v2.html", "sea", "SeaPage",
     "SEA — Yacht Charter",
     "Let the coastline unfold. Private yacht charter through the Whitsundays, Noosa and Sydney."),
    ("waypoint-air.html", "air", "AirPage",
     "AIR — Private Charter",
     "Arrive on your own terms. Private fixed-wing and helicopter charter, Australia and international."),
    ("waypoint-stay.html", "stay", "StayPage",
     "STAY — Private Residences",
     "A place within the place. Private residences in the Whitsundays, Noosa and Tasmania."),
    ("waypoint-world-whitsundays.html", "world/whitsundays", "WhitsundaysPage",
     "The Whitsundays — The World",
     "Some places are meant to be crossed slowly. The Whitsundays, experienced as one considered journey."),
    ("waypoint-journey-engine.html", "begin", "BeginPage",
     "Begin a Journey",
     "Tell us where you are drawn to, and we will begin shaping the journey around you."),
    ("waypoint-design-system-v1.html", "design-system", "DesignSystemPage",
     "Design System (Internal)",
     "WAYPOINT & Co. living design system — internal reference."),
]

def extract(html):
    styles = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.S))
    m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    body = m.group(1)
    scripts = "\n;\n".join(re.findall(r"<script[^>]*>(.*?)</script>", body, re.S))
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S)
    # strip per-page font/preconnect links if any leaked into body (none expected)
    return styles, body.strip(), scripts.strip()

def patch(name, html):
    if name == "waypoint-air.html":
        # freeze: remove page-local pill (Journey Memory replaces it)
        html = re.sub(r"<!-- =+ ADD AIR TO JOURNEY =+ -->.*?</button>\n", "", html, flags=re.S)
        html = html.replace("const addAir = document.getElementById('addAir');",
                            "const addAir = document.getElementById('addAir'); if(!addAir){return;}")
    if name == "waypoint-stay.html":
        html = re.sub(r"<!-- =+ ADD STAY TO JOURNEY =+ -->.*?</button>\n", "", html, flags=re.S)
        html = html.replace("const addStay = document.getElementById('addStay');",
                            "const addStay = document.getElementById('addStay'); if(!addStay){return;}")
    if name == "waypoint-journey-engine.html":
        # wire the pending POST: when leaving WPT 07, submit to /api/enquiry (fire-and-forget)
        old = "  if(idx < steps.length - 1){ idx++; show(); }\n});"
        new = ("  if(steps[idx] === \"7\"){\n"
               "    try{\n"
               "      fetch(\"/api/enquiry\", {method:\"POST\", headers:{\"Content-Type\":\"application/json\"},\n"
               "        body: JSON.stringify({ submissionType:\"JourneyEngine\", state: state,\n"
               "          tracking:{ sourcePage: location.pathname + location.search },\n"
               "          antiSpam:{ website:\"\", dwellMs: Date.now() - (window.__wpOpened||Date.now()-5000) } })});\n"
               "    }catch(e){}\n"
               "  }\n"
               "  if(idx < steps.length - 1){ idx++; show(); }\n});")
        assert old in html, "engine handler anchor not found"
        html = html.replace(old, new)
        html = html.replace("(function(){", "(function(){ window.__wpOpened = Date.now();", 1)
    return html

PAGE_TSX = """import type {{ Metadata }} from "next";
import Client from "./client";

export const metadata: Metadata = {{
  title: {title},
  description: {desc},
}};

export default function Page() {{
  return <Client />;
}}
"""

CLIENT_TSX = """"use client";
/* {note}
   Generated from the frozen v1.0 design build — markup, styles and behaviour
   are preserved exactly. Edit content in the CMS or in the source HTML under
   /design-source, then re-run scripts/convert.py. */
import {{ useEffect }} from "react";

const CSS = {css};
const HTML = {html};
const JS = {js};

export default function {comp}() {{
  useEffect(() => {{
    try {{ new Function(JS)(); }} catch (e) {{ console.error("page script:", e); }}
  }}, []);
  return (
    <>
      <style dangerouslySetInnerHTML={{{{ __html: CSS }}}} />
      <div dangerouslySetInnerHTML={{{{ __html: HTML }}}} />
    </>
  );
}}
"""

for src, route, comp, title, desc in PAGES:
    raw = open(os.path.join(SRC, src)).read()
    raw = patch(src, raw)
    css, body, js = extract(raw)
    d = os.path.join("app", route) if route else "app"
    os.makedirs(d, exist_ok=True)
    if route == "design-system":
        print("design-system: page.tsx left as-is (production-gated, see QA v1.1)")
    else:
        open(os.path.join(d, "page.tsx"), "w").write(
            PAGE_TSX.format(title=json.dumps(title), desc=json.dumps(desc)))
    open(os.path.join(d, "client.tsx"), "w").write(
        CLIENT_TSX.format(note=src, comp=comp,
                          css=json.dumps(css), html=json.dumps(body), js=json.dumps(js)))
    print(f"converted {src:42s} -> /{route or ''}  (css {len(css)}, html {len(body)}, js {len(js)})")

