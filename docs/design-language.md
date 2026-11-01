# Design language

Status: Phase 0 tokens built, 2026-11-01 (`src/patina/styles/`). Values come from Mental Models (`src/styles/global.css`, `src/lib/sketch.ts`, `src/lib/riso.ts`, `src/layouts/Base.astro`) unless marked new. Parts marked planned are not built yet.

Patina is **printed matter that has been handled**: a field notebook with riso prints pasted in, notes in the margin and a few marks of use. It reads as a well-made reference book, never as an app template: typography and paper first, a typeset list before a grid of identical boxes, and art that is printed rather than illustrated.

## Paper

The page is a sheet of warm stock with grain and faint mottling. Cards are a lighter sheet of the same stock laid on top.

| Token       | Day       | Night     | Role                       |
| ----------- | --------- | --------- | -------------------------- |
| `--paper`   | `#d9d4c9` | `#1f1c17` | Page                       |
| `--paper-2` | `#d0c9bc` | `#27231d` | Recessed areas, wells      |
| `--paper-3` | `#c5bdae` | `#312c24` | Pressed and selected fills |
| `--card`    | `#e6e2d9` | `#25211b` | Raised sheet               |
| `--rule`    | `#b5ac9c` | `#4a4235` | Decorative dashed rules    |
| `--line`    | `#36312a` | `#d9ccb2` | Pen lines, control borders |

The grain is **generated, not scanned**: each stock is a stack of seeded fractal-noise layers (mottling, fine dark and light grain, rare specks, short fibres) rendered as a 480 px seamless SVG tile and laid over the paper colour (`background-image: var(--paper-texture)`). Each layer's alpha is small, so the stock reads as colour first and grain second; on day Field paper the result matches Mental Models' veiled scan to within two levels of brightness and a similar grain. The tile is about 1 KB of text, which matters because shadcn registry items can carry only text files. Body, header and cards all use the same tile.

**Stocks** are a theme choice (`data-stock`), each a set of paper and reading-ink tokens plus its grain:

- **Field** (built): Mental Models' warm stock.
- **Newsprint** (built): cool grey paper, soft black ink, visible fibres.
- Planned: _Kraft_ (brown, cream ink), _Graph_ (cream with a faint printed grid), _Blueprint_ (night only, cyan line ink).

The **patina level** (`data-patina`) is how handled the paper looks: `clean` is flat colour, `handled` (default) is the grain, `worn` adds stains, light fibres and more specks over it. See [Seeded variation](seeded-variation.md#paper-stocks-and-patina).

## Inks

Riso prints in drums: one ink per pass, overprinted with `multiply` (with `screen` on night paper), slightly out of register.

| Drum             | Day       | Night     |
| ---------------- | --------- | --------- |
| `--print-blue`   | `#2c6db3` | `#74a9e6` |
| `--print-violet` | `#2f2a74` | `#a9a2f0` |
| `--print-pink`   | `#e0508f` | `#f283b6` |
| `--print-green`  | `#2b8a5d` | `#6cc596` |
| `--print-orange` | `#e06a2e` | `#f29a62` |
| `--print-yellow` | `#f2cf3c` | `#d9b73d` |
| `--print-red`    | `#d7442e` | `#f2806a` |

Red is new: shadcn's destructive role needs it.

A context accent `--k` lets one region print in one drum (Mental Models assigns a drum per kind of idea). `data-ink="pink"` re-inks a subtree: `--k` (print), `--k-ink` (text) and `--k-hand` (handwriting) follow, and the region's prints take the drum as their accent. shadcn's `primary` is solid ink, as in Mental Models' stamped buttons, not the accent.

### Print, text and hand inks

The bright drums fail as text on mid-tone paper: on flat day paper pink measures 2.5:1, orange 2.3:1 and Mental Models' `--ink-3` 3.2:1, and the grain lowers every pair by roughly another 10–15 %. So each drum comes in three strengths:

- **Print inks** (`--print-<drum>`) fill shapes, highlights, washes, tape and art. Where a mark carries meaning (a tick, a focus ring, a chart line), it meets 3:1.
- **Text inks** (`--ink-<drum>`) are the drum mixed toward `--ink` until it reads at 4.6:1 on the worst textured surface. They read as riso's deep inks: blue `#2a517a`, pink `#7c3853` (plum), green `#29583e`, orange `#754125` (brown), red `#863527`; violet already passes.
- **Hand inks** (`--hand-<drum>`) are for handwriting, which is set at 700 weight and 22.9 px, large bold text in WCAG's terms, so 3:1 suffices and more of the drum survives: blue `#2c6aad`, pink `#ab436f`, green `#2a7550`, orange `#a25229`, red `#b83e2b`.

On night paper the drums themselves pass, so text and hand inks are the drums.

Reading inks: `--ink` `#26231e` / `#ece3cf`, `--ink-2` `#4f4940` / `#bdb19b`, `--ink-3` `#565147` / `#9b907d`. Textured paper leaves no room for a faint _text_ grey, so `--ink-3` is only slightly lighter than `--ink-2`, and hierarchy comes from size and voice instead. Mental Models' faint grey lives on as `--ink-faint` (`#7b7366` / `#7d7362`), for disabled text and decorative markers only, both exempt from contrast requirements.

Worst case across both stocks, both sheets and the handled and worn levels (`npm run check:contrast`):

| Ink                     | Day     | Night   | Floor |
| ----------------------- | ------- | ------- | ----- |
| `--ink`                 | 9.1     | 11.8    | 4.5   |
| `--ink-2`               | 5.2     | 7.1     | 4.5   |
| `--ink-3`               | 4.6     | 4.8     | 4.5   |
| `--ink-<drum>`          | 4.6–7.0 | 5.7–7.1 | 4.5   |
| `--hand-<drum>`         | 3.2–7.0 | 5.7–7.1 | 3     |
| `--line` (pen, borders) | 7.5     | 9.5     | 3     |

### Ink sets (planned)

A theme chooses an ink set: which drums exist and which one is the accent. Proposed sets: _Field_ (blue, violet, pink, green, orange, yellow, red), _Fluoro_ (fluorescent pink, blue, sunflower), _Earth_ (brown, teal, mustard), _Spot_ (black plus one accent), _Night_ (the night drums). Prints, charts and avatars draw from the active set, so a theme change re-inks everything.

## Type voices

Three voices, each with one job.

| Voice    | Face                                    | Job                                 | Treatment                                                       |
| -------- | --------------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Read     | Source Serif 4 (variable, optical size) | Body, headings, interface text      | Body 18 px / 1.76; headings 600, tight leading, balanced wrap   |
| Label    | JetBrains Mono                          | Metadata, buttons, kickers, numbers | 11.1 px (`label-mono`), 500, uppercase, 0.06 em tracking        |
| Annotate | Caveat                                  | Margin notes, callouts, hand labels | 700, 22.9 px or larger, line-height 1.08, tilted with variation |

Planned: an optional interface sans (Instrument Sans) for dense application screens such as tables and settings, through `--face-ui`. The serif stays the default.

## Type and spacing

Golden Ratio Typography (the `golden-ratio-ux` method), from four parameters:

- **Body size** `f` = 18 px, Mental Models' proven reading size.
- **Measure** `w` = 37.5 rem (600 px): about 75 characters, at GRT's fulcrum of 34 × `f` and inside the 60–75 character rule. Mental Models' 40 rem gave about 80.
- **Source Serif 4**, measured from the font file: character constant μ = 2.25, x-height ratio 0.709.
- **x-height correction**: linear. The full ratio form gives body leading 1.87, which reads loose; no correction gives 1.63.

| Token          | Step  | Size              | Leading | Use                              |
| -------------- | ----- | ----------------- | ------- | -------------------------------- |
| `text-display` | 3 → 5 | 2.315 → 3.746 rem | 1.06    | Hero headline (fluid)            |
| `text-title`   | 4     | 2.945 rem · 47 px | 1.15    | Page titles                      |
| `text-h1`      | 3     | 2.315 rem · 37 px | 1.15    | Headings                         |
| `text-h2`      | 2     | 1.82 rem · 29 px  | 1.15    | Section headings                 |
| `text-lead`    | 1     | 1.431 rem · 23 px | 1.55    | h3, lead paragraphs, handwriting |
| `text-body`    | 0     | 1.125 rem · 18 px | 1.76    | Reading text (1.66 below 40 rem) |
| `text-ui`      | —     | 1 rem · 16 px     | 1.4     | Controls                         |
| `text-small`   | −1    | 0.884 rem · 14 px | 1.5     | Compact text, metadata           |
| `text-label`   | −2    | 0.695 rem · 11 px | 1.3     | Mono labels                      |

Spacing is the primary line height (31.7 px) times φ^n, rounded to half pixels: `hair` 7.5 px, `tight` 12 px, `snug` 19.5 px, `line` 31.5 px, `section` 51.5 px, `page` 83 px (Tailwind: `gap-snug`, `py-section` and so on).

Exceptions, each deliberate:

- **Headings are set tight** (1.06–1.15), and lead paragraphs at 1.55. GRT's tuned leading (1.6–1.7 at these sizes) suits running prose; headings are one to three balanced lines, and a 23 px lead reads loose above 1.6.
- **`text-ui` is 16 px**, off the scale: the platform's control size, and the size below which iOS zooms focused inputs.
- **Controls are 2.75 rem tall** (2.25 rem compact): touch target and shadcn convention rather than a spacing unit.
- **Phone leading drops to 1.66**: the narrower phone measure differs from desktop by more than 0.1 in GRT's tuned ratio.
- Mental Models' 1.35 rem sub-heading and 0.72 rem labels snap to the nearest steps (1.431 and 0.695 rem); its 3.75 rem hero maximum is step 5 exactly.

## Marks

Marks are what the hand adds to the page. Each has a meaning, so readers learn them. Phase 0 ships the first six as Tailwind utilities in `marks.css`; the rest are drawn with the ink engine.

| Mark                      | Meaning                         | Implementation                                                                       |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------------ |
| Highlight                 | This phrase matters             | `highlight` (`highlight-accent` for the drum): slanted gradient, cloned across lines |
| Hand underline            | A heading or term, emphasized   | `hand-underline`: mask of two loose strokes                                          |
| Sketch frame              | A drawn box around a group      | `sketch-frame`: two pseudo-element borders through `--rough-*` filters               |
| Wash                      | This area belongs to the accent | `wash`: blob of accent through the watercolour filter                                |
| Tape                      | Pinned to the page              | `tape`: translucent strip, `multiply`; hidden at the calm level                      |
| Margin note               | An aside from the reader        | `margin-note`: Caveat in the hand ink, tilted by `--tilt-max`                        |
| Rough rule                | Section boundary                | `rough-rule`: a pen line through a displacement filter                               |
| Ringed number             | Step or reason N                | rough.js circle around a numeral                                                     |
| Drawn box and tick        | A checklist the reader can tick | rough.js square plus check curve                                                     |
| Arrow, bang, hook bullets | Do this; caution; nuance        | Small rough.js glyphs per list kind (planned)                                        |
| Circled verdict           | The current position on a scale | rough.js ellipse around one label (planned)                                          |

Planned marks: circle-around (hugs a word or number), strike, bracket, asterisk, stamp (rubber-stamp label), annotation (handwritten callout with a leader to a target), postmark.

## Surfaces and shape

- **Corners** are slightly irregular (`rounded-sheet`: 3px 5px 4px 3px), never a uniform radius.
- **Shadows** are paper on paper: a 1 px contact shadow plus a long soft drop (`shadow-sheet`; `shadow-lift` on hover).
- **Tilt**: index cards rotate up to `--tilt-max` (±0.8°) from their seed; the calm level sets it to 0. Operated controls never tilt.
- **Header and footer rules** are pen lines through a displacement filter. The sticky header carries the same grain tile as the page.

## Focus and states

- Focus: 2 px dashed outline, 4 px offset, in `--k-ink` (4.6:1 or better).
- Hover on links and rows: a highlighter stroke or an underline that firms up from 55 % to full accent.
- Pressed: a 1 px sink. Selected: solid ink with paper text (segmented controls) or a `--paper-3` fill plus a drawn mark (tick, ring or underline), never colour alone.
- Disabled: dashed pencil outline and `--ink-faint` text.
- Invalid: a red text-ink message under the field plus a drawn underline on the field.

## Motion

Quiet and physical: cards straighten and lift (220 ms ease), a pattern print's accent orbits (60 s linear), marks can draw on, and a print can "pull" its drums in sequence on first view. `prefers-reduced-motion` stops all of it, and motion never carries the only explanation of a state change. Phase 0 ships no motion beyond the reduced-motion guard.

## Iconography

Lucide for interface actions and objects, so icons stay crisp and familiar at 16 px. A hand-drawn glyph set (rough.js, seeded) for decorative and semantic marks, such as the four kind glyphs in Mental Models. Roughening Lucide paths through rough.js is a Phase 1 experiment, kept only if it stays legible at 16 px.

## Night paper

Night is a dark stock, not an inverted page: warm near-black paper, cream ink, brighter drums, `screen` blending for prints and lower highlight and wash alpha (30 % and 18 % instead of 48 % and 26 %). Tape loses its `multiply` and drops to 60 % opacity. Night grain darkens with mottling and lightens with a few cream specks.
