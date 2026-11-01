import { cn } from "@/patina/lib/utils"
import { Checklist } from "@/patina/extras/checklist"
import { Stamp } from "@/patina/marks/stamp"
import { Stage } from "./stage/stage"
import { useStage, type Act } from "./stage/use-stage"

// Scene: a checklist being ticked before high tide. Beats: three taps tick the open items one by one, each tick drawn
// in and the tally counting up beside the title; the last tick completes the list, and completing it stamps the
// sheet Recorded, the stamp landing across its top edge. The poster frame is the finished list under its stamp.

const ITEMS = [
  {
    value: "count",
    label: "Count waders at the sluice gate",
    note: "From the north hide",
  },
  {
    value: "heron",
    label: "Check the creek for the heron",
    note: "Since 05:40",
  },
  { value: "reeds", label: "Photograph the reed edge", note: "Two frames" },
  { value: "tide", label: "Log the tide height", note: "Falling, 2.1 m" },
]
const OPEN = ["heron", "reeds", "tide"]

interface S {
  ticked: string[]
  stamped: boolean
}
const INITIAL: S = { ticked: ["count"], stamped: false }
const POSTER: S = { ticked: ITEMS.map((i) => i.value), stamped: true }

async function script(a: Act<S>) {
  a.place({ x: 0.9, y: 0.92 })
  await a.wait(500)
  const ticked = ["count"]
  for (const value of OPEN) {
    const row = ITEMS.findIndex((item) => item.value === value) + 1
    const box = `[data-slot=checklist-item]:nth-child(${row}) [data-slot=checkbox]`
    await a.move({ css: box, x: 0.62, y: 0.66 })
    await a.press()
    ticked.push(value)
    a.put({ ticked: [...ticked] })
    await a.wait(380)
  }
  await a.wait(260)
  a.put({ stamped: true })
  await a.move({ x: 0.9, y: 0.9 }, { ms: 900 })
  await a.wait(2000)
}

export function ChecklistScene() {
  const stage = useStage({ initial: INITIAL, poster: POSTER, script })
  const { ticked, stamped } = stage.state
  return (
    <Stage stage={stage} label="a checklist ticked off">
      <div
        className={cn(
          "sheet absolute top-[9%] left-[6%] h-[110%] w-[min(30rem,76%)] px-line pt-snug @max-[30rem]:right-tight @max-[30rem]:left-tight @max-[18.5rem]:right-2 @max-[18.5rem]:left-2 @max-[30rem]:w-auto @max-[30rem]:px-tight",
          // A tick inks in where it lands.
          "[&_[data-slot=checkbox-indicator]]:animate-in [&_[data-slot=checkbox-indicator]]:duration-200 [&_[data-slot=checkbox-indicator]]:fade-in [&_[data-slot=checkbox-indicator]]:zoom-in-75",
        )}
      >
        <Checklist
          title="Before high tide, 11:20"
          items={ITEMS}
          value={ticked}
        />
      </div>
      <Stamp
        variant="solid"
        seed="recorded"
        className={cn(
          "absolute top-[calc(9%-1rem)] right-[24%] z-10 text-ui transition-[opacity,scale] duration-200 ease-out @max-[30rem]:right-[1.75rem]",
          stamped ? "scale-100 opacity-100" : "scale-125 opacity-0",
        )}
      >
        Recorded
      </Stamp>
    </Stage>
  )
}
