import * as React from "react"
import { cn } from "@/patina/lib/utils"

// A calm pen-line field that grows with its content. data-ruled="true" adds notebook lines on the text baseline.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "control-field flex field-sizing-content min-h-24 w-full px-tight py-tight data-[ruled=true]:bg-[linear-gradient(transparent_calc(1lh-1px),var(--rule)_calc(1lh-1px))] data-[ruled=true]:bg-size-[100%_1lh] data-[ruled=true]:bg-local data-[ruled=true]:bg-origin-content",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
