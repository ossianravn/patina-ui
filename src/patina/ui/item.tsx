import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

import { Separator } from "@/patina/ui/separator"

// A typeset row in the manner of an index entry: an optional number in mono (ItemMedia variant "number"), a serif
// title, a one-line hook in the second ink, a media slot that suits a small Print, and actions at the end. Outline
// rows sit in a rule-ink frame; muted rows on a recessed well. A row rendered as a link drops the underline and takes
// a well on hover; focus is the page's dashed ring.

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        "group/item-group flex w-full flex-col gap-tight has-data-[size=sm]:gap-hair has-data-[size=xs]:gap-1",
        className,
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-sheet border-[1.5px] text-small leading-small text-ink transition-colors duration-100 [a]:no-underline [a]:hover:bg-paper-2/80",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-rule",
        muted: "border-transparent bg-paper-2/80",
      },
      size: {
        default: "gap-snug px-snug py-tight",
        sm: "gap-tight px-tight py-hair",
        xs: "gap-hair px-hair py-1 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof itemVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  })
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-hair group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "text-ink-2 group-has-data-[slot=item-description]/item:translate-y-0.5 [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-12 overflow-hidden rounded-sheet group-data-[size=sm]/item:size-9 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover [&>[data-slot=print]]:w-[128%] [&>[data-slot=print]]:max-w-none [&>[data-slot=print]]:shrink-0",
        number:
          "min-w-[2.6ch] justify-start font-label text-small leading-none font-medium text-ink-3 tabular-nums group-has-data-[slot=item-description]/item:translate-y-[0.4rem] group-data-[size=sm]/item:text-label group-data-[size=xs]/item:text-label",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-0.5 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-hair font-read text-body leading-subhead font-semibold text-ink group-data-[size=sm]/item:text-ui group-data-[size=xs]/item:text-small",
        className,
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "m-0 line-clamp-2 text-left text-small leading-small font-normal text-ink-2 group-data-[size=xs]/item:text-label [&>a]:underline [&>a]:decoration-k-ink/55 [&>a]:underline-offset-[0.2em] [&>a:hover]:decoration-k-ink",
        className,
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-hair", className)}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-tight",
        className,
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
