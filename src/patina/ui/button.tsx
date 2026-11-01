import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A stamped label: mono, uppercase and bold on solid ink or a pen-line frame, with irregular sheet corners. Ghost
// buttons get a highlighter swipe; links a pen underline. Focus uses the page's dashed ring.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sheet border-[1.5px] border-transparent font-label text-button font-bold tracking-[0.08em] whitespace-nowrap uppercase transition-[background-color,color,translate] select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:border-dashed disabled:text-ink-faint aria-invalid:border-ink-red [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-paper hover:bg-print-violet disabled:border-line disabled:bg-transparent",
        outline:
          "border-line bg-card text-ink hover:bg-paper-3 aria-expanded:bg-paper-3",
        secondary:
          "bg-paper-3 text-ink hover:bg-paper-2 aria-expanded:bg-paper-2",
        ghost:
          "relative isolate text-ink before:pointer-events-none before:absolute before:inset-x-1 before:inset-y-0 before:-z-10 hover:before:highlight aria-expanded:before:highlight",
        destructive:
          "bg-ink-red text-paper hover:bg-ink disabled:border-line disabled:bg-transparent",
        link: "h-auto! border-0 px-0! text-k-ink underline decoration-[1.5px] underline-offset-[0.3em] decoration-k-ink/50 hover:decoration-k-ink",
      },
      size: {
        default:
          "h-control gap-tight px-snug has-data-[icon=inline-end]:pr-tight has-data-[icon=inline-start]:pl-tight",
        xs: "h-7 gap-hair px-tight [&_svg:not([class*='size-'])]:size-3",
        sm: "h-control-compact gap-hair px-tight [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-tight px-line",
        icon: "size-control",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-control-compact",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
