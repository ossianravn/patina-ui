"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/patina/lib/utils"

// A pill track drawn with a pen line. Off, the card-stock thumb rests at the start of a paper track; on, the track
// fills with the region's drum and the thumb moves to the end. The ::after inset keeps the hit area at 24px or more.
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border-[1.5px] border-line px-[2px] transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-ink aria-invalid:border-ink-red data-[size=default]:h-6 data-[size=default]:w-[2.625rem] data-[size=sm]:h-5 data-[size=sm]:w-[2.125rem] data-checked:bg-k data-unchecked:bg-paper-3 data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full border-[1.5px] border-line bg-card transition-transform duration-150 ease-out group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[1.1875rem] group-data-[size=sm]/switch:data-checked:translate-x-[0.9375rem] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
