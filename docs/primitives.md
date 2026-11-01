# Primitives

How Patina treats shadcn's parts (`src/patina/ui/`). Each file starts from shadcn's `base-nova` source (Base UI), fetched with the project's CLI (`node node_modules/shadcn/dist/index.js add <name>`), and keeps shadcn's component names, parts, props, variants and `data-slot` attributes so Patina swaps in without JSX changes. Only the classes change, plus drawn marks where a part has one. The exemplars are `button.tsx`, `input.tsx`, `textarea.tsx`, `checkbox.tsx`, `card.tsx` and `label.tsx`.

## Calm controls, lively surfaces

What people operate stays calm: crisp pen lines, no wobble, no tilt, no tape. Character comes from three places: the drawn marks a control carries (a hand tick, an inked dot, a hand underline, a highlighter stroke), the paper surfaces things sit on (cards, menus, dialogs), and the type voices.

## Shared treatment

| Concern               | Treatment                                                                                                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Text fields, triggers | `control-field` (pen line `--input`, sheet corners, card stock, 16 px `text-ui`, invalid and disabled states) at `h-control` (2.75 rem) or `h-control-compact` (2.25 rem)   |
| Buttons and labels    | Mono, uppercase, bold, `text-button`, `tracking-[0.08em]`; solid ink for the main action                                                                                    |
| Corners               | `rounded-sheet` (irregular 3/5/4/3 px). Pills only where the shape means something (switch track, slider thumb)                                                             |
| Floating surfaces     | `float-sheet` for menus, popovers, select lists; dialogs use `sheet` plus a seeded `Tape` at the lively level                                                               |
| Focus                 | The page's global dashed ring (`:focus-visible` in `base.css`). Remove shadcn's `outline-none`, `ring-*` and `focus-visible:border-ring` classes rather than restyling them |
| Selected, checked     | Solid ink with paper text (segmented and toggle groups), or a drawn mark in the region's drum (`--k`): never colour alone                                                   |
| Highlighted item      | `data-highlighted:highlight` (the marker stroke) on menu, select and combobox items                                                                                         |
| Disabled              | Dashed line and `text-ink-faint`; keep the label legible; `cursor-not-allowed`                                                                                              |
| Invalid               | `aria-invalid` → `border-ink-red` (plus the inset underline that `control-field` adds); the message in `text-ink-red` beside a bang `Glyph`                                 |
| Text colours          | Reading inks (`text-ink`, `text-ink-2`, `text-ink-3`) and text inks (`text-k-ink`, `text-ink-red`); print inks (`bg-print-*`, `--k`) only for fills and marks               |
| Spacing               | The φ units (`p-snug`, `gap-tight`, `py-hair`…). Tailwind's numeric spacing only for fine optical nudges                                                                    |
| Icons                 | Lucide at `size-4`; hand-drawn marks from `@/patina/ink/rough` (`sketch`) or `Glyph` where the mark is the meaning (tick, dot, bang)                                        |
| Motion                | `tw-animate-css` enter/exit classes from shadcn stay; durations 120–200 ms. Reduced motion is handled globally                                                              |

Replace these shadcn tokens on sight: `bg-background` → `bg-paper` or `bg-card`; `text-muted-foreground` → `text-ink-2`; `bg-muted` → `bg-paper-2`; `bg-accent` → `bg-paper-3`; `border-input` → `border-line`; `rounded-lg`/`rounded-md`/`rounded-xl` → `rounded-sheet`; `text-sm`/`text-xs` → `text-small`/`text-label`; any `dark:` variant → nothing (night paper re-inks through tokens).

## Per part

| Part                  | Patina treatment                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Checkbox              | Pen box; a rough tick in `--k` that spills past the box                                                              |
| Radio group           | Pen circle; a rough inked dot in `--k`                                                                               |
| Switch                | Pill track with a pen line; on: track filled `--k`, thumb paper, moved to the end                                    |
| Select, native select | Trigger is a `control-field`; list is a `float-sheet` with highlighter items and a tick for the chosen one           |
| Tabs                  | Mono labels; the active tab gets a hand underline in `--k`; the list sits on a dashed rule                           |
| Toggle, toggle group  | Like the segmented controls on the specimen: pressed is solid ink with paper text                                    |
| Slider, progress      | Pen-line track on `bg-paper-3`; range and indicator in `--k` with a hatch; thumb a card-stock circle with a pen line |
| Tooltip               | A label-maker strip: `bg-ink`, `text-paper`, mono label size                                                         |
| Dialog, alert dialog  | A `sheet` over dimmed paper (`bg-ink/30`), serif title, mono close label; dialog only adds `Tape`                    |
| Badge                 | A small stamp: mono uppercase label size in a 1.5 px current-colour border                                           |
| Alert                 | A wash of `--k` (10 %) with a drawn glyph; destructive uses red                                                      |
| Avatar                | Image in a pen circle; the fallback is a `monogram` Print seeded by the name                                         |
| Skeleton              | `bg-paper-3` with a slow pulse in the content's own geometry                                                         |
| Spinner               | A hand-drawn arc turning                                                                                             |
| Separator, kbd        | A dashed rule; a mono keycap with a heavier bottom edge                                                              |

## Docs demos

Each primitive has `src/site/docs/demos/<name>.tsx`: a default export rendering `DemoSection` and `StateRow` blocks (from `../demo-kit`) that show every variant and state (default, hover-able, focus-able, checked or selected, invalid, disabled, empty, loading where they apply), plus `export const meta: DemoMeta` with `title`, `description` (one sentence on what it is for) and `item` (its registry item). `/docs/components/<name>` renders it. Example content comes from Fieldbook, the demo product: observations, species, tides, expeditions.

## Class merging

Import `cn` from `@/patina/lib/utils`, never from `"cn"`. base-nova sources arrive importing `"cn"` directly; repoint them when you fetch them. The plain `cn` reads Patina's theme names (`text-small`, `text-button`, `px-snug`, `rounded-sheet`) as unknown and drops them when a conflicting-looking class follows, so a 12 px button label silently renders at 18 px. `lib/utils.ts` builds `cn` with `createCn` from `cn/config` and lists those names; add new theme names there.
