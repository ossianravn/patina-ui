"use client"

// Marks that sit on the paper: a sketched frame, a wash, washi tape and a pen-line rule, each varied by its seed.
import type { ComponentProps, CSSProperties } from "react"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { roughVariant, useSeed } from "@/patina/print/seed-scope"

type Drum = "blue" | "violet" | "pink" | "green" | "orange" | "yellow" | "red"
type Seeded = { seed?: string | number }

/** A doubled, wobbly outline drawn around a group. */
export function SketchFrame({
  seed,
  className,
  style,
  ...props
}: ComponentProps<"div"> & Seeded) {
  const s = useSeed("sketch-frame", seed)
  const vars = {
    "--sketch-a": roughVariant(s),
    "--sketch-b": roughVariant(s, 3),
  } as CSSProperties
  return (
    <div
      data-slot="sketch-frame"
      className={cn("sketch-frame", className)}
      style={{ ...vars, ...style }}
      {...props}
    />
  )
}

/** A watercolour blob of the region's drum behind its content. */
export function Wash({
  seed,
  ink,
  className,
  style,
  ...props
}: ComponentProps<"span"> &
  Seeded & { ink?: Exclude<Drum, "yellow" | "red"> }) {
  const shape = stream(useSeed("wash", seed), "shape")
  const r = () => `${Math.round(shape.between(38, 60))}%`
  const vars = {
    "--wash-shape": `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`,
  } as CSSProperties
  return (
    <span
      data-slot="wash"
      data-ink={ink}
      className={cn("wash", className)}
      style={{ ...vars, ...style }}
      {...props}
    />
  )
}

/** A strip of washi tape across the top edge of a positioned parent. Hidden at the calm variation level. */
export function Tape({
  seed,
  ink,
  className,
  style,
  ...props
}: ComponentProps<"span"> & Seeded & { ink?: Drum }) {
  const place = stream(useSeed("tape", seed), "place")
  const vars = {
    "--tape-tilt": `${(place.signed() * 4).toFixed(1)}deg`,
    "--tape-shift": `${Math.round(place.signed() * 20)}%`,
    ...(ink ? { "--tape": `var(--print-${ink})` } : {}),
  } as CSSProperties
  return (
    <span
      aria-hidden="true"
      data-slot="tape"
      className={cn("tape", className)}
      style={{ ...vars, ...style }}
      {...props}
    />
  )
}

/** A pen-line divider. */
export function RoughRule({
  seed,
  className,
  style,
  ...props
}: ComponentProps<"hr"> & Seeded) {
  const s = useSeed("rough-rule", seed)
  return (
    <hr
      data-slot="rough-rule"
      className={cn("rough-rule m-0 w-full", className)}
      style={{ filter: roughVariant(s), ...style }}
      {...props}
    />
  )
}
