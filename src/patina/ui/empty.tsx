import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A quiet page for when there is nothing to show: a print (a `spot` Print in EmptyMedia suits it), a serif heading,
// one line of description and one action, centred in a reading column. Add `border` for a dashed rule-ink frame. The
// media tilts a little at the lively variation level and sits straight at calm. The icon variant sets a Lucide icon
// on a pressed paper tile instead of a print.

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-snug rounded-sheet border-dashed border-rule p-line text-center text-balance",
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-[28rem] flex-col items-center gap-hair",
        className,
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-hair flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rotate-[calc(var(--tilt-max)*-2)] bg-transparent",
        icon: "size-10 rounded-sheet bg-paper-3 text-ink [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-read text-lead leading-subhead font-semibold text-ink",
        className,
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-ui leading-small text-ink-2 [&>a]:underline [&>a]:decoration-k-ink/55 [&>a]:underline-offset-[0.2em] [&>a:hover]:decoration-k-ink",
        className,
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-[28rem] min-w-0 flex-col items-center gap-tight text-small leading-small text-balance",
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
