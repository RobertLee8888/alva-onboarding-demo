/* ═══════════════════════════════════════════════════════════
   Alva · FinTwit onboarding demo
   Native-feeling navigation: iOS push/pop, edge-swipe back,
   auto-advancing success screen, bottom-sheet pickers.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const app = document.getElementById('app');
  const dim = document.getElementById('dim');
  const screens = {};
  document.querySelectorAll('.screen').forEach(s => (screens[s.dataset.screen] = s));

  const PUSH_MS = 520;
  const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

  /* ──────────────────────────────
     Data
     ────────────────────────────── */

  const SOURCES = [
    { id: 'win50', type: 'group', name: 'Win Rate Top 50', sub: '50 accounts',
      imgs: ['avatar-yardeni.png', 'avatar-semianalysis.png', 'avatar-lizann.png', 'avatar-lance.png'] },
    { id: 'roi50', type: 'group', name: 'Best ROI Top 50', sub: '50 accounts',
      imgs: ['avatar-kaleo.png', 'avatar-raoul.png', 'avatar-cathie.png', 'avatar-puru.png'] },
    { id: 'yardeni',   name: 'Yardeni',          rate: 61, img: 'avatar-yardeni.png' },
    { id: 'semi',      name: 'SemiAnalysis',     rate: 58, img: 'avatar-semianalysis.png' },
    { id: 'lizann',    name: 'Liz Ann Sonders',  rate: 57, img: 'avatar-lizann.png' },
    { id: 'lance',     name: 'Lance Roberts',    rate: 55, img: 'avatar-lance.png' },
    { id: 'puru',      name: 'Puru Saxena',      rate: 54, img: 'avatar-puru.png' },
    { id: 'pickering', name: 'Dan Pickering',    rate: 52, img: 'avatar-pickering.png' },
    { id: 'cathie',    name: 'Cathie Wood',      rate: 43, img: 'avatar-cathie.png' },
    { id: 'raoul',     name: 'Raoul Pal',        rate: 42, img: 'avatar-raoul.png' },
    { id: 'chamath',   name: 'Chamath',          rate: 38, img: 'avatar-chamath.png' },
    { id: 'kaleo',     name: 'K A L E O',        rate: 19, img: 'avatar-kaleo.png' },
  ];

  // Matches the Figma "04 · Confirm digest" chip set (used when sources are skipped)
  const DEFAULT_CHIPS = [
    { id: 'win50' }, { id: 'roi50' }, { id: 'yardeni' }, { id: 'semi' },
    { id: 'lizann' }, { id: 'lance' }, { id: 'puru' }, { id: 'pickering' },
    { id: 'cathie' }, { id: 'raoul' }, { id: 'chamath' }, { id: 'kaleo' },
    { id: 'damodaran', name: 'Aswath Damodaran', img: 'avatar-damodaran.png' },
  ];

  const selected = new Set();
  let chipList = []; // ids currently shown as chips on confirm screen

  /* ──────────────────────────────
     Navigation core (push / pop)
     ────────────────────────────── */

  const stack = ['welcome'];
  let animating = false;
  screens.welcome.classList.add('current');

  function currentScreen() { return screens[stack[stack.length - 1]]; }

  function setTransition(el, on) {
    el.style.transition = on
      ? `transform ${PUSH_MS}ms ${EASE}, opacity ${PUSH_MS}ms ${EASE}`
      : 'none';
  }

  function afterFrame(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  function finishNav(from, to) {
    [from, to].forEach(el => {
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.opacity = '';
      el.classList.remove('animating');
    });
    from.classList.remove('current');
    to.classList.add('current');
    dim.style.transition = 'none';
    dim.style.opacity = '0';
    animating = false;
  }

  function push(name, opts = {}) {
    if (animating) return;
    const fromName = stack[stack.length - 1];
    if (fromName === name) return;
    const from = screens[fromName];
    const to = screens[name];
    animating = true;
    stack.push(name);
    onWillShow(name, opts);

    if (opts.fade) {
      // auto-advance style: gentle crossfade + scale (used into final screen)
      to.classList.add('animating');
      setTransition(to, false);
      to.style.opacity = '0';
      to.style.transform = 'scale(1.045)';
      afterFrame(() => {
        to.style.transition = `transform 460ms ${EASE}, opacity 460ms ${EASE}`;
        to.style.opacity = '1';
        to.style.transform = 'scale(1)';
        setTimeout(() => { finishNav(from, to); onDidShow(name, opts); }, 480);
      });
      return;
    }

    // iOS push: new screen slides in from the right, old parallaxes left under a dim
    to.classList.add('animating');
    from.classList.add('animating');
    setTransition(to, false);
    setTransition(from, false);
    dim.style.transition = 'none';
    to.style.transform = 'translate3d(100%, 0, 0)';
    to.style.boxShadow = '-12px 0 32px rgba(0,0,0,0.10)';
    from.style.transform = 'translate3d(0, 0, 0)';
    dim.style.opacity = '0';
    // dim sits between the two screens
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
      setTimeout(() => {
        to.style.boxShadow = '';
        to.style.zIndex = '';
        from.style.zIndex = '';
        dim.style.zIndex = '';
        finishNav(from, to);
        onDidShow(name, opts);
      }, PUSH_MS + 20);
    });
  }

  function pop() {
    if (animating || stack.length < 2) return;
    const fromName = stack[stack.length - 1];
    const toName = stack[stack.length - 2];
    const from = screens[fromName];
    const to = screens[toName];
    animating = true;
    stack.pop();

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
      setTimeout(() => {
        from.style.boxShadow = '';
        from.style.zIndex = '';
        to.style.zIndex = '';
        dim.style.zIndex = '';
        finishNav(from, to);
      }, PUSH_MS + 20);
    });
  }

  /* ──────────────────────────────
     Edge-swipe back (interactive pop)
     ────────────────────────────── */

  let swipe = null;

  app.addEventListener('pointerdown', e => {
    if (animating || stack.length < 2) return;
    if (document.getElementById('sheetLayer').classList.contains('open')) return;
    const rect = app.getBoundingClientRect();
    const scale = rect.width / app.offsetWidth;
    const x = (e.clientX - rect.left) / scale;
    if (x > 28) return;
    const fromName = stack[stack.length - 1];
    if (fromName === 'success') return; // auto-advancing screen: no back swipe
    const toName = stack[stack.length - 2];
    swipe = {
      startX: e.clientX,
      scale,
      width: app.offsetWidth,
      from: screens[fromName],
      to: screens[toName],
      progress: 0,
      moved: false,
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
    if (dx > 4) swipe.moved = true;
    swipe.from.style.transform = `translate3d(${p * 100}%, 0, 0)`;
    swipe.to.style.transform = `translate3d(${-30 + p * 30}%, 0, 0)`;
    dim.style.opacity = String(0.08 * (1 - p));
    if (swipe.moved) e.preventDefault();
  });

  function endSwipe(commit) {
    if (!swipe) return;
    const { from, to } = swipe;
    const remaining = commit ? 1 - swipe.progress : swipe.progress;
    const dur = Math.max(180, Math.min(420, remaining * PUSH_MS));
    from.style.transition = `transform ${dur}ms ${EASE}`;
    to.style.transition = `transform ${dur}ms ${EASE}`;
    dim.style.transition = `opacity ${dur}ms ${EASE}`;
    animating = true;

    if (commit) {
      stack.pop();
      from.style.transform = 'translate3d(100%, 0, 0)';
      to.style.transform = 'translate3d(0, 0, 0)';
      dim.style.opacity = '0';
      setTimeout(() => {
        from.style.boxShadow = '';
        from.style.zIndex = '';
        to.style.zIndex = '';
        dim.style.zIndex = '';
        finishNav(from, to);
      }, dur + 20);
    } else {
      from.style.transform = 'translate3d(0, 0, 0)';
      to.style.transform = 'translate3d(-30%, 0, 0)';
      dim.style.opacity = '0.08';
      setTimeout(() => {
        from.style.boxShadow = '';
        from.style.zIndex = '';
        to.style.zIndex = '';
        dim.style.zIndex = '';
        to.style.transition = 'none';
        to.style.transform = '';
        to.classList.remove('animating');
        from.style.transition = 'none';
        from.style.transform = '';
        from.classList.remove('animating');
        dim.style.transition = 'none';
        dim.style.opacity = '0';
        animating = false;
      }, dur + 20);
    }
    swipe = null;
  }

  app.addEventListener('pointerup', () => { if (swipe) endSwipe(swipe.progress > 0.32); });
  app.addEventListener('pointercancel', () => { if (swipe) endSwipe(false); });

  /* ──────────────────────────────
     Screen lifecycle
     ────────────────────────────── */

  let successTimer = null;

  function onWillShow(name, opts) {
    if (name === 'confirm') {
      chipList = opts.skipped
        ? DEFAULT_CHIPS.map(c => c.id)
        : [...selected];
      renderChips();
    }
    if (name === 'success') {
      screens.success.classList.remove('celebrate');
    }
  }

  function onDidShow(name) {
    if (name === 'success') {
      screens.success.classList.add('celebrate');
      clearTimeout(successTimer);
      successTimer = setTimeout(() => {
        // Auto-advance ~2s → first digest (design: "05 · auto-advances ~2s")
        push('digest', { fade: true });
      }, 2100);
    }
  }

  /* ──────────────────────────────
     03 · Sources grid
     ────────────────────────────── */

  const grid = document.getElementById('sourceGrid');
  const sourcesFooter = document.getElementById('sourcesFooter');

  function sourceById(id) {
    return SOURCES.find(s => s.id === id) || DEFAULT_CHIPS.find(c => c.id === id);
  }

  function renderGrid() {
    grid.innerHTML = '';
    SOURCES.forEach(src => {
      const cell = document.createElement('button');
      cell.className = 'source-cell' + (selected.has(src.id) ? ' selected' : '');
      cell.dataset.id = src.id;
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
      cell.addEventListener('click', () => toggleSource(src.id, cell));
      grid.appendChild(cell);
    });
  }

  function toggleSource(id, cell) {
    if (selected.has(id)) {
      selected.delete(id);
      cell.classList.remove('selected');
    } else {
      selected.add(id);
      cell.classList.add('selected');
    }
    sourcesFooter.classList.toggle('visible', selected.size > 0);
  }

  renderGrid();

  /* ──────────────────────────────
     04 · Chips
     ────────────────────────────── */

  const chipWrap = document.getElementById('chipWrap');

  function renderChips() {
    chipWrap.innerHTML = '';
    chipList.forEach(id => {
      const src = sourceById(id);
      if (!src) return;
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.dataset.id = id;
      const avatar = src.type === 'group'
        ? `<span class="chip-avatar collage">${src.imgs.map(i => `<img src="assets/${i}" alt="">`).join('')}</span>`
        : `<span class="chip-avatar"><img src="assets/${src.img}" alt=""></span>`;
      chip.innerHTML = `${avatar}<span class="chip-label">${src.name}</span>
        <span class="chip-close"><img src="assets/close.svg" alt="Remove"></span>`;
      chip.querySelector('.chip-close').addEventListener('click', () => {
        chip.classList.add('removing');
        setTimeout(() => {
          chipList = chipList.filter(x => x !== id);
          selected.delete(id);
          chip.remove();
        }, 240);
      });
      chipWrap.appendChild(chip);
    });
  }

  /* ──────────────────────────────
     Bottom-sheet pickers
     ────────────────────────────── */

  const sheetLayer = document.getElementById('sheetLayer');
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
        document.getElementById(cfg.valueEl).textContent = opt;
        closeSheet();
      });
      sheetOptions.appendChild(b);
    });
    sheetLayer.classList.add('open');
  }

  function closeSheet() { sheetLayer.classList.remove('open'); }

  document.getElementById('sheetBackdrop').addEventListener('click', closeSheet);
  document.querySelectorAll('[data-picker]').forEach(b =>
    b.addEventListener('click', () => openSheet(b.dataset.picker)));

  /* ──────────────────────────────
     Wire up declarative nav
     ────────────────────────────── */

  document.querySelectorAll('[data-nav]').forEach(el =>
    el.addEventListener('click', () => push(el.dataset.nav)));
  document.querySelectorAll('[data-back]').forEach(el =>
    el.addEventListener('click', pop));
  document.querySelector('[data-skip-sources]')
    .addEventListener('click', () => push('confirm', { skipped: true }));

  // keyboard: ← = back (handy on desktop)
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'Escape') {
      if (sheetLayer.classList.contains('open')) { closeSheet(); return; }
      if (stack[stack.length - 1] !== 'success') pop();
    }
  });

  /* ──────────────────────────────
     Desktop mockup scaling
     ────────────────────────────── */

  const phone = document.getElementById('phone');
  function fitPhone() {
    const isMockup = getComputedStyle(phone).borderRadius !== '0px';
    if (!isMockup) { phone.style.transform = ''; return; }
    const pad = 48;
    const scale = Math.min(
      1,
      (window.innerHeight - pad) / 884,
      (window.innerWidth - pad) / 425
    );
    phone.style.transform = `scale(${scale})`;
  }
  fitPhone();
  window.addEventListener('resize', fitPhone);
})();
