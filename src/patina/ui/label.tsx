import * as React from "react"
import { cn } from "@/patina/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-tight text-small leading-small font-semibold text-ink select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-ink-faint peer-disabled:cursor-not-allowed peer-disabled:text-ink-faint has-data-disabled:cursor-not-allowed has-data-disabled:text-ink-faint",
        className,
      )}
      {...props}
    />
  )
}

export { Label }
