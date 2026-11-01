"use client"

import * as React from "react"
import { CheckboxGroup } from "@base-ui/react/checkbox-group"
import { cn } from "@/patina/lib/utils"
import { Glyph } from "@/patina/marks/glyph"
import { Checkbox } from "@/patina/ui/checkbox"

// A tickable list (Mental Models' checklist sections): each row is the kit's drawn box and hand tick beside a label
// and an optional note, on dashed rules. Ticked rows stay fully legible, their text easing to the second reading
// ink rather than being struck through. The tally sits beside the title in mono and takes a tick when all are done.

export interface ChecklistItem {
  /** Identifies the item in `value`. */
  value: string
  label: React.ReactNode
  /** One short line under the label: where, who, how many. */
  note?: React.ReactNode
  disabled?: boolean
}

export interface ChecklistProps extends Omit<
  React.ComponentProps<"div">,
  "defaultValue" | "onChange" | "title"
> {
  items: readonly ChecklistItem[]
  /** A title above the list; it also names the group. */
  title?: React.ReactNode
  /** The ticked items' values (controlled). */
  value?: string[]
  /** The items ticked at first (uncontrolled). */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
}

function Checklist({
  items,
  title,
  value,
  defaultValue = [],
  onValueChange,
  disabled = false,
  className,
  ...props
}: ChecklistProps) {
  const [inner, setInner] = React.useState(defaultValue)
  const ticked = value ?? inner
  const id = React.useId()
  const done = items.filter((item) => ticked.includes(item.value)).length
  const complete = items.length > 0 && done === items.length

  const change = (next: string[]) => {
    if (value === undefined) setInner(next)
    onValueChange?.(next)
  }

  return (
    <div
      data-slot="checklist"
      data-complete={complete || undefined}
      className={cn("flex w-full max-w-measure min-w-0 flex-col", className)}
      {...props}
    >
      <div
        data-slot="checklist-header"
        className="flex items-baseline gap-tight border-b-[1.5px] border-line pb-hair"
      >
        {title ? (
          <span
            id={`${id}-title`}
            data-slot="checklist-title"
            className="min-w-0 font-read text-body leading-subhead font-semibold text-ink"
          >
            {title}
          </span>
        ) : null}
        <span
          id={`${id}-tally`}
          data-slot="checklist-tally"
          className="ms-auto flex shrink-0 items-center gap-1 font-label text-label leading-[1.45] font-medium tracking-[0.06em] text-ink-2 uppercase tabular-nums"
        >
          {complete ? (
            <Glyph name="check" size={16} className="text-k" />
          ) : null}
          {done} of {items.length}
        </span>
      </div>
      <CheckboxGroup
        value={ticked}
        onValueChange={change}
        disabled={disabled}
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={`${id}-tally`}
        render={<ul />}
        className="m-0 flex list-none flex-col p-0"
      >
        {items.map((item, index) => (
          <li
            key={item.value}
            data-slot="checklist-item"
            className="border-b border-dashed border-rule last:border-b-0"
          >
            <label
              className={cn(
                "group/checklist-item flex cursor-pointer items-start gap-tight py-tight",
                "has-data-disabled:cursor-not-allowed",
              )}
            >
              <Checkbox
                value={item.value}
                disabled={item.disabled}
                aria-labelledby={`${id}-${index}`}
                aria-describedby={item.note ? `${id}-${index}-note` : undefined}
                className="mt-[0.15rem]"
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  id={`${id}-${index}`}
                  data-slot="checklist-label"
                  className="text-ui leading-ui text-ink transition-colors group-has-data-checked/checklist-item:text-ink-2 group-has-data-disabled/checklist-item:text-ink-faint"
                >
                  {item.label}
                </span>
                {item.note ? (
                  <span
                    id={`${id}-${index}-note`}
                    data-slot="checklist-note"
                    className="text-small leading-small text-ink-2 group-has-data-disabled/checklist-item:text-ink-faint"
                  >
                    {item.note}
                  </span>
                ) : null}
              </span>
            </label>
          </li>
        ))}
      </CheckboxGroup>
    </div>
  )
}

export { Checklist }
