# Seeded variation

Status: proposed, 2026-11-01. This document owns every random choice in Patina: where it comes from, how far it may go and what it promises.

**Every Patina surface is a little different, and always the same.** Two index cards side by side tilt differently, their tape sits differently, their outlines wobble differently, and each prints its own illustration. Reload the page, render it on the server, build it next month: each card looks exactly as before. That combination of variety and stability is the signature of the library.

Mental Models proves the idea at small scale: `seedOf(slug)` picks each model's riso illustration, its card tilt and the wobble of its drawn marks, so 400 pages look hand-made and every build is identical. Patina turns it into a system.

## Principles

1. **Seeded.** Every random value comes from `prng(seed)`. Render code never calls `Math.random()` or reads the time, and seeds never depend on layout or viewport.
2. **Bounded.** Each variable has a range set by tokens and the variation level. Variation decorates; it never moves layout, shrinks a hit area, changes text or bends a data value.
3. **Forked.** Each kind of decision draws from its own labelled stream (`fork(seed, "tilt")`, `fork(seed, "tape")`), so adding a new random choice later leaves existing output unchanged.
4. **Coherent.** Variation chooses within the active ink set, stroke weights and motif rules, so a page varies like one printer's work, not like a collage.
5. **Visible.** Wherever a person might want another version (the Press, docs previews, a cover picker), the seed is shown and a reroll is one click away.

## Where seeds come from

In order of precedence:

1. An explicit `seed` prop (string or number).
2. Content the component already has: an `id`, `name` or `title` prop, or a string child (a highlight seeds from its text).
3. The nearest `<SeedScope seed="…">` combined with the component's own label and `useId()`. `useId` agrees between server and client for the same tree, so output is stable across renders, though it may change when the surrounding code is edited. Docs and demos always pass explicit or content seeds.

`seedOf(text)` is FNV-1a over UTF-16 code units, reduced to 31 bits; `prng(seed)` is the small mulberry-style generator from Mental Models' `sketch.ts`; `fork(seed, label)` is `seedOf(\`${seed}:${label}\`)`.

## What varies

| Variable | Used by | Calm | Lively |
| --- | --- | --- | --- |
| Tilt | Index card, note, stamp, print frame | 0° | up to ±0.8° (cards), ±2.5° (notes, stamps) |
| Outline wobble | Sketch frames, card and dialog edges | displacement 1.5 | displacement 4.5, one of six filter variants |
| Stroke roughness | Marks, glyphs, chart strokes | 0.5 | 1.2 |
| Misregistration | Prints, avatars, stamps | up to 0.5 px per drum | up to 2 px per drum |
| Grain | Prints, washes, stamps | light speckle | full speckle, seeded per print |
| Tape | Index cards, pinned objects | none | angle ±4°, offset ±20 %, ink from the set |
| Motif parameters | Prints | motif-defined | motif-defined |
| Age marks | Paper surfaces | none | by patina level |

The **variation level** is a theme setting (`data-variation="calm" | "lively"`) that any subtree can override. Operated controls (inputs, selects, menus, table cells) stay calm at every level. `prefers-reduced-motion` stops animated variation; `forced-colors` removes textures, grain and misregistration and restores plain borders.

## Prints

A print is a seeded riso illustration: two or three drums of ink, each a layer of rough.js strokes and fills, overprinted, grained and slightly out of register.

**Anatomy.** A *line drum* draws the structure (Mental Models: blue, 4.2 px strokes, roughness 0.9). An *accent drum* adds the point of interest in the accent ink. An optional *third drum* adds a small dark detail (violet dots). Each drum renders inside its own grain filter (fractal-noise displacement for rough edges plus a speckle mask for starved ink, seeded per print) and blends with `multiply` on day paper and `screen` on night paper. Misregistration offsets each drum by a seeded fraction of a pixel or two; where drums overlap, the overprint makes a third colour, as real riso does.

**Motifs.** Each motif is a pure function of seed, size and inks.

| Motif | Picture | Good for | Origin |
| --- | --- | --- | --- |
| `rings` | Concentric rings narrowing to a pit | Warnings, traps, focus | Mental Models (trap) |
| `lens` | A lens on crosshair guides, hatched accent | Tools, search, inspection | Mental Models (tool) |
| `orbits` | Two orbits, an accent body drifting round (can animate) | Systems, cycles, sync | Mental Models (pattern) |
| `constellation` | Linked nodes, one ringed | Concepts, networks, teams | Mental Models (concept) |
| `contours` | Topographic lines round one to three peaks | Maps, places, depth | new, Phase 1 |
| `halftone` | A dot field shaped by a seeded blob, second drum offset into moiré | Covers, heroes, backgrounds | new, Phase 1 |
| `flow` | Streamlines through a seeded noise field, a few in accent | Movement, data, weather | new, Phase 1 |
| `horizon` | A disc over horizon bands | Covers, landing heroes, onboarding | new, Phase 1 |
| `sprig` | A branching stem with leaves | Growth, nature, notes | new, Phase 1 |
| `blocks` | Stacked letterpress offcuts | Products, storage, building | new, Phase 1 |
| `scatter` | Poisson-spaced small shapes and ticks | Celebration, variety, empty states | new, Phase 1 |
| `monogram` | Initials in riso over a seeded blob | Avatars, workspaces, logos | new, Phase 1 |
| `grid` | Graph paper with a plotted path and a circled point | Analytics, progress | new, later |
| `waves` | Stacked bands of wobbling waves | Audio, sea, calm | new, later |
| `burst` | Strokes radiating from an off-centre point | Announcements, launches | new, later |
| `path` | A meandering trail with waypoints | Journeys, steps, history | new, later |
| `spiral` | A hand spiral with an accent marker | Loading, focus, recursion | new, later |

**Formats.** The same motif renders in several formats: `spot` (square, transparent, for cards and empty states), `cover` (wide, composed on the thirds, on a paper ground), `avatar` (circular crop), `pattern` (a seamless tile for backgrounds) and `rule` (a long thin strip for dividers).

**Choosing motifs.** A component can fix a motif (avatars use `monogram`), accept one as a prop, or let the seed choose from a curated list so a grid of covers varies in kind as well as detail.

## Generative art in components

| Component | Generative part |
| --- | --- |
| Avatar | Fallback is a `monogram` print seeded by the user's id: a stable personal colour and blob |
| Card, index card | Optional `cover` or `spot` print; seeded tilt and tape |
| Empty | A `spot` print in place of a stock illustration |
| Chart | Hand-drawn strokes at exact data positions; per-series hatch or dot fills with seeded angles, so series differ by pattern as well as ink |
| Separator, rule | Optional `rule` print or a seeded rough line |
| Skeleton | Calm: no art, a quiet paper shimmer in the content's own geometry |
| Image placeholder | A `cover` print at the image's aspect ratio until the image loads |
| Share images, favicons | Build-time prints (satori and resvg, as in Mental Models' `og.ts`) |

## Paper stocks and patina

**Stocks** are generated, not scanned: a script bakes seeded fractal noise, fibres and mottling into one AVIF tile per stock (target under 200 KB), with a matching veil and token set. Seeded generation means a stock can be regenerated, tuned and relicensed freely.

**Patina** is the age of a surface, a theme setting (`data-patina="clean" | "handled" | "worn"`) applied to page and card surfaces only:

| Level | Marks |
| --- | --- |
| `clean` | None |
| `handled` | Softened corners, a faint smudge or two, slightly uneven veil |
| `worn` | Adds a coffee ring, a fold crease, foxing specks, pin holes and corner wear |

Placement is seeded per surface and keeps clear of text blocks and controls: marks sit in margins and corners, at alphas low enough that every text pair keeps its measured contrast. Forced colors and `prefers-contrast: more` render `clean`.

## Interface

The ink engine (framework-free):

```ts
seedOf(text: string): number
prng(seed: number): () => number
fork(seed: number, label: string): number
print(options: {
  motif: Motif
  seed: string | number
  inks?: InkSet
  format?: "spot" | "cover" | "avatar" | "pattern" | "rule"
  size?: number
  variation?: "calm" | "lively"
}): { svg: string; seed: number }
```

React:

```tsx
<Print motif="orbits" seed="sunk-cost" format="spot" className="w-40" />
<SeedScope seed="fieldbook-entries">{children}</SeedScope>
const seed = useSeed("tape")
```

Prints are decorative (`aria-hidden`) unless given a `title`, which makes them `role="img"` with that name.

## The determinism promise

Within a major version, `print()` with the same options returns the same SVG on every engine. Motifs are versioned (`orbits` is `orbits@1`); a change that alters output ships as a new version, and the old one stays until the next major. The first release adds the lasting test that guards this: a set of seeds per motif rendered through `print()` and compared with recorded output.

**Cross-engine drift** is the known risk: JavaScript engines may differ in the last bits of `Math.sin`, `Math.cos` and `Math.atan2`, which rough.js uses. Coordinates are rounded to one decimal (Mental Models' `tidy`), which makes a differing digit rare but possible at a rounding boundary. Phase 1 checks 200 seeds per motif for identical output in Node, Chromium and WebKit; if any differ, the engine switches to its own polynomial trigonometry, which is exact under IEEE arithmetic.

## Performance

Static pages render prints at build time, so they cost no JavaScript. Interactive islands memoize by (motif, seed, format, size, inks). Paths are tidied to one decimal, which cut Mental Models' inline SVG by about two thirds. Grain filters apply per print, never to large containers.
