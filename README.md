# Alva · Design Prototypes

Interactive design prototypes for Alva. The site opens on an index of prototypes; each one is a standalone page, so they never interfere with one another.

### ▶︎ [Open the live prototypes](https://robertlee8888.github.io/alva-onboarding-demo/)

<https://robertlee8888.github.io/alva-onboarding-demo/> — pick a card and click straight into it. On desktop each mobile prototype runs inside a phone mockup; on a phone it fills the screen.

## Contents

| | Prototype | Source |
| --- | --- | --- |
| `index.html` | **Prototypes** — the index: one card per exploration, with title, subtitle and last-edited time | — |
| `onboarding-v2.html` | **Onboarding v2 · choice first** — identity + capabilities + log in on one screen, then an expectation preview of the capability picked | [Onboarding · Production v4 · FinTwit path](https://www.figma.com/design/A4jIwN4EMWr0fJVVGmCIsr/Mobile?node-id=1355-5243) |
| `onboarding.html` | **Onboarding v1 · splash first** — product proof up front, capability choice second. Kept for comparison | same |

Both prototype pages share `styles.css` and `app.js`; the shared script takes the first `.screen` in the document as its entry point, so each page defines its own flow.

Zero dependencies — plain HTML / CSS / JS, no build step. Alva design tokens (`main/m1 #49a3a6`, `text/n9…n3`, `line/l05…l3`), the Delight typeface, and assets exported from Figma.

Navigating between the index and a prototype is a real page navigation, so the browser's own back button and back gesture return you to the index — that is the way back on a phone, where the prototype runs full-screen with no added chrome. On desktop there is an explicit **← All prototypes** control at the bottom left.

## Adding a prototype

1. Drop `your-prototype.html` (plus its own CSS/JS) into this folder.
2. Append one entry to `PROTOTYPES` in `hub.js`:

```js
{
  title: 'Your prototype',
  subtitle: 'One line on what it explores.',
  edited: '2026-08-12',
  href: 'your-prototype.html',
  meta: 'Mobile · 4 screens',   // optional
}
```

The index sorts by `edited` (newest first) and renders the time as `Edited today` / `Edited 3 days ago` / `Edited Aug 12`, the way design tools phrase it. Nothing else needs to change, and a new prototype cannot affect an existing one.

---

# Onboarding v2 · choice first

`01 Start` → `02 Preview` → `03 Choose who Alva reads` → `04 Confirm & generate` → `05 Success (auto-advances ~2s)` → `06 First digest & alerts`

v1 opened on a splash — slogan plus a generic product proof — and asked for the capability choice on screen 02. v2 swaps that: **01** carries identity, the five capabilities and log in; **02** shows what the chosen capability will actually deliver.

Two things get better. The proof becomes *specific*: v1 showed everyone a screener even if they wanted portfolio monitoring, and generic proof is weak proof. And the first tap now carries a real decision instead of a content-free `Get started`. Note that the screen count is unchanged — one screen merged, one added — so this is a reordering, not a shortening.

**02 is an expectation contract, not a value pitch.** Once someone has picked a capability they are already sold; a marketing interstitial after commitment is a speed bump. So 02 answers three questions instead: what this looks like when it runs (the real report component from screen 06, so the promise is literally the artifact that gets delivered), the one thing Alva needs from you, and when the first one arrives. That also explains *why* screen 03 asks for sources, so the person arrives there with a reason rather than a form. As a bonus the flow gains a reconsideration point — in v1 you committed to a task and immediately hit source selection with no chance to see what you had signed up for.

Fitting identity + five options + log in on one screen meant cutting, not shrinking: each capability row drops its inline action link (`Choose sources →`), since the row *is* the action and 02 states the next step properly — that took the rows from ~100px to ~74px. Log in is pinned to the bottom behind a hairline, in lighter weight with only the verb in brand colour, so it reads as an independent path rather than a sixth capability. The slogan collapses into a compact teal band. Nothing scrolls on either screen at 393×852.

# Onboarding v1 · splash first

`01 Welcome` → `02 Choose your first task` → `03 Choose who Alva reads` → `04 Confirm & generate` → `05 Success (auto-advances ~2s)` → `06 First digest & alerts`

## Motion semantics — shared by both versions

Every transition maps to what is actually happening, following Apple's system motion language:

| Moment | Motion | Why |
| --- | --- | --- |
| Drill deeper (Get started, task row, Next, Skip) | Navigation **push**: incoming slides from the right; outgoing parallaxes −30% under a dim layer (`cubic-bezier(0.32, 0.72, 0, 1)`, 500 ms) | Spatial travel deeper into a hierarchy |
| Go back (back button, `←`/`Esc`) | Navigation **pop** — exact reverse | Returning along the same spatial path |
| Edge-swipe back | Finger-tracked interactive pop, cancellable below 32% progress; a press that never moves is treated as a tap so edge-zone controls still work | UIScreenEdgePanGesture behavior |
| Confirm & Generate → Success | **Cross-dissolve** with a slight settle (no push) | A commit is a state change, not spatial travel — and there is nothing to swipe back to |
| Success → First digest | Cross-dissolve + **navigation stack reset** | Onboarding is dismissed; you cannot navigate back into a completed flow |
| Alert-time / language pickers | Bottom sheet with a soft spring, drag-to-dismiss, tap-outside-to-cancel; selection shows its checkmark before the sheet closes | Transient choice presented modally |
| Next CTA on Sources | Slides up from the bottom edge on first selection | A new affordance enters from the edge it belongs to |
| Out-of-scope taps | Toast HUD dropping from below the Dynamic Island | Transient, non-blocking status |

System chrome — the status bar and the home indicator — is global and fixed. It sits above every screen, never travels during a push/pop, and never animates, because it belongs to the OS rather than to any screen. Inside a screen only one region scrolls: the top bar and the bottom bar hold still while titles, search fields and lists scroll past them, and the top bar grows a hairline divider the moment content passes underneath it (iOS scroll-edge effect).

A transition's completion is armed independently of `requestAnimationFrame`, so a throttled frame can never leave the app wedged mid-navigation. `prefers-reduced-motion` collapses everything above to instant transitions.

## Interaction spec, per screen

**v2 · 01 Start** — the FinTwit row pushes to the preview; the other four rows are rendered as designed but inert until their flows are built. No `Skip`: the choice *is* the screen, and log in is the alternative path.

**v2 · 02 Preview** — a read-only artifact plus the three-part contract, with `Choose sources` carrying you forward and back returning you to the choice.

**v1 · 01 Welcome** — `Get started` pushes into the flow. `Log in` is outside the demo and says so via toast. The product-proof phone is a full HTML/CSS reconstruction (chat, screener table), not a bitmap, and carries the hero's drop shadow so its white body never merges into the white section below.

**v1 · 02 Choose your first task** — the FinTwit row (`Track FinTwit, news & technicals` → `Choose sources`) is the one wired into the following steps. The other four routes are rendered exactly as designed but stay inert until their own flows are built. `Skip` = accept the default task and continue.

**03 · Choose who Alva reads** (both versions) — every avatar is a true circle, presets rendered as 2×2 collages; the selected badge is the square exported asset. The search field really filters (name, handle, or group; empty state echoes your query). Tapping a card toggles selection with a springy checkmark; the `Next` CTA slides up with the first selection and retreats if you clear it. Selection state survives navigation — remove a chip on 04 and come back, the grid agrees. `Skip` = continue with the production default source set.

**04 · Confirm your digest** (both versions) — chips mirror your selection (or the Figma default set of 13 when skipped); removing one animates out and syncs back to screen 03. Removing *all* chips reveals an explanatory empty state and disables the CTA (tapping it then tells you why instead of failing silently). Alert time and language open bottom-sheet pickers.

**05 · Success** (both versions) — transient and celebratory. The icon's spring pop and the copy's rise are armed *before* the cross-dissolve begins, so the screen has exactly one entrance rather than appearing, resetting and animating again. Auto-advances after ~2.1 s; no back gesture, by design.

**06 · First digest & alerts** (both versions) — the destination. Telegram / Discord / WhatsApp simulate a connect: pressed → `Connecting…` → outlined `Connected` state plus a confirmation toast. Everything else visible but out of scope (tabs, menu, settings, full report, chatbox) answers with an explanatory toast rather than dead silence. The nav stack was reset on arrival, so the completed onboarding is unreachable.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

Built with Claude from the Figma designs. Motion & flow prototypes, not production code.
