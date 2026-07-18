/* ============================================================
   WAYPOINT & Co. — THE ECOSYSTEM
   Phase Nine · waypoint-ecosystem.js · v1.0

   One module, dropped into every existing page.
   No page is redesigned. Every page becomes connected.

   Provides:
     1. Journey Memory        — the visitor's evolving journey
     2. Contextual Continuation — "Continue the Journey" renderer
     3. Journey Collections   — quiet inspiration gathering
     4. Concierge Awareness   — /begin links enriched with context
     5. Seasonal Intelligence — editorial season rendering
     6. Journey Analytics     — measure journeys, not clicks

   Design laws (enforced in code):
     · Never interrupt. Nothing opens itself.
     · Session-only memory. No sign-in. No tracking beyond the tab.
     · All relationships come from the CMS graph — nothing is
       recommended by this module; it only renders what the
       graph returns.
     · Fully keyboard accessible. Honours prefers-reduced-motion.

   Integration (per page):
     <script src="/js/waypoint-ecosystem.js" defer><\/script>
     <div data-continue-the-journey data-ref="vessel.alani"></div>
     — and remove any page-local "Add X to journey" pill;
       Journey Memory replaces it platform-wide.
   ============================================================ */

(function (window, document) {
  'use strict';

  /* ----------------------------------------------------------
     0 · BRAND LANGUAGE
     One editorial voice. Generic interface words are banned.
     ---------------------------------------------------------- */
  const LANG = {
    journey:        'Journey',
    continueTitle:  'Continue the Journey',
    nearbyWorlds:   'Nearby Worlds',
    furtherAlong:   'Further Along',
    moreToDiscover: 'More to Discover',
    nextChapter:    'The Next Chapter',
    returnHere:     'Return Here',
    wayForward:     'The Way Forward',
    resume:         'Continue where you left off',
    recently:       'Recently Explored',
    continueReading:'Continue Reading',
    resumeJourney:  'Resume Journey',
    beginJourney:   'Begin a Journey',
    inspiredBy:     'Inspired by your recent explorations',
    collections:    'Collections',
    newCollection:  'New collection',
    addedTo:        'Added to',
    clearMemory:    'Forget this journey',
    placesExplored: n => `${n} ${n === 1 ? 'place' : 'places'} explored`,
    expSaved:       n => `${n} ${n === 1 ? 'experience' : 'experiences'} saved`,
    journeysStarted:n => `${n} ${n === 1 ? 'journey' : 'journeys'} started`
  };

  const KIND_LABEL = {
    world: 'World', destination: 'Destination', place: 'Place',
    residence: 'Residence', vessel: 'Yacht', 'aircraft-category': 'Aircraft',
    experience: 'Experience', journey: 'Journey', journalEntry: 'Journal',
    pillar: 'Chapter'
  };

  /* Kinds counted as "places explored" in the summary line */
  const PLACE_KINDS = ['world', 'destination', 'place', 'residence', 'vessel'];

  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1 · SESSION STORE
     Session-only, per privacy principle: memory lives with the
     tab. sessionStorage where available; in-memory otherwise.
     A future account adapter can replace this without touching
     any other part of the module.
     ---------------------------------------------------------- */
  const Store = (function () {
    const KEY = 'waypoint.journey.v1';
    let memoryFallback = null;

    function readRaw() {
      try { return window.sessionStorage.getItem(KEY); }
      catch (e) { return memoryFallback; }
    }
    function writeRaw(v) {
      try { window.sessionStorage.setItem(KEY, v); }
      catch (e) { memoryFallback = v; }
    }
    function load() {
      const raw = readRaw();
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    function save(state) { writeRaw(JSON.stringify(state)); }
    function clear() {
      try { window.sessionStorage.removeItem(KEY); } catch (e) { /* noop */ }
      memoryFallback = null;
    }
    return { load, save, clear };
  })();

  /* ----------------------------------------------------------
     2 · JOURNEY MEMORY — the evolving journey
     Not a cart. Not favourites. A quiet record of the course
     the visitor is already plotting by moving through the world.
     ---------------------------------------------------------- */
  const Journey = {
    state: null,

    fresh() {
      return {
        startedAt: Date.now(),
        fixes: [],        // remembered moments {t, kind, ref, title, url, verb}
        added: [],        // explicit additions {kind, ref, title}
        collections: [],  // {name, items:[{kind,ref,title}]}
        begun: []         // journey-engine starts {seed, t}
      };
    },

    init() {
      this.state = Store.load() || this.fresh();
      return this.state;
    },

    persist() { Store.save(this.state); UI.refresh(); },

    /* remember — quiet observation. Deduped by kind:ref, newest last. */
    remember(evt) {
      if (!evt || !evt.kind || !evt.ref) return;
      const id = evt.kind + ':' + evt.ref;
      this.state.fixes = this.state.fixes.filter(f => (f.kind + ':' + f.ref) !== id);
      this.state.fixes.push({
        t: Date.now(),
        kind: evt.kind,
        ref: evt.ref,
        title: evt.title || evt.ref,
        url: evt.url || (window.location.pathname + window.location.search),
        verb: evt.verb || 'viewed'
      });
      if (this.state.fixes.length > 40) this.state.fixes.shift();
      this.persist();
      Analytics.track('relationship_hop', { kind: evt.kind, ref: evt.ref, depth: this.state.fixes.length });
    },

    /* add — an explicit choice. The pill press, the "Add to a journey". */
    add(item) {
      if (!item || !item.kind || !item.ref) return;
      const id = item.kind + ':' + item.ref;
      if (this.state.added.some(a => (a.kind + ':' + a.ref) === id)) return;
      this.state.added.push({ kind: item.kind, ref: item.ref, title: item.title || item.ref, meta: item.meta || null });
      this.persist();
      Analytics.track('journey_addition', { kind: item.kind, ref: item.ref });
      UI.announce(`${item.title || item.ref} — ${LANG.addedTo} ${LANG.journey}`);
    },

    remove(kind, ref) {
      const id = kind + ':' + ref;
      this.state.added = this.state.added.filter(a => (a.kind + ':' + a.ref) !== id);
      this.persist();
    },

    began(seed) {
      this.state.begun.push({ seed: seed || {}, t: Date.now() });
      this.persist();
      Analytics.track('journey_start', { seed });
    },

    summary() {
      const places = this.state.fixes.filter(f => PLACE_KINDS.includes(f.kind)).length;
      const exps = this.state.added.filter(a => a.kind === 'experience').length
                 + this.state.fixes.filter(f => f.kind === 'experience' && f.verb === 'added').length;
      return {
        places,
        experiences: exps,
        journeys: this.state.begun.length,
        empty: places + exps + this.state.begun.length + this.state.added.length === 0
      };
    },

    /* seed — Concierge Awareness. The Journey Engine consumes this so
       the visitor never repeats a selection they have already made. */
    seed() {
      const lastDest = [...this.state.fixes].reverse()
        .find(f => f.kind === 'destination' || f.kind === 'world');
      const lastResidence = [...this.state.fixes].reverse().find(f => f.kind === 'residence');
      const lastVessel = [...this.state.fixes].reverse().find(f => f.kind === 'vessel');
      const lastJourney = [...this.state.fixes].reverse().find(f => f.kind === 'journey');
      const exps = this.state.added.filter(a => a.kind === 'experience').map(a => a.ref);
      const seed = {};
      if (lastDest) seed.dest = lastDest.ref;
      if (lastResidence) seed.residence = lastResidence.ref;
      if (lastVessel) seed.vessel = lastVessel.ref;
      if (lastJourney) seed.journey = lastJourney.ref;
      if (exps.length) seed.exp = exps.slice(0, 6).join(',');
      return seed;
    },

    forget() {
      Store.clear();
      this.state = this.fresh();
      UI.refresh();
      Analytics.track('journey_forgotten', {});
    }
  };

  /* ----------------------------------------------------------
     3 · COLLECTIONS — quiet inspiration gathering
     ---------------------------------------------------------- */
  const Collections = {
    create(name) {
      name = (name || '').trim();
      if (!name) return null;
      let c = Journey.state.collections.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!c) {
        c = { name, items: [] };
        Journey.state.collections.push(c);
        Journey.persist();
        Analytics.track('collection_create', { name });
      }
      return c;
    },
    addTo(name, item) {
      const c = this.create(name);
      if (!c || !item) return;
      const id = item.kind + ':' + item.ref;
      if (!c.items.some(i => (i.kind + ':' + i.ref) === id)) {
        c.items.push({ kind: item.kind, ref: item.ref, title: item.title || item.ref });
        Journey.persist();
        UI.announce(`${item.title || item.ref} — ${LANG.addedTo} “${c.name}”`);
        Analytics.track('collection_addition', { name: c.name, kind: item.kind, ref: item.ref });
      }
    }
  };

  /* ----------------------------------------------------------
     4 · ANALYTICS — measure the journey, not the click
     Buffered; flushed to a configurable endpoint. Session-scoped,
     anonymous, no fingerprinting. Endpoint may be absent (no-op).
     ---------------------------------------------------------- */
  const Analytics = {
    endpoint: null,
    buffer: [],
    track(event, data) {
      this.buffer.push({ event, data: data || {}, t: Date.now(), path: window.location.pathname });
      if (this.buffer.length >= 10) this.flush();
    },
    flush() {
      if (!this.endpoint || this.buffer.length === 0) { this.buffer = []; return; }
      const payload = JSON.stringify({ events: this.buffer });
      this.buffer = [];
      try {
        if (navigator.sendBeacon) navigator.sendBeacon(this.endpoint, payload);
        else fetch(this.endpoint, { method: 'POST', body: payload, keepalive: true });
      } catch (e) { /* analytics must never break the journey */ }
    }
  };
  window.addEventListener('pagehide', () => Analytics.flush());

  /* ----------------------------------------------------------
     5 · OBSERVATION — the ecosystem quietly notices
     Pages are already tagged with data-cms attributes from
     Phases 4–8. Nothing new is required of the templates:
       · page-level context registers on load
       · a tagged element held in view ≈2.5s registers as explored
       · following any tagged link registers the step
     ---------------------------------------------------------- */
  const Observe = {
    titleOf(el) {
      const h = el.querySelector('h1,h2,h3,.w-name,.fix-name,.d-name,.cat-name,.m-name');
      return h ? h.textContent.trim().replace(/\s+/g, ' ') : null;
    },

    pageContext() {
      /* <body data-cms="..."> or the first data-cms element declares the page */
      const root = document.body.getAttribute('data-cms')
        ? document.body
        : document.querySelector('[data-cms="world"],[data-cms="destination"]');
      if (!root) return;
      const kind = root.getAttribute('data-cms');
      const ref = root.getAttribute('data-world') || root.getAttribute('data-dest')
               || root.getAttribute('data-ref');
      if (kind && ref) {
        Journey.remember({ kind, ref, title: document.title.split('—')[0].trim(), verb: 'entered' });
      }
    },

    dwell() {
      const els = document.querySelectorAll(
        '[data-cms="destination"],[data-cms="residence"],[data-cms="vessel"],' +
        '[data-cms="journey"],[data-cms="experience"],[data-cms="journalEntry"],' +
        '[data-cms="place"],[data-cms="aircraft-category"]'
      );
      if (!('IntersectionObserver' in window) || els.length === 0) return;
      const timers = new WeakMap();
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const el = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            timers.set(el, window.setTimeout(() => {
              const kind = el.getAttribute('data-cms');
              const ref = el.getAttribute('data-dest') || el.getAttribute('data-residence')
                       || el.getAttribute('data-journey') || el.getAttribute('data-place')
                       || el.getAttribute('data-category') || el.getAttribute('data-vessel')
                       || el.getAttribute('data-ref');
              if (kind && ref) Journey.remember({ kind, ref, title: Observe.titleOf(el) || ref });
              io.unobserve(el);
            }, 2500));
          } else {
            const t = timers.get(el);
            if (t) { window.clearTimeout(t); timers.delete(el); }
          }
        });
      }, { threshold: [0.55] });
      els.forEach(el => io.observe(el));
    },

    clicks() {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        const holder = a.closest('[data-cms]');
        if (holder) {
          const kind = holder.getAttribute('data-cms');
          const ref = holder.getAttribute('data-dest') || holder.getAttribute('data-residence')
                   || holder.getAttribute('data-journey') || holder.getAttribute('data-place')
                   || holder.getAttribute('data-category') || holder.getAttribute('data-vessel')
                   || holder.getAttribute('data-ref');
          if (kind && ref) Journey.remember({ kind, ref, title: Observe.titleOf(holder) || ref, verb: 'followed' });
        }
        /* Concierge Awareness — enrich /begin links at the moment of intent */
        try {
          const url = new URL(a.getAttribute('href'), window.location.origin);
          if (url.pathname === '/begin') {
            const seed = Journey.seed();
            Object.keys(seed).forEach(k => {
              if (!url.searchParams.has(k)) url.searchParams.set(k, seed[k]);
            });
            url.searchParams.set('ctx', 'session');
            a.setAttribute('href', url.pathname + '?' + url.searchParams.toString());
            Journey.began(Object.fromEntries(url.searchParams));
          }
        } catch (err) { /* leave the link untouched */ }
      }, true);
    }
  };

  /* ----------------------------------------------------------
     6 · CONTEXTUAL CONTINUATION — "Continue the Journey"
     Replaces every notion of "related content". The module only
     renders what the relationship graph returns — it never
     decides. Endpoint: GET /api/continue?ref=kind.slug
     Response: { title?, items: [{kind, ref, title, essence, url, group}] }
     Groups map to brand language: next-chapter | nearby-worlds |
     further-along | more-to-discover.
     A server-rendered fallback inside the mount is left intact
     if the graph cannot be reached. Progressive enhancement only.
     ---------------------------------------------------------- */
  const Continuation = {
    endpoint: '/api/continue',

    async mountAll() {
      const mounts = document.querySelectorAll('[data-continue-the-journey]');
      for (const el of mounts) {
        const ref = el.getAttribute('data-ref');
        if (!ref) continue;
        try {
          const res = await fetch(this.endpoint + '?ref=' + encodeURIComponent(ref), { credentials: 'same-origin' });
          if (!res.ok) throw new Error('graph unavailable');
          const data = await res.json();
          if (data && Array.isArray(data.items) && data.items.length) this.render(el, data);
        } catch (e) { /* keep the server-rendered fallback */ }
      }
    },

    groupTitle(g) {
      return { 'nearby-worlds': LANG.nearbyWorlds, 'further-along': LANG.furtherAlong,
               'more-to-discover': LANG.moreToDiscover, 'next-chapter': LANG.nextChapter }[g]
             || LANG.continueTitle;
    },

    render(el, data) {
      el.innerHTML = '';
      const section = document.createElement('section');
      section.className = 'wp-continue';
      section.setAttribute('aria-label', LANG.continueTitle);

      const head = document.createElement('p');
      head.className = 'wp-continue-eyebrow';
      head.textContent = data.title || LANG.continueTitle;
      section.appendChild(head);

      const list = document.createElement('div');
      list.className = 'wp-continue-list';

      data.items.slice(0, 6).forEach((item, i) => {
        const a = document.createElement('a');
        a.className = 'wp-continue-item';
        a.href = item.url || '#';
        a.setAttribute('data-cms', item.kind || '');
        a.setAttribute('data-ref', item.ref || '');
        a.style.transitionDelay = reduced ? '0s' : (i * 90) + 'ms';

        const kind = document.createElement('span');
        kind.className = 'wp-continue-kind';
        kind.textContent = item.group ? this.groupTitle(item.group) : (KIND_LABEL[item.kind] || '');

        const title = document.createElement('span');
        title.className = 'wp-continue-title';
        title.textContent = item.title || item.ref;

        const essence = document.createElement('span');
        essence.className = 'wp-continue-essence';
        essence.textContent = item.essence || '';

        a.appendChild(kind); a.appendChild(title);
        if (item.essence) a.appendChild(essence);
        list.appendChild(a);
      });

      section.appendChild(list);
      el.appendChild(section);

      if (!reduced && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((es) => {
          es.forEach(e2 => { if (e2.isIntersecting) { section.classList.add('in'); io.disconnect(); } });
        }, { threshold: 0.2 });
        io.observe(section);
      } else {
        section.classList.add('in');
      }
    }
  };

  /* ----------------------------------------------------------
     7 · SEASONAL INTELLIGENCE — editorial, never operational
     CMS supplies: <span data-season data-window="June–October"
                    data-character="Whale season"></span>
     Rendered as: "Best experienced · June–October · Whale season"
     ---------------------------------------------------------- */
  const Season = {
    mountAll() {
      document.querySelectorAll('[data-season]').forEach(el => {
        const win = el.getAttribute('data-window');
        const character = el.getAttribute('data-character');
        if (!win && !character) return;
        el.textContent = ['Best experienced', win, character].filter(Boolean).join(' · ');
        el.classList.add('wp-season');
      });
    }
  };

  /* ----------------------------------------------------------
     8 · JOURNEY MEMORY UI — one quiet control, platform-wide
     A pill; a drawer; the living plotted course. Keyboard-first.
     Replaces the page-local "Add AIR/STAY to journey" pills.
     ---------------------------------------------------------- */
  const UI = {
    pill: null, drawer: null, live: null, lastFocus: null,

    css() {
      const s = document.createElement('style');
      s.textContent = `
.wp-eco{--eco-ink:#211F1B;--eco-paper:#F1EEE7;--eco-soft:#6D6A61;--eco-line:#B3B0A7;--eco-accent:#5E6B75;
  font-family:"Instrument Sans",-apple-system,sans-serif;}
.wp-eco *{box-sizing:border-box;margin:0;padding:0;}
.wp-eco-pill{position:fixed;left:26px;bottom:26px;z-index:80;display:inline-flex;align-items:center;gap:14px;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;
  background:rgba(241,238,231,.94);backdrop-filter:blur(10px);color:var(--eco-ink);
  border:1px solid var(--eco-line);padding:13px 20px;cursor:pointer;
  opacity:0;transform:translateY(16px);pointer-events:none;
  transition:opacity .6s ${EASE},transform .6s ${EASE},border-color .4s;}
.wp-eco-pill.visible{opacity:1;transform:none;pointer-events:auto;}
.wp-eco-pill:hover,.wp-eco-pill:focus-visible{border-color:var(--eco-ink);}
.wp-eco-pill:focus-visible{outline:2px solid var(--eco-accent);outline-offset:4px;}
.wp-eco-pill .dot{width:7px;height:7px;border-radius:50%;border:1px solid var(--eco-accent);}
.wp-eco-pill.holds .dot{background:var(--eco-accent);}
.wp-eco-scrim{position:fixed;inset:0;z-index:89;background:rgba(33,31,27,.28);opacity:0;pointer-events:none;
  transition:opacity .5s ${EASE};}
.wp-eco-scrim.open{opacity:1;pointer-events:auto;}
.wp-eco-drawer{position:fixed;top:0;bottom:0;left:0;z-index:90;width:min(440px,92vw);
  background:var(--eco-paper);border-right:1px solid var(--eco-line);
  transform:translateX(-102%);transition:transform .7s ${EASE};
  display:flex;flex-direction:column;overflow:hidden;}
.wp-eco-drawer.open{transform:none;}
.wp-eco-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
  padding:28px 28px 20px;border-bottom:1px solid var(--eco-line);}
.wp-eco-head h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:26px;color:var(--eco-ink);}
.wp-eco-close{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--eco-soft);background:none;border:none;cursor:pointer;padding:6px 0;border-bottom:1px solid transparent;}
.wp-eco-close:hover,.wp-eco-close:focus-visible{color:var(--eco-ink);border-bottom-color:var(--eco-ink);}
.wp-eco-close:focus-visible{outline:2px solid var(--eco-accent);outline-offset:4px;}
.wp-eco-sum{padding:18px 28px;border-bottom:1px solid var(--eco-line);
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;font-weight:300;letter-spacing:.18em;
  text-transform:uppercase;color:var(--eco-soft);line-height:2.1;}
.wp-eco-body{flex:1;overflow-y:auto;padding:24px 28px;}
.wp-eco-label{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--eco-accent);margin:18px 0 14px;}
.wp-eco-label:first-child{margin-top:0;}
.wp-eco-course{position:relative;padding-left:22px;}
.wp-eco-course::before{content:"";position:absolute;left:3px;top:8px;bottom:8px;width:1px;background:var(--eco-line);}
.wp-eco-fix{position:relative;padding:0 0 16px;}
.wp-eco-course .wp-eco-fix.explicit{padding:12px 26px 14px 0;border-bottom:1px solid rgba(179,176,167,.45);}
.wp-eco-course .wp-eco-fix.explicit:last-child{border-bottom:none;}
.wp-eco-fix:last-child{padding-bottom:0;}
.wp-eco-fix::before{content:"";position:absolute;left:-22px;top:7px;width:7px;height:7px;border-radius:50%;
  border:1px solid var(--eco-accent);background:var(--eco-paper);}
.wp-eco-fix.explicit::before{background:var(--eco-accent);}
.wp-eco-fix .k{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--eco-soft);}
.wp-eco-glabel{font-family:"IBM Plex Mono",monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;color:var(--eco-accent);margin:20px 0 12px;}
.wp-eco-glabel:first-child{margin-top:0;}
.wp-eco-cmeta{display:block;font-family:"IBM Plex Mono",monospace;font-size:8.5px;font-weight:300;letter-spacing:.14em;text-transform:uppercase;color:var(--eco-soft);margin-top:4px;line-height:1.9;}
.wp-eco-cdef{display:block;font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-size:13.5px;color:var(--eco-soft);margin-top:2px;}
.wp-eco-rm{position:absolute;right:0;top:2px;background:none;border:none;cursor:pointer;color:var(--eco-soft);font-size:14px;padding:4px 6px;min-width:28px;min-height:28px;}
.wp-eco-rm:hover,.wp-eco-rm:focus-visible{color:var(--eco-ink);}
.wp-eco-rm:focus-visible{outline:2px solid var(--eco-accent);outline-offset:2px;}
.wp-eco-fix a{font-family:"Instrument Serif",Georgia,serif;font-size:19px;line-height:1.25;color:var(--eco-ink);
  text-decoration:none;display:block;margin-top:2px;}
.wp-eco-fix a:hover,.wp-eco-fix a:focus-visible{color:var(--eco-accent);}
.wp-eco-fix a:focus-visible{outline:2px solid var(--eco-accent);outline-offset:3px;}
.wp-eco-empty{font-size:14.5px;line-height:1.7;color:var(--eco-soft);max-width:34ch;}
.wp-eco-coll{margin-top:6px;}
.wp-eco-coll-row{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--eco-line);
  font-size:14px;color:var(--eco-ink);}
.wp-eco-coll-row .n{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.16em;color:var(--eco-soft);align-self:center;}
.wp-eco-foot{padding:20px 28px 26px;border-top:1px solid var(--eco-line);display:flex;flex-direction:column;gap:14px;}
.wp-eco-resume{display:inline-flex;align-items:center;justify-content:center;gap:12px;
  font-size:12.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  padding:16px 24px;background:var(--eco-ink);color:var(--eco-paper);text-decoration:none;
  transition:background .4s ${EASE};}
.wp-eco-resume:hover,.wp-eco-resume:focus-visible{background:var(--eco-accent);}
.wp-eco-resume:focus-visible{outline:2px solid var(--eco-accent);outline-offset:4px;}
.wp-eco-forget{align-self:flex-start;font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--eco-soft);background:none;border:none;cursor:pointer;
  padding:4px 0;border-bottom:1px solid transparent;}
.wp-eco-forget:hover,.wp-eco-forget:focus-visible{color:var(--eco-ink);border-bottom-color:var(--eco-ink);}
.wp-eco-forget:focus-visible{outline:2px solid var(--eco-accent);outline-offset:4px;}
.wp-eco-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}
/* --- Continue the Journey (rendered component) --- */
.wp-continue{padding:0;}
.wp-continue-eyebrow{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.32em;
  text-transform:uppercase;color:#5E6B75;margin-bottom:26px;}
.wp-continue-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;
  background:#B3B0A7;border:1px solid #B3B0A7;}
.wp-continue-item{background:#F1EEE7;padding:24px 26px;display:flex;flex-direction:column;gap:8px;
  text-decoration:none;color:#211F1B;opacity:0;transform:translateY(18px);
  transition:opacity .9s ${EASE},transform 1s ${EASE},background .4s;}
.wp-continue.in .wp-continue-item{opacity:1;transform:none;}
.wp-continue-item:hover,.wp-continue-item:focus-visible{background:#EAE6DB;}
.wp-continue-item:focus-visible{outline:2px solid #5E6B75;outline-offset:-2px;}
.wp-continue-kind{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.28em;
  text-transform:uppercase;color:#5E6B75;}
.wp-continue-title{font-family:"Instrument Serif",Georgia,serif;font-size:21px;line-height:1.2;}
.wp-continue-essence{font-size:13.5px;line-height:1.6;color:#6D6A61;}
.wp-season{font-family:"IBM Plex Mono",monospace;font-size:10.5px;font-weight:300;letter-spacing:.2em;
  text-transform:uppercase;color:#5E6B75;}
@media (prefers-reduced-motion: reduce){
  .wp-eco-pill,.wp-eco-drawer,.wp-eco-scrim,.wp-continue-item{transition:none !important;}
  .wp-continue-item{opacity:1;transform:none;}
}
@media (max-width:560px){ .wp-eco-pill{left:16px;bottom:16px;} }`;
      document.head.appendChild(s);
    },

    build() {
      this.css();

      /* live region for polite announcements */
      this.live = document.createElement('div');
      this.live.className = 'wp-eco-sr';
      this.live.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.live);

      /* the pill */
      this.pill = document.createElement('button');
      this.pill.className = 'wp-eco wp-eco-pill';
      this.pill.setAttribute('aria-haspopup', 'dialog');
      this.pill.setAttribute('aria-expanded', 'false');
      this.pill.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="txt"></span>';
      this.pill.addEventListener('click', () => this.open());
      document.body.appendChild(this.pill);

      /* scrim + drawer */
      const scrim = document.createElement('div');
      scrim.className = 'wp-eco-scrim';
      scrim.addEventListener('click', () => this.close());
      document.body.appendChild(scrim);
      this.scrim = scrim;

      this.drawer = document.createElement('aside');
      this.drawer.className = 'wp-eco wp-eco-drawer';
      this.drawer.setAttribute('role', 'dialog');
      this.drawer.setAttribute('aria-modal', 'true');
      this.drawer.setAttribute('aria-label', LANG.journey);
      document.body.appendChild(this.drawer);

      /* visibility rhythm — appears after the hero, never before */
      const show = () => {
        const past = window.scrollY > window.innerHeight * 0.7;
        this.pill.classList.toggle('visible', past || !Journey.summary().empty);
      };
      show();
      window.addEventListener('scroll', show, { passive: true });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer.classList.contains('open')) this.close();
      });

      this.refresh();
    },

    refresh() {
      if (!this.pill) return;
      const s = Journey.summary();
      const parts = [];
      if (s.places) parts.push(LANG.placesExplored(s.places));
      if (s.experiences) parts.push(LANG.expSaved(s.experiences));
      if (s.journeys) parts.push(LANG.journeysStarted(s.journeys));
      this.pill.querySelector('.txt').textContent =
        s.empty ? LANG.journey : LANG.journey + ' · ' + parts.join(' · ');
      this.pill.classList.toggle('holds', !s.empty);
      if (this.drawer && this.drawer.classList.contains('open')) this.renderDrawer();
    },

    renderDrawer() {
      const s = Journey.summary();
      const st = Journey.state;
      const seed = Journey.seed();
      const resumeUrl = '/begin?' + new URLSearchParams(
        Object.assign({}, seed, { ctx: 'session', src: 'journey-memory' })
      ).toString();

      const fixes = [...st.fixes].reverse().slice(0, 12);
      const fixHtml = fixes.map(f => `
        <div class="wp-eco-fix${f.verb === 'added' ? ' explicit' : ''}">
          <span class="k">${KIND_LABEL[f.kind] || f.kind}</span>
          <a href="${f.url}">${f.title}</a>
        </div>`).join('');

      const GROUP = { 'aircraft-category':'AIR', vessel:'SEA', residence:'STAY',
        destination:'DESTINATIONS', world:'DESTINATIONS', place:'DESTINATIONS',
        experience:'EXPERIENCES', journey:'JOURNEYS' };
      const groups = {};
      st.added.forEach(a => {
        const g = GROUP[a.kind] || 'ALSO CONSIDERED';
        (groups[g] = groups[g] || []).push(a);
      });
      const addedHtml = Object.keys(groups).map(g => `
        <div class="wp-eco-glabel">${g}</div>` + groups[g].map(a => `
        <div class="wp-eco-fix explicit" data-k="${a.kind}" data-r="${a.ref}">
          <button class="wp-eco-rm" type="button" aria-label="Remove ${a.title}">\u00D7</button>
          <a href="${resumeUrl}">${a.title}</a>
          ${a.meta ? `<span class="wp-eco-cmeta">${[a.meta.location, a.meta.capacity, a.meta.price].filter(Boolean).join(' \u00B7 ')}</span>
          <span class="wp-eco-cdef">${a.meta.defining || ''}</span>` : ''}
        </div>`).join('')).join('');

      const collHtml = st.collections.map(c => `
        <div class="wp-eco-coll-row"><span>${c.name}</span>
        <span class="n">${c.items.length} ${c.items.length === 1 ? 'item' : 'items'}</span></div>`).join('');

      this.drawer.innerHTML = `
        <div class="wp-eco-head">
          <h2>${LANG.journey}</h2>
          <button class="wp-eco-close" type="button">Close</button>
        </div>
        <div class="wp-eco-sum">${
          s.empty ? 'THE COURSE IS STILL BLANK \u00B7 EXPLORE, AND IT PLOTS ITSELF'
                  : [LANG.placesExplored(s.places), LANG.expSaved(s.experiences), LANG.journeysStarted(s.journeys)].join('<br>')
        }</div>
        <div class="wp-eco-body">
          ${ s.empty
            ? `<p class="wp-eco-empty">Move through the world — destinations, residences, vessels and experiences you spend time with will quietly plot themselves here.</p>`
            : `
              ${ addedHtml ? `<p class="wp-eco-label">Your considered options</p><div class="wp-eco-course">${addedHtml}</div>` : '' }
              <p class="wp-eco-label">${LANG.recently}</p>
              <div class="wp-eco-course">${fixHtml}</div>
              ${ collHtml ? `<p class="wp-eco-label">${LANG.collections}</p><div class="wp-eco-coll">${collHtml}</div>` : '' }
            `}
        </div>
        <div class="wp-eco-foot">
          <a class="wp-eco-resume" href="${resumeUrl}">${ st.begun.length ? LANG.resumeJourney : LANG.beginJourney }</a>
          ${ s.empty ? '' : `<button class="wp-eco-forget" type="button">${LANG.clearMemory}</button>` }
        </div>`;

      this.drawer.querySelector('.wp-eco-close').addEventListener('click', () => this.close());
      this.drawer.querySelectorAll('.wp-eco-rm').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          ev.preventDefault();
          const row = btn.closest('.wp-eco-fix');
          Journey.remove(row.getAttribute('data-k'), row.getAttribute('data-r'));
          this.renderDrawer();
        });
      });
      const forget = this.drawer.querySelector('.wp-eco-forget');
      if (forget) forget.addEventListener('click', () => { Journey.forget(); this.renderDrawer(); });
    },

    open() {
      this.lastFocus = document.activeElement;
      this.renderDrawer();
      this.drawer.classList.add('open');
      this.scrim.classList.add('open');
      this.pill.setAttribute('aria-expanded', 'true');
      const first = this.drawer.querySelector('.wp-eco-close');
      if (first) first.focus();
      this.trap = (e) => {
        if (e.key !== 'Tab') return;
        const f = this.drawer.querySelectorAll('a,button');
        if (!f.length) return;
        const list = Array.prototype.slice.call(f);
        const first2 = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first2) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first2.focus(); e.preventDefault(); }
      };
      this.drawer.addEventListener('keydown', this.trap);
      Analytics.track('journey_memory_open', {});
    },

    close() {
      this.drawer.classList.remove('open');
      this.scrim.classList.remove('open');
      this.pill.setAttribute('aria-expanded', 'false');
      if (this.trap) this.drawer.removeEventListener('keydown', this.trap);
      if (this.lastFocus) this.lastFocus.focus();
    },

    announce(msg) { if (this.live) this.live.textContent = msg; }
  };

  /* ----------------------------------------------------------
     9 · PUBLIC API — window.WaypointJourney
     The hook the Phase 6/7 pills anticipated, now platform-wide.
     ---------------------------------------------------------- */
  const API = {
    add: (item) => Journey.add(item),
    remove: (kind, ref) => Journey.remove(kind, ref),
    remember: (evt) => Journey.remember(evt),
    seed: () => Journey.seed(),
    summary: () => Journey.summary(),
    collections: {
      create: (name) => Collections.create(name),
      add: (name, item) => Collections.addTo(name, item),
      all: () => Journey.state.collections
    },
    forget: () => Journey.forget(),
    configure: (cfg) => {
      cfg = cfg || {};
      if (cfg.continueEndpoint) Continuation.endpoint = cfg.continueEndpoint;
      if (cfg.analyticsEndpoint) Analytics.endpoint = cfg.analyticsEndpoint;
    },
    open: () => UI.open(),
    lang: LANG
  };

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  function boot() {
    /* QA fix: no overlay UI on the full-screen Journey Engine */
    if (window.location.pathname === '/begin') return;
    Journey.init();
    UI.build();
    Observe.pageContext();
    Observe.dwell();
    Observe.clicks();
    Continuation.mountAll();
    Season.mountAll();
  }

  window.WaypointJourney = API;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
