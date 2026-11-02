# Demo site

Status: proposed, 2026-11-01. Built so far: the specimen at `/` (standing in for the home page), `/prints`, `/marks` and the Press at `/press`. The site documents the kit and proves it in use. It is built with Astro and React islands ([plan D3](plan.md#decisions)) and deployed as static files.

## Site map

| Route                 | Page                   | Purpose                                                                                |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | Home                   | Show the language at its best and get someone installing within a minute               |
| `/docs`               | Getting started        | Install, fonts, `<PatinaDefs>`, theme setup, first component                           |
| `/docs/foundations/*` | Foundations            | Paper and stocks, inks, voices, marks, seeded variation, patina, motion, accessibility |
| `/docs/components/*`  | One page per component | Preview, install, usage, states, API, accessibility, treatment notes                   |
| `/prints`             | Print gallery (built)  | Every motif and format, with seeds                                                     |
| `/docs/blocks/*`      | Blocks                 | Installable compositions                                                               |
| `/press`              | The Press (built)      | Generative print playground                                                            |
| `/studio`             | Theme studio           | Stocks, inks, variation and patina on real screens; export                             |
| `/fieldbook/*`        | Demo product           | The kit used end to end                                                                |
| `/changelog`          | Changelog              | Rendered from `CHANGELOG.md`                                                           |
| `/r/{name}.json`      | Registry               | Generated shadcn registry items                                                        |

## Home

1. **Hero.** A large `cover` print beside the headline, with its seed in mono and a reroll button, so the first thing a visitor does is see the randomness work. Headline in the serif with one highlighted phrase; the install command in a code block; two actions: _Get started_ and _Open the Press_.
2. **Every surface has a history.** A loose stack of index cards (Stageshow's _tilted stack_), each with its own print, tape and tilt; a Calm/Lively segmented control re-renders them live.
3. **In use.** Two or three Stageshow-style scenes built from real Patina components: a Fieldbook entry receiving a margin note, a settings panel switching paper stock, a checklist being ticked. Each scene has one idea, a poster frame that tells the story alone, and a compact design for phone widths.
4. **The index.** All components as a typeset A–Z list with glyphs, the way Mental Models lists its models, rather than a grid of identical boxes.
5. **Install and theme.** The registry command, then a link to the theme studio.

Built in Phase 4 (`src/site/home/`): the hero is the `hero-01` block; the calm/lively switch sets the visitor's real variation setting; the paper-stock scene re-scopes the stock rules to the scene at build time, because stocks apply only on `:root`; the index reads every demo's `meta`. The former specimen sections live at `/specimen`.

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

## Site appearance

The site starts on day Newsprint with Patina's inks, an oxblood accent, calm, clean and compact (`src/site/appearance.ts`) until a visitor chooses otherwise. The layouts' pre-paint script and every island that renders appearance on the server use it. The kit's own defaults ([architecture](architecture.md#theme-runtime)) stay what an install starts from, and the theme studio exports against those.

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

Built so far: sign-in, Observations, Observation, Expeditions, Overview and Settings, inside a sidebar shell (`src/site/fieldbook/shell.tsx`). Sign-in, Settings and Overview render the kit's `sign-in-01`, `settings-01` and `dashboard-01` blocks, so each exists once; Overview passes the figures it computes from the records as the block's `data`. Observation pages exist for the static records only; records added in the demo have none.

Alternatives considered: a **small-press shop** (riso zines: storefront, cart, order admin; the most literal fit, but checkout dominates) or a **reading log** (books and highlights; strong for typography, thin on data views, and close to Mental Models).

Demo data comes from static fixtures with seeded ids, so every observation keeps its print and avatar across reloads. Mutations reset on reload; appearance preferences persist locally.

Worst-case data lives beside the demo data (`src/site/fieldbook/worst-case.ts`). In dev, `/fieldbook/data/worst`, `empty`, `one` and `thousand` start the observations screen from it, with a switch at the bottom of the screen; the build generates none of these pages. Astro never passes a query string to a prerendered page, even in dev, so dev-only variants use a path. Add a worst-case row whenever a screen renders a new field.

## Stageshow

[Stageshow](https://github.com/benjitaylor/skills/tree/main/stageshow) (MIT) guides the home-page scenes and any feature illustrations: faux product UI that reads as a real product, simplified to what the viewer needs, framed with intent, every motion with a cause. We follow its workflow (plan the story, start from the closest gold example, set the poster frame first, film and review at the shown width and at 390 px) and use real Patina components inside the stage instead of its placeholder parts. Its bundled app icons are not MIT-licensed and stay out of this project.

## Share images

Each component, foundation and print page gets a 1200 × 630 share image rendered at build time with satori and resvg, reusing Mental Models' `og.ts` approach: the page's print, title in the serif and a mono kicker on paper.

## Deployment

The `Dockerfile` builds the static site and serves it with nginx (`deploy/nginx.conf`) as the `frontend` app of the Patina UI project in Dokploy, on the ByteHosting server (109.71.252.137), rebuilt on push to `main`, at `https://patinaui.com` (`www` redirects to the apex; Traefik issues the certificate). The registry JSON ships with the site under `/r/`. nginx serves each page at one URL without a trailing slash, as Astro builds them, and `404.html` for anything missing; hashed assets under `/_astro/` cache for a year.
