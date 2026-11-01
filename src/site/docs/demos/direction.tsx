import { useState } from "react"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"
import { MarginNote } from "@/patina/marks/notes"
import { Button } from "@/patina/ui/button"
import { DirectionProvider } from "@/patina/ui/direction"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/patina/ui/dropdown-menu"
import { Slider } from "@/patina/ui/slider"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Direction",
  description:
    "Tells every primitive which way the page reads, so menus, sliders and keyboard arrows follow right-to-left text.",
  item: "direction",
  group: "Navigation",
}

type Dir = "ltr" | "rtl"

const TRAIL = ["Fieldbook", "Expeditions", "Saltmarsh walk"]

/** The same small screen in either direction: a trail of links, a menu, a slider and a handwritten aside. */
function Composition({ dir }: { dir: Dir }) {
  const [sort, setSort] = useState("date")
  const [tide, setTide] = useState(3.4)
  const label = `tide-${dir}`
  return (
    <DirectionProvider direction={dir}>
      <div
        dir={dir}
        className="flex min-w-0 flex-col gap-snug rounded-sheet border border-dashed border-rule p-snug"
      >
        <p className="label-mono m-0 text-ink-3">
          {dir === "ltr" ? "Left to right" : "Right to left"}
        </p>
        <nav aria-label={`Trail, ${dir}`}>
          <ol className="m-0 flex list-none flex-wrap items-center gap-hair p-0">
            {TRAIL.map((name, i) => {
              const last = i === TRAIL.length - 1
              return (
                <li key={name} className="flex items-center gap-hair">
                  <a
                    href={`#${dir}-${i}`}
                    aria-current={last ? "page" : undefined}
                    className="label-mono text-ink-2 no-underline hover:text-ink aria-[current=page]:text-ink aria-[current=page]:highlight"
                  >
                    {name}
                  </a>
                  {!last && (
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-3 text-ink-3 rtl:rotate-180"
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-tight">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              Sort <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent dir={dir} className="w-44">
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="date">
                  By date
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="species">
                  By species
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="place">
                  By place
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <MarginNote decorative className="text-body">
            newest first
          </MarginNote>
        </div>
        <div className="flex flex-col gap-hair">
          <span id={label} className="text-small leading-small font-semibold">
            Tide height
          </span>
          <div className="flex items-center gap-tight">
            <Slider
              aria-labelledby={label}
              min={0}
              max={6.1}
              step={0.1}
              value={tide}
              onValueChange={(v) => setTide(Array.isArray(v) ? (v[0] ?? 0) : v)}
              className="w-[12rem]"
            />
            <output
              dir="ltr"
              className="font-label text-small text-ink-2 tabular-nums"
            >
              {tide.toFixed(1)} m
            </output>
          </div>
        </div>
      </div>
    </DirectionProvider>
  )
}

export default function DirectionDemo() {
  return (
    <DemoSection title="Side by side">
      <div className="grid gap-snug md:grid-cols-2">
        <Composition dir="ltr" />
        <Composition dir="rtl" />
      </div>
    </DemoSection>
  )
}
