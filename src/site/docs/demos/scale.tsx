import { Scale } from "@/patina/extras/scale"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Scale",
  description:
    "A drawn scale with the current reading circled, for judgements such as how sure an identification is.",
  item: "scale",
  group: "Patina extras",
}

const SURE = ["Glimpsed", "Heard", "Seen", "Seen well", "Photographed"] as const

export default function ScaleDemo() {
  return (
    <>
      <DemoSection title="An identification">
        <Scale label="How sure" stops={SURE} value="Seen well" />
      </DemoSection>
      <DemoSection title="Numeric, with words for the ends">
        <Scale
          label="Visibility at the Sea wall"
          stops={[1, 2, 3, 4, 5]}
          value={4}
          ends={["Fog", "Clear"]}
        />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Lowest">
          <Scale label="How sure" stops={SURE} value="Glimpsed" />
        </StateRow>
        <StateRow label="Highest">
          <Scale label="How sure" stops={SURE} value="Photographed" />
        </StateRow>
        <StateRow label="Three stops">
          <Scale
            label="Disturbance"
            stops={["None", "Some", "Flushed"]}
            value="Some"
            className="max-w-[22rem]"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
