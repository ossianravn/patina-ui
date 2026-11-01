"use client"

import { useMemo, type ComponentProps, type CSSProperties } from "react"
import {
  ageMarks,
  edgeClip,
  edgeMask,
  type Edge,
} from "@/patina/ink/paper-shapes"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

export interface PaperProps extends ComponentProps<"div"> {
  /** Same seed, same edge, tilt and wear. */
  seed?: string | number
  edge?: Edge
  dogEar?: boolean
  /** Tilt by a seeded share of the variation level's --tilt-max. */
  tilt?: boolean
  /** Raised card stock, or the page's own paper. */
  stock?: "card" | "paper"
  /** Classes for the outer box, which carries the drop shadow and tilt; className styles the sheet itself. */
  frameClassName?: string
}

/**
 * A sheet of paper with a seeded edge and seeded wear: a smudge and a soft fold once handled; a coffee ring, foxing,
 * deeper creases and a worn corner once worn. The marks follow the document's patina level.
 */
export function Paper({
  seed,
  edge = "straight",
  dogEar = false,
  tilt = false,
  stock = "card",
  frameClassName,
  className,
  style,
  children,
  ...props
}: PaperProps) {
  const s = useSeed("paper", seed)
  const id = `patina-paper-${s.toString(36)}`
  const clip = useMemo(() => edgeClip(edge, s, dogEar), [edge, s, dogEar])
  const marks = useMemo(() => ageMarks(s, id), [s, id])
  const mask = edgeMask(edge)
  const turn = tilt ? stream(s, "tilt").signed() : 0
  const frame: CSSProperties = {
    filter: "var(--paper-drop)",
    ...(turn ? { rotate: `calc(var(--tilt-max) * ${turn.toFixed(2)})` } : {}),
  }
  const sheet: CSSProperties = {
    backgroundColor: `var(--${stock})`,
    clipPath: clip,
    mask,
    WebkitMask: mask,
    ...style,
  }

  return (
    <div
      data-slot="paper-frame"
      className={cn("relative max-w-full", frameClassName)}
      style={frame}
    >
      <div
        data-slot="paper"
        data-edge={edge}
        className={cn("paper-surface relative isolate p-snug", className)}
        style={sheet}
        {...props}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 size-full"
          dangerouslySetInnerHTML={{ __html: marks }}
        />
        {children}
        {dogEar && <span aria-hidden="true" className="paper-dog-ear" />}
      </div>
    </div>
  )
}
