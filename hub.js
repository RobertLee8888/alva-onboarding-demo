/* ═══════════════════════════════════════════════════════════
   Alva · Prototypes — index data + rendering

   To add a prototype: drop its page in this folder and append one
   entry below. Nothing else needs to change, and the new prototype
   cannot affect any existing one.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const PROTOTYPES = [
    {
      title: 'alpha radar mobile onboarding',
      subtitle: 'Build an Alpha Radar from FinTwit accounts, key figures, podcasts, news, and earnings.',
      edited: '2026-08-13',
      href: 'alpha-radar.html',
      meta: 'Mobile · 8 screens',
    },
    {
      title: 'Immersive onboarding',
      subtitle: 'FinTwit Digest path — welcome, pick a task, choose who Alva reads, confirm, first digest. Native-feeling iOS transitions.',
      edited: '2026-08-06',
      href: 'onboarding.html',
      meta: 'Mobile · 6 screens',
    },
  ];

  /* ── Edited-time formatting: relative while it is still fresh
        (how design tools phrase it), absolute once it is not ── */

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
    const date = `${MONTHS[m - 1]} ${d}` + (sameYear ? '' : `, ${y}`);
    return `Edited ${date}`;
  }

  /* ── Render ── */

  const list = document.getElementById('protoList');

  // newest edit first, so the thing you were just working on is on top
  const items = PROTOTYPES.slice().sort((a, b) => b.edited.localeCompare(a.edited));

  items.forEach(p => {
    const card = document.createElement('a');
    card.className = 'proto-card';
    card.href = p.href;

    const meta = [formatEdited(p.edited)];
    if (p.meta) meta.push(p.meta);

    card.innerHTML = `
      <span class="pc-body">
        <span class="pc-title">${p.title}</span>
        <span class="pc-sub">${p.subtitle}</span>
        <span class="pc-meta">${meta.join('<span class="dot">·</span>')}</span>
      </span>
      <span class="pc-go"><img src="assets/icon-arrow-right.svg" alt=""></span>`;

    list.appendChild(card);
  });

  const n = items.length;
  document.getElementById('hubFoot').textContent =
    `${n} prototype${n === 1 ? '' : 's'} · more will appear here as they are built`;
})();
