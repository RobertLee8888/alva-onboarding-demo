# Alva · Design Prototypes

A single-page gallery of interactive design prototypes for Alva. One page, two layouts:

- **Desktop** — the list of prototypes on the left, the selected prototype running on the right, inside an iPhone mockup that scales to fit the window.
- **Phone** — two views. The list, then the prototype full-screen with no mockup and no added chrome, because it is already running on a phone. The system back gesture returns to the list.

### ▶︎ [Open the live prototypes](https://robertlee8888.github.io/alva-onboarding-demo/)

## Contents

| | | Source |
| --- | --- | --- |
| `index.html` · `shell.css` · `shell.js` | **The shell** — the list, the stage, the phone mockup, and hash routing | — |
| `alpha-radar.html` · `alpha-radar.css` · `alpha-radar.js` | **Alpha Radar mobile onboarding** — source selection, radar setup, login, and building states across 8 screens. On the three source-selection screens a collection card opens a member bottom sheet | [Alpha Radar onboarding](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=13241-205457) · [Collection member sheet](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=14144-48781) |
| `onboarding.html` · `styles.css` · `app.js` | **Immersive onboarding** — FinTwit Digest path, 6 screens | [Onboarding · Production v4 · FinTwit path](https://www.figma.com/design/A4jIwN4EMWr0fJVVGmCIsr/Mobile?node-id=1355-5243) |

Zero dependencies — plain HTML / CSS / JS, no build step. Alva design tokens (`main/m1 #49a3a6`, `text/n9…n3`, `line/l05…l3`), the Delight typeface, and assets exported from Figma.

## Alpha Radar — the 2026-08-18 design round

Everything below applies to the three source-selection screens (FinTwit accounts, key figures, podcasts) and the Ready screen.

### One collection per screen, and a split read-out

Each screen now carries **one** collection card, not two — `Most Followed 50` is gone. The selection read-out **names the collection and counts the individuals**, joined with a plus:

The selection-screen footer says it in words (Regular/12, centred, `text/n5`):

| | |
| --- | --- |
| Collection only — **the default** | `Win Rate Top 50 selected` |
| Both | `Win Rate Top 50 + 12 FinTwits selected` |
| Individuals only | `12 FinTwits selected` |
| Nothing | `0 FinTwits selected` |

The individuals on the first screen are counted as **FinTwits**, not accounts. The screen's own title, description and the collection's `50 accounts` meta still say "account" — that is what the design file has, so it is what the demo has.

Naming the collection instead of adding its 50 also settles the old double-counting question: someone who is both a collection member and checked in the grid is counted once, as an individual, never twice.

**Skip is a permanent fixture in the top right** of all three source steps, selected or not; only the editing pass hides it, because Confirm is the exit from that. An empty page reads as a count — `0 FinTwits selected` — rather than an instruction, since Skip is right there as the way out.

**Each picker opens with only its collection card checked.** The curated collection is the default; every individual is the user's own addition, so the `+ N accounts` half of the read-out counts what they actually did rather than a number the demo pre-filled. The design file's `12 accounts` / `8 key figures` / `5 podcasts` are therefore a demo state you reach by checking people, not the state the screen opens in.

The design file adds filler cards so no grid row is left holding two stretched cards. That is an artifact of Figma auto-layout, where the cards are FILL children — this grid is `repeat(3, minmax(0, 1fr))`, so a short last row keeps its column width and no filler is needed.

### Ready screen row is composed, not labelled

On the Ready screen the plus moved out of the sentence and into the row ([13223:47199](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=13223-47199)). The row is `collection collage avatar` · `+` · `individuals' avatar stack` · `count` · pencil — gap 8, 24px content, 56 tall — so the collection is carried by its avatar and the words are only the count. Straight out of onboarding, with only the collections checked, each row is the collage plus the collection's name; the plus and the stack appear as soon as you add people.

Both avatar groups are live: the collage is the collection's own four images, and the stack is the first four individuals you actually picked, in the order the list holds them, so the row keeps up as you edit.

The whole row opens its picker — the pencil is a cue, not the target — and it has row-sized press feedback to say so, painted by a layer that reaches the card's inner edges and takes no space so nothing shifts on press. The pencil renders `alpha-edit.svg` at the glyph's own 11.63 × 12.07 with the design's 16px icon box expressed as the margins either side; forcing the glyph itself to 16×16 blew it up 37% and stretched it unevenly, since that asset carries `preserveAspectRatio="none"`.

The file draws two of the four states. The one-sided ones are inferred, on the rule that the words say whatever the avatars cannot — with a collection alone the words become its name, with individuals alone they stay the count. Note that "collection alone" is now the opening state, so it is on screen more than the file's drawn one.

### Ready screen empty row

A category with nothing selected stops being a row-with-an-action and becomes the action ([14159:48746](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=14159-48746)): the grey label and the pencil both go, and one centred text button carries the row — `＋ Add podcasts`, Medium/12 in `main/m1`, `add-l1` at 16px, gap 8, no fill and no pill. 16 + 20 + 16 makes it 52 tall, a little tighter than the 56 of a filled row. Tapping anywhere in the row still opens that picker.

Reaching that state needed a rule the design file does not state. Walking **forward**, a step still requires at least one source, as before — a radar that reads nothing is not a radar. But coming back from Ready via the pencil, **Confirm accepts whatever you chose, including nothing**: clearing a category is a legitimate edit, and it is the only path to the empty row that does not change what Skip means.

### Collection member sheet

Tapping now works by card type:

- **Single card** — whole card = select / deselect, unchanged.
- **Collection card** (the 2×2 collage) — whole card = open a **member bottom sheet**; it no longer toggles.

The sheet follows the finalized frames ([⑥ unselected](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=14144-48617) / [⑦ selected](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=14144-48781)): scrim over the app (never over the status bar or home indicator), sheet from y 106 with a grabber, **close on the left** of the header next to the title, and the collection's inclusion rule ("Highest prediction win rate over the past 90 days · Updated 3 hours ago") as the first line of the scroll area — Regular/14 in `text/n7` — so it scrolls away with the list. Members render as the page grid's own 3-up card molecule and are read-only — the collection is atomic, so the only action is the floating dual-state button: **Follow all** (primary) ⇄ **Following** — white body, a 0.5px `main/m3` hairline, a `main/m3` label and a filled `check-f2`, per [14157:212995](https://www.figma.com/design/DJ9Acp13FruTilsTdrE0id/Draft?node-id=14144-48781). The hairline is an inset shadow rather than a border so the button stays exactly 48 tall. It toggles in place and the card's checkmark and the selection count behind the scrim stay in sync live; the sheet itself stays put, so you can read the list after deciding. Dismissing is the ✕, the scrim or Esc — never the button.

The sheet's button sits at the same height as every other screen's bottom button (34px home indicator + 16px). Its shadow used to be cut off at a hard line 34px up — not by the sheet, but by the home indicator, which was an opaque white bar sitting above it (z 25 vs 18). That bar has no fill now: every screen already pads its scroll area 34 + 92 off the bottom, so nothing passes behind that band, and the surface underneath is white anyway.

Dismissal is the entrance played backwards. `visibility` cannot tween, so it is held for the 0.38s of the slide — otherwise dropping the `open` class hides the sheet on the spot and the exit animation never runs. The easing is the *mirror* of the entrance curve (`cubic-bezier(1, 0, .68, .28)` against `cubic-bezier(0.32, .72, 0, 1)`): reusing the entrance's ease-out on the way out put 92% of the travel in the first 37% of the time, which read as a snap rather than a reversal.

In the demo, members are drawn from the screen's own account list (Win Rate Top 50 really is the 50 highest win rates), rather than the design file's placeholder loop of 7 mock accounts.

**Still open** (carried over from the design file): the file's per-screen individual counts (12 / 8 / 5) no longer describe a default, since the pickers open with the collection alone.

## How the single page holds together

Each prototype runs in its own `<iframe>`, and the shell mounts exactly one at a time.

That is deliberate, not a shortcut. The prototypes are full-screen apps that own their document: they set `body { overflow: hidden }`, position themselves `fixed`, and both use the same class names (`.screen`, `.toast`, `.sheet`, `.phone`) and the same element ids. Loading two of them into one document would have them overwrite each other. Giving each its own document means a new prototype can never break an existing one, and each stays openable on its own URL.

**The iframe is laid out at exactly 393 × 852 — one phone screen.** So the prototype always sees a real phone viewport: its own `vh`, its own media queries, its own full-screen mode. The iPhone bezel around it on desktop is drawn by the shell, outside the iframe, and only the bezel is scaled to fit the window — never above 1:1. Inside the iframe the prototype is always in its bare full-screen mode, which is why the phone layout needed nothing removed: there was never a mockup inside it to remove.

**Routing is the hash.**

| URL | |
| --- | --- |
| `#/` | the list |
| `#/alpha-radar` | that prototype, running |

On desktop both halves are on screen at once, so `#/` resolves immediately to the newest prototype — a blank right half is never a useful state, and the redirect uses `replaceState` so it does not become a history entry the user has to press back through. On a phone the two views are separate and each selection is a real history entry, so the browser's own back gesture is the way back and the page does not need to invent a back button.

Selecting a prototype mounts a **fresh** iframe element rather than reassigning `src` on an existing one: setting `src` before the node enters the document adds no history entry, so back keeps meaning "back to the list" instead of stepping through prototypes the user never chose. It also gives a guaranteed clean reset, which is what **Restart** uses. Returning to the list on a phone unmounts the iframe, so a prototype's timers and animation loops do not keep running behind it — and coming back gives a fresh flow rather than a half-finished one.

## Adding a prototype

1. Drop `your-prototype.html` (plus its own CSS/JS) into this folder.
2. Give it the two lines every prototype needs, so it renders bare inside the shell and keeps its mockup when opened directly:

   In `<head>`, **before** the stylesheet:

   ```html
   <script>if (window.self !== window.top) document.documentElement.classList.add('embedded');</script>
   ```

   And in its CSS — copy the `html.embedded` block from `alpha-radar.css`.
3. Append one entry to `PROTOTYPES` in `shell.js`:

```js
{
  title: 'Your prototype',
  subtitle: 'One line on what it explores.',
  edited: '2026-08-18',
  href: 'your-prototype.html',
  meta: 'Mobile · 4 screens',                        // optional
  figma: { label: 'Frame name', url: 'https://…' },  // optional
}
```

The route slug is derived from `href`, so `your-prototype.html` is reachable at `#/your-prototype`. The list sorts by `edited` (newest first) and renders the time as `Edited today` / `Edited 3 days ago` / `Edited Aug 12`, the way design tools phrase it. Nothing else needs to change.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

# Immersive onboarding

`01 Welcome` → `02 Choose your first task` → `03 Choose who Alva reads` → `04 Confirm & generate` → `05 Success (auto-advances ~2s)` → `06 First digest & alerts`

## Motion semantics

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

**01 · Welcome** — `Get started` pushes into the flow. `Log in` is outside the demo and says so via toast. The product-proof phone is a full HTML/CSS reconstruction (chat, screener table), not a bitmap, and carries the hero's drop shadow so its white body never merges into the white section below.

**02 · Choose your first task** — the FinTwit row (`Track FinTwit, news & technicals` → `Choose sources`) is the one wired into the following steps. The other four routes are rendered exactly as designed but stay inert until their own flows are built. `Skip` = accept the default task and continue.

**03 · Choose who Alva reads** — every avatar is a true circle, presets rendered as 2×2 collages; the selected badge is the square exported asset. The search field really filters (name, handle, or group; empty state echoes your query). Tapping a card toggles selection with a springy checkmark; the `Next` CTA slides up with the first selection and retreats if you clear it. Selection state survives navigation — remove a chip on 04 and come back, the grid agrees. `Skip` = continue with the production default source set.

**04 · Confirm your digest** — chips mirror your selection (or the Figma default set of 13 when skipped); removing one animates out and syncs back to screen 03. Removing *all* chips reveals an explanatory empty state and disables the CTA (tapping it then tells you why instead of failing silently). Alert time and language open bottom-sheet pickers.

**05 · Success** — transient and celebratory. The icon's spring pop and the copy's rise are armed *before* the cross-dissolve begins, so the screen has exactly one entrance rather than appearing, resetting and animating again. Auto-advances after ~2.1 s; no back gesture, by design.

**06 · First digest & alerts** — the destination. Telegram / Discord / WhatsApp simulate a connect: pressed → `Connecting…` → outlined `Connected` state plus a confirmation toast. Everything else visible but out of scope (tabs, menu, settings, full report, chatbox) answers with an explanatory toast rather than dead silence. The nav stack was reset on arrival, so the completed onboarding is unreachable.

---

Built with Claude from the Figma designs. Motion & flow prototypes, not production code.
