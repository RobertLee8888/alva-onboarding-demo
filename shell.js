/* ═══════════════════════════════════════════════════════════
   Alva · Prototypes — single-page shell

   Routing is the hash, and nothing else:

     #/                 the list
     #/alpha-radar      that prototype, running

   On a desktop the list and the prototype are on screen together, so
   "#/" immediately resolves to the newest prototype — an empty right
   half is never a useful state. On a phone the two are separate views
   and the hash is a real history entry, so the system back gesture
   returns to the list without this page inventing a back button.

   Each prototype is mounted in its own iframe, sized to exactly one
   phone screen. That is what keeps this a single page: the prototypes
   keep their own document, their own CSS and their own globals, and can
   never collide with each other or with the shell.

   Which phone screen is the device switcher's business — see DEVICES.
   It is global on purpose: the size outlives the prototype you picked
   it on, so you can carry one size across the whole gallery.

   ── To add a prototype ──
   Drop its page in this folder and append one entry to PROTOTYPES.
   Nothing else needs to change, and it cannot affect an existing one.

   ── To add a device ──
   Append one entry to DEVICES. The segments, the readout, the stage
   fit and the metrics handed to the prototype all read from it.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const PROTOTYPES = [
    {
      title: 'Alpha Radar mobile onboarding',
      subtitle: 'Build an Alpha Radar from FinTwit accounts, key figures, podcasts, news, and earnings. Collection cards open a member sheet.',
      edited: '2026-08-18',
      href: 'alpha-radar.html',
      meta: 'Mobile · 8 screens',
      figma: {
        label: 'Alpha Radar onboarding',
        url: 'https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=13241-205457',
      },
    },
    {
      title: 'Immersive onboarding',
      subtitle: 'FinTwit Digest path — welcome, pick a task, choose who Alva reads, confirm, first digest. Native-feeling iOS transitions.',
      edited: '2026-08-06',
      href: 'onboarding.html',
      meta: 'Mobile · 6 screens',
      figma: {
        label: 'Onboarding · Production v4 · FinTwit path',
        url: 'https://www.figma.com/design/A4jIwN4EMWr0fJVVGmCIsr/Mobile?node-id=1355-5243',
      },
    },
  ];

  /* ──────────────────────────────
     Devices

     Logical points, portrait — the resolution a layout actually sees,
     not the pixel count. The 17 and the 17 Pro Max carry the 6.3" and
     6.9" displays unchanged from the 16 Pro pair; the Air's 6.5" is the
     size that is new this generation.

     safeTop / safeBottom are the real insets, and they are what makes
     this more than a resize: the prototypes were built at 393 × 852,
     whose top inset is 59 — every device here is a taller-island one at
     62, so a 402-wide frame still padded to 59 would not be an iPhone
     17, it would be the old phone stretched. The prototypes name that
     inset differently (--status-h in Alpha Radar, --sb-h in the
     immersive onboarding), so both are set; a document that does not
     use one is not harmed by having it.
     ────────────────────────────── */

  const DEVICES = [
    { id: 'iphone-17',         name: 'iPhone 17',         short: '17',      w: 402, h: 874, safeTop: 62, safeBottom: 34 },
    { id: 'iphone-air',        name: 'iPhone Air',        short: 'Air',     w: 420, h: 912, safeTop: 62, safeBottom: 34 },
    { id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', short: 'Pro Max', w: 440, h: 956, safeTop: 62, safeBottom: 34 },
  ];

  const SAFE_TOP_VARS = ['--status-h', '--sb-h'];
  const SAFE_BOTTOM_VARS = ['--home-h'];

  const DEVICE_KEY = 'alva.prototypes.device';
  const byId = new Map(DEVICES.map(d => [d.id, d]));

  /* newest edit first, so the thing you were just working on is on top */
  const items = PROTOTYPES
    .slice()
    .sort((a, b) => b.edited.localeCompare(a.edited))
    .map(p => Object.assign({ slug: p.href.replace(/\.html?$/i, '') }, p));

  const bySlug = new Map(items.map(p => [p.slug, p]));

  /* ──────────────────────────────
     Edited-time formatting — relative while it is still fresh (how
     design tools phrase it), absolute once it is not
     ────────────────────────────── */

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  function formatEdited(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    const then = new Date(y, m - 1, d);
    const days = Math.round((startOfDay(new Date()) - startOfDay(then)) / 86400000);

    if (days <= 0) return 'Edited today';
    if (days === 1) return 'Edited yesterday';
    if (days < 7) return `Edited ${days} days ago`;
    if (days < 14) return 'Edited last week';

    const sameYear = then.getFullYear() === new Date().getFullYear();
    return `Edited ${MONTHS[m - 1]} ${d}` + (sameYear ? '' : `, ${y}`);
  }

  /* ──────────────────────────────
     Render the list
     ────────────────────────────── */

  const listEl = document.getElementById('protoList');
  const rows = new Map();

  items.forEach(p => {
    const row = document.createElement('a');
    row.className = 'proto-item';
    row.href = `#/${p.slug}`;
    row.setAttribute('aria-current', 'false');

    const meta = [formatEdited(p.edited)];
    if (p.meta) meta.push(p.meta);

    row.innerHTML = `
      <span class="pi-body">
        <span class="pi-title"></span>
        <span class="pi-sub"></span>
        <span class="pi-meta">${meta.join('<span class="dot">·</span>')}</span>
      </span>
      <span class="pi-go"><img src="assets/icon-arrow-right.svg" alt=""></span>`;

    row.querySelector('.pi-title').textContent = p.title;
    row.querySelector('.pi-sub').textContent = p.subtitle;

    /* a plain hash link already navigates; this only records that the
       move came from a click, so focus can be handed to the prototype
       and its own keyboard shortcuts (← / Esc) start working at once */
    row.addEventListener('click', () => { focusOnMount = true; });

    rows.set(p.slug, row);
    listEl.appendChild(row);
  });

  const n = items.length;
  document.getElementById('sbFoot').textContent =
    `${n} prototype${n === 1 ? '' : 's'} · more will appear here as they are built`;

  /* ──────────────────────────────
     Mounting
     ────────────────────────────── */

  const shell = document.getElementById('shell');
  const stage = document.getElementById('stage');
  const screenEl = document.getElementById('phoneScreen');
  const restartPill = document.getElementById('restartPill');
  const standalonePill = document.getElementById('standalonePill');
  const figmaPill = document.getElementById('figmaPill');
  const figmaPillText = document.getElementById('figmaPillText');

  const BASE_TITLE = 'Alva · Prototypes';
  let mounted = null;        // slug currently in the iframe
  let focusOnMount = false;

  function mount(p, force) {
    if (!force && mounted === p.slug) return;

    /* A fresh element rather than a reassigned src: setting src on a
       node that is not in the document yet adds no history entry, so
       the back gesture keeps meaning "back to the list" instead of
       stepping through prototypes the user never chose. It also
       guarantees a clean reset, which is exactly what Restart wants. */
    const frame = document.createElement('iframe');
    frame.title = p.title;
    frame.setAttribute('scrolling', 'no');
    frame.addEventListener('load', function () {
      pushMetrics(frame);
      frame.classList.add('ready');
      if (focusOnMount) { focusOnMount = false; try { frame.contentWindow.focus(); } catch (e) {} }
    });
    frame.src = p.href;

    screenEl.replaceChildren(frame);
    mounted = p.slug;
  }

  function unmount() {
    /* prototypes run timers and animation loops; leaving one alive
       behind the list would also mean coming back to a half-finished
       flow rather than a fresh one */
    screenEl.replaceChildren();
    mounted = null;
  }

  /* ──────────────────────────────
     Device switcher

     The screen box is CSS (--screen-w / --screen-h, which the bezel and
     the stage fit both derive from), and the safe-area insets are handed
     to the prototype's own document. Together those are what a device
     is: a viewport of a certain size with a certain amount of it already
     spoken for by the OS.

     Switching never remounts the iframe. Remounting would throw away
     which of the eight screens you are on, and comparing the same screen
     at three sizes is the entire reason for the control — so the frame
     is resized underneath a running prototype and its own layout does
     the rest.
     ────────────────────────────── */

  const groupEl = document.getElementById('deviceGroup');
  const readoutEl = document.getElementById('deviceReadout');
  const segs = new Map();

  let device = readStoredDevice();

  function readStoredDevice() {
    /* An id that no longer exists — a device removed from the table, or
       a half-typed value in devtools — is not an error state worth
       showing anyone; it just means the default. */
    let stored = null;
    try { stored = localStorage.getItem(DEVICE_KEY); } catch (e) {}
    return byId.get(stored) || DEVICES[0];
  }

  function pushMetrics(frame) {
    /* Same origin, so the shell can set the variables directly on the
       prototype's root. An inline property beats the stylesheet's :root,
       which is what makes this an override rather than a fight. A frame
       caught mid-navigation has no document yet — a normal race, not a
       failure.

       Below 900px there is no mockup and no switcher: the prototype is
       running on whatever phone is actually in someone's hand, and its
       insets are that phone's business. Handing it a chosen device's
       numbers there would be worse than not choosing — so the overrides
       are removed and the prototype's own :root value takes back over. */
    try {
      const root = frame.contentDocument.documentElement;
      const vars = [
        [SAFE_TOP_VARS, device.safeTop],
        [SAFE_BOTTOM_VARS, device.safeBottom],
      ];
      vars.forEach(([names, px]) => names.forEach(v => {
        if (wide.matches) root.style.setProperty(v, px + 'px');
        else root.style.removeProperty(v);
      }));
    } catch (e) {}
  }

  function applyDevice(d) {
    device = d;

    const root = document.documentElement;
    root.style.setProperty('--screen-w', d.w + 'px');
    root.style.setProperty('--screen-h', d.h + 'px');

    readoutEl.textContent = `${d.w} × ${d.h} pt`;

    segs.forEach((btn, id) => {
      const on = id === d.id;
      btn.setAttribute('aria-checked', String(on));
      /* one stop for the whole group, as a radiogroup owes: Tab reaches
         the current device, arrows move between them */
      btn.tabIndex = on ? 0 : -1;
    });

    const frame = screenEl.firstElementChild;
    if (frame) pushMetrics(frame);

    fit();
  }

  function selectDevice(d) {
    if (d.id === device.id) return;
    applyDevice(d);
    try { localStorage.setItem(DEVICE_KEY, d.id); } catch (e) {}
  }

  DEVICES.forEach(d => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dg-seg';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    /* the visible label is short enough to fit the bar; the spoken and
       hovered ones are the whole device */
    btn.setAttribute('aria-label', d.name);
    btn.title = `${d.name} · ${d.w} × ${d.h} pt`;
    btn.textContent = d.short;
    btn.addEventListener('click', () => selectDevice(d));
    segs.set(d.id, btn);
    groupEl.appendChild(btn);
  });

  groupEl.addEventListener('keydown', e => {
    const i = DEVICES.findIndex(d => d.id === device.id);
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = DEVICES[(i + 1) % DEVICES.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = DEVICES[(i - 1 + DEVICES.length) % DEVICES.length];
    else if (e.key === 'Home') next = DEVICES[0];
    else if (e.key === 'End') next = DEVICES[DEVICES.length - 1];
    if (!next) return;
    e.preventDefault();
    selectDevice(next);
    segs.get(next.id).focus();
  });

  /* ──────────────────────────────
     Routing
     ────────────────────────────── */

  const wide = window.matchMedia('(min-width: 900px)');

  function slugFromHash() {
    const m = /^#\/?([\w-]+)/.exec(window.location.hash || '');
    return m && bySlug.has(m[1]) ? m[1] : null;
  }

  function route() {
    let slug = slugFromHash();

    /* Desktop shows both halves at once — resolve "the list" to the
       newest prototype so the stage is never blank. replaceState, not
       a new entry: the user did not navigate here. */
    if (!slug && wide.matches && items.length) {
      slug = items[0].slug;
      history.replaceState(null, '', `#/${slug}`);
    }

    document.documentElement.dataset.view = slug ? 'demo' : 'list';

    rows.forEach((row, s) => row.setAttribute('aria-current', String(s === slug)));

    if (!slug) {
      unmount();
      document.title = BASE_TITLE;
      return;
    }

    const p = bySlug.get(slug);
    mount(p);

    document.title = `${p.title} · Alva prototypes`;
    standalonePill.href = p.href;
    if (p.figma) {
      figmaPill.href = p.figma.url;
      figmaPillText.textContent = `Figma · ${p.figma.label}`;
      figmaPill.hidden = false;
    } else {
      figmaPill.hidden = true;
    }

    fit();
  }

  window.addEventListener('hashchange', route);
  wide.addEventListener('change', route);

  restartPill.addEventListener('click', () => {
    const p = bySlug.get(mounted);
    if (!p) return;
    focusOnMount = true;
    mount(p, true);
  });

  /* ──────────────────────────────
     Fit the mockup to the stage

     The iframe is always laid out at the device's true point size, so
     the prototype sees a real phone viewport (its own vh/dvh, media
     queries and full-screen mode all resolve correctly). Only the
     composited bezel is scaled, and never above 1:1.

     The phone box is measured rather than remembered — it changes with
     the device, and offsetWidth/Height are the pre-transform layout
     size, so reading them here does not compound the scale already
     applied.
     ────────────────────────────── */

  const fitEl = document.getElementById('stageFit');
  const barEls = [...document.querySelectorAll('.stage-bar')];

  /* The reserved band is whatever the chrome actually needs. The bars are
     absolutely positioned, so their height depends on the stage's width
     (a narrow one wraps the row) but never on this padding — which is what
     lets it be written back without oscillating. The write is guarded on
     change so the ResizeObserver below settles after one pass. */
  let chromeH = null;

  const leftBar = document.querySelector('.stage-bar-left');
  const rightBar = document.querySelector('.stage-bar-right');

  function reserveChrome() {
    if (!wide.matches) {
      chromeH = null;
      stage.style.removeProperty('--chrome-h');
      rightBar.style.removeProperty('--bar-max');
      return;
    }

    /* Give the right bar everything the left one is not using, so it stays
       one line for as long as it can. 20px inset on each side, 16px of
       clear air between the two. Written before the height is measured —
       this is what decides whether the row wraps. */
    const room = stage.clientWidth - leftBar.offsetWidth - 56;
    rightBar.style.setProperty('--bar-max', Math.max(160, room) + 'px');

    const tallest = barEls.reduce((m, b) => Math.max(m, b.offsetHeight), 0);
    /* 18px sits the bar off the bottom edge, and the same gap again keeps
       the phone from touching it */
    const next = Math.max(62, tallest + 36);
    if (next === chromeH) return;
    chromeH = next;
    stage.style.setProperty('--chrome-h', next + 'px');
  }

  /* Crossing 900px turns the simulation on or off, and route() does not
     remount when only the width changed — so the insets have to be
     re-pushed. Keyed on the state rather than on a media-query event:
     whichever listener notices the width first, this corrects it once,
     and a listener that never fires cannot leave the prototype padded
     for a device that is no longer being simulated. */
  let simulating = null;

  function syncSimulation() {
    if (simulating === wide.matches) return;
    simulating = wide.matches;
    const frame = screenEl.firstElementChild;
    if (frame) pushMetrics(frame);
  }

  function fit() {
    syncSimulation();
    reserveChrome();
    if (!wide.matches) { stage.style.removeProperty('--fit'); return; }
    const cs = getComputedStyle(stage);
    const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (w <= 0 || h <= 0) return;
    const pw = fitEl.offsetWidth;
    const ph = fitEl.offsetHeight;
    if (!pw || !ph) return;
    const s = Math.min(1, w / pw, h / ph);
    stage.style.setProperty('--fit', Math.max(0.4, s).toFixed(4));
  }

  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
  window.addEventListener('resize', fit);

  applyDevice(device);
  route();
  fit();
})();
