# Quality contract

Status: acceptance criteria, 2026-11-01. Only the token-level contrast rows are checked so far (`npm run check:contrast`, Phase 0); nothing else below is a claim of conformance. [AGENTS.md](../AGENTS.md#verification-and-testing) owns how each change is checked; this document owns what "good" means for the shipped kit and site.

Target: WCAG 2.2 AA for every component and every shipped workflow, in both themes, at both variation levels and every patina level.

## Decoration and accessibility

Patina's decoration (texture, grain, wobble, tilt, misregistration, handwriting) is where an ordinary accessible shadcn component could become an inaccessible one. These rules keep it from happening:

| Area               | Acceptance                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text contrast      | Every text pair reaches 4.5:1 (3:1 for large text), measured against the darkest and lightest 1 % of the textured surface it sits on (blurred to about a glyph), on paper and card, every stock, day and night, handled and worn. `npm run check:contrast` checks every token pair. Text uses text inks only ([Design language](design-language.md#print-text-and-hand-inks)) |
| Meaningful marks   | Focus rings, ticks, radio dots, switch states, chart lines and control borders reach 3:1 against their background                                                                                                                                                                                                                                                             |
| Color alone        | Selection, status and chart series also differ by a drawn mark, a label or a hatch pattern                                                                                                                                                                                                                                                                                    |
| Handwriting        | Caveat at weight 700 and 22.9 px or larger (large bold text, so hand inks need 3:1), for asides; information a person needs also exists in a reading voice or an accessible name. Informative margin notes and annotations stay in the accessibility tree; purely decorative ones are hidden                                                                                  |
| Tilt               | Operated controls never rotate. Rotated surfaces stay within ±2.5° and their text remains selectable and searchable                                                                                                                                                                                                                                                           |
| Decorative art     | Prints, tape, washes and age marks are `aria-hidden` unless a print has a `title`                                                                                                                                                                                                                                                                                             |
| Forced colors      | Textures, grain, washes and misregistration disappear; real borders and system colors take over; focus remains visible                                                                                                                                                                                                                                                        |
| Reduced motion     | No draw-on, pull, orbit, straighten or lift animations; state changes are instant and still clear                                                                                                                                                                                                                                                                             |
| Increased contrast | `prefers-contrast: more` renders the `clean` patina level and solid veils                                                                                                                                                                                                                                                                                                     |
| Targets            | Pointer targets meet 24 × 24 CSS px, including the drawn controls (checkbox, radio, switch thumb)                                                                                                                                                                                                                                                                             |
| Direction          | Arrows, leaders and tilt signs mirror in RTL                                                                                                                                                                                                                                                                                                                                  |

## Interaction

shadcn and Base UI supply keyboard behavior, focus management and dismissal; Patina keeps them intact. Every component's docs page lists its keyboard map. Dialogs move focus inside, contain it and return it to a logical place; menus and listboxes follow their ARIA patterns; feedback appears where the person acted. Groundwork's [quality contract](https://github.com/ossianravn/groundwork/blob/main/docs/quality.md) is the reference for the full interaction criteria, which apply here unchanged.

## Responsive behavior

Content reflows at 320 CSS px without page-wide sideways scrolling. Margin notes, sidenotes and concept maps move inline or become lists on narrow screens. Every Stageshow scene ships a compact design rather than a squeezed one.

## Performance

| Budget                                  | Target                                                                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Core Web Vitals (site, 75th percentile) | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1                                                                                                   |
| Paper stock                             | A generated SVG noise tile per stock, inlined in CSS, about 1 KB                                                                       |
| Prints on static pages                  | Rendered at build time; no JavaScript                                                                                                  |
| Prints in islands                       | Memoized by options; no re-render on unrelated state                                                                                   |
| Displacement filters                    | Only on thin frames and small marks, never on containers larger than a card; repeated rows (tables, long lists) use static rough paths |
| Long lists                              | A 200-row table with Patina styling scrolls without dropped frames on a mid-range laptop                                               |
| Layout stability                        | Prints, covers and images reserve their aspect ratio                                                                                   |
| Kit JavaScript                          | The ink engine and rough.js load only with components that draw at runtime                                                             |

## Definition of done for a component

1. Every state renders on its docs page in day and night, calm and lively, at wide and narrow widths, and it looks right: proportions, alignment and hierarchy, not just absence of overflow.
2. Keyboard and pointer paths work, including any overlay's focus return.
3. Text and mark contrast meet the table above on every stock it supports.
4. Forced colors and reduced motion were looked at once.
5. A `break-ui` pass with worst-case content (long labels, missing values, non-Latin text, huge numbers) left nothing broken.
6. It installs from the registry and its row in the [inventory](components.md) says shipped.

Phase reviews assess complete workflows in the demo product against this contract; a component-level pass does not certify a workflow.
