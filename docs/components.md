# Component inventory

Status: planned, 2026-11-01. This is the living index of what Patina ships: each row names a component, its Patina treatment, its default variation and its phase. Update a row's status when the component ships; add a row when a workflow needs a new reusable part. Treatments are starting points, refined against the rendered result.

Variation: **calm** components stay quiet at every variation level because people operate them; **lively** components carry seeded tilt, tape or art at the `lively` level. See [Seeded variation](seeded-variation.md#what-varies).

## shadcn parity

The 65 `registry:ui` items in shadcn 4.23.0 (checked 2026-11-01 with `npx shadcn search @shadcn`), keeping their names, parts, props and `data-slot` attributes. Typography is a documentation page in shadcn rather than an item; Patina ships it as an item.

### Actions

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| button | Mono uppercase label (Mental Models `.btn`). Default: solid ink with irregular corners; secondary: `--paper-3` fill; outline: sketch frame; ghost: highlighter swipe on hover; link: hand underline that firms on hover; destructive: solid red text ink | calm | 2 |
| button-group | One shared sketch frame, pen-line dividers | calm | 3 |
| toggle | Pressed: `--paper-3` fill plus a drawn underline | calm | 2 |
| toggle-group | Segmented control; the selected segment gets a drawn ring | calm | 2 |
| kbd | Small keycap in mono with a pen frame | calm | 2 |

### Forms

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| input | Pen-line frame on card stock, low wobble; dashed focus ring; drawn underline when invalid | calm | 2 |
| textarea | As input, plus a `ruled` variant with notebook lines aligned to the text baseline | calm | 2 |
| label | Reading voice; mono kicker variant for compact forms | calm | 2 |
| field | Label, description and error in one column; error in red text ink with a hand-drawn bang | calm | 2 |
| input-group | Shared frame; addons in mono | calm | 3 |
| input-otp | One drawn box per digit, mono digits | calm | 3 |
| checkbox | Drawn box and tick curve (Mental Models' checklist marks) | calm | 2 |
| radio-group | Drawn circle with an ink dot | calm | 2 |
| switch | Drawn pill track; on: accent wash fill with the thumb at the end, plus state in the accessible name | calm | 2 |
| select | Input frame and chevron; the list is a card-stock sheet with a highlighter on the active option | calm | 2 |
| native-select | Same frame as select over the native control | calm | 2 |
| slider | Pen-line track, inked range, drawn thumb | calm | 2 |
| combobox | Input plus select's sheet | calm | 3 |
| calendar | A printed calendar page: today circled by hand, selected day an ink dot, ranges a highlighter band | calm | 3 |
| form | Field-based composition with react-hook-form glue | calm | 3 |
| questionnaire | Steps as a stack of index cards; progress as ringed numbers | lively | 3 |

### Overlays

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| dialog | Card sheet over dimmed paper, tape at the top edge, serif title | lively (tape only) | 2 |
| alert-dialog | Dialog without tape; the destructive action in red text ink | calm | 2 |
| sheet | A page sliding from the edge with a deckled leading edge | calm | 3 |
| drawer | Bottom sheet with a drawn grab handle | calm | 3 |
| popover | Small card sheet with a paper shadow | calm | 2 |
| tooltip | A label-maker strip: ink ground, paper text, mono | calm | 2 |
| hover-card | Preview card tilted −0.6° (Mental Models' link previews) | lively | 3 |
| dropdown-menu | Card sheet; highlighter on the active item; mono shortcuts; dashed separators | calm | 2 |
| context-menu | As dropdown menu | calm | 3 |
| menubar | Mono triggers; menus as dropdown menu | calm | 3 |
| command | An index-card search; results as a typeset list with a highlighter on the active row | calm | 3 |
| sonner | A taped paper slip; a drawn tick or bang by type | lively | 3 |
| toast | Served by sonner (shadcn's legacy toast) | — | 3 |

### Navigation

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| tabs | Active tab gets a hand underline in the accent | calm | 2 |
| navigation-menu | Mono links; current page highlighted (Mental Models header); panels as card sheets | calm | 3 |
| breadcrumb | Mono with small hand-drawn separators | calm | 3 |
| pagination | Mono numbers; the current page ringed | calm | 3 |
| sidebar | `--paper-2` column with a rough rule; active item highlighted; mono section labels | calm | 3 |
| direction | RTL provider; arrows, leaders and tilt signs mirror | — | 3 |

### Data display

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| table | A ledger: mono headers, dashed row rules, typeset cells, sticky paper header | calm | 3 |
| card | A sheet of card stock; optional cover print, tape and tilt | lively | 2 |
| avatar | Image in a rough circle; fallback is a seeded `monogram` print | lively | 2 |
| badge | Rubber-stamp label: mono in a rough ink border; solid variant grained like a stamp | lively | 2 |
| chart | Hand-drawn strokes at exact data positions; per-series hatch fills | calm | 3 |
| carousel | A stack of cards or prints; drawn arrow controls | lively | 3 |
| accordion | Rows on dashed rules with a drawn plus that turns | calm | 3 |
| collapsible | Drawn hook chevron | calm | 3 |
| typography | Mental Models' prose: serif measure, list markers in `--ink-3`, kicker, drop cap, blockquote with a margin bar | calm | 3 |
| item | A typeset row (Mental Models' `ModelRow`): number, title, hook | calm | 3 |
| empty | A `spot` print, a serif heading and one action | lively | 3 |
| aspect-ratio | Holds a print placeholder until media loads | — | 3 |
| scroll-area | Thin pencil scrollbar | calm | 3 |
| resizable | Handle as drawn grip dots | calm | 3 |
| code-block | Mono on `--paper-2` with a ruled gutter; stamped copy button | calm | 3 |
| separator | Rough rule or dashed rule | calm | 2 |
| skeleton | A quiet paper shimmer in the content's own geometry | calm | 2 |
| spinner | A hand-drawn orbit turning | calm | 2 |
| progress | Pen-line track with a hatched ink fill | calm | 2 |
| alert | An accent wash with a drawn glyph and text-ink copy | calm | 2 |

### Conversation

| Component | Patina treatment | Variation | Phase |
| --- | --- | --- | --- |
| message | Notes passed across the desk: author in mono, body in serif | calm | 3 |
| bubble | Paper slips; the two sides on different stocks | calm | 3 |
| message-scroller | Scroll container with a stamped jump-to-latest button | calm | 3 |
| marker | Thread separator in mono between rough rules | calm | 3 |
| trace | A timeline of ringed numbers joined by a drawn line | calm | 3 |
| attachment | File chips as small tickets | calm | 3 |

## Patina extras

| Component | What it is | Origin | Variation | Phase |
| --- | --- | --- | --- | --- |
| Print | Seeded riso illustration | Mental Models `Riso` | lively | 1 |
| SeedScope | Seed context for a subtree | new | — | 1 |
| PatinaDefs | The shared SVG filters | Mental Models `Base.astro` defs | — | 0 |
| Highlight | Marker stroke behind text | Mental Models `.hl` | lively | 1 |
| HandUnderline | Two loose strokes under a heading or term | Mental Models `.u-hand` | lively | 1 |
| Circle | A drawn ring hugging a word or number | new | lively | 1 |
| Strike | A hand strike-through | new | lively | 1 |
| Bracket | A drawn bracket grouping lines | new | lively | 1 |
| SketchFrame | Doubled wobbly outline around a group | Mental Models `.sketch` | lively | 1 |
| Wash | Watercolour blob of accent behind content | Mental Models `.wash` | lively | 1 |
| Tape | Washi tape strip | Mental Models `.tape` | lively | 1 |
| RoughRule | Pen-line divider | Mental Models header rule | calm | 1 |
| MarginNote | Handwritten aside with a drawn arrow, in the gutter on wide screens | Mental Models `MarginNote` | lively | 1 |
| Annotation | Handwritten callout with a leader to a target element | new | lively | 1 |
| Stamp | Rubber-stamp label with grain and misregistration | new | lively | 1 |
| Glyph | Seeded hand-drawn glyph set | Mental Models `KindGlyph` | lively | 1 |
| Paper | A surface with a stock and a patina level | new | lively | 4 |
| IndexCard | Tilted, taped card with a print, kicker, title and hook | Mental Models `ModelCard` | lively | 4 |
| IndexRow | Typeset index entry | Mental Models `ModelRow` | calm | 4 |
| Ticket | Perforated stub with mono fields | new | lively | 4 |
| Postmark | Circular dated cancellation mark | new | lively | 4 |
| EditionNumber | "No. 0012" mono numbering | Mental Models | calm | 4 |
| Checklist | Tickable list with drawn boxes and ticks | Mental Models `Sections` | calm | 4 |
| Steps | Ringed-number steps | Mental Models `Sections` | calm | 4 |
| Scale | Drawn scale with the current position circled | Mental Models `EvidenceScale` | calm | 4 |
| ConceptMap | Hand-drawn graph of typed connections, list on small screens | Mental Models `ConnectionMap` | lively | 4 |
| DecisionMap | One question branching to options | Mental Models `KindMap` | lively | 4 |
| ReadingProgress | Rough-edged progress bar at the top of an article | Mental Models | calm | 4 |
| PullQuote | Large serif quote with a hand mark | new | lively | 4 |
| Sidenote | Numbered note in the margin, inline on small screens | new | calm | 4 |
| AppearanceControl | Day/night, stock, ink set, variation and patina as settings rows | Mental Models `ThemeToggle`, extended | calm | 4 |

## Blocks

Planned blocks, chosen by what the demo product and site need: sign-in, sign-up, settings, dashboard, pricing, article page, empty states, hero, sidebar shell, 404. shadcn ships 30 blocks; Patina adds a block when a workflow uses it.
