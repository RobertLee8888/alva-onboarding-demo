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
   phone screen (393 × 852). That is what keeps this a single page: the
   prototypes keep their own document, their own CSS and their own
   globals, and can never collide with each other or with the shell.

   ── To add a prototype ──
   Drop its page in this folder and append one entry to PROTOTYPES.
   Nothing else needs to change, and it cannot affect an existing one.
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

     The iframe is always laid out at a true 393 × 852 so the prototype
     sees a real phone viewport (its own vh/dvh, media queries and
     full-screen mode all resolve correctly). Only the composited bezel
     is scaled, and never above 1:1.
     ────────────────────────────── */

  function fit() {
    if (!wide.matches) { stage.style.removeProperty('--fit'); return; }
    const cs = getComputedStyle(stage);
    const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (w <= 0 || h <= 0) return;
    const s = Math.min(1, w / 425, h / 884);
    stage.style.setProperty('--fit', Math.max(0.4, s).toFixed(4));
  }

  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage);
  window.addEventListener('resize', fit);

  route();
  fit();
})();
