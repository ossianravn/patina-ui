"use client"

import { useMemo, type ComponentProps } from "react"
import { glyph, type GlyphName } from "@/patina/ink/glyphs"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

export interface GlyphProps extends Omit<ComponentProps<"svg">, "children"> {
  name: GlyphName
  /** Glyphs of one name look alike unless they get different seeds. */
  seed?: string | number
  size?: number
  /** An accessible name; without it the glyph is decorative. */
  label?: string
}

/** A hand-drawn glyph in currentColor. */
export function Glyph({
  name,
  seed,
  size = 20,
  label,
  className,
  ...props
}: GlyphProps) {
  const s = useSeed("glyph", seed ?? name)
  const paths = useMemo(() => glyph(name, s), [name, s])
  return (
    <svg
      data-slot="glyph"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0 align-[-0.2em]", className)}
      dangerouslySetInnerHTML={{ __html: paths }}
      {...props}
    />
  )
}
