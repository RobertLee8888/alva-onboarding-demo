# Alva · FinTwit Onboarding Demo

An interactive demo of Alva's mobile onboarding flow (FinTwit Digest path), built from the Figma production spec:
[Onboarding · Production v4 · FinTwit path](https://www.figma.com/design/A4jIwN4EMWr0fJVVGmCIsr/Mobile?node-id=1355-5243).

**Live demo:** enable GitHub Pages on this repo (Settings → Pages → main / root), or just open `index.html`.

## Flow

`01 Welcome` → `02 Choose your first task` → `03 Choose who Alva reads` → `04 Confirm & generate` → `05 Success (auto-advances ~2s)` → `06 First digest & alerts`

## What's inside

- **Zero dependencies** — plain HTML / CSS / JS, no build step.
- **Native-feeling navigation** — iOS-style push/pop transitions (`cubic-bezier(0.32, 0.72, 0, 1)`, parallax + dim on the outgoing screen), interactive edge-swipe back gesture (drag from the left edge, works with mouse and touch), an auto-advancing success screen with a crossfade into the destination, and iOS-style bottom-sheet pickers for alert time / digest language.
- **Desktop mockup** — on wide viewports the app renders inside an iPhone-style frame (dynamic island, side buttons, titanium bezel) scaled to fit; on phone-sized viewports it goes fullscreen.
- **Real design tokens & type** — Alva color tokens (`main/m1 #49a3a6`, `text/n9…n3`, `line/l05…l3`) and the Delight typeface, with assets exported from the Figma file.

## Interactions to try

- Tap any task row on screen 02 to enter the FinTwit setup path.
- Select sources on screen 03 — the Next CTA slides up after your first pick; selections become removable chips on screen 04.
- Swipe from the left edge (or press `←` / `Esc`) to go back anywhere.
- Skip on screen 03 seeds screen 04 with the production default source set.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

Built with Claude from the Figma design. Not production code — a motion & flow prototype.
