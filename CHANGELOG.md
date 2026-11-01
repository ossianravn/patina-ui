# Changelog

## Unreleased

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
