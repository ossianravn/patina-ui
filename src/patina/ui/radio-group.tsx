import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

// A pen-drawn circle; choosing it inks a rough dot in the region's drum. The 24px hit area comes from the ::after
// inset, as on the checkbox.
const DOT = sketch.circle(12, 12, 12.5, {
  seed: 31,
  stroke: "var(--k)",
  strokeWidth: 1.4,
  fill: "var(--k)",
  fillStyle: "solid",
  roughness: 0.7,
})

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-tight", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-[1.15rem] shrink-0 cursor-pointer rounded-full border-[1.5px] border-line bg-card transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-ink data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:opacity-60 aria-invalid:border-ink-red data-checked:border-ink",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-[1.15rem] overflow-visible"
          dangerouslySetInnerHTML={{ __html: DOT }}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
