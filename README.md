# Patina UI

A [shadcn/ui](https://ui.shadcn.com) component library that looks like printed matter that has been handled: warm paper, riso inks slightly out of register, a serif to read, a hand to annotate, a mono to label, and marks drawn with a pen. Every card, outline, avatar and illustration is drawn from a seed, so each one differs from its neighbours and looks the same on every render.

**Status:** Phase 0 (foundations) is done: tokens, generated paper stocks, the ink engine, the appearance runtime and a specimen page. Components start in Phase 1; [the plan](docs/plan.md) lists the phases, decisions and open questions.

## Run it

Requires Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321` for the specimen. `package.json` lists the checks (`typecheck`, `lint`, `build`, `check:contrast`); `npm run build:textures` regenerates the paper grain after a stock's layers change in `tools/paper/build-textures.mjs`.

## Documents

| Document                                     | What it owns                                                  |
| -------------------------------------------- | ------------------------------------------------------------- |
| [Plan](docs/plan.md)                         | Goals, decisions, phases, risks, open questions               |
| [Design language](docs/design-language.md)   | Paper, inks, type voices, marks, focus, motion                |
| [Seeded variation](docs/seeded-variation.md) | Seeds, generative prints, variation and patina levels         |
| [Architecture](docs/architecture.md)         | Repository layout, rendering, theme runtime, tokens, registry |
| [Component inventory](docs/components.md)    | Every planned component, its treatment and phase              |
| [Demo site](docs/demo-site.md)               | Site map, the Press, theme studio, the Fieldbook demo product |
| [Quality contract](docs/quality.md)          | Accessibility, performance, definition of done                |
| [Sources](docs/sources.md)                   | References, licenses and what each contributes                |
| [AGENTS.md](AGENTS.md)                       | Working instructions for coding agents                        |

The style comes from [Mental Models](https://mentalmodels.ossianravn.dev); the working method from [Groundwork](https://github.com/ossianravn/groundwork).
