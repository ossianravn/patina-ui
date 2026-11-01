"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

// A pen-drawn box; checking it draws a tick in the region's drum that spills a little past the box, the way a
// hand tick does. The 24px hit area comes from the ::after inset.
const TICK = sketch.curve(
  [
    [4, 13],
    [10, 20],
    [24, 2],
  ],
  { seed: 22, stroke: "var(--k)", strokeWidth: 2.8, roughness: 0.8 },
)

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-[1.15rem] shrink-0 cursor-pointer items-center justify-center rounded-[3px_5px_4px_3px] border-[1.5px] border-line bg-card transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-ink data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:opacity-60 aria-invalid:border-ink-red data-checked:border-ink",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="pointer-events-none absolute -top-1.5 -left-0.5 size-[1.6rem]"
      >
        <svg
          viewBox="0 0 26 26"
          aria-hidden="true"
          className="size-full overflow-visible"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
