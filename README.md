# Alva · FinTwit Onboarding Demo

An interactive demo of Alva's mobile onboarding flow (FinTwit Digest path), built from the Figma production spec:
[Onboarding · Production v4 · FinTwit path](https://www.figma.com/design/A4jIwN4EMWr0fJVVGmCIsr/Mobile?node-id=1355-5243).

### ▶︎ [Open the live demo](https://robertlee8888.github.io/alva-onboarding-demo/)

<https://robertlee8888.github.io/alva-onboarding-demo/> — click and interact with it right away. On desktop it runs inside a phone mockup; on a phone it fills the screen.

## Flow

`01 Welcome` → `02 Choose your first task` → `03 Choose who Alva reads` → `04 Confirm & generate` → `05 Success (auto-advances ~2s)` → `06 First digest & alerts`

Zero dependencies — plain HTML / CSS / JS, no build step. On wide viewports the app renders inside an iPhone-style frame scaled to fit; on phone-sized viewports it goes fullscreen. Uses Alva design tokens (`main/m1 #49a3a6`, `text/n9…n3`, `line/l05…l3`), the Delight typeface, and assets exported from the Figma file.

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

`prefers-reduced-motion` collapses all of the above to instant transitions.

## Interaction spec, per screen

**01 · Welcome** — `Get started` pushes into the flow. `Log in` is outside the demo and says so via toast. The product-proof phone is a full HTML/CSS reconstruction (chat, screener table), not a bitmap.

**02 · Choose your first task** — the FinTwit row enters setup. The other four routes exist in production but not in this demo: tapping them explains that via toast and pulses the FinTwit row to guide the eye. `Skip` = accept the default task and continue.

**03 · Choose who Alva reads** — the search field really filters (name, handle, or group; empty state echoes your query). Tapping a card toggles selection with a springy checkmark; the `Next` CTA slides up with the first selection and retreats if you clear it. Selection state survives navigation — remove a chip on 04 and come back, the grid agrees. `Skip` = continue with the production default source set.

**04 · Confirm your digest** — chips mirror your selection (or the Figma default set of 13 when skipped); removing one animates out and syncs back to screen 03. Removing *all* chips reveals an explanatory empty state and disables the CTA (tapping it then tells you why instead of failing silently). Alert time and language open bottom-sheet pickers.

**05 · Success** — transient, celebratory (spring pop + rise), auto-advances after ~2.1 s. No back gesture, by design.

**06 · First digest & alerts** — the destination. Telegram / Discord / WhatsApp simulate a connect: pressed → `Connecting…` → outlined `Connected` state plus a confirmation toast. Everything else visible but out of scope (tabs, menu, settings, full report, chatbox) answers with an explanatory toast rather than dead silence. The nav stack was reset on arrival, so the completed onboarding is unreachable.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

Built with Claude from the Figma design. A motion & flow prototype, not production code.
