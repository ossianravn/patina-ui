"use client"

import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import * as ResizablePrimitive from "react-resizable-panels"

// Panels divided by a pen line. The line takes the region's drum while hovered or dragged, and its hit area is wider
// than the line. withHandle adds a card-stock grip with six inked dots, drawn by hand, the same dots every time; in a
// vertical group the grip turns on its side. Focus is the page's dashed ring. The group fills its parent
// (react-resizable-panels sets height: 100% inline), so size the parent rather than the group.
const DOTS = (
  [
    [4, 5],
    [10, 5],
    [4, 12],
    [10, 12],
    [4, 19],
    [10, 19],
  ] as const
)
  .map(([x, y], i) =>
    sketch.circle(x, y, 2.6, {
      seed: 60 + i,
      stroke: "currentColor",
      strokeWidth: 0.8,
      fill: "currentColor",
      fillStyle: "solid",
      roughness: 0.7,
    }),
  )
  .join("")

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-[1.5px] items-center justify-center bg-line/70 transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 data-[separator=active]:bg-k data-[separator=focus]:bg-k data-[separator=hover]:bg-k aria-[orientation=horizontal]:h-[1.5px] aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-3 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-7 w-4 shrink-0 items-center justify-center rounded-sheet border-[1.5px] border-line bg-card text-ink-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 14 24"
            className="h-[1.1rem] w-[0.65rem] overflow-visible"
            dangerouslySetInnerHTML={{ __html: DOTS }}
          />
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
