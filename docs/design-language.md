# Design language

Status: Phase 2 language, 2026-11-01 (`src/patina/styles/`). Patina started from Mental Models' "field notes" and has grown its own palette, paper and shapes; the Field stock and ink set keep the original look as an option. Parts marked planned are not built yet.

Patina is **printed matter that has been handled**: cut paper, overprinted ink, tickets, receipts and notes pasted into a field notebook, ageing the longer they are used. It reads as a well-made object, never as an app template: paper and typography first, a typeset list before a grid of identical boxes, and art that is printed or cut rather than illustrated.

## Paper

The default stock is **Archive**: a warm ivory that has been in a drawer for a while. Cards are a lighter sheet of the same stock laid on top.

| Token       | Day       | Night     | Role                       |
| ----------- | --------- | --------- | -------------------------- |
| `--paper`   | `#e7dfcc` | `#191b19` | Page                       |
| `--paper-2` | `#ddd3be` | `#202320` | Recessed areas, wells      |
| `--paper-3` | `#cfc4ab` | `#2a2e2a` | Pressed and selected fills |
| `--card`    | `#f2ebdb` | `#1f2220` | Raised sheet               |
| `--rule`    | `#c4b79d` | `#3c423c` | Decorative dashed rules    |
| `--line`    | `#2f2a22` | `#d8d2c2` | Pen lines, control borders |

Night Archive is oxidised bronze rather than brown.

The paper is **layered and generated** (`tools/paper/`), six seamless SVG tiles stacked at sizes that share no factors, so the surface never visibly repeats:

| Layer  | Tile    | What it adds                                                                     | Shared           |
| ------ | ------- | -------------------------------------------------------------------------------- | ---------------- |
| tooth  | 353 px  | Fine relief: noise embossed with wrapped edges into highlights and shadows       | every stock      |
| relief | 541 px  | A broader, softer relief                                                         | every stock      |
| fibres | 613 px  | Short curved strands, light and dark, drawn from a seed and wrapped at the edges | every stock      |
| specks | 877 px  | Rare inclusions                                                                  | tinted per stock |
| mottle | 1201 px | Low-frequency clouding                                                           | tinted per stock |
| foxing | 1613 px | Clusters of soft brown spots (worn only)                                         | every stock      |

Neutral layers draw light and dark at low alpha, so one set serves every stock (with a night variant); only mottle and specks carry the stock's tint. The whole stack is about 47 KB of CSS, 6 KB gzipped, all text, so it ships through the registry.

**Stocks** (`data-stock`), each a set of paper, reading-ink and text-ink tokens plus its tinted layers:

- **Archive** (default): warm ivory; bronze at night.
- **Field**: the cool grey stock Patina started from.
- **Newsprint**: cool grey paper, soft black ink.
- Planned: _Kraft_, _Graph_, _Blueprint_.

**Patina** (`data-patina`) is how handled the paper looks, and it is more than texture:

| Level     | Page                          | Sheets (`Paper`)                                                                                               |
| --------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `clean`   | Flat colour                   | Flat colour, no marks                                                                                          |
| `handled` | The layers, faint edge toning | Inner edge toning, a thumb smudge, sometimes a soft fold                                                       |
| `worn`    | Adds foxing and deeper toning | Adds a coffee ring (sometimes, with a second fainter ring), foxing clusters, a deeper crease and a worn corner |

Toning darkens paper towards its edges, the way old paper ages: a fixed vignette on the page, an inset shadow on sheets. `--paper-tone` sets its strength per level. Wear marks are seeded per sheet, so each sheet ages differently and always the same way.

## Surfaces and shapes

Sheets are cut, not boxed. `Paper` (`src/patina/paper/paper.tsx`) takes a seeded **edge** (`deckle`, roughened all round; `torn`, a deep tear along the top; `perforated`, a ticket stub's holes down the left; `pinked`, a receipt's zigzag along the bottom), an optional **dog-ear**, a seeded **tilt** within the variation level, and its **wear**. Its shadow is a drop shadow, so it follows the cut. Card, menu and dialog surfaces use the plain `sheet` and `float-sheet` utilities.

Corners are slightly irregular (`rounded-sheet`: 3/5/4/3 px), never a uniform radius. Shadows are paper on paper: a contact shadow and a long soft drop. Tilt stays within `--tilt-max` (±0.8°), which the calm level sets to 0; operated controls never tilt. Header and footer rules are pen lines through a displacement filter.

## Inks

Prints are made in drums: one ink per pass, overprinted with `multiply` (`screen` on night paper), slightly out of register. Patina's drums take their hues from patina itself, verdigris on copper, with indigo, plum, rose, ochre and oxblood beside them. Names are by hue:

| Drum             | Day       | Night     | Hue       |
| ---------------- | --------- | --------- | --------- |
| `--print-green`  | `#2b8a78` | `#63c2ae` | Verdigris |
| `--print-orange` | `#c2602f` | `#ee915e` | Copper    |
| `--print-blue`   | `#304a8c` | `#8fa8e8` | Indigo    |
| `--print-violet` | `#4a2b5e` | `#b9a0d8` | Plum      |
| `--print-pink`   | `#d9537c` | `#f08aaa` | Rose      |
| `--print-yellow` | `#e2a83a` | `#ecc35e` | Ochre     |
| `--print-red`    | `#9a2f3c` | `#e27a86` | Oxblood   |

The context accent `--k` defaults to verdigris. `data-ink="orange"` re-inks a subtree: `--k` (print), `--k-ink` (text) and `--k-hand` (handwriting) follow, and the region's prints take the drum as their accent. shadcn's `primary` is solid ink, the stamped button, not the accent.

### Print, text and hand inks

Bright drums fail as text on mid-tone paper, and the paper's layers cost every pair another 10–15 %. So each drum comes in three strengths:

- **Print inks** (`--print-<drum>`) fill shapes, highlights, washes, tape and art. Where a mark carries meaning (a tick, a focus ring, a chart line), it meets 3:1.
- **Text inks** (`--ink-<drum>`) are the drum mixed toward the stock's `--ink` until it reads at 4.6:1 on that stock's worst surface; each stock carries its own (`node tools/check-contrast.mjs --suggest` derives them). On Archive: indigo `#2f4785`, rose `#753645`, verdigris `#265146`, copper `#6f3d23`, oxblood `#832b35`; plum passes as it is.
- **Hand inks** (`--hand-<drum>`) are for handwriting, which is set at 700 weight and 22.9 px, large bold text in WCAG's terms, so 3:1 suffices and more of the drum survives. On Archive: verdigris `#296f60`, copper `#9a4f29`, rose `#a4435f`; indigo, plum and oxblood pass as they are.

On night paper the drums themselves pass, so text and hand inks are the drums, except oxblood text, which lightens.

Reading inks on Archive: `--ink` `#221d17` / `#ebe5d6`, `--ink-2` `#4a4237` / `#b9b2a2`, `--ink-3` `#50493d` / `#aaa497`. Textured paper leaves no room for a faint text grey, so `--ink-3` sits close to `--ink-2` and hierarchy comes from size and voice. `--ink-faint` keeps a faint grey for disabled text and decorative markers, both exempt from contrast requirements.

`npm run check:contrast` checks every text, hand and pen ink against every stock, theme and patina level, with the layers composited at their real tile sizes and half the edge toning added; all pairs pass.

### Ink sets

A print's three drums come from its ink set (`data-inks`, or `inks` on `<Print>`): **patina** (default: verdigris line, copper accent, plum detail), **field** (riso blue, pink and violet), **fluoro**, **earth** and **spot** (ink plus the accent). A set re-inks every print beneath it with no re-render.

## Type voices

Three voices, each with one job.

| Voice    | Face                                    | Job                                 | Treatment                                                       |
| -------- | --------------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| Read     | Source Serif 4 (variable, optical size) | Body, headings, interface text      | Body 18 px / 1.76; headings 600, 1.06–1.3, balanced wrap        |
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
| `text-lead`    | 1     | 1.431 rem · 23 px | 1.6     | h3, lead paragraphs, handwriting |
| `text-body`    | 0     | 1.125 rem · 18 px | 1.76    | Reading text (1.66 below 40 rem) |
| `text-ui`      | —     | 1 rem · 16 px     | 1.4     | Controls                         |
| `text-small`   | −1    | 0.884 rem · 14 px | 1.6     | Compact text, metadata           |
| `text-label`   | −2    | 0.695 rem · 11 px | 1.45    | Mono labels                      |

Headings at lead and body size (h3, h4, card, dialog and popover titles, legends) use `leading-subhead`, 1.3.

Spacing is the primary line height (31.7 px) times φ^n, rounded to half pixels: `hair` 7.5 px, `tight` 12 px, `snug` 19.5 px, `line` 31.5 px, `section` 51.5 px, `page` 83 px (Tailwind: `gap-snug`, `py-section` and so on).

Exceptions, each deliberate:

- **Headings are set tight**: 1.06 for the display, 1.15 for title, h1 and h2, which run one to three balanced lines. Smaller headings wrap more often and get 1.3. GRT's tuned leading (1.5–1.7 at these sizes) suits running prose and reads loose on semibold titles.
- **Lead paragraphs drop to body size on phones**: 23 px in a 21 rem column is about 30 characters a line, far under the 24 × `f` floor.
- **`text-ui` is 16 px**, off the scale: the platform's control size, and the size below which iOS zooms focused inputs.
- **Controls are 2.75 rem tall** (2.25 rem compact): touch target and shadcn convention rather than a spacing unit.
- **Phone leading drops to 1.66**: the narrower phone measure differs from desktop by more than 0.1 in GRT's tuned ratio.
- Mental Models' 1.35 rem sub-heading and 0.72 rem labels snap to the nearest steps (1.431 and 0.695 rem); its 3.75 rem hero maximum is step 5 exactly.

### Audit

Run the `golden-ratio-ux` live audit whenever a type or spacing token changes: `measure_live.js` on the home page, the button, field, card and tabs docs, the three Fieldbook screens and the prints page, at 1280 and 375 px, then `grt.py audit --size 18 --width 600 --mu 2.253 --x-ratio 0.709 --x-mode linear`.

The audit of 1 November 2026 raised small text from 1.5 to 1.6, lead paragraphs from 1.55 to 1.6 and mono labels from 1.3 to 1.45, all of which sat below their tuned leading where they wrap. It also added `leading-subhead`, set phone leads at body size and gave the wordmarks their own single-line leading. High findings fell from 147 to 103, and what remains is accepted:

- **Single-line text**: labels, stamps, badges, keycaps, avatar initials, truncated titles and wordmarks. Tuned leading applies to text that wraps.
- **Prose in narrow card columns** (200–410 px) runs at 1.66–1.76 against a tuned 1.5–1.6. The kit ships one body ratio per breakpoint, not one per container, and never goes below 1.5.
- **Caveat at 1.08**: its glyphs sit small in the em, so wrapped notes read as handwriting, not as cramped type.
- **Titles at lead and body size** at 1.3. The script grades text under 1.4 × `f` as prose, so it scores these headings against prose leading.
- **Text inside prints** (monogram letters at 84 and 104 px) is artwork.

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

Night is a dark stock, not an inverted page: Archive turns to oxidised bronze, ink to cream, the drums brighten and prints screen rather than multiply. Highlight and wash alpha drop (30 % and 18 % instead of 48 % and 26 %), tape loses its multiply and drops to 60 % opacity, and the paper layers darken with black relief and a few cream fibres. Toning darkens towards black rather than brown.
