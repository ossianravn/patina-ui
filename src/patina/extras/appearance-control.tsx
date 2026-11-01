"use client"

import { useId, type ComponentProps, type ReactNode } from "react"
import { cn } from "@/patina/lib/utils"
import { APPEARANCE, useAppearance, type Appearance } from "@/patina/theme"
import { Switch } from "@/patina/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"

// The appearance settings as settings rows: the name on the left, the control beside it, each control as wide as its
// options. Segmented controls for the short choices, ink swatches for the ink set and the accent drum (the Press's
// picker), a switch for the variation level. Rows wrap their control under the name when the column is too narrow.
// Every change applies to <html> and persists through useAppearance, so all islands on the page follow.

export type AppearanceRow = keyof Appearance

/** Every row, in reading order (the order of APPEARANCE). */
export const APPEARANCE_ROWS = Object.keys(APPEARANCE) as AppearanceRow[]

export const appearanceLabels: {
  [K in AppearanceRow]: {
    label: string
    options: Record<Appearance[K], string>
  }
} = {
  theme: {
    label: "Theme",
    options: { system: "System", day: "Day", night: "Night" },
  },
  stock: {
    label: "Paper",
    options: { archive: "Archive", field: "Field", newsprint: "Newsprint" },
  },
  inks: {
    label: "Inks",
    options: {
      patina: "Patina",
      field: "Field",
      fluoro: "Fluoro",
      earth: "Earth",
      spot: "Spot",
    },
  },
  accent: {
    label: "Accent",
    options: {
      green: "Verdigris",
      orange: "Copper",
      blue: "Indigo",
      pink: "Rose",
      violet: "Plum",
      red: "Oxblood",
    },
  },
  variation: {
    label: "Lively paper",
    options: { calm: "Calm", lively: "Lively" },
  },
  patina: {
    label: "Patina",
    options: { clean: "Clean", handled: "Handled", worn: "Worn" },
  },
  density: {
    label: "Density",
    options: { comfortable: "Comfortable", compact: "Compact" },
  },
  face: { label: "Interface", options: { serif: "Serif", sans: "Sans" } },
}

const HINTS: Partial<Record<AppearanceRow, string>> = {
  inks: "The drums every print is made in.",
  accent: "Ticks, links, focus rings and margin notes.",
  variation: "Tilted cards, tape and stronger misregistration.",
  patina: "How handled the paper looks.",
  density: "Tighter spacing and shorter controls.",
  face: "Prose and headings stay in the serif.",
}

export interface AppearanceControlProps extends Omit<
  ComponentProps<"div">,
  "children"
> {
  /** Which rows show, in this order. Defaults to every row. */
  rows?: readonly AppearanceRow[]
  /** A line under each name saying what the setting changes. */
  hints?: boolean
  /** The defaults the page's appearanceScript uses, for the server render. */
  defaults?: Appearance
}

type Change = (change: Partial<Appearance>) => void

/** Theme, paper, inks, accent, variation, patina, density and interface face as settings rows. */
export function AppearanceControl({
  rows = APPEARANCE_ROWS,
  hints = false,
  defaults,
  className,
  ...props
}: AppearanceControlProps) {
  const [appearance, update] = useAppearance(defaults)
  const id = useId()
  return (
    <div
      data-slot="appearance-control"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {rows.map((row) => (
        <Row
          key={row}
          row={row}
          id={`${id}-${row}`}
          hint={hints ? HINTS[row] : undefined}
          appearance={appearance}
          update={update}
        />
      ))}
    </div>
  )
}

function Row({
  row,
  id,
  hint,
  appearance,
  update,
}: {
  row: AppearanceRow
  id: string
  hint?: string
  appearance: Appearance
  update: Change
}) {
  const label = appearanceLabels[row].label
  const hintId = hint ? `${id}-hint` : undefined
  const a11y = { labelledBy: `${id}-label`, describedBy: hintId }
  let control: ReactNode
  if (row === "variation") {
    control = (
      <Switch
        id={id}
        aria-describedby={hintId}
        checked={appearance.variation === "lively"}
        onCheckedChange={(on) => update({ variation: on ? "lively" : "calm" })}
      />
    )
  } else if (row === "inks" || row === "accent") {
    control = (
      <Swatches row={row} value={appearance[row]} update={update} {...a11y} />
    )
  } else {
    control = (
      <Segmented row={row} value={appearance[row]} update={update} {...a11y} />
    )
  }
  const Name = row === "variation" ? "label" : "span"
  return (
    <div
      data-slot="appearance-control-row"
      data-row={row}
      className="flex flex-wrap items-center justify-between gap-x-snug gap-y-hair border-b border-dashed border-rule py-snug"
    >
      <div className="min-w-0 flex-[1_1_6rem]">
        <Name
          id={`${id}-label`}
          {...(row === "variation" ? { htmlFor: id } : {})}
          className="font-semibold"
        >
          {label}
        </Name>
        {hint && (
          <p id={hintId} className="m-0 text-small leading-small text-ink-2">
            {hint}
          </p>
        )}
      </div>
      {control}
    </div>
  )
}

type Labelled = { labelledBy: string; describedBy?: string }

/** One row's options and their names, loosely typed for rendering. */
function optionsOf(row: AppearanceRow) {
  const options: readonly string[] = APPEARANCE[row]
  const names: Record<string, string> = appearanceLabels[row].options
  return { options, names }
}

type ControlProps = Labelled & { value: string; update: Change }

function Segmented({
  row,
  value,
  update,
  labelledBy,
  describedBy,
}: ControlProps & { row: AppearanceRow }) {
  const { options, names } = optionsOf(row)
  return (
    <ToggleGroup
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      variant="outline"
      spacing={0}
      value={[value]}
      onValueChange={(next: unknown[]) =>
        next[0] && update({ [row]: next[0] } as Partial<Appearance>)
      }
    >
      {options.map((option) => (
        <ToggleGroupItem key={option} value={option}>
          {names[option]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

/** Three overlapping drums for an ink set, or one for an accent drum, ringed in card stock so they read on ink. */
function Drums({ row, option }: { row: "inks" | "accent"; option: string }) {
  const drums = row === "inks" ? ["line", "accent", "detail"] : [option]
  return (
    <span aria-hidden="true" className="flex -space-x-1">
      {drums.map((drum) => (
        <span
          key={drum}
          className={cn(
            "rounded-full shadow-[0_0_0_1.5px_var(--card)]",
            row === "inks" ? "size-2.5" : "size-3",
          )}
          style={{ background: `var(--print-${drum})` }}
        />
      ))}
    </span>
  )
}

function Swatches({
  row,
  value,
  update,
  labelledBy,
  describedBy,
}: ControlProps & { row: "inks" | "accent" }) {
  const name = useId()
  const { options, names } = optionsOf(row)
  // The chosen name sits beside the swatches, as wide as the longest, so the swatches never move.
  const longest = Math.max(
    ...options.map((option) => (names[option] ?? option).length),
  )
  return (
    <span className="flex items-center gap-tight">
      <span
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        className="inline-flex w-fit rounded-sheet border-[1.5px] border-line"
      >
        {options.map((option) => (
          <label
            key={option}
            title={names[option]}
            data-inks={row === "inks" ? option : undefined}
            className="relative flex h-control cursor-pointer items-center px-2 first:rounded-l-[2px] last:rounded-r-[2px] hover:not-has-checked:bg-paper-3 has-checked:bg-ink has-focus-visible:z-10 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-dashed has-focus-visible:outline-k-ink"
          >
            <input
              type="radio"
              name={name}
              value={option}
              aria-label={names[option]}
              checked={value === option}
              onChange={() => update({ [row]: option } as Partial<Appearance>)}
              className="sr-only"
            />
            <Drums row={row} option={option} />
          </label>
        ))}
      </span>
      <span
        aria-hidden="true"
        className="label-mono text-ink-2"
        style={{ width: `calc(${longest}ch + ${longest * 0.06}em)` }}
      >
        {names[value]}
      </span>
    </span>
  )
}
