import { Fragment } from "react"
import { Print } from "@/patina/print/print"
import { ScrollArea, ScrollBar } from "@/patina/ui/scroll-area"
import { Separator } from "@/patina/ui/separator"
import { OBSERVATIONS } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Scroll area",
  description:
    "A region that scrolls inside a fixed frame, with a thin pencil scrollbar that stays out of the way of its content.",
  item: "scroll-area",
  group: "Data display",
}

// Tide times for the fortnight from the demo clock: two highs a day, about 50 minutes later each day.
const TIDES = Array.from({ length: 14 }, (_, d) => {
  const minutes = 3 * 60 + 10 + d * 50
  const clock = (m: number) =>
    `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`
  const [first, second] = [minutes % 1440, (minutes + 743) % 1440].sort(
    (a, b) => a - b,
  )
  return {
    day: `${["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"][d % 7]} ${14 + d} Nov`,
    first: clock(first ?? 0),
    second: clock(second ?? 0),
  }
})

export default function ScrollAreaDemo() {
  return (
    <>
      <DemoSection title="Orientation">
        <StateRow label="Vertical">
          <ScrollArea className="h-72 w-[19rem] rounded-sheet border border-rule">
            <div className="px-snug py-tight">
              <h3 className="label-mono m-0 mb-hair text-ink-2">
                High water, next fortnight
              </h3>
              {TIDES.map((t, i) => (
                <Fragment key={t.day}>
                  {i > 0 ? <Separator /> : null}
                  <p className="m-0 flex justify-between py-hair text-ui leading-ui">
                    <span>{t.day}</span>
                    <span className="font-label text-small text-ink-2 tabular-nums">
                      {t.first} · {t.second}
                    </span>
                  </p>
                </Fragment>
              ))}
            </div>
          </ScrollArea>
        </StateRow>
        <StateRow label="Horizontal">
          <ScrollArea className="w-full max-w-[38rem] rounded-sheet [contain:inline-size] border border-rule">
            <ul className="m-0 flex w-max list-none gap-snug p-snug pb-line">
              {OBSERVATIONS.map((o) => (
                <li key={o.id} className="flex w-28 flex-col gap-1">
                  <Print motif={o.motif} seed={o.id} className="w-28" />
                  <span className="truncate text-small leading-small font-semibold">
                    {o.species}
                  </span>
                  <span className="label-mono truncate text-ink-3">
                    {o.place}
                  </span>
                </li>
              ))}
            </ul>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </StateRow>
      </DemoSection>
    </>
  )
}
