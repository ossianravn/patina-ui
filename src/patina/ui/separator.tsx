"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/patina/lib/utils"

// A dashed rule in the rule ink, across or down. For a section boundary drawn by hand, use RoughRule instead.
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 border-dashed border-rule data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-t data-[orientation=vertical]:w-0 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:border-l",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
