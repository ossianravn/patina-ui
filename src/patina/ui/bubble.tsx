import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// Paper slips. Each variant is a stock, not a gradient: default is a slip of card laid on the page with a paper
// shadow (the person's side), secondary and muted are the page's own darker stocks (the other side), tinted is card
// washed with the region's drum, outline is a pencilled slip, destructive an oxblood wash. Corners are the sheet's
// irregular cut. Text reads in the serif; links and buttons inside keep the page's dashed focus ring.

const bubbleVariants = cva(
  "group/bubble relative flex w-fit max-w-[min(100%,max(80%,18rem))] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "*:data-[slot=bubble-content]:bg-card *:data-[slot=bubble-content]:paper-texture *:data-[slot=bubble-content]:shadow-sheet *:data-[slot=bubble-content]:ring-1 *:data-[slot=bubble-content]:ring-line/10 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-paper-3",
        secondary:
          "*:data-[slot=bubble-content]:bg-paper-3 *:data-[slot=bubble-content]:paper-texture [&>[data-slot=bubble-content]:is(button,a):hover]:bg-paper-2",
        muted:
          "*:data-[slot=bubble-content]:bg-paper-2 *:data-[slot=bubble-content]:paper-texture [&>[data-slot=bubble-content]:is(button,a):hover]:bg-paper-3",
        tinted:
          "*:data-[slot=bubble-content]:bg-[color-mix(in_srgb,var(--k)_14%,var(--card))] *:data-[slot=bubble-content]:paper-texture [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_srgb,var(--k)_22%,var(--card))]",
        outline:
          "*:data-[slot=bubble-content]:border-line/45 *:data-[slot=bubble-content]:bg-transparent [&>[data-slot=bubble-content]:is(button,a):hover]:bg-paper-2",
        ghost:
          "border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-paper-2",
        destructive:
          "*:data-[slot=bubble-content]:bg-print-red/10 *:data-[slot=bubble-content]:text-ink-red [&>[data-slot=bubble-content]:is(button,a):hover]:bg-print-red/18",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-hair", className)}
      {...props}
    />
  )
}

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 overflow-hidden rounded-sheet border border-transparent px-tight py-hair font-read text-body leading-lead wrap-break-word group-data-[align=end]/bubble:self-end [button]:cursor-pointer [button]:text-left [button,a]:no-underline [button,a]:transition-colors",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-sheet border border-line/30 bg-card px-1.5 py-px font-label text-label leading-[1.45] font-bold text-ink shadow-[0_0_0_2px_var(--paper)] has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "left-tight",
        end: "right-tight",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  },
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
