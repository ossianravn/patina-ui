import { Progress, ProgressLabel, ProgressValue } from "@/patina/ui/progress"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Progress",
  description:
    "A pen-line track that fills with hatched ink as a task moves towards done.",
  item: "progress",
  group: "Data display",
}

// A fixed locale keeps the formatted value the same on the server and in the browser, so hydration matches.
const LOCALE = "en-GB"

export default function ProgressDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="In progress">
        <Progress locale={LOCALE} value={58} className="w-[22rem] max-w-full">
          <ProgressLabel>Survey transects</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Not started">
        <Progress locale={LOCALE} value={0} className="w-[22rem] max-w-full">
          <ProgressLabel>Moth trap counts</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Complete">
        <Progress locale={LOCALE} value={100} className="w-[22rem] max-w-full">
          <ProgressLabel>Lichen photographs</ProgressLabel>
          <ProgressValue />
        </Progress>
      </StateRow>
      <StateRow label="Indeterminate">
        <Progress locale={LOCALE} value={null} className="w-[22rem] max-w-full">
          <ProgressLabel>Uploading 14 photos</ProgressLabel>
        </Progress>
      </StateRow>
      <StateRow label="Track only">
        <Progress
          locale={LOCALE}
          value={30}
          aria-label="Tide out"
          className="w-[12rem]"
        />
      </StateRow>
    </DemoSection>
  )
}
