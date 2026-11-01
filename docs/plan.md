# Plan

Status: Phase 2 done, 2026-11-01. The maintainer approved the recommended stack, primitives, demo product and license on 2026-11-01; decisions still marked **proposed** wait for them, and the open questions at the end list what remains.

## What Patina UI is

Patina UI is a shadcn/ui component library that looks like printed matter that has been handled: warm paper, riso inks slightly out of register, a serif to read, a hand to annotate, a mono to label, and marks drawn with a pen. Its signature is **seeded variation**: every card, outline, avatar and illustration is a little different from its neighbours and exactly the same on every render, because each one is drawn from a seed.

The style comes from [Mental Models](https://mentalmodels.ossianravn.dev) ("field notes", `C:\CodexApp\mental-models`). The working method, kit/site split and registry approach come from [Groundwork](https://github.com/ossianravn/groundwork) (`C:\CodexApp\awesome-web-template`).

Tagline candidates: "shadcn/ui, with a patina." · "Every surface has a history."

## Goals

1. **shadcn parity.** All 65 `registry:ui` items in shadcn 4.23.0 (checked 2026-11-01) restyled in the Patina language, with shadcn's names, props, variants and `data-slot` attributes, built on Base UI. [Inventory](components.md).
2. **Seeded generative art as a system.** Prints (riso illustrations) with a motif library, ink sets and misregistration, used across avatars, covers, empty states, chart fills, dividers and share images. A Press playground to explore them. [Seeded variation](seeded-variation.md).
3. **Patina extras.** About 25 components shadcn lacks: marks (highlight, hand underline, circle, tape, stamp, margin note, annotation), paper objects (index card, paper stock, ticket) and editorial parts (sidenote, ringed steps, drawn checklist, scale, concept map).
4. **A demo site** with a home page, a docs page per component, the Press, a theme studio and a demo product that uses the kit end to end. [Demo site](demo-site.md).
5. **Installable** through the shadcn CLI, working in a fresh Vite app and a fresh Next.js app.
6. **Quality**: WCAG 2.2 AA in both themes and the "would Apple ship this" bar. [Quality contract](quality.md).

## Non-goals for v1

- A copy of the Mental Models site. Patina extracts its language and generalizes it for application UI.
- A sticker, mascot or kawaii kit. Looseleaf already covers hand-drawn whimsy; Patina is editorial and print-shop.
- A custom hand-drawn interface typeface. Interface text stays in proven, legible faces.
- Backend services, authentication or databases in the demo.
- Ports to other frameworks. The ink engine is framework-free so a port stays possible later.

## How Patina differs from Looseleaf

[Looseleaf](https://github.com/kevintngo/looseleaf) (MIT, 123 components, 2026) is the closest prior art: shadcn/ui drawn by hand. Patina is deliberately different.

|                        | Looseleaf                                             | Patina UI                                                                                             |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Metaphor               | Pen on paper, stickers, a mascot                      | Riso print shop and field notebook                                                                    |
| Interface type         | One hand-drawn face (Kevin Sans) for everything       | Serif to read, mono to label, hand only to annotate                                                   |
| How controls are drawn | A measured SVG per component from a custom pen engine | CSS draws frames, SVG draws marks, JS measures only when a mark must hug content                      |
| Randomness             | Seeded strokes                                        | Seeded strokes plus generative prints, misregistration, ink sets and age marks, with a reroll culture |
| Primitives             | Radix                                                 | Base UI (shadcn `base-nova`)                                                                          |
| Signature              | Hand-drawn whimsy                                     | Generative riso prints and editorial calm                                                             |

Looseleaf lessons we adopt: keep shadcn's API and `data-slot` names; derive the registry from the source tree and never hand-edit it; test installation into fresh consumer apps; offer a calm density; support forced colors, reduced motion and 24 px targets.

## Decisions

| #   | Decision                                                                                                                                                                    | Status                      | Rationale and alternatives                                                                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Kit and site in one repository**: kit in `src/patina/`, site around it, as in Groundwork                                                                                  | proposed                    | One place to change a component and its docs. A monorepo with packages adds tooling without a consumer that needs it.                                                                                                                                                                                                                  |
| D2  | **Base UI** primitives (shadcn `base-nova` style)                                                                                                                           | decided 2026-11-01          | Matches Groundwork, so patterns and fixes transfer. Radix would match Looseleaf and older shadcn examples.                                                                                                                                                                                                                             |
| D3  | **Site on Astro 7 with React islands and MDX**                                                                                                                              | decided 2026-11-01          | Static pages, build-time prints (zero JS for most art, as Mental Models proves), MDX docs, islands for interactive demos. Alternatives: Vite SPA like Groundwork (no static HTML for docs without extra prerendering); Next.js (shadcn's own docs stack, heavier for a static site). The kit stays framework-neutral React either way. |
| D4  | **Rendering**: CSS draws frames, SVG draws marks, JS measures only when a mark must hug content                                                                             | proposed                    | Controls stay crisp, cheap and server-rendered. See [Architecture](architecture.md#rendering).                                                                                                                                                                                                                                         |
| D5  | **Seed model**: FNV-1a `seedOf(text)` plus a small PRNG with labelled forks; seeds from an explicit prop, then content, then a scoped key                                   | proposed                    | Ported from Mental Models' `sketch.ts`. Labelled forks keep existing output stable when a new random choice is added.                                                                                                                                                                                                                  |
| D6  | **Ink roles**: bright print inks for marks and art; deeper text inks for text; hand inks at 3:1 for large bold handwriting                                                  | built (Phase 0)             | Five of Mental Models' light-theme inks fail AA as text on paper (pink 2.49:1), and the grain costs another 10–15 %. See [Design language](design-language.md#print-text-and-hand-inks).                                                                                                                                               |
| D7  | **Fonts**: Source Serif 4, Caveat, JetBrains Mono (all OFL), shipped as registry font items                                                                                 | proposed                    | The three voices of Mental Models. Instrument Sans as an optional interface sans for dense app screens.                                                                                                                                                                                                                                |
| D8  | **Distribution**: hosted registry at `<site>/r/{name}.json` (namespace `@patina`) plus the GitHub registry form `ossianravn/patina-ui/<item>` once the repository is public | proposed                    | The hosted registry works while the repository is private.                                                                                                                                                                                                                                                                             |
| D9  | **Paper textures generated by our own script** as seeded SVG noise tiles inlined in CSS, several stocks                                                                     | built (Phase 0)             | Mental Models' `paper.avif` is a scan of unrecorded provenance, and shadcn registry items carry only text files, so a baked AVIF could not ship through the registry either. About 1 KB per tile, tileable, regenerable. See [Seeded variation](seeded-variation.md#paper-stocks-and-patina).                                          |
| D10 | **Proportional verification**, no unit tests, first lasting tests at the registry install contract and the seed stability promise                                           | decided (maintainer policy) | [AGENTS.md](../AGENTS.md#verification-and-testing).                                                                                                                                                                                                                                                                                    |
| D11 | **MIT license** for code, art and textures                                                                                                                                  | decided 2026-11-01          | The license of shadcn/ui, Base UI, Looseleaf, Groundwork and Mental Models' code. Fonts stay under the SIL OFL. `LICENSE` in the repository root.                                                                                                                                                                                      |

## Phases

Each phase ships kit parts together with the site pages and demo-product screens that use them, so the inventory grows through workflows.

### Phase 0: foundations

Scaffold Astro + React 19 + Tailwind CSS 4 + shadcn (`base-nova`), `tsconfig` paths (`@/patina/*`), ESLint, Prettier and the scripts named in AGENTS.md. Port the Mental Models tokens (paper, inks, rules, voices, type steps), derive text inks, generate two paper stocks, port `sketch.ts` into the ink engine with labelled forks, add `<PatinaDefs>` (the shared SVG filters) and the theme runtime (day/night, variation, patina level) with a pre-paint script. Run a `golden-ratio-ux` audit of the type and spacing tokens.

Exit: a specimen page shows paper, the three voices, the marks from Mental Models and one print, correct on day and night paper at 1440 and 390 px, with every text pair at 4.5:1 or better measured on the textured background; typecheck, lint and build pass.

Outcome (2026-11-01): met. The specimen at `/` shows both stocks, both themes, both variation levels and all three patina levels through segmented controls that persist; `npm run check:contrast` passes every pair. Two changes to the plan came out of it: stocks are SVG noise rather than AVIF (D9), and handwriting got its own hand inks. The registry build moved to Phase 1, as planned there.

### Phase 1: marks and prints (the signature)

Marks: highlight, hand underline, circle, sketch frame, wash, tape, rough rule, margin note, annotation, stamp, glyph set. The print engine: the four Mental Models motifs ported, eight new motifs, ink sets, misregistration, grain, the `<Print>` component and the pure `print()` function. Press playground v0 (motif, seed, inks, reroll, copy). First registry build and `registry:check`.

Exit: the print gallery renders identical SVG on the server and in the browser for the same seed (no hydration warning); rerolling changes the print; `npx shadcn add` of `base` and `print` into a scratch Vite app builds.

Outcome (2026-11-01): met. Twelve motifs (four from Mental Models, eight new), four ink sets, `<Print>`, `SeedScope` and eleven marks ship; `/prints`, `/marks` and the Press (`/press`, URL-backed, with reroll, a contact sheet, copy and SVG download) show them. Server and hydrated Press markup are identical for all 25 prints, with no hydration warnings. The registry builds ten items, and `base` plus six mark and print items installed into a fresh Vite app (TypeScript 7, `strict`) byte-identical and built. Found on the way: `shadcn add` rewrites imports by file name, so kit modules now need unique names; and 3 of 200 `sprig` prints drifted between Node and Chromium until motifs stopped using `**` and the sketch wrapper snapped its inputs. Not covered: WebKit, and the lasting consumer test, which stays a Phase 2 exit criterion.

### Phase 2: core primitives and the demo product's first screens

Button, badge, card, input, textarea, label, field, checkbox, radio group, switch, select, native select, tabs, toggle, toggle group, separator, skeleton, avatar (seeded fallback), alert, progress, slider, kbd, tooltip, popover, dialog, alert dialog, dropdown menu, spinner. Component docs pages with state matrices. Demo product: sign-in, the list screen and settings.

Exit: every Phase 2 component has its docs page with all states in both themes and both variation levels; the three demo screens pass a `break-ui` worst-case pass; the first consumer install test exists in `tests/consumer/`.

Outcome (2026-11-01): met. The 28 primitives ship on Base UI, each with a docs page at `/docs/components/<name>`, and Fieldbook has its observations list (search, filter, add, duplicate, delete), the new-observation dialog, sign-in and settings. Before the primitives, Patina moved away from Mental Models at the maintainer's request: its own palette, the Archive stock, six generated paper layers, the `Paper` component with seeded edges and wear, and three new motifs.

- **Worst case** (dev-only `/fieldbook/data/worst`, `empty`, `one` and `thousand`): fixed an id collision after a delete, counts without separators, species cut off with no way to read them, count and status missing on phones, dates split across lines, the wrong empty state for an empty notebook, a header and filter row wider than 320 px, "1,284" rejected as a count, and 450–970 ms keystrokes at 1,000 rows (now 50 rows a page, 83 ms).
- **Consumer install** (`npm run test:consumer`): `base`, `print`, `paper`, three mark items and four primitives install offline into a fresh Vite app through the shadcn CLI, byte-identical, and the app builds.
- **Type and spacing**: the golden-ratio audit raised small, lead and label leading and added `leading-subhead` ([Type and spacing](design-language.md#audit)).
- Not covered: WebKit, and a side-by-side review of every docs page in all eight appearance combinations. Docs pages were checked for errors and horizontal overflow at 1440 and 390 px; Fieldbook at 320 to 1440 px, day and night.

### Phase 3: data, navigation and the rest of parity

Table and data table, pagination, breadcrumb, accordion, collapsible, command, combobox, sheet, drawer, menubar, navigation menu, context menu, hover card, calendar and date picker, chart (hand-drawn strokes, hatch fills, accurate data), sonner, sidebar, scroll area, resizable, carousel, input OTP, input group, button group, form, empty, item, aspect ratio, typography, direction, and the conversation set (message, bubble, message scroller, attachment, marker, trace, code block, questionnaire). shadcn's legacy `toast` is served by sonner. Demo product: detail screen, collections, an overview with charts.

Exit: parity table complete; a 200-row table with sketch styling scrolls without dropped frames on a mid-range laptop (see the [performance budget](quality.md#performance)).

### Phase 4: Patina extras, blocks and the home page

Index card, index row, ticket, drawn checklist, ringed steps, scale, concept map, decision map, reading progress, pull quote, sidenote, drop cap, edition number, postmark. Blocks: sign-in, settings, dashboard, pricing, article, empty states, hero. Home page with stageshow-style scenes built from real Patina components. Theme studio with presets and export.

Exit: home page and theme studio reviewed at wide and narrow widths in both themes; blocks install through the registry.

### Phase 5: release v0.1

Docs complete, CHANGELOG, share images (satori pipeline from Mental Models), consumer installs into Vite and Next.js, accessibility review against the quality contract, performance check, deployment of the static site.

Exit: the maintainer approves publishing; the site and registry are live.

## Risks

| Risk                                                          | Mitigation                                                                                                        |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| SVG displacement filters cost paint time across many elements | Filters only on thin frames and small marks; static rough.js paths in repeated rows; a measured budget in Phase 3 |
| Texture lowers effective contrast                             | `npm run check:contrast` measures every ink against the darkest and lightest 1 % of each textured surface         |
| Randomness causes hydration mismatches or flaky screenshots   | Seeds only from props, content or scope; never from time, index alone or layout                                   |
| Looks like a theme painted over shadcn                        | Each component gets a Patina treatment decided in the inventory, and the site shows them in real workflows        |
| Parity breadth (65 items) crowds out the signature            | Phase 1 ships the signature before parity work begins                                                             |
| Charm hurts dense application screens                         | The variation level (`calm`, `lively`) and calm defaults for operated controls                                    |
| Caveat is hard to read at small sizes                         | Hand voice at 22.9 px and weight 700 or larger, for asides only                                                   |
| Registry drifts from source                                   | Registry generated from the tree by script; `registry:check` in the routine checks                                |

## Open questions for the maintainer

Answered on 2026-11-01: Astro with React islands (D3), Base UI (D2), Fieldbook as the demo product and the MIT license (D11). The paper scan question no longer matters: stocks are generated (D9).

1. **Visibility (D8):** when should the repository become public? The GitHub registry form needs it; the hosted registry does not.
2. **Domain:** later, by the maintainer's choice; until then the site is local only.

## Next step

Phase 3: data, navigation and the rest of shadcn parity, led by the table, and Fieldbook's detail, collections and overview screens.
