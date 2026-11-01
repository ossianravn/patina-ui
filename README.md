# Patina UI

A [shadcn/ui](https://ui.shadcn.com) component library that looks like printed matter that has been handled: warm paper, riso inks slightly out of register, a serif to read, a hand to annotate, a mono to label, and marks drawn with a pen. Every card, outline, avatar and illustration is drawn from a seed, so each one differs from its neighbours and looks the same on every render.

**Status:** Phase 4 done: shadcn parity, Patina's own extras, blocks, a theme studio and the home page. Phase 5 (release v0.1) is next. Patina has its own palette, layered paper that ages with use, cut-paper sheets, fifteen print motifs, the marks, every shadcn part on Base UI, a hand-drawn chart, component docs and Fieldbook, the demo product. [The plan](docs/plan.md) lists the phases, decisions and open questions.

## Run it

Requires Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4782`: the specimen, the print gallery (`/prints`), the marks (`/marks`), the Press (`/press`), the component docs (`/docs`) and Fieldbook (`/fieldbook`). `package.json` lists the checks (`typecheck`, `lint`, `build`, `check:contrast`); `npm run build:textures` regenerates the paper grain after a stock's layers change in `tools/paper/build-textures.mjs`.

## Use the kit

The kit installs with the shadcn CLI from its registry (`public/r/`, served by the site). Until the site has a domain, serve it locally with `npm run dev` and point a project at it:

```json
{ "registries": { "@patina": "http://127.0.0.1:4782/r/{name}.json" } }
```

```sh
npx shadcn add @patina/print @patina/notes
```

Items install into `src/patina/` (the project needs an `@/` alias for `src/`). Make `src/patina/styles/patina.css` your Tailwind entry, render `<PatinaDefs />` once inside `<body>`, and put `appearanceScript()` in an inline `<script>` in `<head>` to apply saved appearance before the first paint. `npm run registry` rebuilds the registry after a kit change.

## Documents

| Document                                     | What it owns                                                  |
| -------------------------------------------- | ------------------------------------------------------------- |
| [Plan](docs/plan.md)                         | Goals, decisions, phases, risks, open questions               |
| [Design language](docs/design-language.md)   | Paper, inks, type voices, marks, focus, motion                |
| [Seeded variation](docs/seeded-variation.md) | Seeds, generative prints, variation and patina levels         |
| [Architecture](docs/architecture.md)         | Repository layout, rendering, theme runtime, tokens, registry |
| [Component inventory](docs/components.md)    | Every planned component, its treatment and phase              |
| [Primitives](docs/primitives.md)             | How shadcn's parts are printed in Patina                      |
| [Demo site](docs/demo-site.md)               | Site map, the Press, theme studio, the Fieldbook demo product |
| [Quality contract](docs/quality.md)          | Accessibility, performance, definition of done                |
| [Sources](docs/sources.md)                   | References, licenses and what each contributes                |
| [AGENTS.md](AGENTS.md)                       | Working instructions for coding agents                        |

The style comes from [Mental Models](https://mentalmodels.ossianravn.dev); the working method from [Groundwork](https://github.com/ossianravn/groundwork).

## License

Code, art and generated textures: [MIT](LICENSE). The fonts (Source Serif 4, JetBrains Mono, Caveat) are under the SIL Open Font License, shipped with their Fontsource packages.
