import { Steps, type Step } from "@/patina/extras/steps"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Steps",
  description:
    "Numbered stages of a process, showing which are done, which is under way and what comes next.",
  item: "steps",
  group: "Patina extras",
}

const CONFIRMED: Step[] = [
  {
    title: "Recorded",
    description: "Mira Okafor logs the bittern at the Reed bed, 16:58.",
  },
  {
    title: "Reviewed",
    description: "The reserve recorder checks the notes and the sound clip.",
  },
  {
    title: "Confirmed",
    description: "The county rarities panel accepts the record.",
  },
  {
    title: "In the county report",
    description: "Printed in the 2026 bird report next spring.",
  },
]

const SHORT: Step[] = CONFIRMED.map(({ title }) => ({ title }))

export default function StepsDemo() {
  return (
    <>
      <DemoSection title="How a record is confirmed">
        <Steps steps={CONFIRMED} current={1} className="max-w-measure" />
      </DemoSection>
      <DemoSection title="Horizontal">
        <Steps steps={CONFIRMED} current={2} orientation="horizontal" />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Not started">
          <Steps steps={SHORT} current={0} orientation="horizontal" />
        </StateRow>
        <StateRow label="All done">
          <Steps
            steps={SHORT}
            current={SHORT.length}
            orientation="horizontal"
          />
        </StateRow>
        <StateRow label="Titles only">
          <Steps steps={SHORT} current={2} />
        </StateRow>
      </DemoSection>
    </>
  )
}
