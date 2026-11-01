import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A small stamp: a mono uppercase label in a 1.5px border of its own colour, with sheet corners. The default is a
// solid ink stamp; destructive stamps in red text ink. Calm: badges sit in lists and tables, so they never tilt.
const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sheet border-[1.5px] border-transparent px-1.5 font-label text-label leading-none font-bold tracking-[0.08em] whitespace-nowrap uppercase no-underline transition-colors has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-invalid:border-ink-red [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-ink bg-ink text-paper [a]:hover:border-print-violet [a]:hover:bg-print-violet",
        secondary: "bg-paper-3 text-ink [a]:hover:bg-paper-2",
        destructive: "border-current text-ink-red [a]:hover:bg-print-red/10",
        outline: "border-current text-ink [a]:hover:bg-paper-3",
        ghost: "text-ink-2 hover:bg-paper-3 hover:text-ink",
        link: "px-0 text-k-ink underline decoration-[1.5px] decoration-k-ink/50 underline-offset-[0.3em] hover:decoration-k-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
