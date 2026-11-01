import { useState } from "react"
import { Checklist, type ChecklistItem } from "@/patina/extras/checklist"
import { Button } from "@/patina/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Checklist",
  description:
    "A list to tick off as you go, with a running tally, such as the checks before a count.",
  item: "checklist",
  group: "Patina extras",
}

const PRE_COUNT: ChecklistItem[] = [
  {
    value: "tide",
    label: "Tide table checked",
    note: "High water 11:52 at the Sluice gate",
  },
  {
    value: "sectors",
    label: "Count sectors agreed",
    note: "Mira Okafor takes the Tidal flats and the Saltings",
  },
  { value: "scope", label: "Scope and tripod packed" },
  {
    value: "clickers",
    label: "Tally counters zeroed",
    note: "Two each, one spare in the North hide",
  },
  {
    value: "keys",
    label: "Hide keys collected",
    note: "From the warden’s office by 07:00",
  },
]

const ALL = PRE_COUNT.map((item) => item.value)

function Controlled() {
  const [value, setValue] = useState<string[]>(["tide"])
  return (
    <div className="flex w-full max-w-measure flex-col gap-snug">
      <Checklist
        title="Before the wader count"
        items={PRE_COUNT}
        value={value}
        onValueChange={setValue}
      />
      <div className="flex gap-tight">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setValue(ALL)}
          disabled={value.length === ALL.length}
        >
          Tick all
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setValue([])}
          disabled={value.length === 0}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}

export default function ChecklistDemo() {
  return (
    <>
      <DemoSection title="Uncontrolled">
        <Checklist
          title="Before the wader count"
          items={PRE_COUNT}
          defaultValue={["tide", "sectors", "scope"]}
        />
      </DemoSection>
      <DemoSection title="Controlled">
        <Controlled />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="All done">
          <Checklist
            title="Hide opened"
            items={PRE_COUNT.slice(3)}
            defaultValue={["clickers", "keys"]}
          />
        </StateRow>
        <StateRow label="Item disabled">
          <Checklist
            title="Boat survey"
            items={[
              { value: "lifejackets", label: "Lifejackets aboard" },
              {
                value: "boat",
                label: "Boat booked",
                note: "Not running until the spring",
                disabled: true,
              },
            ]}
          />
        </StateRow>
        <StateRow label="No title">
          <Checklist items={PRE_COUNT.slice(0, 2)} defaultValue={["tide"]} />
        </StateRow>
      </DemoSection>
    </>
  )
}
