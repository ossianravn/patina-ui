import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// A stamped label that stays down: the button's mono voice, and solid ink with paper text while pressed, like the
// specimen's segmented controls. Disabled and pressed keeps a paper-3 fill so the state still reads.
const toggleVariants = cva(
  "group/toggle inline-flex shrink-0 cursor-pointer items-center justify-center gap-hair rounded-sheet border-[1.5px] border-transparent font-label text-button font-bold tracking-[0.08em] whitespace-nowrap text-ink-2 uppercase transition-[background-color,color,translate] select-none hover:text-ink active:translate-y-px disabled:pointer-events-none disabled:border-dashed disabled:text-ink-faint aria-invalid:border-ink-red data-pressed:bg-ink data-pressed:text-paper disabled:data-pressed:border-line disabled:data-pressed:bg-paper-3 disabled:data-pressed:text-ink-faint [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:not-data-pressed:bg-paper-3",
        outline: "border-line bg-card hover:not-data-pressed:bg-paper-3",
      },
      size: {
        default:
          "h-control min-w-control px-tight has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        sm: "h-control-compact min-w-control-compact px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 min-w-12 px-snug has-data-[icon=inline-end]:pr-tight has-data-[icon=inline-start]:pl-tight",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
