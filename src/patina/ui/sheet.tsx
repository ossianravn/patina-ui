"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

import { Button } from "@/patina/ui/button"

// A page of card stock sliding in from one edge of the window, over dimmed paper. Its leading edge, the one facing the
// page, is deckled by a seeded clip-path (modelled on the deckle in ink/paper-shapes.ts, on that one side only); the
// paper shadow is a drop-shadow on the viewport around it, so it follows the cut edge instead of being clipped by it.
// Serif title, a mono close label like the dialog's, a dashed rule above the footer. Calm: no tilt, no tape.

type Side = "top" | "right" | "bottom" | "left"

const r1 = (n: number) => Math.round(n * 10) / 10

/** A clip-path that roughens the edge facing the page: points every 0.7–1.8 % pushed in by up to 3.5 px. */
function deckle(side: Side, seed: number) {
  const s = stream(seed, `sheet-edge:${side}`)
  const cuts: [number, number][] = [[0, r1(s.between(0, 3.5))]]
  for (let p = s.between(0.7, 1.8); p < 100; p += s.between(0.7, 1.8))
    cuts.push([r1(p), r1(s.between(0, 3.5))])
  cuts.push([100, r1(s.between(0, 3.5))])
  const edge = cuts.map(([p, d]) => {
    if (side === "right") return `${d}px ${p}%`
    if (side === "left") return `calc(100% - ${d}px) ${100 - p}%`
    if (side === "bottom") return `${100 - p}% ${d}px`
    return `${p}% calc(100% - ${d}px)`
  })
  const rest = {
    right: ["100% 100%", "100% 0"],
    left: ["0 0", "0 100%"],
    bottom: ["0 100%", "100% 100%"],
    top: ["100% 0", "0 0"],
  }[side]
  return `polygon(${[...edge, ...rest].join(", ")})`
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  style,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: Side
  showCloseButton?: boolean
}) {
  const seed = useSeed("sheet")
  const clipPath = React.useMemo(() => deckle(side, seed), [side, seed])
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Viewport
        data-slot="sheet-viewport"
        className="pointer-events-none fixed inset-0 z-50 [filter:var(--paper-drop)]"
      >
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          data-side={side}
          className={cn(
            "paper-surface pointer-events-auto fixed z-50 flex flex-col gap-tight bg-card text-small leading-small text-ink outline-none transition duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 has-[>[data-slot=sheet-close]]:*:data-[slot=sheet-header]:pr-20",
            "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:max-h-[85dvh] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem]",
            "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:max-h-[85dvh] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem]",
            "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=left]:sm:max-w-sm",
            "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=right]:sm:max-w-sm",
            className,
          )}
          style={{ clipPath, ...style }}
          {...props}
        >
          {children}
          {showCloseButton && (
            <SheetPrimitive.Close
              data-slot="sheet-close"
              render={
                <Button
                  variant="ghost"
                  className="absolute top-tight right-tight"
                  size="xs"
                />
              }
            >
              Close
            </SheetPrimitive.Close>
          )}
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-hair p-snug pb-0", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-tight border-t border-dashed border-rule p-snug",
        className,
      )}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "m-0 font-read text-lead leading-subhead font-semibold text-ink",
        className,
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("m-0 text-small leading-small text-ink-2", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
