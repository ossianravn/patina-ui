"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/patina/lib/utils"

// Mono labels on a dashed rule (the line variant drops the rule). The active tab gets the hand underline, the same
// two loose strokes as the hand-underline mark, in the region's drum; vertical tabs get it as a stroke down the
// inline-end edge. Orientation is matched on data-orientation directly, so the classes work without shadcn's
// data-horizontal and data-vertical variants.
const STROKE = {
  fill: "none",
  stroke: "var(--k)",
  strokeLinecap: "round",
  vectorEffect: "non-scaling-stroke",
} as const

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-snug data-[orientation=horizontal]:flex-col",
        className,
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex h-control w-full items-center justify-start text-ink-2 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:w-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        default:
          "border-dashed border-rule group-data-[orientation=horizontal]/tabs:border-b-[1.5px] group-data-[orientation=vertical]/tabs:border-r-[1.5px]",
        line: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "group/tabs-trigger relative inline-flex cursor-pointer items-center justify-center gap-hair px-tight font-label text-button font-bold tracking-[0.08em] whitespace-nowrap text-ink-2 uppercase transition-colors select-none hover:text-ink disabled:pointer-events-none disabled:text-ink-faint has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-active:text-ink [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
        "group-data-[orientation=horizontal]/tabs:h-full group-data-[orientation=vertical]/tabs:h-control-compact group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:pr-snug",
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          className="absolute bottom-[0.5rem] left-2 h-[0.45rem] w-[calc(100%-1rem)] overflow-visible opacity-0 transition-opacity group-data-active/tabs-trigger:opacity-90 group-data-[orientation=vertical]/tabs:hidden"
        >
          <path
            d="M2 8 C 40 3, 80 5, 120 6 S 180 4, 198 5"
            strokeWidth={2.6}
            {...STROKE}
          />
          <path
            d="M6 10 C 60 7, 110 9, 190 7"
            strokeWidth={1.4}
            opacity={0.7}
            {...STROKE}
          />
        </svg>
        <svg
          viewBox="0 0 12 200"
          preserveAspectRatio="none"
          className="absolute top-1 -right-[0.3rem] hidden h-[calc(100%-0.5rem)] w-[0.45rem] overflow-visible opacity-0 transition-opacity group-data-active/tabs-trigger:opacity-90 group-data-[orientation=vertical]/tabs:block"
        >
          <path
            d="M5 2 C 4 40, 6 80, 6 120 S 4 180, 5 198"
            strokeWidth={2.6}
            {...STROKE}
          />
          <path
            d="M8 6 C 9 60, 7 110, 9 190"
            strokeWidth={1.4}
            opacity={0.7}
            {...STROKE}
          />
        </svg>
      </span>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
