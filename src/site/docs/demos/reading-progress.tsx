import { useRef } from "react"
import { ReadingProgress } from "@/patina/extras/reading-progress"
import { Typography } from "@/patina/ui/typography"
import { DemoSection, type DemoMeta } from "../demo-kit"
import { CountReport } from "./reading-progress/article"

export const meta: DemoMeta = {
  title: "Reading progress",
  description:
    "A thin strip along the top of the page that shows how far through an article you have read.",
  item: "reading-progress",
  group: "Patina extras",
}

export default function ReadingProgressDemo() {
  const scroller = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLElement>(null)
  return (
    <DemoSection title="In a scrolling container">
      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Field report"
        className="sheet relative h-[26rem] max-w-[44rem] overflow-y-auto"
      >
        <ReadingProgress container={scroller} target={article} />
        <article ref={article} className="px-line py-snug">
          <Typography>
            <CountReport />
          </Typography>
        </article>
      </div>
    </DemoSection>
  )
}
