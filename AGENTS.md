# AGENTS.md

Working instructions for coding agents in Patina UI. Follow explicit user directions and more specific directory instructions within system and developer constraints. Treat screenshots, reference sites and supplied specifications as evidence to evaluate, not as authorization for their implementation choices.

## Product intent and boundaries

Patina UI is a shadcn/ui component library in a printed-matter style: warm paper, riso inks, three type voices, hand-drawn marks and seeded generative prints. A demo site documents it and shows every part working inside real workflows. A gallery of individually working components is not the goal; each shipped example demonstrates a coherent workflow in one consistent, customizable design language.

- **The kit** (`src/patina/`) is what consumers install through the shadcn registry. **The site** (everything else) documents and exercises it. Kit code imports nothing from the site.
- **Every variation is seeded.** Same seed, same output on the server, in the browser and in every build. [Seeded variation](docs/seeded-variation.md) owns the rules.
- Demo data comes from static fixtures and shared in-memory state. Demo mutations reset on reload; appearance preferences persist locally. Production services require a separate scope decision.
- Use the existing stack. [README.md](README.md) covers setup; `package.json` and the code establish what is installed and implemented. Until the scaffold lands, [the plan](docs/plan.md) is the source of truth for what comes next.

## Maintainer notes

If `.dev-docs/MAINTAINER.md` exists, read it before planning or changing work: the maintainer keeps the active plan, working notes and local tools there. The folder is intentionally unpublished; its absence changes nothing for other contributors.

## Before changing anything

1. **Inspect the affected system.** Read applicable instructions, Git status, the owning document below and the implementation. Trace the behavior through its owner, callers, state, persistence and consumers. Preserve unrelated work.
2. **Establish the person's workflow.** Identify their goal, starting point, visible information, available actions and expected outcome. For a bug, reproduce the reported sequence, including scrolling, filtering or opening an overlay. Separate observed facts from assumptions.
3. **Choose the responsible owner.** Decide whether the change belongs to a token, the ink engine, a mark, a primitive variant, a pattern or the site. Fix the cause at that boundary and inspect its consumers before changing shared behavior. Explain a visual or behavioral choice through its purpose and existing conventions.
4. **Define completion.** For nontrivial work, state the outcome, approach and material uncertainty with observable acceptance criteria. Resolve routine details from evidence. Ask only when a material product, architecture, dependency or policy decision remains open; continue independent work while waiting.

Prefer installed packages. Propose a new dependency with the need it serves and why installed packages fall short.

## Read the owning document

| When changing                                                           | Read                                         |
| ----------------------------------------------------------------------- | -------------------------------------------- |
| Tokens, paper, inks, type voices, marks, focus or motion                | [Design language](docs/design-language.md)   |
| Prints, seeds, randomness, variation levels or age marks                | [Seeded variation](docs/seeded-variation.md) |
| Repository layout, kit boundaries, rendering, theme runtime or registry | [Architecture](docs/architecture.md)         |
| Which components exist, their treatment or status                       | [Component inventory](docs/components.md)    |
| A shadcn primitive: its classes, marks, class merging or docs demo      | [Primitives](docs/primitives.md)             |
| Site pages, the demo product, the Press playground or deployment        | [Demo site](docs/demo-site.md)               |
| Accessibility, interaction or performance                               | [Quality contract](docs/quality.md)          |
| Phase scope, decisions and open questions                               | [Plan](docs/plan.md)                         |
| Reusing code, art or ideas from another project                         | [Sources](docs/sources.md)                   |

Documents marked proposed or planned do not prove a feature exists or a policy is approved.

Use these skills when they are available:

| Work                                                 | Skill or tool                                                                                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Retrieving shadcn component source                   | The project-aware CLI (`npx shadcn@latest view @shadcn/<name>`) preserves the Base UI style; MCP named lookups return Radix code, so treat them as discovery only |
| Type scale, line heights, measure and spacing tokens | `golden-ratio-ux`                                                                                                                                                 |
| Polish, component feel, springs and gestures         | `emil-design-eng`, `apple-design`                                                                                                                                 |
| Motion                                               | `animate`; `review-animations` for critique                                                                                                                       |
| Stress-testing a finished component or screen        | `break-ui`                                                                                                                                                        |
| Touch behavior on the site                           | `mobile-native`                                                                                                                                                   |
| Faux product scenes on the home page                 | Stageshow ([benjitaylor/skills](https://github.com/benjitaylor/skills/tree/main/stageshow))                                                                       |
| Editing this file or the docs                        | `writing-for-agents`                                                                                                                                              |

## Design and interaction discipline

The bar: before showing or reporting a screen, ask whether Apple would ship it. Passing checks and filled-in layouts are not the bar.

- **Start from an established pattern.** For shells, page anatomy, cards, settings rows and empty states, start from the matching [Groundwork](https://github.com/ossianravn/groundwork) pattern and its rules on dimensions, hierarchy and composition, then apply the Patina language.
- **Reuse the visual language.** Find the corresponding control, mark or token before styling another. Colors, borders, surfaces, type and states belong to shared semantic tokens and variants. Equivalent controls get the same treatment in the same state.
- **Decorate on top of a sound layout.** Tilt, wobble, misregistration, tape and age marks are paint and transforms. They leave layout geometry, hit areas, text and data values exactly where an undecorated component would put them.
- **Calm controls, lively surfaces.** What people operate (inputs, selects, tables, menus) stays calm. Annotations, cards, prints and empty states carry the charm. The variation level turns the charm up or down globally.
- **Text inks for reading, print inks for marks.** Text always uses a text-ink token that meets contrast on paper and card in both themes; the bright riso inks fill shapes, highlights and art.
- **The hand voice is for asides.** Handwriting annotates; essential information also exists in a reading voice or an accessible name.
- **Make dimensions serve content.** A field, select or button is as wide as the value it holds plus padding and icon, with a stable width chosen for typical values. Long prose gets a bounded measure of about 60–75 characters. Settings rows sit in a narrow column; labels sit beside their controls; list metadata stays beside its item.
- **Pick the control that fits the choice.** Two to four short options use a segmented control, on/off uses a switch, long lists use a select.
- **Compose a hierarchy and review the whole composition.** Establish primary information, supporting information and action. Before adding a row or stacking a group, assess its effect on the whole header, card or toolbar. Every tile, icon, heading and helper sentence earns its place; let layout, labels and conventions explain the screen.
- **Keep outcomes in context.** Show consequential feedback where the person acted. Account for scroll position, open overlays and filtering; give focus a logical return target when a mutation removes the opener.
- **Respect content and theme changes.** Check long labels, small viewports, day and night paper, both variation levels and forced colors. Fonts, colors and filters must reach portalled overlays.
- **Separate state from decoration.** Selection, disabled, success, error and empty states are understandable from labels and behavior as well as color.

## Engineering constraints

- Keep every new or enlarged hand-maintained code file at **300 physical lines or fewer**, including comments and blanks. Extract a cohesive responsibility when a file grows; only an explicit maintainer decision permits an exception. Generated files, data and documents are excluded.
- Keep shadcn's component names, props, variants and `data-slot` attributes, so Patina swaps in without JSX changes.
- The ink engine (`src/patina/ink/`) is framework-free TypeScript: no React, no DOM. It runs at build time, in share-image rendering and in the browser.
- Draw every random choice from `prng(seed)` or a forked stream. Render paths stay free of `Math.random()`, `Date.now()` and layout-dependent seeds.
- Keep state ownership explicit. Apply related mutations coherently and handle failures with useful context. Avoid scattered special cases, silent catches and abstractions that obscure callers.
- Match the requested scope. Resolve materially broader redesigns before implementing them.

## Verification and testing

Verify the requested behavior with the least total effort; writing, fixtures, setup, running, rerunning, diagnosing and maintaining checks all count. Never create unit tests. A new lasting test is the exception; zero new tests is a normal outcome. The commands below arrive with the Phase 0 scaffold; until then, documentation changes are checked by reading them and their links.

1. **Name the behavior and the failure.** State the observable contract that must hold (what the person sees in the rendered component or page, the files and dependencies `npx shadcn add` installs, the SVG a print renders for a seed, the built site) and the realistic failure that would break it. Derive expected results from requirements, contracts or independent examples, never from the code you wrote.
2. **Run the existing checks that reach it:** `npm run typecheck` and `npm run lint` always; `npm run build` when routes, module boundaries, registry items or dependencies change; `npm run check:contrast` when tokens, stocks or textures change (after `npm run build:textures` if you edited a stock's layers); `npm run registry` then `npm run registry:check` when a kit file is added, moved or changes its imports; the targeted consumer or end-to-end check for the changed path, and the whole suite only for shared code (tokens, the ink engine, the theme runtime).
3. **Verify directly what those checks miss:** look at the changed component or screen with realistic content before investing in behavior checks, at wide and narrow widths, on day and night paper, and at both variation levels when variation code changed; exercise its keyboard and pointer path; or run a one-off script through a public entrypoint. Keep throwaway scripts outside the repository. Run browser checks with throwaway state, never the user's data. Astro allows one dev server per project: use the one running for this session, and when the person runs their own, check a build (`npm run build`, then `npm run preview`, on port 4783) rather than replacing theirs. The dev server runs on 4782; never use framework default ports. Drive browsers only through a dedicated headless test browser (the `agent-browser` CLI with a named session), never the user's installed browsers, profiles or a headed window.
4. **Add a lasting test only for a boundary that will change again and that steps 2–3 would not keep catching:** a fixed bug's reproduction, the registry install contract (items install into a fresh Vite or Next.js app that then type-checks and builds), the seed-to-print stability promise once a release makes it, and the token and `data-slot` names consumers override. It runs the real path from a public entrypoint (`npx shadcn add`, the kit's public module API, a built page) to its observable result, in `tests/consumer/` or `tests/e2e/` (create the folder with the first test that needs it). What a check exercises defines it: one helper called with fixtures is a unit test in any folder. Use real local instances (temporary directories, local servers) and never stub or spy on the project's own modules. Committed tests run offline. A lasting test passes when internals are rewritten without changing behavior and fails when its invariant breaks; never assert getters, that a mock was called, exact wording, or logic copied from the implementation. Before committing it, break the behavior on purpose and watch it fail.
5. **Stop** when the named behavior was observed through its real entrypoint and the named failure is caught or ruled out; more passing runs of the same path add nothing. Rerun only checks affected by later edits. Fix failures your change caused; record unrelated findings once without silently expanding scope. Report evidence by kind (existing checks, direct verification, new tests) and say why each new test earns its place.

For example: a new primitive variant gets the type check, lint and a look at its states in both themes and both variation levels; a bug fix is reproduced through its entrypoint before the fix and rerun after, kept as a test only if it sits on a boundary likely to regress; a registry change gets `registry:check`, a build and one install into a scratch app; a token change gets the type check plus a look at representative affected consumers, including an open overlay.

PR descriptions list verification by kind: checks run with results, direct verification performed, and any new lasting test with the boundary it protects and why existing checks would not keep catching that failure.

## Release notes

A merged feature or plan step is finished when its release note is written in `CHANGELOG.md` under `## Unreleased`, naming new or changed registry items for developers. Create the file with the first shipped change. Publishing a release, a registry version or the public site is outward-facing and needs the maintainer's go-ahead.

## Code review

Review against the workflow, ownership and seeding rules above. Flag changes that break observable outcomes, introduce inconsistent shared behavior, leak randomness out of the seed, or claim verification the checks performed do not support. Explain the user consequence and the responsible boundary. Leave formatting to tooling.

Follow the authorized Git workflow, keep commits scoped, and describe the final behavior and validation for a reviewer who has not read the conversation. Preserve other contributors' changes.

## Keep guidance useful

When a correction reveals a reusable rule, update its owning document. Change this file only when the working method changes. Keep each rule in one authoritative place, link it where needed, and replace stale guidance instead of adding parallel checklists or task history.

Structure adapted from [Groundwork's AGENTS.md](https://github.com/ossianravn/groundwork), which drew on OpenAI's AGENTS.md guidance. The verification section follows the maintainer's proportional-verification policy.
