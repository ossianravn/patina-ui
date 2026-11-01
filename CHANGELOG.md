# Changelog

## Unreleased

Phase 3: the rest of shadcn parity, and Fieldbook's main screens.

- Data and layout: `table` (a ledger with a sticky heading; the docs add a data table and a 200-row ledger), `pagination`, `breadcrumb`, `item`, `empty`, `aspect-ratio`, `scroll-area`, `resizable`, `accordion`, `collapsible` and `typography` (a prose container with a kicker and drop cap).
- Overlays and navigation: `sheet` (a deckled edge), `drawer`, `hover-card`, `context-menu`, `menubar`, `navigation-menu`, `sidebar` with `use-mobile`, and `direction`.
- Forms: `input-group`, `input-otp`, `button-group`, `command`, `combobox`, `calendar` (with date and range pickers in the docs), `carousel`, `sonner` (following Patina's day and night paper instead of next-themes) and `questionnaire`. `form` is served by `field` and `toast` by `sonner`, as in base-nova.
- `chart`: shadcn's Recharts chart in the ink set's drums, a hatch fill per series (`fill="var(--hatch-<key>)"`), and `drawnBar`, `drawnCurve` and `drawnSector`, which draw strokes by hand through the exact data points. `--chart-1…5` now follow the ink set.
- Conversation: `message`, `bubble`, `message-scroller`, `marker`, `trace`, `attachment`, and `code-block` with `use-highlighted-code` (Shiki, coloured with Patina's text inks).
- Fixes: `checkbox` draws a dash when partly checked; `dropdown-menu` (and so `context-menu` and `menubar`) uses logical properties for right-to-left text; `margin-note` mirrors in right-to-left text.
- Registry: 77 items. A part split across files installs as one item, and `code-block` brings its hook.
- Site: the Components index is grouped as in the inventory. Fieldbook moves into a sidebar shell and gains an observation page (journal, attachments, reviewers' notes, conditions), Expeditions (with a planning sheet that uses the date picker and combobox) and an Overview (headline numbers, two hand-drawn charts, the week's biggest counts and today's survey).

Phase 2: Patina's own look, and the core primitives.

- Identity: a new default palette (verdigris, copper, indigo, plum, rose, ochre, oxblood), the Archive stock (ivory; bronze at night) as the default, Field kept as a stock and an ink set, a new mark, and site copy drawn from Fieldbook rather than Mental Models.
- Paper: six generated layers (tooth, relief, fibres, specks, mottle, foxing) at tile sizes that never visibly repeat; edge toning by patina level; per-stock text and hand inks derived by `node tools/check-contrast.mjs --suggest`.
- `paper`: a sheet with a seeded deckle, torn, perforated or pinked edge, a dog-ear, tilt, and wear that follows the patina level (smudge and fold when handled; coffee rings, foxing, creases and a worn corner when worn).
- `print`: three new motifs, `collage`, `tiles` and `lino` (fifteen in all), and the `patina` ink set as the default.
- Primitives on Base UI (shadcn `base-nova` sources in the Patina language): `alert`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `field`, `input`, `kbd`, `label`, `native-select`, `popover`, `progress`, `radio-group`, `select`, `separator`, `skeleton`, `slider`, `spinner`, `switch`, `tabs`, `textarea`, `toggle`, `toggle-group` and `tooltip`.
- `base`: `cn` built with `createCn` so Patina's theme names survive class merging; `controls.css` and `paper.css`.
- Type: small text, lead paragraphs and mono labels get more leading, and `leading-subhead` (1.3) sets titles at lead and body size, after a golden-ratio audit.
- Site: component docs at `/docs`, and Fieldbook, the demo product, at `/fieldbook` (observations, new observation, sign-in, settings), checked against worst-case data. The Press's ink picker shows swatches, so it fits a phone.
- Consumer install test (`npm run test:consumer`): registry items install offline into a fresh Vite app and build.

Phase 1: marks, prints and the registry.

- Registry (`npm run registry`, `npm run registry:check`): `base`, `print`, `glyph`, `highlight`, `hand-underline`, `hand-marks`, `paper-marks`, `notes`, `stamp` and the `patina` umbrella.
- `print`: twelve motifs (`rings`, `lens`, `orbits`, `constellation`, `contours`, `halftone`, `flow`, `horizon`, `sprig`, `blocks`, `scatter`, `monogram`), the Field, Fluoro, Earth and Spot ink sets, `<Print>` and a `standalone` SVG mode. The same seed draws the same print in Node and Chromium.
- `base`: `SeedScope` and `useSeed`; the ink engine snaps coordinates before drawing, so prints do not drift between engines.
- Marks: `Highlight`, `HandUnderline`, `Circle`, `Strike`, `Bracket`, `SketchFrame`, `Wash`, `Tape`, `RoughRule`, `MarginNote`, `Annotation`, `Stamp` and `Glyph` (sixteen glyphs).
- Site: the print gallery (`/prints`), the marks (`/marks`) and the Press (`/press`).
- MIT license.

Phase 0: foundations.

- Tokens (`src/patina/styles/`): Field and Newsprint paper stocks for day and night; print, text and hand inks, each checked against the textured paper (`npm run check:contrast`); a Golden Ratio type scale and spacing units from an 18 px body at a 37.5 rem measure; shadcn's semantic roles mapped onto them; Tailwind utilities through `@theme inline`.
- Paper grain generated as seeded SVG noise tiles (`npm run build:textures`), with `clean`, `handled` and `worn` patina levels.
- Mark utilities ported from Mental Models: `highlight`, `hand-underline`, `sketch-frame`, `wash`, `tape`, `margin-note`, `rough-rule`, `label-mono`.
- Ink engine (`src/patina/ink/`): `seedOf`, `prng`, `fork`, `stream`, the rough.js `sketch` wrapper, shared and per-print filters, and `print()` with the `orbits` motif and CSS-driven misregistration.
- `<PatinaDefs>` for the shared SVG filters; the appearance runtime (`appearanceScript`, `useAppearance`) for theme, stock, variation and patina level.
- A specimen page at `/` with appearance controls.
