import type { ComponentProps } from "react"
import { cn } from "@/patina/lib/utils"

/** Two loose strokes under a heading or term, in the region's drum. */
export function HandUnderline({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="hand-underline"
      className={cn("hand-underline", className)}
      {...props}
    />
  )
}
