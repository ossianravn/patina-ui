# Demo site

Status: proposed, 2026-11-01; Phase 0 built only a specimen page at `/`. The site documents the kit and proves it in use. It is built with Astro and React islands ([plan D3](plan.md#decisions)) and deployed as static files.

## Site map

| Route                 | Page                   | Purpose                                                                                |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | Home                   | Show the language at its best and get someone installing within a minute               |
| `/docs`               | Getting started        | Install, fonts, `<PatinaDefs>`, theme setup, first component                           |
| `/docs/foundations/*` | Foundations            | Paper and stocks, inks, voices, marks, seeded variation, patina, motion, accessibility |
| `/docs/components/*`  | One page per component | Preview, install, usage, states, API, accessibility, treatment notes                   |
| `/docs/prints`        | Print gallery          | Every motif and format, with seeds                                                     |
| `/docs/blocks/*`      | Blocks                 | Installable compositions                                                               |
| `/press`              | The Press              | Generative print playground                                                            |
| `/themes`             | Theme studio           | Stocks, inks, variation and patina on real screens; export                             |
| `/fieldbook/*`        | Demo product           | The kit used end to end                                                                |
| `/changelog`          | Changelog              | Rendered from `CHANGELOG.md`                                                           |
| `/r/{name}.json`      | Registry               | Generated shadcn registry items                                                        |

## Home

1. **Hero.** A large `cover` print beside the headline, with its seed in mono and a reroll button, so the first thing a visitor does is see the randomness work. Headline in the serif with one highlighted phrase; the install command in a code block; two actions: _Get started_ and _Open the Press_.
2. **Every surface has a history.** A loose stack of index cards (Stageshow's _tilted stack_), each with its own print, tape and tilt; a Calm/Lively segmented control re-renders them live.
3. **In use.** Two or three Stageshow-style scenes built from real Patina components: a Fieldbook entry receiving a margin note, a settings panel switching paper stock, a checklist being ticked. Each scene has one idea, a poster frame that tells the story alone, and a compact design for phone widths.
4. **The index.** All components as a typeset A–Z list with glyphs, the way Mental Models lists its models, rather than a grid of identical boxes.
5. **Install and theme.** The registry command, then a link to the theme studio.

## Component pages

Each page follows one anatomy:

1. Title and a one-line hook saying what the component is for.
2. **Preview on paper** with a small toolbar: Day/Night, Calm/Lively, and Reroll where the component varies. RTL where direction matters.
3. **Install**: `npx shadcn add @patina/<name>` and what it brings.
4. **Usage** with the shortest working code.
5. **Examples**: variants and every state (default, hover, focus, pressed, selected, disabled, invalid, loading, empty) rendered, not described.
6. **API**: shadcn's props plus Patina's additions (`seed`, `variation`, `motif`).
7. **Accessibility**: keyboard map, names, what decoration hides from assistive technology and why.
8. **Treatment notes**: why it looks the way it does, linking the foundation it draws on.

## The Press

The playground for prints. Controls sit in a narrow column of settings rows (about 22 rem), the print fills the rest:

| Setting                | Control                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Motif                  | Select (17 options)                                                                                                   |
| Format                 | Select (spot, cover, avatar, pattern, rule)                                                                           |
| Ink set                | Swatch radio group                                                                                                    |
| Seed                   | Text field sized for about 16 characters, with a reroll button; rerolls produce memorable seeds such as `quiet-heron` |
| Misregistration, grain | Sliders with mono values                                                                                              |
| Variation              | Segmented control (Calm, Lively)                                                                                      |
| Paper                  | Select of stocks                                                                                                      |

Below the print, a contact sheet of 24 neighbouring seeds lets people pick by eye. Actions: copy seed, copy JSX, download SVG, download PNG. The current settings live in the URL so a print can be shared.

## Theme studio

Stock, ink set, accent drum, variation, patina level, density and the optional interface sans, previewed on real Fieldbook screens and component specimens at once. Export as CSS or as a shadcn `registry:theme` item that `npx shadcn add ./theme.json` installs (Groundwork's flow).

## Demo product

The product that proves the kit, chosen on 2026-11-01: **Fieldbook**, a notebook for field research where people log observations, annotate them and organize them into expeditions. It matches the language (field notes, specimens, maps) and exercises nearly every component:

| Screen                      | Components it exercises                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Landing, pricing, changelog | Prints, index cards, tickets, navigation menu, accordion                                                                            |
| Sign in, onboarding         | Field, input, input OTP, questionnaire, steps                                                                                       |
| Observations                | Table and data table, filters (combobox, toggle group), pagination, command search, empty state                                     |
| Observation                 | Typography, highlight, margin notes, annotations, identification scale, checklist, attachments, concept map of related observations |
| Expeditions                 | Index cards with cover prints, calendar, date picker, avatars, hover cards                                                          |
| Overview                    | Charts with hatch fills, progress, badges                                                                                           |
| Identification assistant    | Message, bubble, trace, code block (scripted, no model calls)                                                                       |
| Team and comments           | Avatars, message scroller, marker, sonner                                                                                           |
| Settings                    | Settings rows in a narrow column, appearance control, switch, select, alert dialog                                                  |

Alternatives considered: a **small-press shop** (riso zines: storefront, cart, order admin; the most literal fit, but checkout dominates) or a **reading log** (books and highlights; strong for typography, thin on data views, and close to Mental Models).

Demo data comes from static fixtures with seeded ids, so every observation keeps its print and avatar across reloads. Mutations reset on reload; appearance preferences persist locally.

## Stageshow

[Stageshow](https://github.com/benjitaylor/skills/tree/main/stageshow) (MIT) guides the home-page scenes and any feature illustrations: faux product UI that reads as a real product, simplified to what the viewer needs, framed with intent, every motion with a cause. We follow its workflow (plan the story, start from the closest gold example, set the poster frame first, film and review at the shown width and at 390 px) and use real Patina components inside the stage instead of its placeholder parts. Its bundled app icons are not MIT-licensed and stay out of this project.

## Share images

Each component, foundation and print page gets a 1200 × 630 share image rendered at build time with satori and resvg, reusing Mental Models' `og.ts` approach: the page's print, title in the serif and a mono kicker on paper.

## Deployment

Static build served by nginx on Dokploy, rebuilt on push to `main`. Proposed domain: `patina.ossianravn.dev`. The registry JSON ships with the site under `/r/`.
