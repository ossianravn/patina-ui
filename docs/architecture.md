# Architecture

Status: proposed, 2026-11-01. Nothing below exists yet; Phase 0 builds the skeleton. The stack follows decisions D1–D4 and D8 in [the plan](plan.md#decisions).

## Repository layout

```
src/patina/              # the kit: everything a consumer installs
  ink/                   # framework-free engine: seed, prng, fork, rough wrapper, filters, palettes
    motifs/              # one file per print motif
  styles/                # patina.css (Tailwind entry), tokens.css, base.css, marks.css, stocks/
  theme/                 # pre-paint script, preferences, ink sets, stocks, variation, patina level
  defs/                  # <PatinaDefs>: the shared SVG filters
  marks/                 # Highlight, HandUnderline, Circle, Tape, Stamp, MarginNote, Annotation, …
  print/                 # <Print>, <SeedScope>, useSeed
  ui/                    # shadcn primitives in the Patina language (Base UI)
  paper/                 # Paper, IndexCard, Ticket and other paper objects
  lib/                   # cn and small shared helpers
src/site/                # demo-site components, layouts and the demo product
src/pages/               # Astro routes
src/content/             # MDX docs, one file per component and foundation
public/r/                # generated registry JSON (never edited by hand)
tools/                   # registry build, paper-stock generator, share images, verification scripts
tests/consumer/          # created with the first lasting registry test
tests/e2e/               # created with the first lasting browser test
registry.json            # generated from src/patina/
```

## Layers and ownership

| Layer | Owns | Depends on |
| --- | --- | --- |
| Tokens (`styles/tokens.css`) | Paper, inks, text inks, voices, type scale, spacing, radii, shadows, motion | nothing |
| Ink engine (`ink/`) | Seeds, PRNG, rough.js strokes, grain and wobble filters, motifs, print SVG | rough.js |
| Theme runtime (`theme/`) | Day/night, stock, ink set, variation level, patina level, density; persistence and the pre-paint script | tokens |
| Defs (`defs/`) | One copy of each shared SVG filter, server-rendered | ink engine |
| Marks and prints | Annotation-level visuals and generative art | ink engine, defs, tokens |
| Primitives (`ui/`) | shadcn parts: structure, behavior (Base UI), states, Patina treatment | tokens, defs, marks |
| Paper objects and patterns | Index card, ticket, checklist, scale, concept map | primitives, marks, prints |
| Site | Docs, Press, theme studio, demo product | the kit |

Rules, each to be enforced by a check in Phase 0:

- Kit code imports nothing from `src/site`, `src/pages` or `src/content`.
- `src/patina/ink/` imports nothing from React or the DOM.
- Kit stylesheets style only what kit components render.

## Rendering

**CSS draws frames, SVG draws marks, JS measures only when a mark must hug content.**

1. **Frames** (borders of buttons, inputs, cards, dialogs, menus) are pseudo-elements carrying an ordinary border passed through a shared displacement filter, as Mental Models' `.sketch` does. Six filter variants with different noise seeds give neighbouring frames different wobbles; a component picks one from its seed through a CSS variable (`--patina-rough: url(#patina-rough-3)`). The real element keeps a plain, transparent border, so layout, hit areas and forced colors behave like stock shadcn. Calm components use the low-displacement variants.
2. **Marks with a fixed shape** (ticks, ringed numbers, glyphs, arrows, scale dots) are rough.js paths in a fixed `viewBox`, generated from a seed. They scale with the element and need no measuring. Static pages generate them at build time; islands memoize them.
3. **Marks that hug content** (a circle around a word, an annotation leader to a target, an underline across a wrapped heading) measure their target once with a `ResizeObserver` and redraw on size change. The server renders a CSS fallback (the `.hl` gradient or the `.u-hand` mask), so nothing jumps if JavaScript is slow.
4. **Prints** render as inline SVG from `print()`: at build time in Astro, memoized in islands.

`<PatinaDefs>` renders the shared filters once near the root (`patina-rough-1…6`, `patina-ink`, `patina-wash`, per-print grain filters stay local). Portalled overlays reference the same ids, so Base UI portals need no extra setup as long as `<PatinaDefs>` sits inside the document.

## Theme runtime

State lives as attributes on `<html>`, so CSS does the work and no React context is required:

| Attribute | Values | Default |
| --- | --- | --- |
| `data-theme` | `day`, `night`, `system` | `system` |
| `data-stock` | `field`, `newsprint`, `kraft`, `graph`, `blueprint` | `field` |
| `data-inks` | `field`, `fluoro`, `earth`, `spot`, `night` | `field` |
| `data-variation` | `calm`, `lively` | `lively` |
| `data-patina` | `clean`, `handled`, `worn` | `handled` |
| `data-density` | `comfortable`, `compact` | `comfortable` |

A pre-paint inline script applies saved preferences before first render (Groundwork's `themeScript` pattern, and Mental Models' `astro:before-swap` re-application for view transitions). `readTheme`, `applyTheme` and a `useTheme` hook expose the same state to React.

## Tokens

Three tiers, following Groundwork's ownership model:

1. **Raw values**: paper, inks, text inks, stock textures, voices, the type and spacing scales.
2. **shadcn semantic roles**: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1…5`, `--sidebar-*`, mapped from the raw values so shadcn-shaped code works unchanged.
3. **Patina roles**: `--k` (context accent), `--print-*` and `--text-*` inks, `--paper-bg`, `--card-bg`, `--veil`, `--patina-rough`, `--tilt-max`, `--misregister`, `--hl-alpha`, `--wash-alpha`, `--font-read`, `--font-label`, `--font-hand`, `--font-ui`.

Tailwind 4 exposes the roles through `@theme inline` in `patina.css`.

## Registry

The registry is generated from `src/patina/` by `tools/registry/build.mjs` (Looseleaf's and Groundwork's approach): nobody edits `registry.json` or `public/r/` by hand.

| Item | Contents |
| --- | --- |
| `base` | Tokens, styles, theme runtime, `<PatinaDefs>`, the ink engine core, `cn` |
| `font-source-serif-4`, `font-caveat`, `font-jetbrains-mono` | Fonts as `registry:font` items |
| `stock-<name>` | One paper stock texture and its tokens |
| `print` | `<Print>`, `<SeedScope>`, `useSeed` and all motifs |
| `<component>` | One item per primitive, mark or paper object, bringing the items it imports |
| `patina` | Umbrella: everything except blocks |
| `<block>` | Blocks, kept out of the umbrella |

Installs: `npx shadcn add @patina/button` with `{"registries": {"@patina": "https://<site>/r/{name}.json"}}`, or `npx shadcn add ossianravn/patina-ui/button` once the repository is public. Items install into the consumer's `@/patina/` folder so the kit's own imports keep working.

## Framework portability

The kit is React 19, Tailwind CSS 4 and Base UI. Modules with hooks start with `"use client"`, so Next.js Server Components can import them. The site's Astro choice affects only the site. The ink engine has no framework dependency, which is what lets the site render prints at build time and leaves room for a later port.
