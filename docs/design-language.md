# Design language

Status: proposed, 2026-11-01. Values come from Mental Models (`src/styles/global.css`, `src/lib/sketch.ts`, `src/lib/riso.ts`, `src/layouts/Base.astro`) unless marked new. Phase 0 turns them into tokens.

Patina is **printed matter that has been handled**: a field notebook with riso prints pasted in, notes in the margin and a few marks of use. It reads as a well-made reference book, never as an app template: typography and paper first, a typeset list before a grid of identical boxes, and art that is printed rather than illustrated.

## Paper

The page is a sheet of warm stock with grain and faint mottling. Cards are a lighter sheet of the same stock laid on top.

| Token | Day | Night | Role |
| --- | --- | --- | --- |
| `--paper` | `#d9d4c9` | `#1f1c17` | Page |
| `--paper-2` | `#d0c9bc` | `#27231d` | Recessed areas, wells |
| `--paper-3` | `#c5bdae` | `#312c24` | Pressed and selected fills |
| `--card` | `#e6e2d9` | `#25211b` | Raised sheet |
| `--rule` | `#b5ac9c` | `#4a4235` | Decorative dashed rules |
| `--line` | `#36312a` | `#d9ccb2` | Pen lines, control borders |

The texture sits under a **veil**: a translucent wash of the paper colour over the scan, so the stock reads as colour first and grain second. One sheet of texture is pinned behind the page (`body::before`, `background-size: cover`) so it never tiles or seams; cards reuse it at a fixed tile size under a lighter veil. Night paper uses a heavier dark veil.

New: paper **stocks** as a theme choice, each a generated texture plus its veil and token set. Proposed: *Field* (the Mental Models stock), *Newsprint* (cool grey, soft black and red), *Kraft* (brown, cream ink), *Graph* (cream with a faint printed grid), *Blueprint* (night only, cyan line ink). Generation is planned in [Seeded variation](seeded-variation.md#paper-stocks-and-patina).

## Inks

Riso prints in drums: one ink per pass, overprinted with `multiply` (with `screen` on night paper), slightly out of register.

| Drum | Day | Night |
| --- | --- | --- |
| `--blue` | `#2c6db3` | `#74a9e6` |
| `--violet` | `#2f2a74` | `#a9a2f0` |
| `--pink` | `#e0508f` | `#f283b6` |
| `--green` | `#2b8a5d` | `#6cc596` |
| `--orange` | `#e06a2e` | `#f29a62` |
| `--yellow` | `#f2cf3c` | `#d9b73d` |

Reading inks: `--ink` (`#26231e` / `#ece3cf`), `--ink-2` (`#4f4940` / `#bdb19b`), `--ink-3` (`#7b7366` / `#8d826f`).

A context accent `--k` lets one region print in one drum (Mental Models assigns a drum per kind of idea). In Patina, `--k` maps to the shadcn `primary` role by default and any subtree can re-ink itself with `data-ink="pink"`.

### Print inks and text inks

Measured contrast on flat day paper (`#d9d4c9`), before texture:

| Ink | On paper | On card | As text |
| --- | --- | --- | --- |
| `--ink` | 10.6 | 12.1 | yes |
| `--ink-2` | 6.0 | 6.9 | yes |
| `--ink-3` | 3.2 | 3.6 | no |
| `--violet` | 8.3 | 9.5 | yes |
| `--blue` | 3.6 | 4.1 | no |
| `--green` | 2.9 | 3.3 | no |
| `--pink` | 2.5 | 2.8 | no |
| `--orange` | 2.3 | 2.6 | no |

On night paper every ink passes on paper; `--ink-3` reaches 4.5 on paper but only 4.2 on card.

So Patina splits two roles:

- **Print inks** (the drums above) fill shapes, highlights, washes, tape and art. Where a mark carries meaning (a checkbox tick, a focus ring, a chart line), it meets 3:1 against its background.
- **Text inks** (`--pink-text`, `--blue-text`, `--green-text`, `--orange-text`, `--ink-3` replaced) are darker mixes toward `--ink` that read at 4.5:1 or better on paper and card. Starting candidates from mixing each drum toward `--ink` until it passes on day paper: ink-3 `#615a50`, blue `#2b5d92`, pink `#923d60`, green `#296647`, orange `#8a4927`. Phase 0 confirms them against the darkest region of each texture and both sheets, targeting 4.8:1 for body text.

Mental Models prints its handwriting and focus outline in `--k`; Patina prints handwriting in the text ink of the accent and the focus ring in a variant that meets 3:1.

### Ink sets

A theme chooses an ink set: which drums exist and which one is the accent. Proposed sets: *Field* (blue, violet, pink, green, orange, yellow), *Fluoro* (fluorescent pink, blue, sunflower), *Earth* (brown, teal, mustard), *Spot* (black plus one accent), *Night* (the night drums). Prints, charts and avatars draw from the active set, so a theme change re-inks everything.

## Type voices

Three voices, each with one job.

| Voice | Face | Job | Treatment |
| --- | --- | --- | --- |
| Read | Source Serif 4 (variable, optical size) | Body, headings, interface text | Body 1.125 rem / 1.7; headings 600, tight leading, balanced wrap |
| Label | JetBrains Mono | Metadata, buttons, kickers, numbers | 0.72 rem, 500–600, uppercase, 0.06–0.08 em tracking |
| Annotate | Caveat | Margin notes, callouts, hand labels | 600, line-height 1.05–1.1, 1.2 rem or larger, slight rotation |

Scale from Mental Models: `--step-0` 1.125 rem, `--step-1` 1.35 rem, `--step-3` `clamp(2.4rem, 1.6rem + 3vw, 3.75rem)`, measure 40 rem. Phase 0 completes the scale and spacing with a `golden-ratio-ux` audit, adding steps for dense application text (0.875–1 rem) that Mental Models never needed.

New: an optional interface sans (Instrument Sans) for dense application screens such as tables and settings, selected by theme. The serif stays the default.

## Marks

Marks are what the hand adds to the page. Each has a meaning, so readers learn them.

| Mark | Meaning | Implementation in Mental Models |
| --- | --- | --- |
| Highlight | This phrase matters | Slanted gradient stroke behind text (`.hl`), clone-decorated across lines |
| Hand underline | A heading or term, emphasized | SVG mask of two loose strokes (`.u-hand`) |
| Sketch frame | A drawn box around a group | Two pseudo-element borders through displacement filters (`.sketch`) |
| Wash | This area belongs to the accent | Blob of accent behind content through a watercolour filter (`.wash`) |
| Tape | Pinned to the page | Translucent strip with torn ends, `multiply` (`.tape`) |
| Margin note | An aside from the reader | Caveat in the gutter with a drawn arrow (`MarginNote`) |
| Ringed number | Step or reason N | rough.js circle around a numeral |
| Drawn box and tick | A checklist the reader can tick | rough.js square plus check curve |
| Arrow, bang, hook bullets | Do this; caution; nuance | Small rough.js glyphs per list kind |
| Circled verdict | The current position on a scale | rough.js ellipse around one label (`EvidenceScale`) |
| Rough rule | Section boundary | Border through a displacement filter |

New marks: circle-around (hugs a word or number), strike, bracket, asterisk, stamp (rubber-stamp label), annotation (handwritten callout with a leader to a target), postmark.

## Surfaces and shape

- **Corners** are slightly irregular (`border-radius: 3px 5px 4px 3px`), never a uniform radius.
- **Shadows** are paper on paper: a 1 px contact shadow plus a long soft drop (`0 1px 1px rgb(60 40 10 / .08), 0 14px 28px -18px rgb(60 40 10 / .4)`).
- **Tilt**: index cards rotate up to ±0.8° from their seed and straighten on hover while lifting 3 px. Operated controls never tilt.
- **Header and footer rules** are pen lines through a displacement filter; the sticky header carries the paper texture with `background-attachment: fixed`, so it matches the page behind it.

## Focus and states

- Focus: 2 px dashed outline, 4 px offset, in an ink that meets 3:1 on the surface.
- Hover on links and rows: a highlighter stroke or an underline that firms up from 55 % to full accent.
- Pressed: a 1 px sink. Selected: a `--paper-3` fill plus a drawn mark (tick, ring or underline), never colour alone.
- Disabled: dashed pencil outline and `--ink-3`-level text, still legible.
- Invalid: a text-ink red message under the field plus a drawn underline on the field.

## Motion

Quiet and physical: cards straighten and lift (220 ms ease), a pattern print's accent orbits (60 s linear), marks can draw on, and a print can "pull" its drums in sequence on first view. `prefers-reduced-motion` stops all of it, and motion never carries the only explanation of a state change.

## Iconography

Lucide for interface actions and objects, so icons stay crisp and familiar at 16 px. A hand-drawn glyph set (rough.js, seeded) for decorative and semantic marks, such as the four kind glyphs in Mental Models. Roughening Lucide paths through rough.js is a Phase 1 experiment, kept only if it stays legible at 16 px.

## Night paper

Night is a dark stock, not an inverted page: warm near-black paper, cream ink, brighter drums, `screen` blending for prints and lower highlight and wash alpha (30 % and 18 % instead of 48 % and 26 %). Tape loses its `multiply` and drops to 60 % opacity.
