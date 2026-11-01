"use client"

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"
import { cn } from "@/patina/lib/utils"

// A thin pencil scrollbar: a faint rule-ink track with a narrow graphite thumb that firms and thickens while hovered
// or dragged. The bar keeps a 10px hit area; the marks inside it are pseudo-elements, so they never move layout.
// The viewport takes the page's dashed focus ring when focused from the keyboard.

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] focus-visible:outline-offset-[-2px]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/scrollbar relative flex touch-none p-px select-none before:pointer-events-none before:absolute before:bg-rule data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:before:inset-x-1 data-horizontal:before:top-1/2 data-horizontal:before:h-px data-vertical:h-full data-vertical:w-2.5 data-vertical:before:inset-y-1 data-vertical:before:left-1/2 data-vertical:before:w-px",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 before:absolute before:rounded-full before:bg-ink-3 before:opacity-70 before:transition-[opacity,width,height] before:duration-150 group-data-hovering/scrollbar:before:opacity-100 group-data-scrolling/scrollbar:before:opacity-100 data-horizontal:before:inset-x-0 data-horizontal:before:top-1/2 data-horizontal:before:h-0.5 data-horizontal:before:-translate-y-1/2 data-vertical:before:inset-y-0 data-vertical:before:left-1/2 data-vertical:before:w-0.5 data-vertical:before:-translate-x-1/2 hover:before:bg-ink data-horizontal:hover:before:h-1 data-vertical:hover:before:w-1 active:before:bg-ink"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
