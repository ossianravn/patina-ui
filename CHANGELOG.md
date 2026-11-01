# Changelog

## Unreleased

Phase 0: foundations. Nothing is published to the registry yet.

- Tokens (`src/patina/styles/`): Field and Newsprint paper stocks for day and night; print, text and hand inks, each checked against the textured paper (`npm run check:contrast`); a Golden Ratio type scale and spacing units from an 18 px body at a 37.5 rem measure; shadcn's semantic roles mapped onto them; Tailwind utilities through `@theme inline`.
- Paper grain generated as seeded SVG noise tiles (`npm run build:textures`), with `clean`, `handled` and `worn` patina levels.
- Mark utilities ported from Mental Models: `highlight`, `hand-underline`, `sketch-frame`, `wash`, `tape`, `margin-note`, `rough-rule`, `label-mono`.
- Ink engine (`src/patina/ink/`): `seedOf`, `prng`, `fork`, `stream`, the rough.js `sketch` wrapper, shared and per-print filters, and `print()` with the `orbits` motif and CSS-driven misregistration.
- `<PatinaDefs>` for the shared SVG filters; the appearance runtime (`appearanceScript`, `useAppearance`) for theme, stock, variation and patina level.
- A specimen page at `/` with appearance controls.
