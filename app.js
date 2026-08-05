/* ═══════════════════════════════════════════════════════════
   Alva · FinTwit onboarding demo — interaction layer

   Motion semantics (after Apple's system motion language):
   · Drilling deeper / going back  →  navigation push / pop
     (spatial slide + parallax + dim, interruptible edge-swipe)
   · Committing a form             →  cross-dissolve
     (state change, not spatial movement — no back affordance)
   · Onboarding completion         →  cross-dissolve + stack reset
     (the flow is dismissed; you cannot navigate back into it)
   · Transient choices             →  bottom sheet with spring,
     drag-to-dismiss, tap-outside-to-cancel
   · New affordances (CTA reveal)  →  slide up from the edge they
     belong to
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const app = document.getElementById('app');
  const dim = document.getElementById('dim');
  const screens = {};
  document.querySelectorAll('.screen').forEach(s => (screens[s.dataset.screen] = s));

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PUSH_MS = REDUCED ? 1 : 500;   // ~UINavigationController push duration
  const FADE_MS = REDUCED ? 1 : 420;   // cross-dissolve duration
  const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';           // decelerating, nav push
  const SPRING = 'cubic-bezier(0.34, 1.3, 0.64, 1)';       // gentle overshoot

  /* ──────────────────────────────
     Data
     ────────────────────────────── */

  const SOURCES = [
    { id: 'win50', type: 'group', name: 'Win Rate Top 50', sub: '50 accounts',
      imgs: ['avatar-yardeni.png', 'avatar-semianalysis.png', 'avatar-lizann.png', 'avatar-lance.png'] },
    { id: 'roi50', type: 'group', name: 'Best ROI Top 50', sub: '50 accounts',
      imgs: ['avatar-kaleo.png', 'avatar-raoul.png', 'avatar-cathie.png', 'avatar-puru.png'] },
    { id: 'yardeni',   name: 'Yardeni',          handle: '@yardeni',        rate: 61, img: 'avatar-yardeni.png' },
    { id: 'semi',      name: 'SemiAnalysis',     handle: '@SemiAnalysis_',  rate: 58, img: 'avatar-semianalysis.png' },
    { id: 'lizann',    name: 'Liz Ann Sonders',  handle: '@LizAnnSonders',  rate: 57, img: 'avatar-lizann.png' },
    { id: 'lance',     name: 'Lance Roberts',    handle: '@LanceRoberts',   rate: 55, img: 'avatar-lance.png' },
    { id: 'puru',      name: 'Puru Saxena',      handle: '@saxena_puru',    rate: 54, img: 'avatar-puru.png' },
    { id: 'pickering', name: 'Dan Pickering',    handle: '@pickeringenergy',rate: 52, img: 'avatar-pickering.png' },
    { id: 'cathie',    name: 'Cathie Wood',      handle: '@CathieDWood',    rate: 43, img: 'avatar-cathie.png' },
    { id: 'raoul',     name: 'Raoul Pal',        handle: '@RaoulGMI',       rate: 42, img: 'avatar-raoul.png' },
    { id: 'chamath',   name: 'Chamath',          handle: '@chamath',        rate: 38, img: 'avatar-chamath.png' },
    { id: 'kaleo',     name: 'K A L E O',        handle: '@CryptoKaleo',    rate: 19, img: 'avatar-kaleo.png' },
  ];

  // Figma "04 · Confirm digest" default chip set — used when sources are skipped
  const DEFAULT_CHIPS = [
    'win50', 'roi50', 'yardeni', 'semi', 'lizann', 'lance', 'puru',
    'pickering', 'cathie', 'raoul', 'chamath', 'kaleo', 'damodaran',
  ];
  const EXTRA = { damodaran: { id: 'damodaran', name: 'Aswath Damodaran', img: 'avatar-damodaran.png' } };

  const selected = new Set();
  let chipList = [];

  function sourceById(id) { return SOURCES.find(s => s.id === id) || EXTRA[id]; }

  /* ──────────────────────────────
     Toast (transient status HUD)
     ────────────────────────────── */

  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('show');
    void toast.offsetWidth; // restart animation
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  /* ──────────────────────────────
     Navigation core
     ────────────────────────────── */

  const stack = ['welcome'];
  let animating = false;
  screens.welcome.classList.add('current');

  function setTransition(el, on, ms) {
    el.style.transition = on
      ? `transform ${ms || PUSH_MS}ms ${EASE}, opacity ${ms || PUSH_MS}ms ${EASE}`
      : 'none';
  }

  function afterFrame(fn) { requestAnimationFrame(() => requestAnimationFrame(fn)); }

  function clearNavStyles(...els) {
    els.forEach(el => {
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.opacity = '';
      el.style.boxShadow = '';
      el.style.zIndex = '';
      el.classList.remove('animating');
    });
    dim.style.transition = 'none';
    dim.style.opacity = '0';
    dim.style.zIndex = '';
  }

  function finishNav(from, to, reset) {
    clearNavStyles(from, to);
    from.classList.remove('current');
    to.classList.add('current');
    if (reset) { stack.length = 0; stack.push(to.dataset.screen); }
    animating = false;
  }

  function push(name, opts = {}) {
    if (animating) return;
    const fromName = stack[stack.length - 1];
    if (fromName === name) return;
    const from = screens[fromName];
    const to = screens[name];
    animating = true;
    if (!opts.reset) stack.push(name);
    onWillShow(name, opts);

    if (opts.fade) {
      // Cross-dissolve: a state change (commit / auto-advance), not spatial travel.
      to.classList.add('animating');
      setTransition(to, false);
      to.style.opacity = '0';
      to.style.transform = 'scale(1.03)';
      to.style.zIndex = '3';
      afterFrame(() => {
        setTransition(to, true, FADE_MS);
        to.style.opacity = '1';
        to.style.transform = 'scale(1)';
        setTimeout(() => { finishNav(from, to, opts.reset); onDidShow(name, opts); }, FADE_MS + 20);
      });
      return;
    }

    // Navigation push: destination slides in from the right,
    // origin parallaxes left by 30% beneath a dimming layer.
    to.classList.add('animating');
    from.classList.add('animating');
    setTransition(to, false);
    setTransition(from, false);
    dim.style.transition = 'none';
    to.style.transform = 'translate3d(100%, 0, 0)';
    to.style.boxShadow = '-12px 0 32px rgba(0,0,0,0.10)';
    from.style.transform = 'translate3d(0, 0, 0)';
    dim.style.opacity = '0';
    from.style.zIndex = '1';
    dim.style.zIndex = '2';
    to.style.zIndex = '3';

    afterFrame(() => {
      setTransition(to, true);
      setTransition(from, true);
      dim.style.transition = `opacity ${PUSH_MS}ms ${EASE}`;
      to.style.transform = 'translate3d(0, 0, 0)';
      from.style.transform = 'translate3d(-30%, 0, 0)';
      dim.style.opacity = '0.08';
      setTimeout(() => { finishNav(from, to, opts.reset); onDidShow(name, opts); }, PUSH_MS + 20);
    });
  }

  function pop() {
    if (animating || stack.length < 2) return;
    const from = screens[stack[stack.length - 1]];
    const toName = stack[stack.length - 2];
    const to = screens[toName];
    animating = true;
    stack.pop();
    onWillShow(toName, { back: true });

    to.classList.add('animating');
    from.classList.add('animating');
    setTransition(to, false);
    setTransition(from, false);
    dim.style.transition = 'none';
    to.style.transform = 'translate3d(-30%, 0, 0)';
    from.style.transform = 'translate3d(0, 0, 0)';
    from.style.boxShadow = '-12px 0 32px rgba(0,0,0,0.10)';
    dim.style.opacity = '0.08';
    to.style.zIndex = '1';
    dim.style.zIndex = '2';
    from.style.zIndex = '3';

    afterFrame(() => {
      setTransition(to, true);
      setTransition(from, true);
      dim.style.transition = `opacity ${PUSH_MS}ms ${EASE}`;
      to.style.transform = 'translate3d(0, 0, 0)';
      from.style.transform = 'translate3d(100%, 0, 0)';
      dim.style.opacity = '0';
      setTimeout(() => finishNav(from, to, false), PUSH_MS + 20);
    });
  }

  /* ──────────────────────────────
     Interactive edge-swipe back
     (finger-tracked, cancellable — like UIScreenEdgePanGesture)
     ────────────────────────────── */

  let swipe = null;

  app.addEventListener('pointerdown', e => {
    if (animating || stack.length < 2) return;
    if (sheetLayer.classList.contains('open')) return;
    const name = stack[stack.length - 1];
    if (name === 'success') return; // transient screen: no back gesture
    const rect = app.getBoundingClientRect();
    const scale = rect.width / app.offsetWidth;
    const x = (e.clientX - rect.left) / scale;
    if (x > 28) return;
    swipe = {
      startX: e.clientX, scale, width: app.offsetWidth,
      from: screens[name], to: screens[stack[stack.length - 2]],
      progress: 0, moved: false, pointerId: e.pointerId,
    };
    const { from, to } = swipe;
    to.classList.add('animating');
    from.classList.add('animating');
    setTransition(from, false);
    setTransition(to, false);
    dim.style.transition = 'none';
    to.style.zIndex = '1';
    dim.style.zIndex = '2';
    from.style.zIndex = '3';
    from.style.boxShadow = '-12px 0 32px rgba(0,0,0,0.10)';
  });

  app.addEventListener('pointermove', e => {
    if (!swipe) return;
    const dx = Math.max(0, (e.clientX - swipe.startX) / swipe.scale);
    const p = Math.min(1, dx / swipe.width);
    swipe.progress = p;
    if (dx > 4 && !swipe.moved) {
      swipe.moved = true;
      // capture only once it is really a gesture, so plain taps on
      // edge-zone controls (back button) still produce their click
      try { app.setPointerCapture(swipe.pointerId); } catch (_) {}
    }
    swipe.from.style.transform = `translate3d(${p * 100}%, 0, 0)`;
    swipe.to.style.transform = `translate3d(${-30 + p * 30}%, 0, 0)`;
    dim.style.opacity = String(0.08 * (1 - p));
    if (swipe.moved) e.preventDefault();
  });

  function endSwipe(commit) {
    if (!swipe) return;
    if (!swipe.moved) {
      // A press in the edge zone that never moved (e.g. tapping the back
      // button) is a tap, not a gesture — release it without animating,
      // so the click handler underneath still fires.
      clearNavStyles(swipe.from, swipe.to);
      swipe = null;
      return;
    }
    const { from, to } = swipe;
    const remaining = commit ? 1 - swipe.progress : swipe.progress;
    const dur = Math.max(160, Math.min(400, remaining * PUSH_MS));
    setTransition(from, true, dur);
    setTransition(to, true, dur);
    dim.style.transition = `opacity ${dur}ms ${EASE}`;
    animating = true;

    if (commit) {
      const toName = stack[stack.length - 2];
      stack.pop();
      onWillShow(toName, { back: true });
      from.style.transform = 'translate3d(100%, 0, 0)';
      to.style.transform = 'translate3d(0, 0, 0)';
      dim.style.opacity = '0';
      setTimeout(() => finishNav(from, to, false), dur + 20);
    } else {
      from.style.transform = 'translate3d(0, 0, 0)';
      to.style.transform = 'translate3d(-30%, 0, 0)';
      dim.style.opacity = '0.08';
      setTimeout(() => {
        clearNavStyles(from, to);
        from.classList.add('current');
        animating = false;
      }, dur + 20);
    }
    swipe = null;
  }

  app.addEventListener('pointerup', () => { if (swipe) endSwipe(swipe.moved && swipe.progress > 0.32); });
  app.addEventListener('pointercancel', () => { if (swipe) endSwipe(false); });

  /* ──────────────────────────────
     Screen lifecycle
     ────────────────────────────── */

  let successTimer = null;

  function onWillShow(name, opts = {}) {
    if (name === 'sources') syncSourceState();
    if (name === 'confirm' && !opts.back) {
      chipList = opts.skipped ? [...DEFAULT_CHIPS] : [...selected];
      renderChips();
    }
    if (name === 'success') screens.success.classList.remove('celebrate');
  }

  function onDidShow(name) {
    if (name === 'success') {
      screens.success.classList.add('celebrate');
      clearTimeout(successTimer);
      // Auto-advances ~2s (Figma: "05 · Success only · auto-advances ~2s").
      // Landing on the first digest DISMISSES onboarding: the stack resets,
      // so there is no back gesture into a flow that has completed.
      successTimer = setTimeout(() => push('digest', { fade: true, reset: true }), 2100);
    }
  }

  /* ──────────────────────────────
     03 · Sources: grid, search, selection
     ────────────────────────────── */

  const grid = document.getElementById('sourceGrid');
  const gridEmpty = document.getElementById('gridEmpty');
  const sourcesFooter = document.getElementById('sourcesFooter');
  const searchInput = document.getElementById('searchInput');
  const cells = {};

  function renderGrid() {
    grid.innerHTML = '';
    SOURCES.forEach(src => {
      const cell = document.createElement('button');
      cell.className = 'source-cell';
      cell.dataset.id = src.id;
      cell.setAttribute('aria-pressed', 'false');
      const avatar = src.type === 'group'
        ? `<span class="sc-avatar collage">${src.imgs.map(i => `<img src="assets/${i}" alt="">`).join('')}</span>`
        : `<span class="sc-avatar"><img src="assets/${src.img}" alt=""></span>`;
      const sub = src.type === 'group'
        ? `<span class="sc-sub">${src.sub}</span>`
        : `<span class="sc-sub"><b>${src.rate}%</b> win rate</span>`;
      cell.innerHTML = `
        <span class="sc-avatar-pad">${avatar}
          <span class="sc-check"><img src="assets/checkbox-checked.svg" alt=""></span>
        </span>
        <span class="sc-name">${src.name}</span>
        ${sub}`;
      cell.addEventListener('click', () => toggleSource(src.id));
      grid.appendChild(cell);
      cells[src.id] = cell;
    });
  }

  function toggleSource(id) {
    if (selected.has(id)) selected.delete(id);
    else selected.add(id);
    syncSourceState();
  }

  // Single source of truth → grid checkmarks and footer CTA always
  // reflect `selected`, including after chip removal on screen 04.
  function syncSourceState() {
    SOURCES.forEach(src => {
      const on = selected.has(src.id);
      cells[src.id].classList.toggle('selected', on);
      cells[src.id].setAttribute('aria-pressed', String(on));
    });
    sourcesFooter.classList.toggle('visible', selected.size > 0);
  }

  function filterGrid(q) {
    const query = q.trim().toLowerCase();
    let shown = 0;
    SOURCES.forEach(src => {
      const hay = (src.name + ' ' + (src.handle || '') + ' ' + (src.sub || '')).toLowerCase();
      const hit = !query || hay.includes(query);
      cells[src.id].hidden = !hit;
      if (hit) shown++;
    });
    gridEmpty.hidden = shown > 0;
    grid.hidden = shown === 0;
    if (shown === 0) gridEmpty.querySelector('b').textContent = q.trim();
  }

  renderGrid();
  searchInput.addEventListener('input', () => filterGrid(searchInput.value));

  /* ──────────────────────────────
     04 · Confirm: chips + validity
     ────────────────────────────── */

  const chipWrap = document.getElementById('chipWrap');
  const chipsEmpty = document.getElementById('chipsEmpty');
  const generateBtn = document.getElementById('generateBtn');

  function syncConfirmState() {
    const empty = chipList.length === 0;
    chipsEmpty.hidden = !empty;
    generateBtn.classList.toggle('disabled', empty);
  }

  function renderChips() {
    chipWrap.innerHTML = '';
    chipList.forEach(id => {
      const src = sourceById(id);
      if (!src) return;
      const chip = document.createElement('span');
      chip.className = 'chip';
      const avatar = src.type === 'group'
        ? `<span class="chip-avatar collage">${src.imgs.map(i => `<img src="assets/${i}" alt="">`).join('')}</span>`
        : `<span class="chip-avatar"><img src="assets/${src.img}" alt=""></span>`;
      chip.innerHTML = `${avatar}<span class="chip-label">${src.name}</span>
        <button class="chip-close" aria-label="Remove ${src.name}"><img src="assets/close.svg" alt=""></button>`;
      chip.querySelector('.chip-close').addEventListener('click', () => {
        chip.classList.add('removing');
        setTimeout(() => {
          chipList = chipList.filter(x => x !== id);
          selected.delete(id);   // stays in sync with screen 03
          chip.remove();
          syncConfirmState();
        }, 220);
      });
      chipWrap.appendChild(chip);
    });
    syncConfirmState();
  }

  generateBtn.addEventListener('click', () => {
    if (generateBtn.classList.contains('disabled')) {
      showToast('Add at least one source — or Skip for defaults');
      return;
    }
    push('success', { fade: true }); // commit → cross-dissolve, not a push
  });

  /* ──────────────────────────────
     Bottom-sheet pickers (spring in, drag or tap-outside to dismiss)
     ────────────────────────────── */

  const sheetLayer = document.getElementById('sheetLayer');
  const sheet = document.getElementById('sheet');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetOptions = document.getElementById('sheetOptions');
  const PICKERS = {
    time: { title: 'Daily alert time', valueEl: 'timeValue',
            options: ['06:30 ET', '07:30 ET', '08:30 ET', '09:30 ET', 'Market close'] },
    lang: { title: 'Digest language', valueEl: 'langValue',
            options: ['English', '中文', '日本語', 'Español'] },
  };

  function openSheet(kind) {
    const cfg = PICKERS[kind];
    const current = document.getElementById(cfg.valueEl).textContent;
    sheetTitle.textContent = cfg.title;
    sheetOptions.innerHTML = '';
    cfg.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'sheet-option' + (opt === current ? ' selected' : '');
      b.innerHTML = `<span>${opt}</span><span class="tick">✓</span>`;
      b.addEventListener('click', () => {
        sheetOptions.querySelectorAll('.sheet-option').forEach(o => o.classList.remove('selected'));
        b.classList.add('selected');
        document.getElementById(cfg.valueEl).textContent = opt;
        setTimeout(closeSheet, 140); // let the checkmark land first (iOS picker rhythm)
      });
      sheetOptions.appendChild(b);
    });
    sheet.style.transform = '';
    sheetLayer.classList.add('open');
  }

  function closeSheet() { sheetLayer.classList.remove('open'); }

  document.getElementById('sheetBackdrop').addEventListener('click', closeSheet);
  document.querySelectorAll('[data-picker]').forEach(b =>
    b.addEventListener('click', () => openSheet(b.dataset.picker)));

  // drag-to-dismiss
  let sheetDrag = null;
  sheet.addEventListener('pointerdown', e => {
    sheetDrag = { startY: e.clientY, dy: 0 };
    sheet.style.transition = 'none';
    try { sheet.setPointerCapture(e.pointerId); } catch (_) {}
  });
  sheet.addEventListener('pointermove', e => {
    if (!sheetDrag) return;
    sheetDrag.dy = Math.max(0, e.clientY - sheetDrag.startY);
    sheet.style.transform = `translateY(${sheetDrag.dy}px)`;
  });
  function endSheetDrag() {
    if (!sheetDrag) return;
    sheet.style.transition = '';
    if (sheetDrag.dy > 110) { sheet.style.transform = ''; closeSheet(); }
    else sheet.style.transform = '';
    sheetDrag = null;
  }
  sheet.addEventListener('pointerup', endSheetDrag);
  sheet.addEventListener('pointercancel', endSheetDrag);

  /* ──────────────────────────────
     02 · Tasks: FinTwit is the built path; other rows guide back to it
     ────────────────────────────── */

  const fintwitRow = document.getElementById('fintwitRow');
  document.querySelectorAll('[data-offpath]').forEach(row =>
    row.addEventListener('click', () => {
      showToast('This demo builds the FinTwit path');
      fintwitRow.classList.remove('pulse');
      void fintwitRow.offsetWidth;
      fintwitRow.classList.add('pulse');
    }));

  /* ──────────────────────────────
     06 · Digest: simulated connect + out-of-scope feedback
     ────────────────────────────── */

  document.querySelectorAll('[data-connect]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('connected') || btn.classList.contains('connecting')) return;
      const name = btn.dataset.connect;
      btn.classList.add('connecting');
      const label = btn.querySelector('span');
      const original = label.textContent;
      label.textContent = 'Connecting…';
      setTimeout(() => {
        btn.classList.remove('connecting');
        btn.classList.add('connected');
        label.textContent = original + ' · Connected';
        showToast(`Sample digest sent via ${name}`);
      }, REDUCED ? 10 : 900);
    });
  });

  document.querySelectorAll('[data-toast]').forEach(el =>
    el.addEventListener('click', e => {
      e.stopPropagation();
      showToast(el.dataset.toast);
    }));

  /* ──────────────────────────────
     Declarative nav + keyboard
     ────────────────────────────── */

  document.querySelectorAll('[data-nav]').forEach(el =>
    el.addEventListener('click', () => {
      const fade = el.dataset.navFade !== undefined;
      push(el.dataset.nav, fade ? { fade: true } : {});
    }));
  document.querySelectorAll('[data-back]').forEach(el =>
    el.addEventListener('click', pop));
  document.querySelector('[data-skip-sources]')
    .addEventListener('click', () => push('confirm', { skipped: true }));
  document.querySelector('[data-skip-confirm]')
    .addEventListener('click', () => push('success', { fade: true }));

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      if (sheetLayer.classList.contains('open')) { closeSheet(); return; }
      if (document.activeElement === searchInput) return;
      pop();
    }
  });

  /* ──────────────────────────────
     Replay (desktop stage control)
     ────────────────────────────── */

  const replayPill = document.getElementById('replayPill');
  if (replayPill) replayPill.addEventListener('click', () => location.reload());

  /* ──────────────────────────────
     Desktop mockup scaling
     ────────────────────────────── */

  const phone = document.getElementById('phone');
  function fitPhone() {
    const isMockup = getComputedStyle(phone).borderRadius !== '0px';
    if (!isMockup) { phone.style.transform = ''; return; }
    const pad = 48;
    const scale = Math.min(1, (window.innerHeight - pad) / 884, (window.innerWidth - pad) / 425);
    phone.style.transform = `scale(${scale})`;
  }
  fitPhone();
  window.addEventListener('resize', fitPhone);
})();
