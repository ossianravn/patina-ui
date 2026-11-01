import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "@/patina/lib/utils"

// A pen-line track on paper; the range is inked in the region's drum with a hatch, and each thumb is a card-stock
// circle with a pen line. The thumb's focus lives on a hidden range input, so the dashed ring is drawn with
// has-focus-visible. Orientation is matched on data-orientation directly, so the classes work without shadcn's
// data-horizontal and data-vertical variants; the root's width stays a plain class so a call-site width replaces it,
// and a vertical slider takes its height from the call site (at least 10rem).
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("w-full data-[orientation=vertical]:w-auto", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center py-hair select-none data-disabled:cursor-not-allowed data-disabled:opacity-60 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-hair data-[orientation=vertical]:py-0">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full border-[1.5px] border-line bg-paper-3 select-none data-disabled:border-dashed data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-k bg-[repeating-linear-gradient(-45deg,transparent_0_2.5px,color-mix(in_srgb,var(--card)_45%,transparent)_2.5px_4px)] select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="relative block size-5 shrink-0 cursor-grab rounded-full border-[1.5px] border-line bg-card transition-colors select-none after:absolute after:-inset-2 hover:bg-paper-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-k-ink has-focus-visible:outline-dashed data-dragging:cursor-grabbing data-dragging:bg-paper-3 data-disabled:pointer-events-none data-disabled:border-dashed"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
