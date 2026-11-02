"use client"

// Handwritten asides: a margin note with a drawn arrow, and an annotation that points at what it describes.
import { useMemo, type ComponentProps, type ReactNode } from "react"
import { sketch } from "@/patina/ink/rough"
import { cn } from "@/patina/lib/utils"
import { textOf, useSeed } from "@/patina/print/seed-scope"

const pen = (seed: number) => ({
  seed,
  stroke: "currentColor",
  strokeWidth: 1.5,
  roughness: 1,
})

export interface MarginNoteProps extends ComponentProps<"div"> {
  seed?: string | number
  arrow?: boolean
  /** Where the arrow points: back at the line the note sits beside, or up at what sits above the note. */
  point?: "back" | "up"
  /** "gutter" moves the note into the right margin of its positioned parent on screens 82rem and wider. */
  placement?: "inline" | "gutter"
  /** Hide a note that only repeats what the page already says from assistive technology. */
  decorative?: boolean
}

// The up arrow starts level with the text and rises above the note's box (a transform, so layout is untouched).
const LEADS = {
  back: {
    box: [44, 22],
    draw: (s: number) => sketch.arrow(40, 6, 4, 16, pen(s), -0.25, 6),
    className: "mt-hair",
  },
  up: {
    box: [40, 36],
    draw: (s: number) => sketch.arrow(34, 30, 8, 3, pen(s), -0.35, 6),
    className: "-translate-y-[0.8em]",
  },
} as const

/** A handwritten aside from the reader, with a small drawn arrow. */
export function MarginNote({
  seed,
  arrow = true,
  point = "back",
  placement = "inline",
  decorative = false,
  children,
  className,
  ...props
}: MarginNoteProps) {
  const s = useSeed("margin-note", seed ?? textOf(children))
  const { box, draw, className: leadClass } = LEADS[point]
  const lead = useMemo(() => draw(s), [draw, s])
  const gutter = placement === "gutter"
  return (
    <div
      role="note"
      data-slot="margin-note"
      data-placement={placement}
      aria-hidden={decorative || undefined}
      className={cn(
        "margin-note flex items-start gap-hair",
        gutter &&
          "min-[82rem]:absolute min-[82rem]:top-[0.15rem] min-[82rem]:left-[calc(100%+0.75rem)] min-[82rem]:w-52",
        className,
      )}
      {...props}
    >
      {arrow && (
        <svg
          aria-hidden="true"
          width={box[0]}
          height={box[1]}
          viewBox={`0 0 ${box[0]} ${box[1]}`}
          className={cn(
            "shrink-0 rtl:-scale-x-100",
            leadClass,
            gutter && "max-[82rem]:hidden",
          )}
          dangerouslySetInnerHTML={{ __html: lead }}
        />
      )}
      <span>{children}</span>
    </div>
  )
}

type Side = "top" | "right" | "bottom" | "left"

const PLACE: Record<Side, string> = {
  right: "left-full top-1/2 ml-tight -translate-y-1/2 flex-row",
  left: "right-full top-1/2 mr-tight -translate-y-1/2 flex-row-reverse",
  top: "bottom-full left-1/2 mb-hair -translate-x-1/2 flex-col-reverse items-center",
  bottom: "top-full left-1/2 mt-hair -translate-x-1/2 flex-col items-center",
}
const ARROW: Record<
  Side,
  { box: [number, number]; draw: (s: number) => string }
> = {
  right: {
    box: [40, 20],
    draw: (s) => sketch.arrow(38, 13, 4, 8, pen(s), 0.2, 6),
  },
  left: {
    box: [40, 20],
    draw: (s) => sketch.arrow(2, 13, 36, 8, pen(s), -0.2, 6),
  },
  top: {
    box: [20, 32],
    draw: (s) => sketch.arrow(8, 2, 11, 30, pen(s), 0.2, 6),
  },
  bottom: {
    box: [20, 32],
    draw: (s) => sketch.arrow(8, 30, 11, 2, pen(s), -0.2, 6),
  },
}

export interface AnnotationProps extends ComponentProps<"span"> {
  note: ReactNode
  side?: Side
  seed?: string | number
}

/** A handwritten callout beside its target, with an arrow pointing at it. Leave room on that side. */
export function Annotation({
  note,
  side = "right",
  seed,
  children,
  className,
  ...props
}: AnnotationProps) {
  const s = useSeed("annotation", seed ?? textOf(note))
  const { box, draw } = ARROW[side]
  const arrow = useMemo(() => draw(s), [draw, s])
  return (
    <span
      data-slot="annotation"
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
      <span
        className={cn(
          "margin-note absolute flex gap-hair whitespace-nowrap",
          PLACE[side],
        )}
      >
        <svg
          aria-hidden="true"
          width={box[0]}
          height={box[1]}
          viewBox={`0 0 ${box[0]} ${box[1]}`}
          className="shrink-0"
          dangerouslySetInnerHTML={{ __html: arrow }}
        />
        <span>{note}</span>
      </span>
    </span>
  )
}
