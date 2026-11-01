import type { ComponentProps } from "react"
import { cn } from "@/patina/lib/utils"

/** A marker stroke behind a phrase that matters. Yellow by default; `accent` prints it in the region's drum. */
export function Highlight({
  accent = false,
  className,
  ...props
}: ComponentProps<"mark"> & { accent?: boolean }) {
  return (
    <mark
      data-slot="highlight"
      className={cn(
        "highlight bg-transparent text-inherit",
        accent && "highlight-accent",
        className,
      )}
      {...props}
    />
  )
}
