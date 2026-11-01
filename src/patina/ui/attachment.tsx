import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"
import { Button } from "@/patina/ui/button"

// File chips as small tickets. With media and content, the media is the ticket's stub: a notch is cut from each
// edge where a dashed perforation separates it from the mono file name. The sheet is two layers behind the content
// (a pen-line layer and a card-stock layer one pixel inside it, both masked by the same notches), so the outline
// follows the cut and focus rings stay unclipped. Idle is a dashed outline, error inks the outline oxblood, and
// uploading and processing pulse the name.

const notch = (x: string, y: string, r: string) =>
  `radial-gradient(circle at ${x} ${y}, #0000 ${r}, #000 calc(${r} + 0.5px))`
const R = "var(--ticket-notch)"
const R1 = "calc(var(--ticket-notch) + 1px)"
const X = "var(--ticket-x)"
const X1 = "calc(var(--ticket-x) - 1px)"
const Y = "var(--ticket-stub)"
const Y1 = "calc(var(--ticket-stub) - 1px)"
const MASKS = {
  horizontal: {
    "--ticket-outer": `${notch(X, "0", R)}, ${notch(X, "100%", R)}`,
    "--ticket-inner": `${notch(X1, "-1px", R1)}, ${notch(X1, "calc(100% + 1px)", R1)}`,
  },
  vertical: {
    "--ticket-outer": `${notch("0", Y, R)}, ${notch("100%", Y, R)}`,
    "--ticket-inner": `${notch("-1px", Y1, R1)}, ${notch("calc(100% + 1px)", Y1, R1)}`,
  },
}

const attachmentVariants = cva(
  [
    "group/attachment relative isolate flex w-fit max-w-full min-w-0 shrink-0 flex-wrap gap-(--ticket-gap) rounded-sheet text-ink",
    "[--ticket-perf:0px] not-data-[state=idle]:has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:[--ticket-perf:1.5px] [--ticket-stub:calc(var(--ticket-pad)_+_var(--ticket-media)_+_var(--ticket-gap)/2)] [--ticket-x:var(--ticket-stub)] rtl:[--ticket-x:calc(100%_-_var(--ticket-stub))]",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-sheet before:bg-line/35 after:pointer-events-none after:absolute after:inset-px after:-z-10 after:rounded-sheet after:bg-card after:paper-texture",
    "not-data-[state=idle]:has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:before:[mask-image:var(--ticket-outer)] not-data-[state=idle]:has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:before:[mask-composite:intersect] not-data-[state=idle]:has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:after:[mask-image:var(--ticket-inner)] not-data-[state=idle]:has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:after:[mask-composite:intersect]",
    "has-[>a,>button]:hover:after:bg-paper-2 data-[state=error]:before:bg-ink-red/70 data-[state=idle]:before:border-[1.5px] data-[state=idle]:before:border-dashed data-[state=idle]:before:border-line/45 data-[state=idle]:before:bg-transparent data-[state=idle]:after:hidden",
  ],
  {
    variants: {
      size: {
        default:
          "text-small [--ticket-gap:0.75rem] [--ticket-media:2.5rem] [--ticket-notch:5px] [--ticket-pad:0.5rem] has-data-[slot=attachment-content]:px-tight has-data-[slot=attachment-content]:py-hair has-data-[slot=attachment-media]:p-(--ticket-pad)",
        sm: "text-small [--ticket-gap:0.625rem] [--ticket-media:2rem] [--ticket-notch:4px] [--ticket-pad:0.375rem] has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-(--ticket-pad)",
        xs: "text-label [--ticket-gap:0.5rem] [--ticket-media:1.75rem] [--ticket-notch:3.5px] [--ticket-pad:0.25rem] has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-(--ticket-pad)",
      },
      orientation: {
        horizontal:
          "min-w-40 items-center has-data-[slot=attachment-media]:has-data-[slot=attachment-content]:pe-tight",
        vertical:
          "w-(--ticket-w) flex-col [--ticket-stub:calc(var(--ticket-w)_-_var(--ticket-pad)_+_var(--ticket-gap)/2)] [--ticket-w:6rem] has-data-[slot=attachment-content]:[--ticket-w:7.5rem]",
      },
    },
  },
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  style,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      style={
        {
          ...MASKS[orientation ?? "horizontal"],
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "relative flex aspect-square w-(--ticket-media) shrink-0 items-center justify-center overflow-hidden rounded-sheet bg-paper-2 text-ink-2 group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:bg-print-red/10 group-data-[state=error]/attachment:text-ink-red group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "",
        image:
          "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  },
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // The perforation is the content's ::before, positioned against the ticket rather than the content box.
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
        "before:pointer-events-none before:absolute before:border-dashed before:border-line/40",
        "group-data-[orientation=horizontal]/attachment:before:inset-y-[calc(var(--ticket-notch)_+_3px)] group-data-[orientation=horizontal]/attachment:before:start-[calc(var(--ticket-stub)_-_0.75px)] group-data-[orientation=horizontal]/attachment:before:border-s-(length:--ticket-perf)",
        "group-data-[orientation=vertical]/attachment:before:inset-x-[calc(var(--ticket-notch)_+_3px)] group-data-[orientation=vertical]/attachment:before:top-[calc(var(--ticket-stub)_-_0.75px)] group-data-[orientation=vertical]/attachment:before:border-t-(length:--ticket-perf)",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "block max-w-full min-w-0 truncate font-label leading-[1.45] font-medium text-ink group-data-[orientation=vertical]/attachment:text-label group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "mt-0.5 block max-w-full min-w-0 truncate font-label text-label leading-[1.45] tracking-[0.06em] text-ink-2 uppercase group-data-[state=error]/attachment:text-ink-red",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:end-[calc(var(--ticket-pad)_+_0.25rem)] group-data-[orientation=vertical]/attachment:top-[calc(var(--ticket-pad)_+_0.25rem)] group-data-[orientation=vertical]/attachment:gap-1 group-data-[orientation=vertical]/attachment:*:bg-card",
        className,
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant,
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant ?? "ghost"}
      size={size}
      className={cn("text-ink-2 hover:text-ink", className)}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn(
          "absolute inset-0 z-10 cursor-pointer rounded-sheet",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "-mx-1.5 flex min-w-0 snap-x snap-mandatory scroll-px-1.5 gap-tight overflow-x-auto overscroll-x-contain p-1.5 [scrollbar-width:none] *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
        className,
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger,
}
