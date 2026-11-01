import { Separator } from "@/patina/ui/separator"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Separator",
  description:
    "A dashed rule that divides entries in a list or items in a row.",
  item: "separator",
  group: "Data display",
}

const ENTRIES = [
  { species: "Grey heron", note: "07:42 · first hide" },
  { species: "Little egret", note: "08:05 · sluice gate" },
  { species: "Curlew", note: "08:31 · the flats" },
]

export default function SeparatorDemo() {
  return (
    <DemoSection title="Orientation">
      <StateRow label="Horizontal">
        <div className="w-[20rem] max-w-full">
          {ENTRIES.map(({ species, note }, i) => (
            <div key={species}>
              {i > 0 && <Separator />}
              <div className="flex items-baseline justify-between gap-tight py-hair">
                <span className="font-semibold">{species}</span>
                <span className="text-small leading-small text-ink-2">
                  {note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </StateRow>
      <StateRow label="Vertical">
        <div className="flex h-5 items-center gap-tight font-label text-label tracking-[0.06em] text-ink-2 uppercase">
          <span>Sat 14 Nov</span>
          <Separator orientation="vertical" />
          <span>07:00</span>
          <Separator orientation="vertical" />
          <span>Sluice gate</span>
        </div>
      </StateRow>
    </DemoSection>
  )
}
