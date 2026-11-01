"use client"

import * as React from "react"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/patina/ui/button"

// A printed calendar page: a serif month, mono weekday heads and serif day numbers. Today is circled by hand (one
// fixed seed, so every build draws the same ring), the chosen day sits on a hand-inked dot with paper-coloured
// figures, and a range is a highlighter band between its two dots. Outside days print faint; disabled days are
// struck through. Dates format in en-US unless a locale is given, so the server and the browser agree.
const RING = sketch.ellipse(20, 20, 35, 33, {
  seed: 71,
  stroke: "var(--k)",
  strokeWidth: 1.6,
  roughness: 1.2,
})
const DOT = sketch.circle(20, 20, 31, {
  seed: 72,
  stroke: "var(--ink)",
  strokeWidth: 1.2,
  fill: "var(--ink)",
  fillStyle: "solid",
  roughness: 1.1,
})

const band =
  "before:pointer-events-none before:absolute before:inset-y-[24%] before:-z-10 before:bg-[color-mix(in_srgb,var(--print-yellow)_var(--hl-alpha),transparent)]"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-tight [--cell-size:2.5rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code ?? "en-US", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-snug md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-tight", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-ink-faint",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:pointer-events-none aria-disabled:text-ink-faint",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-hair",
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "relative h-control-compact rounded-sheet border-[1.5px] border-input bg-card transition-colors hover:border-ink data-[disabled=true]:border-dashed data-[disabled=true]:bg-transparent data-[disabled=true]:text-ink-faint has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-k-ink has-focus-visible:outline-dashed",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 cursor-pointer bg-card opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "font-read font-semibold text-ink select-none",
          captionLayout === "label"
            ? "text-body leading-subhead"
            : "flex h-full items-center gap-1 pr-1.5 pl-tight text-small leading-small [&>svg]:size-3.5 [&>svg]:text-ink-2",
          defaultClassNames.caption_label,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "label-mono flex-1 pb-1 text-ink-3 select-none",
          defaultClassNames.weekday,
        ),
        week: cn("mt-0.5 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "label-mono text-ink-3 select-none",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative isolate aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day,
        ),
        range_start: cn(
          band,
          "before:right-0 before:left-1/2",
          defaultClassNames.range_start,
        ),
        range_middle: cn(
          band,
          "before:inset-x-0 first:before:left-1 last:before:right-1",
          defaultClassNames.range_middle,
        ),
        range_end: cn(
          band,
          "before:right-1/2 before:left-0 [&:has([data-range-start=true][data-range-end=true])]:before:hidden",
          defaultClassNames.range_end,
        ),
        today: cn(defaultClassNames.today),
        outside: cn(defaultClassNames.outside),
        disabled: cn(defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  children,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const dotted = Boolean(modifiers.selected && !modifiers.range_middle)

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code ?? "en-US")}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 font-read text-ui leading-none font-normal tracking-normal normal-case lining-nums tabular-nums focus-visible:outline-offset-0 active:not-aria-[haspopup]:translate-y-0 disabled:line-through disabled:decoration-ink-faint group-data-outside/day:text-ink-faint data-[range-end=true]:text-paper data-[range-end=true]:before:hidden data-[range-start=true]:text-paper data-[range-start=true]:before:hidden data-[selected-single=true]:text-paper data-[selected-single=true]:before:hidden [&>span]:text-label [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      {dotted && (
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[2.125rem] -translate-1/2 overflow-visible"
          dangerouslySetInnerHTML={{ __html: DOT }}
        />
      )}
      {modifiers.today && (
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[2.375rem] -translate-1/2 overflow-visible"
          dangerouslySetInnerHTML={{ __html: RING }}
        />
      )}
      {children}
    </Button>
  )
}

export { Calendar, CalendarDayButton }
