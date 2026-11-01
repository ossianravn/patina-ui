import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A line in the thread that is not a message: a date, "New", someone joining. Mono label voice; the separator
// variant sits between two rough rules (the RoughRule mark's pen line through two different wobble filters), the
// border variant on a dashed rule. Colour the whole marker with a text ink (text-k-ink, text-ink-red) to call it out.
const markerVariants = cva(
  "group/marker relative flex min-h-4 w-full items-center gap-hair text-left font-label text-label leading-[1.45] font-medium tracking-[0.06em] text-ink-2 uppercase [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:decoration-[1.5px] [a]:underline-offset-[0.3em] [a]:hover:text-ink",
  {
    variants: {
      variant: {
        default: "",
        separator:
          "gap-tight before:rough-rule before:min-w-0 before:flex-1 before:[filter:var(--rough-2)] after:rough-rule after:min-w-0 after:flex-1 after:[filter:var(--rough-5)]",
        border: "border-b border-dashed border-rule pb-hair",
      },
    },
  },
)

function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof markerVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(markerVariants({ variant, className })),
      },
      props,
    ),
    render,
    state: {
      slot: "marker",
      variant,
    },
  })
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "min-w-0 wrap-break-word group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center *:[a]:underline *:[a]:underline-offset-[0.3em] *:[a]:hover:text-ink",
        className,
      )}
      {...props}
    />
  )
}

export { Marker, MarkerIcon, MarkerContent, markerVariants }
