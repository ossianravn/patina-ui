"use client"

import * as React from "react"
import { sketch } from "@/patina/ink/rough"
import { cn } from "@/patina/lib/utils"
import { textOf, useSeed } from "@/patina/print/seed-scope"
import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/patina/ui/collapsible"

// A timeline of ringed numbers joined by a drawn line. TraceIcon draws a pen ring around its mono number (or icon);
// the line's status repaints it: running turns the ring into a spinning arc in the drum, done ticks it, error inks
// it red, pending fades it. A wobbly pen line runs from each ring down to the next, through any open detail.

const PEN = { stroke: "currentColor", strokeWidth: 1.5, roughness: 0.7 }

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="trace"
      className={cn(
        "flex w-full min-w-0 flex-col gap-tight [--trace-ring:1.5rem] *:relative",
        "*:not-last:before:pointer-events-none *:not-last:before:absolute *:not-last:before:start-[calc(var(--trace-ring)/2_-_0.3rem)] *:not-last:before:top-[calc(var(--trace-ring)_+_1px)] *:not-last:before:-bottom-[calc(var(--space-tight)_-_1px)] *:not-last:before:w-[0.6rem] *:not-last:before:bg-[linear-gradient(var(--line),var(--line))] *:not-last:before:bg-size-[1.5px_100%] *:not-last:before:bg-center *:not-last:before:bg-no-repeat *:not-last:before:opacity-45 *:not-last:before:[filter:var(--rough-4)]",
        "*:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0 *:has-[>[data-slot=trace-line]]:rounded-sheet *:has-[>[data-slot=trace-line]]:text-left *:has-[>[data-slot=trace-line]]:no-underline",
        className,
      )}
      {...props}
    />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending" | "done"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn(
        "group/trace-line flex w-fit max-w-full min-w-0 items-center gap-hair font-read text-small leading-small text-ink-2 transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-ink data-[status=error]:text-ink-red data-[status=error]:in-[a:hover,button:hover]:text-ink-red data-[status=pending]:text-ink-3 data-[status=running]:text-ink",
        className,
      )}
      {...props}
    />
  )
}

function TraceIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const seed = useSeed("trace-ring", textOf(children))
  const marks = React.useMemo(
    () => ({
      ring: sketch.ellipse(12, 12, 21, 20, { ...PEN, seed }),
      arc: sketch.path("M 12 2 A 10 10 0 1 1 2.6 15.4", {
        ...PEN,
        seed: seed + 1,
        strokeWidth: 2,
        disableMultiStroke: true,
      }),
      tick: sketch.curve(
        [
          [5, 13],
          [10, 19.5],
          [23, 1],
        ],
        { ...PEN, seed: seed + 2, strokeWidth: 2.4, roughness: 0.9 },
      ),
    }),
    [seed],
  )
  const mark = "pointer-events-none absolute inset-0 size-full overflow-visible"
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn(
        "relative flex size-(--trace-ring) shrink-0 items-center justify-center font-label text-label leading-none font-bold text-ink tabular-nums group-data-[status=error]/trace-line:text-ink-red group-data-[status=pending]/trace-line:text-ink-3 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        "[[data-slot=trace-title]~&]:-ms-1 [[data-slot=trace-title]~&]:size-4 [[data-slot=trace-title]~&]:*:opacity-100! [[data-slot=trace-title]~&]:*:data-[trace-mark]:hidden",
        className,
      )}
      {...props}
    >
      <svg
        data-trace-mark=""
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          mark,
          "text-line group-data-[status=error]/trace-line:text-ink-red group-data-[status=pending]/trace-line:opacity-40 group-data-[status=running]/trace-line:hidden",
        )}
        dangerouslySetInnerHTML={{ __html: marks.ring }}
      />
      <svg
        data-trace-mark=""
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          mark,
          "hidden animate-spin text-k [animation-duration:1.4s] group-data-[status=running]/trace-line:block",
        )}
        dangerouslySetInnerHTML={{ __html: marks.arc }}
      />
      <span className="relative flex items-center justify-center group-data-[status=done]/trace-line:opacity-0">
        {children}
      </span>
      <svg
        data-trace-mark=""
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          mark,
          "hidden text-k group-data-[status=done]/trace-line:block",
        )}
        dangerouslySetInnerHTML={{ __html: marks.tick }}
      />
    </span>
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn("min-w-0 truncate", className)}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn(
        "shrink-0 font-label text-label leading-[1.45] tracking-[0.04em] text-ink-3 tabular-nums",
        className,
      )}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "open"> &
  (
    | { open?: undefined }
    | {
        open: boolean
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger>) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-sheet text-left text-ink-3 transition-colors hover:text-ink has-[[data-status=error]]:text-ink-red",
        className,
      )}
      {...props}
    >
      {children}
      <CollapsibleChevron className="size-3.5" />
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="min-w-0"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn(
          "ms-[calc(var(--trace-ring)_+_var(--space-hair))] mt-1 mb-hair max-w-measure min-w-0 pe-1 font-read text-small leading-small wrap-break-word text-ink-2",
          className,
        )}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
