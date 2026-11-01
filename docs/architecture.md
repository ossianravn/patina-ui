# Architecture

Status: Phase 2 adds the shadcn primitives (Base UI), the Paper component, layered paper and the docs and Fieldbook routes, 2026-11-01. Parts marked planned do not exist yet. The stack follows decisions D1–D4 and D8 in [the plan](plan.md#decisions).

## Repository layout

```
src/patina/                  # the kit: everything a consumer installs
  ink/                       # framework-free engine: seed, rough wrapper, filters, noise, inks, glyphs, print-svg
    motifs/                  # one file per print motif, plus shared pens
  styles/                    # patina.css (Tailwind entry) and the files it imports:
                             #   fonts, tokens, stocks, inks, textures.generated, roles, base, marks, paper, controls
  theme/                     # appearance state, pre-paint script, useAppearance
  defs/                      # <PatinaDefs>: the shared SVG filters
  print/                     # <Print>; seed-scope: SeedScope, useSeed, textOf, roughVariant
  marks/                     # Highlight, HandUnderline, hand-marks, paper-marks, notes, Stamp, Glyph
  paper/                     # <Paper>: seeded edges, dog-ear, tilt and wear
  ui/                        # shadcn primitives (base-nova sources, Patina classes); see docs/primitives.md
  lib/                       # cn, built with createCn so it knows Patina's theme names
src/site/                    # layouts, specimen, the Press, docs demos (site/docs), Fieldbook (site/fieldbook)
src/pages/                   # Astro routes: /, /prints, /marks, /press, /docs, /docs/components/[name], /fieldbook/*
tools/paper/                 # layers.mjs and build-textures.mjs: write styles/textures.generated.css
tools/registry/              # build.mjs and items.json: writes registry.json and public/r/
tools/check-contrast.mjs     # every text ink against every textured surface
tests/consumer/, tests/e2e/  # created with the first lasting test that needs them
```

## Layers and ownership

| Layer                        | Owns                                                                                                  | Depends on                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------- |
| Tokens (`styles/tokens.css`) | Paper, reading, print, text and hand inks, voices, type scale, spacing, radii, shadows                | nothing                   |
| Stocks and ink sets          | `stocks.css`: paper and reading inks per stock and theme; `inks.css`: the drums a print uses          | tokens                    |
| Ink engine (`ink/`)          | Seeds, PRNG, rough.js strokes, grain and wobble filters, noise, motifs, glyphs, print SVG             | rough.js                  |
| Theme runtime (`theme/`)     | Theme, stock, variation and patina level as attributes on `<html>`; persistence; the pre-paint script | tokens                    |
| Defs (`defs/`)               | One copy of each shared SVG filter, server-rendered                                                   | ink engine                |
| Seeds and prints (`print/`)  | `SeedScope`, `useSeed`, `<Print>`                                                                     | ink engine                |
| Marks (`marks/`)             | Annotation-level visuals, as components over the utilities in `marks.css`                             | ink engine, seeds, tokens |
| Primitives (`ui/`, planned)  | shadcn parts: structure, behavior (Base UI), states, Patina treatment                                 | tokens, defs, marks       |
| Paper objects and patterns   | Index card, ticket, checklist, scale, concept map (planned)                                           | primitives, marks, prints |
| Site                         | Specimen, print gallery, marks, Press; docs, theme studio and demo product later                      | the kit                   |

Rules enforced by ESLint (`eslint.config.js`):

- Kit code imports nothing from `src/site`, `src/pages` or `src/content`.
- `src/patina/ink/` imports nothing from React, the DOM or the rest of the kit, and never calls `Math.random()` or `Date.now()`.

Enforced by the registry build: kit modules have unique file names (see [Registry](#registry)).

Still a convention: kit stylesheets style only what kit components render.

## Rendering

**CSS draws frames, SVG draws marks, and nothing measures.**

1. **Frames** come in two kinds. Operated controls (buttons, inputs, select triggers) use crisp pen lines with irregular sheet corners: the `control-field` utility and the button's classes; calm controls, no wobble. Decorative frames (`sketch-frame`, `Stamp`) are pseudo-elements whose border passes through a shared displacement filter, as Mental Models' `.sketch` does: six filter variants with different noise seeds give neighbouring frames different wobbles, picked from the seed with `filter: var(--rough-3)` (`roughVariant(seed)`), and the variation level swaps what `--rough-1…6` point at. A filtered line needs a box taller than the line (`rough-rule` is 0.6 rem tall for a 1.5 px line), or the displacement is clipped into gaps. Cut sheets (`Paper`) are a clip-path or mask from the seed, with a drop shadow on a wrapper so the shadow follows the cut.
2. **Marks with a fixed shape** (ticks, ringed numbers, glyphs, arrows, scale dots) are rough.js paths in a fixed `viewBox`, generated from a seed. They scale with the element. Static pages generate them at build time; islands memoize them.
3. **Marks that hug content** (`Circle`, `Strike`, `Bracket`) draw a seeded shape in a fixed `viewBox`, stretch it over their content with `preserveAspectRatio="none"` and keep the stroke width with `vector-effect: non-scaling-stroke` (`nonScaling` on a pen). No `ResizeObserver`, so they look the same in static HTML and after hydration. The earlier plan to measure is dropped; an annotation leader to an arbitrary target is the one case that may still need it.
4. **Prints** render as inline SVG from `print()`: at build time in Astro, memoized in islands. Each drum is a `<g>` with its own grain filter; misregistration is `translate: calc(var(--misregister) * dx) …` with a seeded unit direction, so the variation level scales it without re-rendering. `standalone: true` makes a self-contained file (size, namespace, overprinting inline) for downloads and share images.

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
| `data-density`          | `comfortable`, `compact`   | —         | planned |

- `appearanceScript(defaults)` returns an inline script for `<head>` that applies the saved choice before first paint.
- `apply`, `current`, `readSaved`, `save` and `normalize` work on the attributes and `localStorage` (`patina-appearance`); unknown stored values fall back to the defaults.
- `useAppearance()` is a `useSyncExternalStore` hook over the attributes: server renders use the defaults, hydration picks up what the script applied, and a `MutationObserver` keeps several islands in step. `system` re-resolves when the operating system switches.
- Any element can override variation (`data-variation="calm"`), re-ink its region (`data-ink="pink"`, the accent) or choose a print ink set (`data-inks="fluoro"`, or `inks` on `<Print>`); theme and stock apply to the whole document.

## Tokens

Three tiers, following Groundwork's ownership model:

1. **Raw values** (`tokens.css`, `stocks.css`, `inks.css`): `--paper`, `--paper-2`, `--paper-3`, `--card`, `--rule`, `--line`; reading inks `--ink`, `--ink-2`, `--ink-3`, `--ink-faint`; drums `--print-<drum>`; text inks `--ink-<drum>`; hand inks `--hand-<drum>`; faces `--face-read|label|hand|ui`; sizes `--type-*`; leading `--lh-*`; spacing `--space-hair|tight|snug|line|section|page`; `--measure`, `--control-height`, `--sheet-radius`, `--sheet-shadow`, `--lift-shadow`.
2. **shadcn semantic roles** (`roles.css`): `--background`, `--foreground`, `--card`, `--popover`, `--primary` (solid ink), `--secondary`, `--muted`, `--accent`, `--destructive`, `--border` (`--rule`), `--input` (`--line`), `--ring`, `--chart-1…5`, `--sidebar-*`, so shadcn-shaped code works unchanged.
3. **Patina roles**: `--k`, `--k-ink`, `--k-hand` (context accent in print, text and hand form); `--print-line`, `--print-accent`, `--print-detail` (a print's drums, set by the ink set); `--paper-grain`, `--paper-wear`, `--paper-texture`; `--misregister`, `--tilt-max`, `--rough-1…6`; `--hl-alpha`, `--wash-alpha`; per-mark seeds such as `--sketch-a`, `--wash-shape`, `--tape-tilt` and `--stamp-turn`.

Raw names avoid Tailwind's theme namespaces (`--font-*`, `--text-*`, `--leading-*`, `--spacing-*`, `--radius-*`, `--shadow-*`), which `@theme inline` in `patina.css` maps them onto: `font-read`, `text-lead`, `leading-body`, `p-snug`, `h-control`, `max-w-measure`, `rounded-sheet`, `shadow-sheet`, `bg-paper-2`, `text-ink-pink`, `bg-print-yellow`, and shadcn's `bg-background` family. Custom variants: `night:`, `dark:` and `calm:`.

Paper grain is generated: `tools/paper/build-textures.mjs` turns each stock's noise layers into a 480 px seamless SVG tile, written as data URIs into `textures.generated.css`. Text only, so it ships through the registry.

## Registry

`npm run registry` generates `registry.json` and `public/r/*.json` from `src/patina/` (Groundwork's builder, adapted): membership is in `tools/registry/items.json`, and npm and item dependencies are read from each file's imports. A file outside every group is an item named after the file; a part split across files (chart, sidebar, combobox, questionnaire) needs a group, and groups match in order, so a specific path must not fall under an earlier folder pattern. `requires` adds an item a part works with but does not import (`code-block` and its highlighting hook). Nobody edits the outputs by hand; `npm run registry:check` fails when they are stale.

| Item                                                                                  | Contents                                                                                                                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base`                                                                                | Styles and tokens, theme runtime, `<PatinaDefs>`, `SeedScope`, the engine core (seed, rough, filters), `cn`; npm: `roughjs`, `cn`, the three fonts |
| `print`                                                                               | `<Print>`, `print()`, ink sets, noise and all twelve motifs                                                                                        |
| `glyph`, `highlight`, `hand-underline`, `hand-marks`, `paper-marks`, `notes`, `stamp` | The marks                                                                                                                                          |
| `patina`                                                                              | Umbrella: every item                                                                                                                               |

Every file installs at the same path under the consumer's `src/patina/`, so the kit's own `@/patina/…` imports keep working. Item dependencies are written as `@patina/<name>` for a consumer whose `components.json` has `{"registries": {"@patina": "https://<site>/r/{name}.json"}}`; `node tools/registry/build.mjs --base <url>` writes full URLs instead, for local install tests. The GitHub form `ossianravn/patina-ui/<item>` works once the repository is public.

What installing into fresh apps has taught:

- **Module file names are unique.** `shadcn add` rewrites each import to the installed file with the same base name, so `ink/seed.ts` and `print/seed.tsx` got mixed up in the consumer while the source compiled fine, and a file `lib/ink.tsx` would capture imports of the folder `ink/`. The builder rejects duplicate `.ts`/`.tsx` base names, counting a folder with an `index` file as a name.
- **The builder reads imports in either quote style**, so a single-quoted import cannot silently drop an item dependency.
- **Run the CLI through Node when testing installs on this machine.** Under `npx`, npm 11 refused the CLI's own dependency install (`EALLOWSCRIPTS`); `node node_modules/shadcn/dist/index.js add …` works.
- **`shadcn add` fetches `ui.shadcn.com/r/colors/<baseColor>.json` on every add.** Patina's files never use it, so a consumer's `components.json` can set `"baseColor": ""` to skip the download.

`npm run test:consumer` (`tests/consumer/install.test.mjs`) is the lasting check of this contract. It builds the registry into a temporary folder, serves it locally, installs items into a copy of `tests/consumer/fixture/` through the real CLI with npm offline (from the cache the repo's own install filled) and every other network request refused, and then asserts three things:

- every installed file is byte-identical to its source;
- the fixture type-checks;
- the fixture builds.

It runs in about 15 seconds. The fixture's dependency versions must follow the repo's when React, Vite, Tailwind or TypeScript are bumped.

## Framework portability

The kit is React 19, Tailwind CSS 4 and, from Phase 2, Base UI. Modules with hooks start with `"use client"`, so Next.js Server Components can import them. The site's Astro choice affects only the site. The ink engine has no framework dependency, which is what lets the site render prints at build time and leaves room for a later port.
