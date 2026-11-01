import { cn } from "@/patina/lib/utils"

// A block of toned paper in the shape of the content it stands in for, with a slow pulse. Give it that content's
// own geometry at the call site: a line of text, a circle for an avatar, a print's aspect ratio.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-sheet bg-paper-3 [animation-duration:2.6s]",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
