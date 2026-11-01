"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { cn } from "@/patina/lib/utils"
import { XIcon } from "lucide-react"

import { Button } from "@/patina/ui/button"

// A multiple combobox's chosen values, collected as small mono tags inside a control-field. The field carries the
// page's dashed focus ring while its input has focus, the red line and underline when invalid, the dashed line when
// disabled. Each tag's remove button keeps a 24px hit area.
function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn(
        "control-field flex min-h-control flex-wrap items-center gap-1 px-tight py-1 has-data-[slot=combobox-chip]:pl-1.5 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-k-ink has-[input:focus-visible]:outline-dashed has-aria-invalid:border-ink-red has-aria-invalid:shadow-[inset_0_-2px_0_var(--ink-red)] has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-dashed has-[input:disabled]:bg-transparent has-[input:disabled]:text-ink-faint",
        className,
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-7 w-fit items-center justify-center gap-0.5 rounded-sheet border-[1.5px] border-line bg-paper-2 px-hair font-label text-label leading-none font-semibold tracking-[0.06em] whitespace-nowrap text-ink uppercase has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:border-dashed has-disabled:bg-transparent has-disabled:text-ink-faint has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="size-6 text-ink-2 hover:text-ink"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none size-3" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn(
        "h-7 min-w-16 flex-1 bg-transparent px-1 font-ui text-ui text-ink outline-none placeholder:text-ink-3 disabled:cursor-not-allowed disabled:text-ink-faint",
        className,
      )}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export { ComboboxChip, ComboboxChips, ComboboxChipsInput, useComboboxAnchor }
