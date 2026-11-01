"use client"

// Marks that hug their content: a seeded drawing in a fixed viewBox, stretched over the content with strokes that
// keep their width. No measuring, so they render the same in static HTML and after hydration.
import { useMemo, type ComponentProps } from "react"
import { sketch } from "@/patina/ink/rough"
import { cn } from "@/patina/lib/utils"
import { textOf, useSeed } from "@/patina/print/seed-scope"

type HugProps = ComponentProps<"span"> & { seed?: string | number }

const pen = (seed: number) => ({
  seed,
  stroke: "var(--k)",
  strokeWidth: 1.8,
  roughness: 1.3,
  nonScaling: true,
})

function Drawing({
  svg,
  viewBox,
  className,
}: {
  svg: string
  viewBox: string
  className: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute overflow-visible", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/** A drawn ring around a word or number. */
export function Circle({ seed, children, className, ...props }: HugProps) {
  const s = useSeed("circle", seed ?? textOf(children))
  const ring = useMemo(() => sketch.ellipse(60, 25, 114, 44, pen(s)), [s])
  return (
    <span
      data-slot="circle"
      className={cn("relative mx-[0.35em] inline-block px-[0.1em]", className)}
      {...props}
    >
      {children}
      <Drawing
        svg={ring}
        viewBox="0 0 120 50"
        className="-top-[0.3em] -left-[0.4em] h-[calc(100%+0.6em)] w-[calc(100%+0.8em)]"
      />
    </span>
  )
}

/** A hand strike-through for text that no longer holds. */
export function Strike({
  seed,
  children,
  className,
  ...props
}: HugProps & ComponentProps<"s">) {
  const s = useSeed("strike", seed ?? textOf(children))
  const line = useMemo(
    () => sketch.line(2, 11, 118, 9, { ...pen(s), strokeWidth: 2 }),
    [s],
  )
  return (
    <s
      data-slot="strike"
      className={cn("relative inline-block no-underline", className)}
      {...props}
    >
      {children}
      <Drawing
        svg={line}
        viewBox="0 0 120 20"
        className="top-0 -left-[0.1em] h-full w-[calc(100%+0.2em)]"
      />
    </s>
  )
}

/** A drawn bracket grouping the lines beside it. */
export function Bracket({
  seed,
  side = "left",
  children,
  className,
  ...props
}: ComponentProps<"div"> & {
  seed?: string | number
  side?: "left" | "right"
}) {
  const s = useSeed("bracket", seed)
  const path = useMemo(
    () =>
      sketch.path("M 11 2 Q 3 2 3 9 L 3 91 Q 3 98 11 98", {
        ...pen(s),
        roughness: 0.9,
      }),
    [s],
  )
  return (
    <div
      data-slot="bracket"
      data-side={side}
      className={cn(
        "relative",
        side === "left" ? "pl-snug" : "pr-snug",
        className,
      )}
      {...props}
    >
      <Drawing
        svg={path}
        viewBox="0 0 14 100"
        className={cn(
          "top-0 h-full w-[0.75rem]",
          side === "left" ? "left-0" : "right-0 -scale-x-100",
        )}
      />
      {children}
    </div>
  )
}
