"use client"

import * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"
import { ArrowDownIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Button } from "@/patina/ui/button"

// The scroll container for a thread. A thin pencil scrollbar; the viewport's focus ring is drawn inside it, since
// the frame clips. When the reader scrolls away from the latest note, a stamped button comes up from the bottom
// edge: a mono label in a doubled rough frame on card stock, the rubber stamp's look on a control that stays level.

function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>,
) {
  return <MessageScrollerPrimitive.Provider {...props} />
}

function MessageScroller({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Root>) {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>) {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain [scrollbar-color:var(--rule)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] contain-content focus-visible:-outline-offset-4 data-autoscrolling:[scrollbar-color:transparent_transparent] data-pending-scroll:invisible",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Content>) {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col gap-snug", className)}
      {...props}
    />
  )
}

function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Item>) {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn(
        "min-w-0 shrink-0 [contain-intrinsic-size:auto_10rem] [content-visibility:auto]",
        className,
      )}
      {...props}
    />
  )
}

function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "outline",
  size = "sm",
  ...props
}: React.ComponentProps<typeof MessageScrollerPrimitive.Button> &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <MessageScrollerPrimitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      className={cn(
        "absolute inset-s-1/2 isolate -translate-x-1/2 border-transparent bg-card text-k-ink shadow-lift transition-[translate,scale,opacity] duration-200 hover:bg-paper-3 rtl:translate-x-1/2",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-sheet before:border-2 before:border-current before:[filter:var(--rough-3)] after:pointer-events-none after:absolute after:inset-[3px] after:-z-10 after:rounded-sheet after:border after:border-current after:opacity-60 after:[filter:var(--rough-3)]",
        "data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-300 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)] data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)] data-[direction=end]:bottom-snug data-[direction=end]:data-[active=false]:translate-y-full data-[direction=start]:top-snug data-[direction=start]:data-[active=false]:-translate-y-full data-[direction=start]:[&_svg]:rotate-180",
        className,
      )}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon data-icon="inline-start" />
          <span className="sr-only">Jump to </span>
          {direction === "end" ? "Latest" : "Earliest"}
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
