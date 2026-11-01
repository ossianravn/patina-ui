"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { sketch } from "@/patina/ink/rough"
import { cn } from "@/patina/lib/utils"

// A disclosure. The panel opens and closes by animating its height (200 ms), so it clips while it moves; give its
// content a little padding when it holds focusable things. CollapsibleChevron is the drawn hook chevron: put it in
// the trigger and it turns a quarter when the trigger is expanded.

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({
  className,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    />
  )
}

// A chevron drawn in one stroke whose tail curls back, the way a pen lifts off the paper.
const HOOK = sketch.path(
  "M 9 4.5 C 11.5 7 13.6 9.6 15.6 12 C 13.6 14.3 11.6 16.7 9.6 19.2 C 9 19.9 8.1 19.8 7.9 19",
  {
    seed: 23,
    stroke: "currentColor",
    strokeWidth: 1.9,
    roughness: 0.55,
    bowing: 0.6,
  },
)

function CollapsibleChevron({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      data-slot="collapsible-chevron"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 overflow-visible transition-transform duration-200 ease-out in-aria-expanded:rotate-90 rtl:-scale-x-100 rtl:in-aria-expanded:-rotate-90",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: HOOK }}
      {...props}
    />
  )
}

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleChevron,
}
