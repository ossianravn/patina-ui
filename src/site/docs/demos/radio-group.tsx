import { Label } from "@/patina/ui/label"
import { RadioGroup, RadioGroupItem } from "@/patina/ui/radio-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Radio group",
  description:
    "A set of pen-drawn circles for picking exactly one of a few options; the chosen one takes an inked dot.",
  item: "radio-group",
}

const CONFIDENCE = [
  { value: "certain", label: "Certain" },
  { value: "probable", label: "Probable" },
  { value: "possible", label: "Possible" },
]

function Options({
  disabled,
  invalid,
}: {
  disabled?: string
  invalid?: boolean
}) {
  return CONFIDENCE.map(({ value, label }) => (
    <Label key={value}>
      <RadioGroupItem
        value={value}
        disabled={value === disabled}
        aria-invalid={invalid || undefined}
      />{" "}
      {label}
    </Label>
  ))
}

export default function RadioGroupDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Nothing chosen">
          <RadioGroup aria-label="Identification confidence" className="w-auto">
            <Options />
          </RadioGroup>
        </StateRow>
        <StateRow label="Chosen">
          <RadioGroup
            aria-label="Identification confidence"
            defaultValue="probable"
            className="w-auto"
          >
            <Options />
          </RadioGroup>
        </StateRow>
        <StateRow label="Invalid">
          <RadioGroup
            aria-label="Identification confidence"
            aria-invalid="true"
            className="w-auto"
          >
            <Options invalid />
          </RadioGroup>
        </StateRow>
        <StateRow label="One disabled">
          <RadioGroup
            aria-label="Identification confidence"
            defaultValue="probable"
            className="w-auto"
          >
            <Options disabled="certain" />
          </RadioGroup>
        </StateRow>
        <StateRow label="All disabled">
          <RadioGroup
            aria-label="Identification confidence"
            defaultValue="possible"
            disabled
            className="w-auto"
          >
            <Options />
          </RadioGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Inline">
        <StateRow label="Tide">
          <div className="flex flex-col gap-hair">
            <span
              id="tide-state"
              className="text-small leading-small font-semibold"
            >
              Tide at the time of the sighting
            </span>
            <RadioGroup
              aria-labelledby="tide-state"
              defaultValue="falling"
              className="flex w-auto flex-wrap gap-x-snug gap-y-tight"
            >
              <Label>
                <RadioGroupItem value="rising" /> Rising
              </Label>
              <Label>
                <RadioGroupItem value="high" /> High water
              </Label>
              <Label>
                <RadioGroupItem value="falling" /> Falling
              </Label>
              <Label>
                <RadioGroupItem value="low" /> Low water
              </Label>
            </RadioGroup>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
