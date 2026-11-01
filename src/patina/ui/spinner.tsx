import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

// A hand-drawn arc in currentColor, turning. Three quarters of a pen circle, so the gap shows the motion.
const ARC = sketch.path("M 12 3 A 9 9 0 1 1 3 12", {
  seed: 41,
  stroke: "currentColor",
  strokeWidth: 2.2,
  roughness: 0.7,
  disableMultiStroke: true,
})

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin overflow-visible", className)}
      {...props}
    >
      <g dangerouslySetInnerHTML={{ __html: ARC }} />
    </svg>
  )
}

export { Spinner }
