import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/patina/lib/utils"

// A calm pen-line field on card stock: crisp border, sheet corners, 16px text (no zoom on iOS), the page's dashed
// focus ring. Width follows the value it holds; set it at the call site.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "control-field h-control w-full min-w-0 px-tight py-hair file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-label file:text-label file:font-semibold file:text-ink",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
