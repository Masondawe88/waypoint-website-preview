/* ============================================================
   WAYPOINT & Co. — THE FAST LANE
   Version 1.0 Final Feature · waypoint-fastlane.js

   The direct line to the WAYPOINT Concierge.
   Not a booking engine. Not checkout. Not availability.
   "If you already know what you want, we'll take it from here."

   One module, dropped into every page beside the Ecosystem:

     <script src="/js/waypoint-fastlane.js" defer><\/script>

   It provides:
     · The enquiry modal (instant, no navigation, no reload)
     · Trigger binding:   any [data-fastlane] element, and any
                          <a href="/enquire?..."> link (intercepted)
     · Nav "Enquire":     injected beside the existing Begin action
     · Desktop FAB:       discreet bottom-right floating action
     · Mobile bar:        sticky footer — Enquire · Shape Journey
     · Intelligent prefill: context from the trigger, the page,
                          and Journey Memory (never asked, never shown
                          as questions — attached quietly)
     · Journey Engine inheritance via WaypointJourney.seed()
     · Same endpoint as the engine: POST /api/enquiry
       with submissionType: "FastLane"

   Design laws:
     · Inherits the platform language. No new visual system.
     · Only email is mandatory.
     · Confirmation is a promise, not a receipt.
     · WCAG AA — dialog semantics, focus trap, Escape, live
       announcements, reduced motion, 44px touch targets.
   ============================================================ */

(function (window, document) {
  'use strict';

  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     LANGUAGE — fixed by the brief. Banned verbs never appear.
     ---------------------------------------------------------- */
  const LANG = {
    navLabel:    'Enquire',
    fabLabel:    'Enquire',
    barPrimary:  'Enquire',
    barSecondary:'Shape Journey',
    headline:    'Tell us a little about your plans.',
    sub:         'We\u2019ll personally review your request and guide you from here.',
    send:        'Send enquiry',
    sending:     'Sending\u2026',
    thanksHead:  'Thank you.',
    thanksBody:  'Your request has been received. A member of the WAYPOINT Concierge will personally review your plans and be in touch shortly.',
    thanksNote:  'NO AUTOMATED ITINERARY REPLACES THOUGHTFUL PLANNING',
    close:       'Close',
    name:        'Name',
    email:       'Email',
    phone:       'Phone (optional)',
    dates:       'Preferred travel dates',
    flexible:    'My dates are flexible',
    guests:      'Guests',
    message:     'Anything else we should know?',
    emailNeeded: 'An email address is all we need to reply.',
    failed:      'That didn\u2019t send. Please try again, or email us directly.',
    contextIntro:'Enquiry',
    remove:      'Remove'
  };

  const KIND_LABEL = {
    vessel: 'Vessel', residence: 'Residence', 'aircraft-category': 'Aircraft',
    experience: 'Experience', journey: 'Journey', destination: 'Destination',
    world: 'World', place: 'Place'
  };

  /* ----------------------------------------------------------
     STATE
     ---------------------------------------------------------- */
  const S = {
    endpoint: '/api/enquiry',
    analyticsEndpoint: null,
    open: false,
    openedAt: 0,
    context: {},          // {kind, ref, title} — what they clicked
    seeds: {},            // inherited journey/session context
    lastFocus: null,
    els: {}
  };

  /* ----------------------------------------------------------
     ANALYTICS — conversations, not clicks
     ---------------------------------------------------------- */
  const track = (event, data) => {
    if (!S.analyticsEndpoint) return;
    try {
      const payload = JSON.stringify({ events: [{ event, data: data || {}, t: Date.now(), path: window.location.pathname }] });
      if (navigator.sendBeacon) navigator.sendBeacon(S.analyticsEndpoint, payload);
      else fetch(S.analyticsEndpoint, { method: 'POST', body: payload, keepalive: true });
    } catch (e) { /* never break the enquiry */ }
  };

  /* ----------------------------------------------------------
     CONTEXT — the modal already knows what the visitor clicked
     ---------------------------------------------------------- */
  function titleNear(el) {
    if (!el) return null;
    const h = el.querySelector('h1,h2,h3,.cat-name,.d-name,.w-name,.fix-name,.m-name');
    return h ? h.textContent.trim().replace(/\s+/g, ' ') : null;
  }

  function refFrom(el) {
    if (!el) return null;
    return el.getAttribute('data-ref') || el.getAttribute('data-dest')
        || el.getAttribute('data-residence') || el.getAttribute('data-journey')
        || el.getAttribute('data-place') || el.getAttribute('data-category')
        || el.getAttribute('data-vessel') || el.getAttribute('data-world');
  }

  function contextFromTrigger(trigger) {
    /* V2: carry the indicative rate the client saw, for CRM context */
    
    /* 1 · explicit data-fastlane-* on the trigger wins */
    if (trigger && trigger.getAttribute('data-fastlane-ref')) {
      return {
        kind: trigger.getAttribute('data-fastlane-kind') || '',
        ref:  trigger.getAttribute('data-fastlane-ref'),
        title:trigger.getAttribute('data-fastlane-title') || trigger.getAttribute('data-fastlane-ref'),
        rateViewed: trigger.getAttribute('data-fastlane-rate') || null,
        priceUnit: trigger.getAttribute('data-fastlane-unit') || null,
        priceOnApplication: trigger.getAttribute('data-fastlane-poa') === 'true',
        location: trigger.getAttribute('data-fastlane-loc') || null
      };
    }
    /* 2 · nearest tagged ancestor (the pattern every page already uses) */
    const holder = trigger ? trigger.closest('[data-cms]') : null;
    if (holder) {
      const kind = holder.getAttribute('data-cms');
      const ref = refFrom(holder);
      if (kind && ref) return { kind, ref, title: titleNear(holder) || ref };
    }
    /* 3 · an /enquire link's own parameters */
    if (trigger && trigger.tagName === 'A') {
      try {
        const u = new URL(trigger.getAttribute('href'), window.location.origin);
        const ref = u.searchParams.get('ref');
        if (ref) {
          const dot = ref.indexOf('.');
          return { kind: dot > 0 ? ref.slice(0, dot) : '', ref: dot > 0 ? ref.slice(dot + 1) : ref, title: null };
        }
        const dest = u.searchParams.get('dest');
        if (dest) return { kind: 'destination', ref: dest, title: null };
      } catch (e) { /* fall through */ }
    }
    /* 4 · the page itself */
    const root = document.body.getAttribute('data-cms')
      ? document.body
      : document.querySelector('[data-cms="world"],[data-cms="destination"],[data-cms="vessel"]');
    if (root) {
      const kind = root.getAttribute('data-cms');
      const ref = refFrom(root);
      if (kind && ref) return { kind, ref, title: document.title.split('\u2014')[0].trim() };
    }
    return {};
  }

  function inheritSeeds() {
    /* Journey Engine + Ecosystem inheritance — never ask again */
    try {
      if (window.WaypointJourney && typeof window.WaypointJourney.seed === 'function') {
        return window.WaypointJourney.seed() || {};
      }
    } catch (e) { /* ecosystem absent — fine */ }
    return {};
  }

  function journeyMemorySnapshot() {
    try {
      if (window.WaypointJourney && typeof window.WaypointJourney.summary === 'function') {
        const s = window.WaypointJourney.summary();
        return { places: s.places, experiences: s.experiences, journeys: s.journeys };
      }
    } catch (e) { /* noop */ }
    return null;
  }

  /* ----------------------------------------------------------
     STYLES — the platform language, nothing new
     ---------------------------------------------------------- */
  function css() {
    const s = document.createElement('style');
    s.textContent = `
.wp-fl{--fl-ink:#211F1B;--fl-paper:#F1EEE7;--fl-soft:#6D6A61;--fl-line:#B3B0A7;--fl-accent:#5E6B75;
  font-family:"Instrument Sans",-apple-system,sans-serif;}
.wp-fl *{box-sizing:border-box;margin:0;padding:0;}
.wp-fl-scrim{position:fixed;inset:0;z-index:95;background:rgba(33,31,27,.32);
  opacity:0;pointer-events:none;transition:opacity .45s ${EASE};}
.wp-fl-scrim.open{opacity:1;pointer-events:auto;}
.wp-fl-modal{position:fixed;z-index:96;left:50%;top:50%;
  width:min(600px,calc(100vw - 32px));max-height:min(760px,calc(100svh - 48px));
  background:var(--fl-paper);border:1px solid var(--fl-line);
  transform:translate(-50%,-50%) translateY(22px);opacity:0;pointer-events:none;
  transition:opacity .5s ${EASE},transform .6s ${EASE};
  display:flex;flex-direction:column;overflow:hidden;}
.wp-fl-modal.open{opacity:1;transform:translate(-50%,-50%);pointer-events:auto;}
.wp-fl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;
  padding:30px 34px 0;}
.wp-fl-eyebrow{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.3em;
  text-transform:uppercase;color:var(--fl-accent);}
.wp-fl-close{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--fl-soft);background:none;border:none;cursor:pointer;
  padding:8px 0 6px;min-width:44px;min-height:34px;border-bottom:1px solid transparent;}
.wp-fl-close:hover,.wp-fl-close:focus-visible{color:var(--fl-ink);border-bottom-color:var(--fl-ink);}
.wp-fl-close:focus-visible{outline:2px solid var(--fl-accent);outline-offset:4px;}
.wp-fl-body{overflow-y:auto;padding:14px 34px 34px;}
.wp-fl-h2{font-family:"Instrument Serif",Georgia,serif;font-weight:400;
  font-size:clamp(26px,3.2vw,34px);line-height:1.12;color:var(--fl-ink);margin-top:12px;}
.wp-fl-sub{font-size:15px;line-height:1.7;color:var(--fl-soft);margin-top:12px;max-width:44ch;}
.wp-fl-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;}
.wp-fl-chip{display:inline-flex;align-items:center;gap:10px;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--fl-ink);border:1px solid var(--fl-line);padding:9px 12px;background:transparent;}
.wp-fl-chip .k{color:var(--fl-accent);}
.wp-fl-chip button{background:none;border:none;cursor:pointer;color:var(--fl-soft);
  font-family:inherit;font-size:12px;line-height:1;padding:4px;min-width:24px;min-height:24px;}
.wp-fl-chip button:hover,.wp-fl-chip button:focus-visible{color:var(--fl-ink);}
.wp-fl-chip button:focus-visible{outline:2px solid var(--fl-accent);outline-offset:2px;}
.wp-fl-form{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:18px 20px;}
.wp-fl-field{display:flex;flex-direction:column;gap:7px;}
.wp-fl-field.full{grid-column:1 / -1;}
.wp-fl-label{font-family:"IBM Plex Mono",monospace;font-size:10px;letter-spacing:.26em;
  text-transform:uppercase;color:var(--fl-accent);}
.wp-fl-input,.wp-fl-ta{font-family:"Instrument Sans",sans-serif;font-size:15.5px;color:var(--fl-ink);
  background:transparent;border:none;border-bottom:1px solid var(--fl-line);
  padding:10px 2px;min-height:44px;border-radius:0;transition:border-color .3s;}
.wp-fl-ta{min-height:76px;resize:vertical;line-height:1.6;}
.wp-fl-input:focus,.wp-fl-ta:focus{outline:none;border-bottom-color:var(--fl-ink);}
.wp-fl-input:focus-visible,.wp-fl-ta:focus-visible{outline:2px solid var(--fl-accent);outline-offset:3px;}
.wp-fl-input::placeholder,.wp-fl-ta::placeholder{color:#A5A29A;}
.wp-fl-flex{display:flex;align-items:center;gap:12px;padding-top:6px;}
.wp-fl-flex input{width:18px;height:18px;accent-color:var(--fl-accent);min-width:18px;}
.wp-fl-flex label{font-size:13.5px;color:var(--fl-soft);cursor:pointer;padding:8px 0;}
.wp-fl-guests{display:inline-flex;align-items:center;gap:0;border:1px solid var(--fl-line);}
.wp-fl-guests button{width:44px;height:44px;background:none;border:none;cursor:pointer;
  font-family:"IBM Plex Mono",monospace;font-size:16px;color:var(--fl-ink);}
.wp-fl-guests button:hover{background:#EAE6DB;}
.wp-fl-guests button:focus-visible{outline:2px solid var(--fl-accent);outline-offset:-2px;}
.wp-fl-guests .n{min-width:56px;text-align:center;font-family:"IBM Plex Mono",monospace;
  font-size:13px;color:var(--fl-ink);}
.wp-fl-err{grid-column:1/-1;font-size:13px;color:#8A4A3A;min-height:18px;}
.wp-fl-actions{grid-column:1/-1;display:flex;align-items:center;gap:22px;margin-top:6px;flex-wrap:wrap;}
.wp-fl-send{display:inline-flex;align-items:center;gap:12px;cursor:pointer;
  font-size:12.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  padding:17px 30px;min-height:48px;background:var(--fl-ink);color:var(--fl-paper);border:1px solid var(--fl-ink);
  transition:background .4s ${EASE},border-color .4s ${EASE};}
.wp-fl-send:hover:not(:disabled),.wp-fl-send:focus-visible{background:var(--fl-accent);border-color:var(--fl-accent);}
.wp-fl-send:focus-visible{outline:2px solid var(--fl-accent);outline-offset:4px;}
.wp-fl-send:disabled{opacity:.55;cursor:default;}
.wp-fl-privacy{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--fl-soft);}
.wp-fl-hp{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;}
/* confirmation */
.wp-fl-thanks{padding:26px 0 6px;}
.wp-fl-thanks .h{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:32px;color:var(--fl-ink);}
.wp-fl-thanks .b{font-size:15.5px;line-height:1.75;color:var(--fl-soft);margin-top:14px;max-width:46ch;}
.wp-fl-thanks .n{font-family:"IBM Plex Mono",monospace;font-size:9.5px;letter-spacing:.22em;
  color:var(--fl-accent);margin-top:22px;display:block;}
/* desktop FAB — discreet, bottom right */
.wp-fl-fab{position:fixed;right:26px;bottom:26px;z-index:80;
  display:inline-flex;align-items:center;gap:12px;cursor:pointer;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.24em;text-transform:uppercase;
  background:#211F1B;color:#F1EEE7;border:1px solid #211F1B;padding:13px 20px;min-height:44px;
  opacity:0;transform:translateY(16px);pointer-events:none;
  transition:opacity .6s ${EASE},transform .6s ${EASE},background .4s;}
.wp-fl-fab.visible{opacity:1;transform:none;pointer-events:auto;}
.wp-fl-fab:hover,.wp-fl-fab:focus-visible{background:#5E6B75;border-color:#5E6B75;}
.wp-fl-fab:focus-visible{outline:2px solid #5E6B75;outline-offset:4px;}
.wp-fl-fab .glyph{font-weight:300;font-size:13px;}
/* mobile sticky bar — two equal lanes */
.wp-fl-bar{position:fixed;left:0;right:0;bottom:0;z-index:80;display:none;
  grid-template-columns:1fr 1fr;background:rgba(241,238,231,.96);backdrop-filter:blur(10px);
  border-top:1px solid #B3B0A7;padding:10px 12px calc(10px + env(safe-area-inset-bottom));gap:10px;}
.wp-fl-bar a,.wp-fl-bar button{display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;
  font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;
  min-height:48px;text-decoration:none;border:1px solid #211F1B;}
.wp-fl-bar .primary{background:#211F1B;color:#F1EEE7;}
.wp-fl-bar .secondary{background:transparent;color:#211F1B;}
.wp-fl-bar .primary:focus-visible,.wp-fl-bar .secondary:focus-visible{outline:2px solid #5E6B75;outline-offset:2px;}
.wp-fl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}
/* nav injection */
.wp-fl-nav{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;
  background:none;border:none;cursor:pointer;color:inherit;padding:10px 14px;min-height:40px;
  border-bottom:1px solid transparent;transition:border-color .3s;}
.wp-fl-nav:hover,.wp-fl-nav:focus-visible{border-bottom-color:currentColor;}
.wp-fl-nav:focus-visible{outline:2px solid #5E6B75;outline-offset:4px;}
@media (max-width:820px){
  .wp-fl-bar{display:grid;}
  .wp-fl-fab{display:none;}
  body.wp-fl-has-bar .wp-eco-pill{bottom:calc(78px + env(safe-area-inset-bottom)) !important;}
  .wp-fl-modal{width:100vw;max-height:100svh;height:100svh;left:0;top:0;
    transform:translateY(24px);border:none;}
  .wp-fl-modal.open{transform:none;}
  .wp-fl-form{grid-template-columns:1fr;}
}
@media (prefers-reduced-motion: reduce){
  .wp-fl-modal,.wp-fl-scrim,.wp-fl-fab{transition:none !important;}
}`;
    document.head.appendChild(s);
  }

  /* ----------------------------------------------------------
     MODAL — built once, opened instantly
     ---------------------------------------------------------- */
  function buildModal() {
    const scrim = document.createElement('div');
    scrim.className = 'wp-fl wp-fl-scrim';
    scrim.addEventListener('click', close);
    document.body.appendChild(scrim);

    const modal = document.createElement('div');
    modal.className = 'wp-fl wp-fl-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'wp-fl-h2');
    document.body.appendChild(modal);

    const live = document.createElement('div');
    live.className = 'wp-fl-sr';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    S.els = { scrim, modal, live };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && S.open) close();
      if (e.key === 'Tab' && S.open) trap(e);
    });
  }

  function trap(e) {
    const f = S.els.modal.querySelectorAll('a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const list = Array.prototype.slice.call(f).filter(el => !el.disabled && el.offsetParent !== null);
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function chipHtml(kindLabel, value, removableKey) {
    return `<span class="wp-fl-chip" data-chipkey="${removableKey || ''}">
      ${kindLabel ? `<span class="k">${kindLabel}</span>` : ''}<span>${value}</span>
      ${removableKey ? `<button type="button" aria-label="${LANG.remove} ${value}">\u00D7</button>` : ''}
    </span>`;
  }

  function render() {
    const ctx = S.context;
    const seeds = S.seeds;
    const chips = [];

    if (ctx.ref) chips.push(chipHtml(KIND_LABEL[ctx.kind] || '', ctx.title || ctx.ref, 'context'));
    if (seeds.dest && (!ctx.ref || seeds.dest !== ctx.ref)) chips.push(chipHtml('Destination', seeds.dest, 'dest'));
    if (seeds.journey && seeds.journey !== ctx.ref) chips.push(chipHtml('Journey', seeds.journey, 'journey'));
    if (seeds.exp) seeds.exp.split(',').slice(0, 4).forEach(x => chips.push(chipHtml('Experience', x, 'exp:' + x)));

    S.els.modal.innerHTML = `
      <div class="wp-fl-head">
        <span class="wp-fl-eyebrow">${LANG.contextIntro}${ctx.title || ctx.ref ? ' \u00B7 ' + (ctx.title || ctx.ref) : ''}</span>
        <button type="button" class="wp-fl-close">${LANG.close}</button>
      </div>
      <div class="wp-fl-body">
        <h2 class="wp-fl-h2" id="wp-fl-h2">${LANG.headline}</h2>
        <p class="wp-fl-sub">${LANG.sub}</p>
        ${chips.length ? `<div class="wp-fl-chips">${chips.join('')}</div>` : ''}
        <form class="wp-fl-form" novalidate>
          <div class="wp-fl-field">
            <label class="wp-fl-label" for="wp-fl-name">${LANG.name}</label>
            <input class="wp-fl-input" id="wp-fl-name" name="name" type="text" autocomplete="name">
          </div>
          <div class="wp-fl-field">
            <label class="wp-fl-label" for="wp-fl-email">${LANG.email}</label>
            <input class="wp-fl-input" id="wp-fl-email" name="email" type="email" autocomplete="email" required aria-required="true">
          </div>
          <div class="wp-fl-field">
            <label class="wp-fl-label" for="wp-fl-phone">${LANG.phone}</label>
            <input class="wp-fl-input" id="wp-fl-phone" name="phone" type="tel" autocomplete="tel">
          </div>
          <div class="wp-fl-field">
            <label class="wp-fl-label" for="wp-fl-dates">${LANG.dates}</label>
            <input class="wp-fl-input" id="wp-fl-dates" name="dates" type="text" placeholder="e.g. Late June, 5 nights" value="${seeds.dates ? String(seeds.dates).replace(/"/g,'&quot;') : ''}">
          </div>
          <div class="wp-fl-field">
            <span class="wp-fl-label" id="wp-fl-guests-label">${LANG.guests}</span>
            <span class="wp-fl-guests" role="group" aria-labelledby="wp-fl-guests-label">
              <button type="button" data-step="-1" aria-label="Fewer guests">\u2212</button>
              <span class="n" aria-live="polite">${seeds.guests ? parseInt(seeds.guests, 10) || 2 : '\u2014'}</span>
              <button type="button" data-step="1" aria-label="More guests">+</button>
            </span>
          </div>
          <div class="wp-fl-field wp-fl-flex">
            <input type="checkbox" id="wp-fl-flexible" name="flexible">
            <label for="wp-fl-flexible">${LANG.flexible}</label>
          </div>
          <div class="wp-fl-field full">
            <label class="wp-fl-label" for="wp-fl-msg">${LANG.message}</label>
            <textarea class="wp-fl-ta" id="wp-fl-msg" name="message"></textarea>
          </div>
          <div class="wp-fl-hp" aria-hidden="true">
            <label>Leave this field empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
          </div>
          <p class="wp-fl-err" role="alert"></p>
          <div class="wp-fl-actions">
            <button type="submit" class="wp-fl-send">${LANG.send}</button>
            <span class="wp-fl-privacy">${LANG.emailNeeded}</span>
          </div>
        </form>
      </div>`;

    S.els.modal.querySelector('.wp-fl-close').addEventListener('click', close);

    /* removable chips */
    S.els.modal.querySelectorAll('.wp-fl-chip button').forEach(btn => {
      btn.addEventListener('click', () => {
        const chip = btn.closest('.wp-fl-chip');
        const key = chip.getAttribute('data-chipkey');
        if (key === 'context') S.context = {};
        else if (key === 'dest') delete S.seeds.dest;
        else if (key === 'journey') delete S.seeds.journey;
        else if (key.indexOf('exp:') === 0) {
          S.seeds.exp = (S.seeds.exp || '').split(',').filter(x => x !== key.slice(4)).join(',');
          if (!S.seeds.exp) delete S.seeds.exp;
        }
        chip.remove();
      });
    });

    /* guests stepper */
    const nEl = S.els.modal.querySelector('.wp-fl-guests .n');
    S.els.modal.querySelectorAll('.wp-fl-guests button').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = parseInt(nEl.textContent, 10);
        let next = (isNaN(cur) ? 2 : cur) + parseInt(btn.getAttribute('data-step'), 10);
        if (next < 1) next = 1;
        if (next > 99) next = 99;
        nEl.textContent = String(next);
      });
    });

    S.els.modal.querySelector('form').addEventListener('submit', submit);
  }

  /* ----------------------------------------------------------
     OPEN / CLOSE
     ---------------------------------------------------------- */
  function open(trigger, explicitContext) {
    S.context = explicitContext || contextFromTrigger(trigger);
    S.seeds = inheritSeeds();
    S.openedAt = Date.now();
    S.lastFocus = document.activeElement;
    render();
    S.els.scrim.classList.add('open');
    S.els.modal.classList.add('open');
    S.open = true;
    const email = S.els.modal.querySelector('#wp-fl-email');
    const name = S.els.modal.querySelector('#wp-fl-name');
    (name || email).focus();
    track('fastlane_open', {
      source: window.location.pathname,
      asset: S.context.ref || null,
      kind: S.context.kind || null
    });
  }

  function close() {
    S.els.scrim.classList.remove('open');
    S.els.modal.classList.remove('open');
    S.open = false;
    if (S.lastFocus && S.lastFocus.focus) S.lastFocus.focus();
  }

  /* ----------------------------------------------------------
     SUBMIT — same endpoint as the Journey Engine
     ---------------------------------------------------------- */
  async function submit(e) {
    e.preventDefault();
    const form = e.target;
    const err = form.querySelector('.wp-fl-err');
    const send = form.querySelector('.wp-fl-send');
    const email = form.email.value.trim();

    err.textContent = '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = LANG.emailNeeded;
      form.email.focus();
      return;
    }

    const guestsText = form.parentElement.querySelector('.wp-fl-guests .n').textContent;
    const guests = parseInt(guestsText, 10);

    const payload = {
      submissionType: 'FastLane',
      enquiryType: 'direct',
      assetId: (S.context && S.context.ref) || null,
      assetName: (S.context && S.context.title) || null,
      assetCategory: (S.context && S.context.kind) || null,
      indicativeRateViewed: (S.context && S.context.rateViewed) || null,
      enquirySource: window.location.pathname + window.location.search,
      priceUnit: (S.context && S.context.priceUnit) || null,
      priceOnApplication: (S.context && S.context.priceOnApplication) || false,
      assetLocation: (S.context && S.context.location) || null,
      contact: {
        name: form.name.value.trim() || null,
        email,
        phone: form.phone.value.trim() || null
      },
      plans: {
        dates: form.dates.value.trim() || null,
        flexibleDates: form.flexible.checked,
        guests: isNaN(guests) ? null : guests,
        message: form.message.value.trim() || null
      },
      context: {
        kind: S.context.kind || null,
        ref: S.context.ref || null,
        title: S.context.title || null,
        cmsId: S.context.kind && S.context.ref ? (S.context.kind + '.' + S.context.ref) : null
      },
      session: {
        seeds: S.seeds,
        journeyMemory: journeyMemorySnapshot()
      },
      tracking: {
        sourcePage: window.location.pathname + window.location.search,
        sourceCta: (S.lastFocus && S.lastFocus.getAttribute) ?
          (S.lastFocus.getAttribute('data-src') || S.lastFocus.textContent.trim().slice(0, 60)) : null,
        openedAt: S.openedAt,
        completionMs: Date.now() - S.openedAt
      },
      antiSpam: { website: form.website.value, dwellMs: Date.now() - S.openedAt }
    };

    send.disabled = true;
    send.textContent = LANG.sending;

    try {
      const res = await fetch(S.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('send failed');
      confirmView();
      track('fastlane_submit', {
        asset: payload.context.cmsId,
        completionMs: payload.tracking.completionMs,
        source: payload.tracking.sourcePage
      });
      try {
        if (window.WaypointJourney) window.WaypointJourney.remember({
          kind: S.context.kind || 'enquiry', ref: S.context.ref || 'direct',
          title: (S.context.title || 'Enquiry') , verb: 'added'
        });
      } catch (e2) { /* noop */ }
    } catch (e3) {
      send.disabled = false;
      send.textContent = LANG.send;
      err.textContent = LANG.failed;
      track('fastlane_error', {});
    }
  }

  function confirmView() {
    const body = S.els.modal.querySelector('.wp-fl-body');
    body.innerHTML = `
      <div class="wp-fl-thanks">
        <p class="h">${LANG.thanksHead}</p>
        <p class="b">${LANG.thanksBody}</p>
        <span class="n">${LANG.thanksNote}</span>
      </div>`;
    S.els.live.textContent = LANG.thanksHead + ' ' + LANG.thanksBody;
    const closeBtn = S.els.modal.querySelector('.wp-fl-close');
    if (closeBtn) closeBtn.focus();
  }

  /* ----------------------------------------------------------
     TRIGGERS — data attributes, /enquire links, nav, FAB, bar
     ---------------------------------------------------------- */
  function bindTriggers() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-fastlane], a[href^="/enquire"]');
      if (!t) return;
      e.preventDefault();
      S.lastFocus = t;
      open(t);
    }, true);
  }

  function injectNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    if (nav.querySelector('.wp-fl-nav')) return;
    /* QA fix: some pages (homepage) carry their own Enquire control — never duplicate it */
    var existing = nav.querySelectorAll('a,button');
    for (var i = 0; i < existing.length; i++) {
      if (existing[i].textContent.trim().toLowerCase() === 'enquire') return;
    }
    const begin = nav.querySelector('.nav-begin');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wp-fl-nav';
    btn.textContent = LANG.navLabel;
    btn.addEventListener('click', () => { S.lastFocus = btn; open(btn); });
    if (begin && begin.parentNode) begin.parentNode.insertBefore(btn, begin);
    else nav.appendChild(btn);
  }

  function buildFab() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'wp-fl wp-fl-fab';
    fab.innerHTML = `<span class="glyph" aria-hidden="true">\u2192</span><span>${LANG.fabLabel}</span>`;
    fab.addEventListener('click', () => { S.lastFocus = fab; open(fab); });
    document.body.appendChild(fab);
    const show = () => fab.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
    show();
    window.addEventListener('scroll', show, { passive: true });
  }

  function buildBar() {
    const bar = document.createElement('div');
    bar.className = 'wp-fl wp-fl-bar';
    const shapeHref = '/begin?src=fastlane-bar' + (function(){
      const root = document.querySelector('[data-cms="world"],[data-cms="destination"]');
      const ref = root ? refFrom(root) : null;
      return ref ? '&dest=' + encodeURIComponent(ref) : '';
    })();
    bar.innerHTML = `
      <button type="button" class="primary">${LANG.barPrimary}</button>
      <a class="secondary" href="${shapeHref}">${LANG.barSecondary}</a>`;
    bar.querySelector('.primary').addEventListener('click', (e) => { S.lastFocus = e.currentTarget; open(e.currentTarget); });
    document.body.appendChild(bar);
    document.body.classList.add('wp-fl-has-bar');
  }

  /* ----------------------------------------------------------
     PUBLIC API
     ---------------------------------------------------------- */
  window.WaypointFastLane = {
    open: (context) => open(null, context || null),
    close,
    configure: (cfg) => {
      cfg = cfg || {};
      if (cfg.endpoint) S.endpoint = cfg.endpoint;
      if (cfg.analyticsEndpoint) S.analyticsEndpoint = cfg.analyticsEndpoint;
    }
  };

  /* ----------------------------------------------------------
     BOOT
     ---------------------------------------------------------- */
  function boot() {
    /* QA fix: the Journey Engine is a full-screen fixed surface — the bar,
       FAB and nav injection would overlay its own controls. Stand down. */
    if (window.location.pathname === '/begin') return;
    css();
    buildModal();
    bindTriggers();
    injectNav();
    buildFab();
    buildBar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
