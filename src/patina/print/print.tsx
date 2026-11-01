"use client"

import { useMemo, type ComponentProps } from "react"
import {
  print,
  type InkSet,
  type MotifName,
  type PrintInks,
} from "@/patina/ink"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "./seed-scope"

export interface PrintProps extends Omit<
  ComponentProps<"span">,
  "children" | "title"
> {
  motif: MotifName
  /** Same seed, same print. Without one, the print takes its seed from the nearest SeedScope. */
  seed?: string | number
  inks?: InkSet | PrintInks
  /** Text the motif prints, such as a monogram's name. */
  text?: string
  /** Makes the print meaningful to assistive technology; without it the print is decorative. */
  title?: string
}

/** A seeded riso illustration. */
export function Print({
  motif,
  seed,
  inks,
  text,
  title,
  className,
  ...props
}: PrintProps) {
  const scoped = useSeed(`print:${motif}`)
  const resolved = seed ?? scoped
  const { svg } = useMemo(
    () => print({ motif, seed: resolved, inks, text, title }),
    [motif, resolved, inks, text, title],
  )
  return (
    <span
      data-slot="print"
      data-motif={motif}
      className={cn("block", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}
