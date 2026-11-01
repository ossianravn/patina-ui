import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A wash of the region's drum with a drawn glyph (pass a Glyph or a Lucide icon as the first child) and copy in the
// reading inks. Destructive washes in red and sets the title and glyph in red text ink.
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-sheet px-snug py-tight text-left text-small leading-small text-ink has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-28 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-tight *:[svg]:row-span-2 *:[svg]:translate-y-px *:[svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-k/10 *:[svg]:text-k-ink",
        destructive:
          "bg-print-red/10 *:data-[slot=alert-title]:text-ink-red *:[svg]:text-ink-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-semibold group-has-[>svg]/alert:col-start-2",
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "max-w-measure text-small leading-small text-balance text-ink-2 md:text-pretty [&_p]:m-0 [&_p:not(:last-child)]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-1/2 right-tight -translate-y-1/2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
