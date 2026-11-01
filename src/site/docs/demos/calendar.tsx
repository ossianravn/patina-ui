import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/patina/ui/button"
import { Calendar } from "@/patina/ui/calendar"
import { Label } from "@/patina/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/patina/ui/popover"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Calendar",
  description:
    "A month page for choosing a day or a run of days, and the date pickers built from it.",
  item: "calendar",
  group: "Forms",
}

// The demo clock: Saturday 14 November 2026. Passing it as `today` keeps the server and browser on one page.
const TODAY = new Date(2026, 10, 14)
const day = (d: number, month = 10) => new Date(2026, month, d)

const page = "w-fit rounded-sheet sheet"
const trigger =
  "h-control justify-start gap-hair px-tight font-ui text-ui font-normal tracking-normal normal-case data-[empty=true]:text-ink-3 [&_svg]:text-ink-2"

function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(day(18))
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-hair">
      <Label id="survey-date-label">Survey date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          aria-labelledby="survey-date-label"
          render={
            <Button
              variant="outline"
              data-empty={!date}
              className={`${trigger} w-[12.5rem]`}
            />
          }
        >
          <CalendarIcon />
          {date ? format(date, "EEE d MMM yyyy") : "Pick a date"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            today={TODAY}
            defaultMonth={date ?? TODAY}
            selected={date}
            onSelect={(next) => {
              setDate(next)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

function RangePicker() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(20),
    to: day(26),
  })
  const label = range?.from
    ? range.to
      ? `${format(range.from, "d MMM")} – ${format(range.to, "d MMM yyyy")}`
      : format(range.from, "d MMM yyyy")
    : "Pick the days"
  return (
    <div className="flex flex-col gap-hair">
      <Label id="expedition-dates-label">Expedition dates</Label>
      <Popover>
        <PopoverTrigger
          aria-labelledby="expedition-dates-label"
          render={
            <Button
              variant="outline"
              data-empty={!range?.from}
              className={`${trigger} w-[15rem]`}
            />
          }
        >
          <CalendarIcon />
          {label}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            today={TODAY}
            defaultMonth={range?.from ?? TODAY}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function CalendarDemo() {
  const [single, setSingle] = useState<Date | undefined>(day(18))
  const [range, setRange] = useState<DateRange | undefined>({
    from: day(20),
    to: day(26),
  })
  return (
    <>
      <DemoSection title="Calendar">
        <StateRow label="Single day">
          <Calendar
            mode="single"
            today={TODAY}
            defaultMonth={TODAY}
            selected={single}
            onSelect={setSingle}
            className={page}
          />
        </StateRow>
        <StateRow label="Range">
          <Calendar
            mode="range"
            today={TODAY}
            defaultMonth={TODAY}
            selected={range}
            onSelect={setRange}
            className={page}
          />
        </StateRow>
        <StateRow label="Disabled days">
          <Calendar
            mode="single"
            today={TODAY}
            defaultMonth={TODAY}
            disabled={[{ before: TODAY }, { dayOfWeek: [1] }]}
            className={page}
          />
        </StateRow>
        <StateRow label="Month menus">
          <Calendar
            mode="single"
            today={TODAY}
            defaultMonth={TODAY}
            captionLayout="dropdown"
            startMonth={day(1, 0)}
            endMonth={new Date(2027, 11, 1)}
            className={page}
          />
        </StateRow>
      </DemoSection>
      <DemoSection title="Date pickers">
        <StateRow label="Single">
          <DatePicker />
        </StateRow>
        <StateRow label="Range">
          <RangePicker />
        </StateRow>
      </DemoSection>
    </>
  )
}
