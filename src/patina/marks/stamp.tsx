"use client"

import type { ComponentProps, CSSProperties } from "react"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { roughVariant, textOf, useSeed } from "@/patina/print/seed-scope"

export interface StampProps extends ComponentProps<"span"> {
  variant?: "outline" | "solid"
  seed?: string | number
}

/** A rubber-stamp label in the region's text ink, turned a little by its seed. */
export function Stamp({
  variant = "outline",
  seed,
  children,
  className,
  style,
  ...props
}: StampProps) {
  const s = useSeed("stamp", seed ?? textOf(children))
  const vars = {
    "--stamp-turn": stream(s, "turn").signed().toFixed(2),
    "--stamp-rough": roughVariant(s),
  } as CSSProperties
  return (
    <span
      data-slot="stamp"
      data-variant={variant}
      className={cn("stamp", variant === "solid" && "stamp-solid", className)}
      style={{ ...vars, ...style }}
      {...props}
    >
      {children}
    </span>
  )
}
