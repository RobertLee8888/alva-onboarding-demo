(function () {
  'use strict';

  const ASSET = 'assets/';
  const AVATARS = {
    fintwit: [
      'alpha-fintwit-1.png', 'alpha-fintwit-2.png', 'alpha-fintwit-3.png',
      'alpha-fintwit-4.png', 'alpha-fintwit-5.png', 'alpha-fintwit-6.png', 'alpha-fintwit-7.png',
    ],
    figures: [
      'alpha-figure-1.png', 'alpha-figure-2.png', 'alpha-figure-3.png', 'alpha-figure-4.png',
      'alpha-figure-5.png', 'alpha-figure-6.png', 'alpha-figure-7.png', 'alpha-figure-8.png',
    ],
    podcasts: [
      'alpha-podcast-1.png', 'alpha-podcast-2.png', 'alpha-podcast-3.png', 'alpha-podcast-4.png',
      'alpha-podcast-5.png', 'alpha-podcast-6.png', 'alpha-podcast-7.png', 'alpha-podcast-8.png',
    ],
  };

  const STEPS = [
    {
      id: 'intro',
      button: 'Choose my sources',
    },
    {
      id: 'fintwit',
      title: 'Choose FinTwit accounts',
      description: 'Accounts whose posts can move markets. You can adjust this list later.',
      placeholder: 'Search by handle, name, or focus',
      count: '100 accounts selected',
      skip: true,
      items: [
        { name: 'Win Rate Top 50', meta: '50 accounts', collage: [0, 1, 2, 3], selected: true, rule: 'Highest prediction win rate over the past 90 days', ranked: true },
        { name: 'Crypto Wizard', rate: '69% win rate', image: 0 },
        { name: 'Arthur Hayes', rate: '67% win rate', image: 1 },
        { name: 'Ming-Chi Kuo', rate: '70% win rate', image: 2 },
        { name: 'Mike Alfred', rate: '66% win rate', image: 3 },
        { name: 'Puru Saxena', rate: '64% win rate', image: 4 },
        { name: 'Alea', rate: '63% win rate', image: 5 },
        { name: 'Gainzy', rate: '61% win rate', image: 6 },
        { name: 'Cathie Wood', rate: '60% win rate', image: 1 },
        { name: 'Chamath', rate: '59% win rate', image: 2 },
        { name: 'K A L E O', rate: '58% win rate', image: 3 },
        { name: 'Liz Ann Sonders', rate: '57% win rate', image: 4 },
        { name: 'Raoul Pal', rate: '56% win rate', image: 5 },
        { name: 'Dan Pickering', rate: '55% win rate', image: 6 },
        { name: 'SemiAnalysis', rate: '54% win rate', image: 0 },
        { name: 'Lance Roberts', rate: '53% win rate', image: 1 },
        { name: 'Aswath Damodaran', rate: '52% win rate', image: 2 },
        { name: 'Brian Feroldi', rate: '51% win rate', image: 3 },
        { name: 'Howard Marks', rate: '50% win rate', image: 4 },
        { name: 'Josh Brown', rate: '49% win rate', image: 5 },
        { name: 'Lyn Alden', rate: '48% win rate', image: 6 },
        { name: 'Bespoke', rate: '47% win rate', image: 0 },
        { name: 'MacroAlf', rate: '46% win rate', image: 1 },
        { name: 'The Market Ear', rate: '45% win rate', image: 2 },
        { name: 'Walter Deemer', rate: '44% win rate', image: 3 },
        { name: 'Jurrien Timmer', rate: '43% win rate', image: 4 },
        { name: 'Charlie Bilello', rate: '42% win rate', image: 5 },
        { name: 'Peter Brandt', rate: '41% win rate', image: 6 },
        { name: 'Kobeissi Letter', rate: '40% win rate', image: 0 },
      ],
    },
    {
      id: 'figures',
      title: 'Choose key figures',
      description: 'People whose actions can move markets. You can adjust this list later.',
      placeholder: 'Search by handle, name, or focus',
      count: '100 key figures selected',
      skip: true,
      items: [
        { name: 'Top Key Figures', meta: '50 key figures', collage: [0, 1, 2, 3], selected: true, rule: 'People whose moves shifted markets most over the past 90 days' },
        { name: 'Elon Musk', image: 0 },
        { name: 'Barack Obama', image: 1 },
        { name: 'Cristiano Ronaldo', image: 2 },
        { name: 'Taylor Swift', image: 3 },
        { name: 'Rihanna', image: 4 },
        { name: 'Katy Perry', image: 5 },
        { name: 'Justin Bieber', image: 6 },
        { name: 'Jeff Bezos', image: 7 },
        { name: 'Bill Gates', image: 0 },
        { name: 'Warren Buffett', image: 1 },
        { name: 'Jerome Powell', image: 2 },
        { name: 'Jensen Huang', image: 3 },
        { name: 'Tim Cook', image: 4 },
        { name: 'Satya Nadella', image: 5 },
        { name: 'Mark Zuckerberg', image: 6 },
        { name: 'Jamie Dimon', image: 7 },
        { name: 'Sam Altman', image: 0 },
        { name: 'Sundar Pichai', image: 1 },
        { name: 'Larry Fink', image: 2 },
        { name: 'Michael Dell', image: 3 },
        { name: 'Lisa Su', image: 4 },
        { name: 'Reed Hastings', image: 5 },
        { name: 'Brian Armstrong', image: 6 },
        { name: 'Michael Saylor', image: 7 },
        { name: 'Oprah Winfrey', image: 0 },
        { name: 'LeBron James', image: 1 },
        { name: 'Beyoncé', image: 2 },
        { name: 'Ariana Grande', image: 3 },
      ],
    },
    {
      id: 'podcasts',
      title: 'Choose podcasts to follow',
      description: 'Choose the market and industry podcasts Alva should follow.',
      placeholder: 'Search by podcast name',
      count: '100 podcasts selected',
      skip: true,
      items: [
        { name: 'Top Podcasts', meta: '50 podcasts', collage: [0, 1, 2, 3], selected: true, rule: 'Most cited market podcasts over the past 90 days' },
        { name: 'All-In', image: 0 },
        { name: 'BG2', image: 1 },
        { name: 'Acquired', image: 2 },
        { name: 'The Compound', image: 3 },
        { name: 'Invest Like the Best', image: 4 },
        { name: 'Odd Lots', image: 5 },
        { name: 'No Priors', image: 6 },
        { name: 'Pivot', image: 7 },
        { name: 'Prof G Markets', image: 0 },
        { name: 'The Knowledge Project', image: 1 },
        { name: 'Business Breakdowns', image: 2 },
        { name: 'Capital Allocators', image: 3 },
        { name: 'Investing By The Books', image: 4 },
        { name: 'Masters in Business', image: 5 },
        { name: 'The Memo', image: 6 },
        { name: 'Animal Spirits', image: 7 },
        { name: 'Macro Voices', image: 0 },
        { name: 'Forward Guidance', image: 1 },
        { name: 'The Investors Podcast', image: 2 },
        { name: 'Excess Returns', image: 3 },
        { name: 'Value After Hours', image: 4 },
        { name: 'Infinite Loops', image: 5 },
        { name: 'Acquired LP Show', image: 6 },
        { name: 'Twenty Minute VC', image: 7 },
        { name: 'Stratechery', image: 0 },
        { name: 'The Logan Bartlett Show', image: 1 },
        { name: 'Uncommon Knowledge', image: 2 },
        { name: 'BG2 Pod Extra', image: 3 },
      ],
    },
    {
      id: 'watch',
      title: 'What else should I watch?',
      description: 'Besides the people you picked, I can keep an eye on the whole market.',
    },
    {
      id: 'ready',
      title: 'Your radar is ready to run',
      description: 'Two last things — when I should reach you, and in which language.',
    },
    { id: 'login' },
    { id: 'building' },
  ];

  const BUILD_STEPS = [
    'Linked 100 FinTwit accounts',
    'Linked 100 key figures',
    'Indexed 100 podcast feeds',
    'Mapped market news to companies',
    'Reading earnings and guidance',
    'Scoring what moved your names',
    "Ranking today's signals",
    'Checking unusual volume and price action',
    'Connecting related company events',
    'Comparing signals with market context',
    'Filtering duplicate stories',
    'Prioritizing the strongest ideas',
    'Writing your first brief',
    'Scheduling your daily 20:00 alert',
  ];

  const EXTRA_ITEMS = {
    fintwit: [
      'Fundstrat', 'DeItaone', 'Unusual Whales', 'SpotGamma', 'Tier10k',
      'Jim Bianco', 'Michael Green', 'Jeff Weniger', 'Cullen Roche', 'Eric Balchunas',
      'Bob Elliott', 'Joseph Wang', 'Kris Sidial', 'Dario Perkins', 'Andreas Steno',
      'Kantro', 'CrossBorder Capital', 'FiscalData', 'Markets & Mayhem', 'Alfonso Peccatiello',
      'Sven Henrich', 'Brent Donnelly', 'Liz Young Thomas', 'Gene Munster', 'Ross Gerber',
      'Dan Ives', 'Beth Kindig', 'Shay Boloor', 'Puru Finance', 'The Transcript',
    ],
    figures: [
      'Janet Yellen', 'Christine Lagarde', 'Mary Barra', 'Andy Jassy', 'David Solomon',
      'Jane Fraser', 'Doug McMillon', 'Mary Callahan Erdoes', 'Ken Griffin', 'Ray Dalio',
      'Bill Ackman', 'David Tepper', 'Stanley Druckenmiller', 'Howard Marks', 'Larry Ellison',
      'Safra Catz', 'Shantanu Narayen', 'Arvind Krishna', 'Pat Gelsinger', 'Dara Khosrowshahi',
      'Daniel Ek', 'Susan Wojcicki', 'Melinda French Gates', 'Jack Dorsey', 'Marc Benioff',
      'Alex Karp', 'Ted Sarandos', 'Bob Iger', 'Mukesh Ambani', 'Masayoshi Son',
    ],
    podcasts: [
      'Invest Like a Billionaire', 'Motley Fool Money', 'Money Talks', 'The Journal', 'FT News Briefing',
      'Bloomberg Surveillance', 'Masters of Scale', 'Decoder', 'Hard Fork', 'Tech Won’t Save Us',
      'The a16z Podcast', 'Bankless', 'The Pomp Podcast', 'On The Margin', 'Real Vision Daily Briefing',
      'The Tape', 'Trillions', 'ETF Edge', 'Closing Bell', 'Squawk Pod',
      'The Bid', 'Odd Lots Extra', 'The Compound Live', 'Investors Field Guide', 'Founders',
      'How I Built This', 'People I Mostly Admire', 'Conversations with Tyler', 'EconTalk', 'Dwarkesh Podcast',
    ],
  };

  /* Each picker opens with ONLY its collection card checked (Robert
     2026-08-18). The curated collection is the default; every individual
     is the user's own addition, so the "+ N accounts" read-out counts
     what they actually did rather than a number we pre-filled. */

  Object.entries(EXTRA_ITEMS).forEach(([id, names]) => {
    const step = STEPS.find(item => item.id === id);
    names.forEach((name, index) => {
      const item = { name, image: index % AVATARS[id].length };
      if (id === 'fintwit') item.rate = `${Math.max(10, 39 - index)}% win rate`;
      step.items.push(item);
    });
  });

  const screensEl = document.getElementById('screens');
  const app = document.getElementById('radarApp');
  const topbar = document.getElementById('flowTopbar');
  const progress = document.getElementById('progress');
  const backButton = document.getElementById('backButton');
  const skipButton = document.getElementById('skipButton');
  const sheetLayer = document.getElementById('sheetLayer');
  const memberLayer = document.getElementById('memberLayer');
  const memberTitle = document.getElementById('memberTitle');
  const memberRule = document.getElementById('memberRule');
  const memberGrid = document.getElementById('memberGrid');
  const memberScroll = document.getElementById('memberScroll');
  const memberFollow = document.getElementById('memberFollow');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetOptions = document.getElementById('sheetOptions');
  const toast = document.getElementById('toast');
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NAV_MS = REDUCED ? 1 : 440;
  const LIST_DELAY_MS = REDUCED ? 1 : 900;
  const LIST_STAGGER_MS = REDUCED ? 0 : 18;
  const BUILD_SCROLL_MS = REDUCED ? 1 : 520;
  const BUILD_HOLD_MS = REDUCED ? 60 : 5000;
  let current = 0;
  let animating = false;
  let editingStep = null;
  let toastTimer = null;
  let newsOn = true;
  let earningsOn = true;
  let alertTime = '20:00 GMT+8';
  let language = 'English';
  const loadedSteps = new Set();
  const loadTimers = new Map();
  let buildingStep = 4;
  let buildingTimer = null;
  let memberOpen = null;   // { step, index } of the collection in the sheet
  let memberCloseTimer = null;

  function avatar(type, index) {
    return ASSET + AVATARS[type][index % AVATARS[type].length];
  }

  function renderAction(label, count = '', source = false) {
    return `
      <footer class="action-bar${source ? ' source-action' : ''}">
        <span class="action-fade" aria-hidden="true"></span>
        <p class="selection-count" hidden>${count}</p>
        <button class="primary-button" data-primary-action${source ? ' disabled' : ''}>${label}</button>
      </footer>`;
  }

  function renderIntro() {
    return `
      <section class="screen intro" data-step="0">
        <div class="intro-stage">
          <article class="record-card">
            <div class="record-head">
              <div class="record-identity">
                <div class="record-id"><img class="stock-logo" src="assets/alpha-amd-logo.svg" alt="AMD"><span class="ticker">\$AMD</span><span class="bullish">Bullish</span></div>
                <p class="published"><span>Published by</span><span>Aug 4, 2026</span></p>
              </div>
              <div class="profit"><span>Profit rate</span><strong>+15.2%</strong><small>\$163.20 → \$188.00</small></div>
            </div>
            <div class="quote">🎙 Bloomberg Surveillance - Bloomberg Surveillance TV
              <strong>“Some semiconductor margins can become too lofty, too good, but AMD is nowhere near that point now, especially relative to some of the other players across the semiconductor ecosystem.”</strong>
            </div>
            <div class="record-copy">
              <h2>Relative margin headroom leaves room for profitability improvement</h2>
              <p>The relative margin assessment points to company-specific profitability headroom, but it remains an unquantified opinion without a timeframe or operating path.</p>
            </div>
          </article>
        </div>
        <div class="intro-copy">
          <div class="intro-wordmark">
            <img src="assets/wordmark-symbol.svg" class="wm-symbol" alt="">
            <img src="assets/wordmark-text.svg" class="wm-text" alt="Alva">
          </div>
          <h1>Build an Alpha Radar around<br>what you follow</h1>
          <p>Choose the voices, podcasts and market sources Alva<br>should read for you every day.</p>
          <div class="source-icons" aria-label="X, Bloomberg, Reuters, and podcasts">
            <span class="source-icon source-x"><img src="assets/alpha-source-x.svg" alt=""></span>
            <img class="source-icon" src="assets/alpha-source-bloomberg.png" alt="">
            <img class="source-icon" src="assets/alpha-source-reuters.png" alt="">
            <img class="source-icon" src="assets/alpha-source-podcast.png" alt="">
          </div>
        </div>
        ${renderAction('Choose my sources')}
      </section>`;
  }

  function renderSourceScreen(step, index) {
    const skeletons = Array.from({ length: 12 }, () => `
      <span class="source-skeleton" aria-hidden="true">
        <span class="skeleton-avatar"></span>
        <span class="skeleton-line skeleton-name"></span>
        <span class="skeleton-line skeleton-meta"></span>
      </span>`).join('');
    const cards = step.items.map((item, itemIndex) => {
      const images = item.collage
        ? item.collage.map(i => `<img src="${avatar(step.id, i)}" alt="">`).join('')
        : `<img src="${avatar(step.id, item.image)}" alt="">`;
      const meta = item.rate
        ? `<span class="source-meta"><span class="rate">${item.rate.split(' ')[0]}</span> ${item.rate.substring(item.rate.indexOf(' ') + 1)}</span>`
        : item.meta ? `<span class="source-meta">${item.meta}</span>` : '';
      return `
        <button class="source-card${item.selected ? ' selected' : ''}" style="--item-delay:${Math.min(itemIndex, 11) * LIST_STAGGER_MS}ms" data-source-index="${itemIndex}"${item.collage ? ' data-collection' : ''} data-search="${item.name.toLowerCase()}">
          <span class="source-avatar${item.collage ? ' collage' : ''}">${images}</span>
          <span class="source-copy"><span class="source-name">${item.name}</span>${meta}</span>
          <span class="selected-badge" aria-hidden="true"></span>
        </button>`;
    }).join('');

    return `
      <section class="screen source-step" data-step="${index}">
        <div class="screen-scroll">
          <div class="content">
            <div class="title-block"><h1>${step.title}</h1><p>${step.description}</p></div>
            <input class="search" data-search-input type="search" placeholder="${step.placeholder}" autocomplete="off" spellcheck="false">
            <div class="source-grid-wrap">
              <div class="source-grid source-skeleton-grid" data-skeleton-grid>${skeletons}</div>
              <div class="source-grid is-loading" data-source-grid>${cards}<p class="grid-empty" hidden>No matching sources.</p></div>
            </div>
          </div>
        </div>
        ${renderAction('Next', step.count, true)}
      </section>`;
  }

  function renderWatch(step, index) {
    return `
      <section class="screen" data-step="${index}">
        <div class="screen-scroll">
          <div class="content">
            <div class="title-block"><h1>${step.title}</h1><p>${step.description}</p></div>
            <div class="watch-card">
              <button class="watch-row" data-toggle="news"><span class="watch-head"><span class="watch-title">News</span><span class="switch on"></span></span><span class="watch-description">Market-wide breaking events, mapped to the companies they move</span></button>
              <button class="watch-row" data-toggle="earnings"><span class="watch-head"><span class="watch-title">Earnings</span><span class="switch on"></span></span><span class="watch-description">US-equity results, guidance and management commentary</span></button>
            </div>
          </div>
        </div>
        ${renderAction('Next')}
      </section>`;
  }

  function renderReady(step, index) {
    return `
      <section class="screen" data-step="${index}">
        <div class="screen-scroll">
          <div class="content">
            <div class="title-block"><h1>${step.title}</h1><p>${step.description}</p></div>
            <div class="summary-card">
              <button class="summary-row" data-edit-step="1"></button>
              <button class="summary-row" data-edit-step="2"></button>
              <button class="summary-row" data-edit-step="3"></button>
              <div class="watch-summary">
                <button class="summary-option" data-toggle="news"><span>News</span><span class="switch compact on"></span></button><i class="divider"></i>
                <button class="summary-option" data-toggle="earnings"><span>Earnings</span><span class="switch compact on"></span></button>
              </div>
            </div>
            <div class="delivery-card">
              <button class="delivery-row" data-sheet="time"><span class="delivery-copy"><span class="delivery-label">Daily alert</span><span class="delivery-value" id="timeValue">20:00 GMT+8</span></span><span class="change-button">Change</span></button>
              <button class="delivery-row" data-sheet="language"><span class="delivery-copy"><span class="delivery-label">Language</span><span class="delivery-value" id="languageValue">English</span></span><span class="change-button">Change</span></button>
            </div>
          </div>
        </div>
        ${renderAction('Start my Alpha Radar')}
      </section>`;
  }

  function renderLogin(index) {
    return `
      <section class="screen login-screen" data-step="${index}">
        <div class="login-dialog">
          <div class="login-heading">
            <img class="login-logo" src="${ASSET}alpha-login-logo.svg" alt="Alva">
            <div><h1>Log in to Alva</h1><p>Login to build, remix, and trade.</p></div>
          </div>
          <div class="login-actions">
            <button class="login-button" data-login-option><img src="${ASSET}alpha-login-google.svg" alt=""><span>Login with Google</span></button>
            <button class="login-button" data-login-option><img src="${ASSET}alpha-login-apple.svg" alt=""><span>Login with Apple</span></button>
            <div class="social-login-row">
              <button class="login-button icon-only" data-login-option aria-label="Login with Discord"><span class="discord-mark"><img src="${ASSET}icon-discord.svg" alt=""></span></button>
              <button class="login-button icon-only" data-login-option aria-label="Login with X"><img src="${ASSET}alpha-login-x.svg" alt=""></button>
              <button class="login-button icon-only" data-login-option aria-label="Login with Telegram"><img src="${ASSET}alpha-login-telegram.svg" alt=""></button>
            </div>
            <div class="login-divider"><span></span><i>or</i><span></span></div>
            <button class="email-login" data-login-option>Login with Email</button>
          </div>
          <p class="login-terms">By signing in, you agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong></p>
        </div>
      </section>`;
  }

  function renderBuilding(index) {
    return `
      <section class="screen building-screen" data-step="${index}">
        <div class="building-body">
          <div class="building-ticker">
            <div class="building-steps" data-building-steps></div>
            <span class="ticker-fade ticker-fade-top"></span>
            <span class="ticker-fade ticker-fade-bottom"></span>
          </div>
          <div class="building-copy"><h1>Building your Alpha Radar</h1><p>This can take a few minutes — Alva will message you as soon as the first report is ready.</p></div>
        </div>
      </section>`;
  }

  screensEl.innerHTML = STEPS.map((step, index) => {
    if (index === 0) return renderIntro();
    if (index >= 1 && index <= 3) return renderSourceScreen(step, index);
    if (index === 4) return renderWatch(step, index);
    if (index === 5) return renderReady(step, index);
    if (index === 6) return renderLogin(index);
    return renderBuilding(index);
  }).join('');

  const screens = Array.from(document.querySelectorAll('.screen'));
  screens[0].classList.add('current');
  progress.innerHTML = Array.from({ length: 5 }, () => '<span class="progress-segment"></span>').join('');

  /* ──────────────────────────────
     Selection read-out (Robert 2026-08-18)

     A collection is named, individuals are counted, and the two are
     joined with a plus: "Win Rate Top 50 + 12 accounts". Naming the
     collection rather than adding its 50 also settles the old
     double-counting question — a member who is also checked in the grid
     is now counted once, as an individual, and never twice.

     The selection screens append "selected"; the Ready rows do not.
     ────────────────────────────── */

  const NOUNS = {
    1: ['account', 'accounts'],
    2: ['key figure', 'key figures'],
    3: ['podcast', 'podcasts'],
  };

  function selectedCollections(index) {
    const step = STEPS[index];
    return step.items ? step.items.filter(item => item.collage && item.selected) : [];
  }

  function selectedSingles(index) {
    const step = STEPS[index];
    return step.items ? step.items.filter(item => !item.collage && item.selected) : [];
  }

  function hasSelection(index) {
    return selectedCollections(index).length + selectedSingles(index).length > 0;
  }

  function selectionLabel(index, suffix) {
    const [one, many] = NOUNS[index];
    const singles = selectedSingles(index).length;
    const parts = selectedCollections(index).map(item => item.name);
    if (singles) parts.push(`${singles} ${singles === 1 ? one : many}`);
    /* An empty page reads as a count too — "0 accounts selected" — not as an
       instruction. Skip is already on screen by then as the way out, so the
       footer has no one to instruct (Robert 2026-08-18). */
    if (!parts.length) parts.push(`0 ${many}`);
    return parts.join(' + ') + (suffix ? ' selected' : '');
  }

  /* ──────────────────────────────
     Ready row (13718:47652 / empty 14159:48781)

     The design moved the "+" out of the sentence and into the row itself:
     the collection is its own collage avatar, the individuals are an avatar
     stack, and the words are only the count. So the row is composed, not
     just labelled — and it is rebuilt whenever the selection changes.

     Only "both" and "neither" are drawn in the file. The two one-sided cases
     are inferred, on the rule that the text says whatever the avatars cannot:
     with a collection alone the words are its name, with individuals alone
     the words stay the count.
     ────────────────────────────── */

  function readyRowMarkup(index) {
    const collection = selectedCollections(index)[0];
    const singles = selectedSingles(index);
    const [one, many] = NOUNS[index];

    if (!collection && !singles.length) {
      return `
        <span class="summary-label">No ${many} selected</span>
        <span class="summary-add"><img src="${ASSET}add-l1-reverse.svg" alt="">Add ${many}</span>`;
    }

    const collage = collection
      ? `<span class="summary-collage">${collection.collage
          .map(i => `<img src="${avatar(STEPS[index].id, i)}" alt="">`).join('')}</span>`
      : '';
    /* the real first four, so the row keeps up as you edit */
    const stack = singles.length
      ? `<span class="avatar-stack">${singles.slice(0, 4)
          .map(item => `<img src="${avatar(STEPS[index].id, item.image)}" alt="">`).join('')}</span>`
      : '';
    const plus = collection && singles.length ? '<span class="summary-plus">+</span>' : '';
    const words = singles.length
      ? `${singles.length} ${singles.length === 1 ? one : many}`
      : collection.name;

    return `
      ${collage}${plus}${stack}
      <span class="summary-label">${words}</span>
      <img class="edit-icon" src="${ASSET}alpha-edit.svg" alt="">`;
  }

  function updateChrome(index = current) {
    const step = STEPS[index];
    const inFlow = index > 0 && index <= 5;
    const sourceStep = index >= 1 && index <= 3;
    const editingSource = sourceStep && editingStep === index;
    app.classList.toggle('in-flow', inFlow);
    app.classList.toggle('source-footer', sourceStep);
    app.classList.toggle('post-onboarding', index >= 6);
    app.classList.toggle('editing-selection', editingSource);
    topbar.setAttribute('aria-hidden', String(!inFlow));
    /* Skip is the "none of these" exit, so it only appears once the page is
       empty — with the collection still checked there is nothing to skip
       (Robert 2026-08-18). Order matters: step.skip short-circuits before
       hasSelection, which only the source steps can answer. */
    skipButton.hidden = !inFlow || !step.skip || editingSource || hasSelection(index);
    progress.querySelectorAll('.progress-segment').forEach((segment, i) => {
      segment.classList.toggle('done', i < index);
    });

    if (sourceStep) {
      const screen = screens[index];
      const selectionCount = screen.querySelector('.selection-count');
      selectionCount.textContent = selectionLabel(index, true);
      selectionCount.hidden = !loadedSteps.has(index);
      screen.querySelector('[data-primary-action]').textContent = editingSource ? 'Confirm' : 'Next';
      /* Walking forward, a step still needs at least one source — a radar that
         reads nothing is not a radar. But coming back from Ready via the pencil,
         Confirm has to accept whatever you chose, including nothing: clearing a
         category is a legitimate edit, and it is how the Ready screen's empty
         row is reached (Figma ④b Podcasts 空态, 14159:48746). */
      screen.querySelector('[data-primary-action]').disabled =
        !loadedSteps.has(index) || (!editingSource && !hasSelection(index));
    }

    if (index === 5) {
      document.querySelectorAll('[data-edit-step]').forEach(row => {
        const step = Number(row.dataset.editStep);
        row.classList.toggle('is-empty', !hasSelection(step));
        row.innerHTML = readyRowMarkup(step);
      });
    }
  }

  function animateEditingTopbarIn() {
    topbar.style.transition = 'none';
    topbar.style.transform = 'translate3d(100%, 0, 0)';
    void topbar.offsetWidth;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      topbar.style.transition = `transform ${NAV_MS}ms var(--ease)`;
      topbar.style.transform = 'translate3d(0, 0, 0)';
    }));
    window.setTimeout(() => {
      topbar.style.transition = '';
      topbar.style.transform = '';
    }, NAV_MS + 50);
  }

  function loadSourceList(index) {
    if (index < 1 || index > 3 || loadedSteps.has(index) || loadTimers.has(index)) return;
    const grid = screens[index].querySelector('[data-source-grid]');
    const skeleton = screens[index].querySelector('[data-skeleton-grid]');
    screens[index].querySelector('[data-primary-action]').disabled = true;
    const timer = window.setTimeout(() => {
      grid.classList.add('is-revealing');
      grid.classList.remove('is-loading');
      skeleton.classList.add('is-fading');
      void grid.offsetWidth;
      grid.classList.add('is-entering');
      grid.classList.remove('is-revealing');
      const duration = LIST_STAGGER_MS * Math.min(11, STEPS[index].items.length - 1) + 300;
      const finishTimer = window.setTimeout(() => {
        grid.classList.remove('is-entering');
        skeleton.hidden = true;
        loadedSteps.add(index);
        loadTimers.delete(index);
        if (current === index) updateChrome(index);
      }, duration);
      loadTimers.set(index, finishTimer);
    }, LIST_DELAY_MS);
    loadTimers.set(index, timer);
  }

  function navigate(next, direction) {
    if (animating || next < 0 || next >= screens.length || next === current) return;
    closeMemberSheet();
    const from = screens[current];
    const to = screens[next];
    const forward = direction !== 'back';
    animating = true;
    from.style.zIndex = '1';
    to.style.zIndex = '2';
    const enteringFlow = next === 1 && current === 0;
    if (enteringFlow) {
      app.classList.add('flow-entering');
      updateChrome(next);
      topbar.style.transition = 'none';
      topbar.style.transform = 'translate3d(100%, 0, 0)';
      void app.offsetWidth;
    }
    to.classList.add('animating');
    to.style.transition = 'none';
    from.style.transition = 'none';
    to.style.transform = `translate3d(${forward ? '100%' : '-30%'},0,0)`;
    to.style.opacity = '1';
    from.style.transform = 'translate3d(0,0,0)';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (enteringFlow) app.classList.remove('flow-entering');
      if (enteringFlow) {
        topbar.style.transition = `transform ${NAV_MS}ms var(--ease)`;
        topbar.style.transform = 'translate3d(0, 0, 0)';
      }
      to.style.transition = `transform ${NAV_MS}ms var(--ease)`;
      from.style.transition = `transform ${NAV_MS}ms var(--ease), opacity ${NAV_MS}ms var(--ease)`;
      to.style.transform = 'translate3d(0,0,0)';
      from.style.transform = `translate3d(${forward ? '-30%' : '100%'},0,0)`;
      from.style.opacity = forward ? '.92' : '1';
    }));

    window.setTimeout(() => {
      from.classList.remove('current');
      to.classList.remove('animating');
      to.classList.add('current');
      [from, to].forEach(el => {
        el.style.transition = 'none';
        el.style.transform = '';
        el.style.opacity = '';
        el.style.zIndex = '';
      });
      if (enteringFlow) {
        topbar.style.transition = '';
        topbar.style.transform = '';
      }
      current = next;
      updateChrome();
      loadSourceList(current);
      if (current === 7) startBuildingLoop();
      else stopBuildingLoop();
      animating = false;
    }, NAV_MS + 50);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  backButton.addEventListener('click', () => {
    if (editingStep === current) {
      editingStep = null;
      navigate(5, 'back');
      return;
    }
    navigate(current - 1, 'back');
  });
  skipButton.addEventListener('click', () => {
    skipButton.blur();
    navigate(current + 1, 'forward');
  });
  document.getElementById('restartButton').addEventListener('click', () => {
    editingStep = null;
    navigate(0, 'back');
  });

  document.addEventListener('click', event => {
    const primary = event.target.closest('[data-primary-action]');
    if (primary) {
      primary.blur();
      if (primary.disabled) return;
      if (editingStep === current) {
        editingStep = null;
        navigate(5, 'back');
        return;
      }
      navigate(current + 1, 'forward');
      return;
    }

    if (event.target.closest('[data-login-option]')) {
      navigate(7, 'forward');
      return;
    }

    const source = event.target.closest('[data-source-index]');
    if (source) {
      // collection card: the whole card opens the member sheet —
      // single cards keep whole-card = select/deselect, unchanged
      if (source.hasAttribute('data-collection')) {
        openMemberSheet(current, Number(source.dataset.sourceIndex));
        return;
      }
      const item = STEPS[current].items[Number(source.dataset.sourceIndex)];
      item.selected = !item.selected;
      source.classList.toggle('selected', item.selected);
      updateChrome();
      return;
    }

    const toggle = event.target.closest('[data-toggle]');
    if (toggle) {
      const key = toggle.dataset.toggle;
      if (key === 'news') newsOn = !newsOn;
      if (key === 'earnings') earningsOn = !earningsOn;
      toggle.querySelector('.switch').classList.toggle('on', key === 'news' ? newsOn : earningsOn);
      document.querySelectorAll(`[data-toggle="${key}"] .switch`).forEach(item => {
        item.classList.toggle('on', key === 'news' ? newsOn : earningsOn);
      });
      return;
    }

    const edit = event.target.closest('[data-edit-step]');
    if (edit) {
      editingStep = Number(edit.dataset.editStep);
      app.classList.add('editing-selection');
      skipButton.hidden = true;
      animateEditingTopbarIn();
      navigate(editingStep, 'forward');
      return;
    }

    const sheetButton = event.target.closest('[data-sheet]');
    if (sheetButton) openSheet(sheetButton.dataset.sheet);
  });

  document.querySelectorAll('[data-search-input]').forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const grid = input.closest('.content').querySelector('[data-source-grid]');
      let visible = 0;
      grid.querySelectorAll('[data-source-index]').forEach(card => {
        const match = card.dataset.search.includes(query);
        card.hidden = !match;
        if (match) visible += 1;
      });
      grid.querySelector('.grid-empty').hidden = visible > 0;
    });
  });

  /* ──────────────────────────────
     Collection member sheet
     Figma 13969:48088 row 2 — sheet y=106, close-l1 left, rule line
     scrolls with the list, 3-up page-grid molecule, floating dual-state
     button. The collection is atomic (Robert 2026-08-14): members are
     read-only, the ONLY action is Follow all / Following, synced live
     with the card's checkmark and the selection count behind the scrim.
     ────────────────────────────── */

  function collectionMembers(step, item) {
    const singles = step.items.filter(it => !it.collage);
    // "Win Rate Top 50" — exactly what its rule says: sort by win rate
    const pool = item.ranked && step.id === 'fintwit'
      ? singles.slice().sort((a, b) => parseInt(b.rate) - parseInt(a.rate))
      : singles.slice();
    return pool.slice(0, 50);
  }

  function paintFollowButton(item) {
    memberFollow.classList.toggle('following', !!item.selected);
    memberFollow.innerHTML = item.selected
      ? `<img class="follow-check" src="${ASSET}check-l1.svg" alt="">Following`
      : 'Follow all';
  }

  function openMemberSheet(stepIndex, itemIndex) {
    const step = STEPS[stepIndex];
    const item = step.items[itemIndex];
    memberOpen = { step: stepIndex, index: itemIndex };

    memberTitle.textContent = item.name;
    memberRule.innerHTML = '';
    memberRule.append(item.rule || '', document.createElement('br'), 'Updated 3 hours ago');

    memberGrid.innerHTML = collectionMembers(step, item).map(member => {
      const meta = member.rate
        ? `<span class="source-meta"><span class="rate">${member.rate.split(' ')[0]}</span> ${member.rate.substring(member.rate.indexOf(' ') + 1)}</span>`
        : '';
      return `
        <span class="source-card">
          <span class="source-avatar"><img src="${avatar(step.id, member.image)}" alt=""></span>
          <span class="source-copy"><span class="source-name">${member.name}</span>${meta}</span>
        </span>`;
    }).join('');

    paintFollowButton(item);
    clearTimeout(memberCloseTimer);
    memberScroll.scrollTop = 0;
    memberLayer.classList.add('open');
    memberLayer.setAttribute('aria-hidden', 'false');
  }

  function closeMemberSheet() {
    clearTimeout(memberCloseTimer);
    if (!memberOpen) return;
    memberOpen = null;
    memberLayer.classList.remove('open');
    memberLayer.setAttribute('aria-hidden', 'true');
  }

  memberFollow.addEventListener('click', () => {
    if (!memberOpen) return;
    const item = STEPS[memberOpen.step].items[memberOpen.index];
    item.selected = !item.selected;
    paintFollowButton(item);
    // the card's checkmark and the count behind the scrim follow along
    const card = screens[memberOpen.step].querySelector(`[data-source-index="${memberOpen.index}"]`);
    if (card) card.classList.toggle('selected', item.selected);
    updateChrome(memberOpen.step);

    /* Let the new button state land, then dismiss — the choice is made, so
       holding the sheet open just asks for a second dismissal. Re-armed on
       every tap so someone toggling twice is not closed mid-decision. */
    clearTimeout(memberCloseTimer);
    memberCloseTimer = window.setTimeout(closeMemberSheet, 500);
  });

  memberLayer.addEventListener('click', event => {
    if (event.target.closest('[data-close-member]')) closeMemberSheet();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && memberOpen) closeMemberSheet();
  });

  function openSheet(type) {
    const isTime = type === 'time';
    const options = isTime
      ? ['08:00 GMT+8', '12:00 GMT+8', '20:00 GMT+8']
      : ['English', '简体中文', '繁體中文'];
    const currentValue = isTime ? alertTime : language;
    sheetTitle.textContent = isTime ? 'Daily alert time' : 'Language';
    sheetOptions.innerHTML = options.map(option => `
      <button class="sheet-option${option === currentValue ? ' selected' : ''}" data-sheet-option="${type}" data-value="${option}">
        <span>${option}</span><span>${option === currentValue ? '✓' : ''}</span>
      </button>`).join('');
    sheetLayer.classList.add('open');
    sheetLayer.setAttribute('aria-hidden', 'false');
  }

  function closeSheet() {
    sheetLayer.classList.remove('open');
    sheetLayer.setAttribute('aria-hidden', 'true');
  }

  sheetLayer.addEventListener('click', event => {
    if (event.target.closest('[data-close-sheet]')) {
      closeSheet();
      return;
    }
    const option = event.target.closest('[data-sheet-option]');
    if (!option) return;
    if (option.dataset.sheetOption === 'time') {
      alertTime = option.dataset.value;
      document.getElementById('timeValue').textContent = alertTime;
    } else {
      language = option.dataset.value;
      document.getElementById('languageValue').textContent = language;
    }
    closeSheet();
  });

  function buildStepMarkup(stepIndex, currentIndex) {
    const status = stepIndex < currentIndex ? 'done' : stepIndex === currentIndex ? 'current' : 'next';
    const icon = status === 'done'
      ? `<img src="${ASSET}alpha-building-check.svg" alt="">`
      : status === 'current'
        ? '<span class="building-loader"><i></i><i></i><i></i><i></i></span>'
        : `<img src="${ASSET}alpha-building-next.svg" alt="">`;
    return `<div class="building-step ${status}"><span class="building-icon">${icon}</span><span>${BUILD_STEPS[stepIndex % BUILD_STEPS.length]}</span></div>`;
  }

  function paintBuildingSteps(animate) {
    const list = document.querySelector('[data-building-steps]');
    if (!list) return;
    const visibleStart = buildingStep - 4;
    list.innerHTML = Array.from({ length: 10 }, (_, offset) => visibleStart + offset)
      .map(stepIndex => buildStepMarkup(stepIndex, buildingStep))
      .join('');
    list.style.transition = 'none';
    list.style.transform = animate ? 'translateY(38px)' : 'translateY(0)';
    if (animate) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        list.style.transition = `transform ${BUILD_SCROLL_MS}ms var(--ease)`;
        list.style.transform = 'translateY(0)';
      }));
    }
  }

  function scheduleBuildingStep() {
    clearTimeout(buildingTimer);
    buildingTimer = window.setTimeout(() => {
      if (current !== 7) return;
      buildingStep += 1;
      paintBuildingSteps(true);
      scheduleBuildingStep();
    }, BUILD_HOLD_MS);
  }

  function startBuildingLoop() {
    buildingStep = 4;
    paintBuildingSteps(false);
    scheduleBuildingStep();
  }

  function stopBuildingLoop() {
    clearTimeout(buildingTimer);
  }

  updateChrome();

  function fitPhone() {
    if (window.innerWidth <= 520) {
      document.getElementById('phone').style.transform = '';
      return;
    }
    const scale = Math.min(1, (window.innerHeight - 48) / 884, (window.innerWidth - 80) / 425);
    document.getElementById('phone').style.transform = `scale(${Math.max(.45, scale)})`;
  }
  window.addEventListener('resize', fitPhone);
  fitPhone();
})();
