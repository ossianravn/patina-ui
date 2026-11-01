"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

// Rows on dashed rules. The trigger is a serif heading with a plus drawn by hand at its end; opening the row turns the
// plus's upright stroke down onto the crossbar, leaving a minus. The panel's height eases open and shut; its text sits
// in the second ink at a reading measure. Focus is the page's dashed ring; a disabled row fades to the faint ink.
const PEN = {
  stroke: "currentColor",
  strokeWidth: 1.7,
  roughness: 0.9,
} as const
const BAR = sketch.curve(
  [
    [3, 10.5],
    [10, 9.6],
    [17, 10.1],
  ],
  { ...PEN, seed: 51 },
)
const UPRIGHT = sketch.curve(
  [
    [10.4, 3],
    [9.6, 10],
    [10.1, 17],
  ],
  { ...PEN, seed: 52 },
)

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-dashed border-rule not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="m-0 flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 cursor-pointer items-start justify-between gap-snug py-tight text-left font-read text-body leading-subhead font-semibold text-ink decoration-k-ink/55 decoration-[1.5px] underline-offset-[0.25em] transition-colors hover:underline aria-disabled:pointer-events-none aria-disabled:text-ink-faint data-disabled:pointer-events-none data-disabled:text-ink-faint **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-ink-2 aria-disabled:**:data-[slot=accordion-trigger-icon]:text-ink-faint data-disabled:**:data-[slot=accordion-trigger-icon]:text-ink-faint",
          className,
        )}
        {...props}
      >
        {children}
        <svg
          data-slot="accordion-trigger-icon"
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none mt-px shrink-0 overflow-visible"
        >
          <g dangerouslySetInnerHTML={{ __html: BAR }} />
          <g
            className="origin-center transition-transform duration-200 ease-out [transform-box:view-box] group-aria-expanded/accordion-trigger:rotate-90"
            dangerouslySetInnerHTML={{ __html: UPRIGHT }}
          />
        </svg>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-body leading-body text-ink-2 transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div
        className={cn(
          "max-w-measure pb-snug [&_a]:underline [&_a]:decoration-k-ink/55 [&_a]:underline-offset-[0.2em] [&_a]:hover:decoration-k-ink [&_p]:m-0 [&_p:not(:last-child)]:mb-tight",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
