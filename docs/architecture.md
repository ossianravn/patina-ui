# Architecture

Status: Phase 0 built the foundations (tokens, ink engine, theme runtime, shared filters, the specimen page), 2026-11-01. Parts marked planned do not exist yet. The stack follows decisions D1–D4 and D8 in [the plan](plan.md#decisions).

## Repository layout

```
src/patina/                  # the kit: everything a consumer installs
  ink/                       # framework-free engine: seed, prng, fork, rough wrapper, filters, print()
    motifs/                  # one file per print motif (Phase 0: orbits)
  styles/                    # patina.css (Tailwind entry) and the files it imports:
                             #   fonts, tokens, stocks, textures.generated, roles, base, marks
  theme/                     # appearance state, pre-paint script, useAppearance
  defs/                      # <PatinaDefs>: the shared SVG filters
  lib/                       # cn
  marks/ print/ ui/ paper/   # planned: mark components, <Print>, shadcn primitives, paper objects
src/site/                    # site layouts, components and the specimen sections
src/pages/                   # Astro routes
tools/paper/                 # build-textures.mjs: writes styles/textures.generated.css
tools/check-contrast.mjs     # every text ink against every textured surface
public/r/, registry.json     # planned (Phase 1): generated registry, never edited by hand
tests/consumer/, tests/e2e/  # created with the first lasting test that needs them
```

## Layers and ownership

| Layer                        | Owns                                                                                                  | Depends on                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
| Tokens (`styles/tokens.css`) | Paper, reading, print, text and hand inks, voices, type scale, spacing, radii, shadows                | nothing                   |
| Stocks (`styles/stocks.css`) | Paper and reading inks per stock and theme; grain comes from `textures.generated.css`                 | tokens                    |
| Ink engine (`ink/`)          | Seeds, PRNG, rough.js strokes, grain and wobble filters, motifs, print SVG                            | rough.js                  |
| Theme runtime (`theme/`)     | Theme, stock, variation and patina level as attributes on `<html>`; persistence; the pre-paint script | tokens                    |
| Defs (`defs/`)               | One copy of each shared SVG filter, server-rendered                                                   | ink engine                |
| Marks and prints             | Annotation-level visuals (Phase 0: CSS utilities in `marks.css`) and generative art                   | ink engine, defs, tokens  |
| Primitives (`ui/`, planned)  | shadcn parts: structure, behavior (Base UI), states, Patina treatment                                 | tokens, defs, marks       |
| Paper objects and patterns   | Index card, ticket, checklist, scale, concept map (planned)                                           | primitives, marks, prints |
| Site                         | Specimen now; docs, Press, theme studio, demo product later                                           | the kit                   |

Rules enforced by ESLint (`eslint.config.js`):

- Kit code imports nothing from `src/site`, `src/pages` or `src/content`.
- `src/patina/ink/` imports nothing from React, the DOM or the rest of the kit, and never calls `Math.random()` or `Date.now()`.

Still a convention: kit stylesheets style only what kit components render.

## Rendering

**CSS draws frames, SVG draws marks, JS measures only when a mark must hug content.**

1. **Frames** (borders of buttons, inputs, cards, dialogs, menus) are pseudo-elements carrying an ordinary border passed through a shared displacement filter, as Mental Models' `.sketch` does. Six filter variants with different noise seeds give neighbouring frames different wobbles; a component picks one from its seed with `filter: var(--rough-3)`. The variation level swaps what `--rough-1…6` point at (`#patina-rough-N` or `#patina-rough-calm-N`). The real element keeps a plain border, so layout, hit areas and forced colors behave like stock shadcn. A filtered line needs a box taller than the line (the `rough-rule` utility is 0.6 rem tall for a 1.5 px line), or the displacement is clipped into gaps.
2. **Marks with a fixed shape** (ticks, ringed numbers, glyphs, arrows, scale dots) are rough.js paths in a fixed `viewBox`, generated from a seed. They scale with the element and need no measuring. Static pages generate them at build time; islands memoize them.
3. **Marks that hug content** (a circle around a word, an annotation leader to a target, an underline across a wrapped heading) measure their target once with a `ResizeObserver` and redraw on size change. The server renders a CSS fallback (the `highlight` gradient or the `hand-underline` mask), so nothing jumps if JavaScript is slow. Planned for Phase 1.
4. **Prints** render as inline SVG from `print()`: at build time in Astro, memoized in islands. Each drum is a `<g>` with its own grain filter; misregistration is `translate: calc(var(--misregister) * dx) …` with a seeded unit direction, so the variation level scales it without re-rendering.

`<PatinaDefs>` renders the shared filters once inside `<body>` (`patina-rough-1…6`, `patina-rough-calm-1…6`, `patina-ink`, `patina-wash`); per-print grain filters stay local. Portalled overlays reference the same ids, so Base UI portals need no extra setup as long as `<PatinaDefs>` sits inside the document.

## Theme runtime

State lives as attributes on `<html>`, so CSS does the work and every island reads the same state (`src/patina/theme/`):

| Attribute               | Values                     | Default   | Status  |
| ----------------------- | -------------------------- | --------- | ------- |
| `data-theme`            | `day`, `night` (resolved)  | system    | built   |
| `data-theme-preference` | `system`, `day`, `night`   | `system`  | built   |
| `data-stock`            | `field`, `newsprint`       | `field`   | built   |
| `data-variation`        | `calm`, `lively`           | `lively`  | built   |
| `data-patina`           | `clean`, `handled`, `worn` | `handled` | built   |
| `data-inks`             | ink sets                   | `field`   | planned |
| `data-density`          | `comfortable`, `compact`   | —         | planned |

- `appearanceScript(defaults)` returns an inline script for `<head>` that applies the saved choice before first paint.
- `apply`, `current`, `readSaved`, `save` and `normalize` work on the attributes and `localStorage` (`patina-appearance`); unknown stored values fall back to the defaults.
- `useAppearance()` is a `useSyncExternalStore` hook over the attributes: server renders use the defaults, hydration picks up what the script applied, and a `MutationObserver` keeps several islands in step. `system` re-resolves when the operating system switches.
- Any subtree can override variation (`data-variation="calm"`) or re-ink itself (`data-ink="pink"`); theme and stock apply to the whole document.

## Tokens

Three tiers, following Groundwork's ownership model:

1. **Raw values** (`tokens.css`, `stocks.css`): `--paper`, `--paper-2`, `--paper-3`, `--card`, `--rule`, `--line`; reading inks `--ink`, `--ink-2`, `--ink-3`, `--ink-faint`; drums `--print-<drum>`; text inks `--ink-<drum>`; hand inks `--hand-<drum>`; faces `--face-read|label|hand|ui`; sizes `--type-*`; leading `--lh-*`; spacing `--space-hair|tight|snug|line|section|page`; `--measure`, `--control-height`, `--sheet-radius`, `--sheet-shadow`, `--lift-shadow`.
2. **shadcn semantic roles** (`roles.css`): `--background`, `--foreground`, `--card`, `--popover`, `--primary` (solid ink), `--secondary`, `--muted`, `--accent`, `--destructive`, `--border` (`--rule`), `--input` (`--line`), `--ring`, `--chart-1…5`, `--sidebar-*`, so shadcn-shaped code works unchanged.
3. **Patina roles**: `--k`, `--k-ink`, `--k-hand` (context accent in print, text and hand form); `--print-line`, `--print-accent`, `--print-detail` (a print's drums); `--paper-grain`, `--paper-wear`, `--paper-texture`; `--misregister`, `--tilt-max`, `--rough-1…6`; `--hl-alpha`, `--wash-alpha`.

Raw names avoid Tailwind's theme namespaces (`--font-*`, `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*`, `--shadow-*`), which `@theme inline` in `patina.css` maps them onto: `font-read`, `text-lead`, `leading-body`, `p-snug`, `max-w-measure`, `rounded-sheet`, `shadow-sheet`, `bg-paper-2`, `text-ink-pink`, `bg-print-yellow`, and shadcn's `bg-background` family. Custom variants: `night:`, `dark:` and `calm:`.

Paper grain is generated: `tools/paper/build-textures.mjs` turns each stock's noise layers into a 480 px seamless SVG tile, written as data URIs into `textures.generated.css`. Text only, so it ships through the registry.

## Registry (planned, Phase 1)

The registry will be generated from `src/patina/` by `tools/registry/build.mjs` (Looseleaf's and Groundwork's approach): nobody edits `registry.json` or `public/r/` by hand.

| Item                                                        | Contents                                                                          |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `base`                                                      | Tokens, stocks, textures, roles, base, marks, theme runtime, `<PatinaDefs>`, `cn` |
| `font-source-serif-4`, `font-caveat`, `font-jetbrains-mono` | Fonts as `registry:font` items                                                    |
| `print`                                                     | `<Print>`, `<SeedScope>`, `useSeed`, the ink engine and all motifs                |
| `<component>`                                               | One item per primitive, mark or paper object, bringing the items it imports       |
| `patina`                                                    | Umbrella: everything except blocks                                                |
| `<block>`                                                   | Blocks, kept out of the umbrella                                                  |

Installs: `npx shadcn add @patina/button` with `{"registries": {"@patina": "https://<site>/r/{name}.json"}}`, or `npx shadcn add ossianravn/patina-ui/button` once the repository is public. Items install into the consumer's `@/patina/` folder so the kit's own imports keep working.

## Framework portability

The kit is React 19, Tailwind CSS 4 and Base UI. Modules with hooks start with `"use client"`, so Next.js Server Components can import them. The site's Astro choice affects only the site. The ink engine has no framework dependency, which is what lets the site render prints at build time and leaves room for a later port.
