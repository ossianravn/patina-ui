import { useState, type ReactNode } from "react"
import { Slider } from "@/patina/ui/slider"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Slider",
  description:
    "A pen-line track with a card-stock thumb, for setting a value or a range by feel within known bounds.",
  item: "slider",
  group: "Forms",
}

const first = (v: number | readonly number[]) =>
  Array.isArray(v) ? (v[0] ?? 0) : (v as number)

function Readout({ children }: { children: ReactNode }) {
  return (
    <output className="w-[5.5rem] shrink-0 font-label text-small leading-small text-ink-2 tabular-nums">
      {children}
    </output>
  )
}

function Labelled({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-hair">
      <span id={id} className="text-small leading-small font-semibold">
        {label}
      </span>
      <div className="flex items-center gap-snug">{children}</div>
    </div>
  )
}

export default function SliderDemo() {
  const [cover, setCover] = useState(3)
  const [depth, setDepth] = useState<readonly number[]>([2, 12])
  const [tide, setTide] = useState(3.4)
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Single value">
          <Labelled id="cloud-cover" label="Cloud cover">
            <Slider
              aria-labelledby="cloud-cover"
              min={0}
              max={8}
              value={cover}
              onValueChange={(v) => setCover(first(v))}
              className="w-[16rem]"
            />
            <Readout>{cover} oktas</Readout>
          </Labelled>
        </StateRow>
        <StateRow label="Range">
          <Labelled id="survey-depth" label="Survey depth">
            <Slider
              aria-labelledby="survey-depth"
              min={0}
              max={30}
              value={depth}
              onValueChange={(v) =>
                setDepth(Array.isArray(v) ? v : [v as number])
              }
              className="w-[16rem]"
            />
            <Readout>
              {depth[0]}–{depth[1]} m
            </Readout>
          </Labelled>
        </StateRow>
        <StateRow label="Disabled">
          <Labelled id="wind-force" label="Wind force (from the station)">
            <Slider
              aria-labelledby="wind-force"
              min={0}
              max={12}
              defaultValue={4}
              disabled
              className="w-[16rem]"
            />
            <Readout>Force 4</Readout>
          </Labelled>
        </StateRow>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="Tide height">
          <div className="flex items-end gap-tight">
            <Slider
              aria-labelledby="tide-height"
              orientation="vertical"
              min={0}
              max={6}
              step={0.1}
              value={tide}
              onValueChange={(v) => setTide(first(v))}
              className="h-40"
            />
            <div className="flex flex-col">
              <span
                id="tide-height"
                className="text-small leading-small font-semibold"
              >
                Tide height
              </span>
              <Readout>{tide.toFixed(1)} m</Readout>
            </div>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
