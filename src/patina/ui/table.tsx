"use client"

import * as React from "react"
import { cn } from "@/patina/lib/utils"

// A ledger: mono uppercase headings over a pen line, dashed rules between rows, typeset serif cells with tabular
// figures (right-align numeric columns with `text-right` on their head and cells). The heading row sticks to the top
// of the container when the container scrolls; to scroll inside a fixed height, size the container from outside
// (`<div className="*:data-[slot=table-container]:h-96">`). Once the body scrolls under it, the heading row takes a
// ground matching the surface beneath (paper, or card stock inside a Card); before that it stays clear, so it never
// shows as a band against the page's toning. Browsers without scroll-state queries keep the ground on throughout.
// The rule under the headings is an inset shadow, so it travels with the sticky row. A selected row
// (data-state="selected") takes the pressed fill and an ink bar in the region's drum at its leading edge.

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto [container-type:scroll-state] [--table-surface:var(--paper)] in-data-[slot=card]:[--table-surface:var(--card)]"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full caption-bottom border-collapse font-ui text-ui leading-ui text-ink tabular-nums",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "paper-texture sticky top-0 z-10 bg-(--table-surface) [@container_not_scroll-state(scrollable:top)]:bg-transparent [@container_not_scroll-state(scrollable:top)]:bg-none [&_tr]:border-b-0 [&_tr]:hover:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t-[1.5px] border-line font-semibold [&>tr]:last:border-b-0 [&_tr]:hover:bg-transparent",
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-dashed border-rule transition-colors hover:bg-paper-2/70 has-aria-expanded:bg-paper-2/70 data-[state=selected]:bg-paper-3 data-[state=selected]:[&>:first-child]:shadow-[inset_2px_0_0_var(--k)]",
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "label-mono h-control-compact px-tight text-left align-middle whitespace-nowrap text-ink-2 shadow-[inset_0_-1.5px_0_var(--line)] [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-tight py-hair align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "mt-tight text-left text-small leading-small text-ink-2",
        className,
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
