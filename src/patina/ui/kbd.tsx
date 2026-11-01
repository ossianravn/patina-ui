import { cn } from "@/patina/lib/utils"

// A mono keycap on card stock: a fine pen frame with a heavier bottom edge, the way a key sits on the board. Inside
// a tooltip's ink strip it turns into a paper outline.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sheet border border-b-[2.5px] border-line bg-card px-1 font-label text-label leading-none font-semibold text-ink select-none in-data-[slot=tooltip-content]:border-paper/60 in-data-[slot=tooltip-content]:bg-transparent in-data-[slot=tooltip-content]:text-paper [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
