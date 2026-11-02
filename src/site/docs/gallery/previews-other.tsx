import { useMemo } from "react"
import { IndexCard } from "@/patina/extras/index-card"
import { sketch } from "@/patina/ink/rough"
import { Button } from "@/patina/ui/button"
import { Bubble, BubbleContent } from "@/patina/ui/bubble"
import { Progress, ProgressLabel, ProgressValue } from "@/patina/ui/progress"
import { Skeleton } from "@/patina/ui/skeleton"

// Previews for parts whose demo only draws in the browser (Recharts' responsive container, the thread's scroller,
// the questionnaire's steps), whose first example is a whole collection, or that need card stock to show.

const WEEK = [3, 5, 2, 7, 4, 6, 9]

/** A week of sightings as hand-drawn hatched bars in the first chart drum, on a pen-line baseline. */
function ChartPreview() {
  const svg = useMemo(() => {
    const bars = WEEK.map((count, i) =>
      sketch.rect(12 + i * 34, 104 - count * 10, 22, count * 10, {
        seed: 70 + i,
        stroke: "var(--chart-1)",
        strokeWidth: 1.4,
        fill: "var(--chart-1)",
        fillStyle: "hachure",
        hachureGap: 4,
        roughness: 0.9,
      }),
    ).join("")
    const base = sketch.line(4, 105, 250, 105, {
      seed: 80,
      stroke: "var(--line)",
      strokeWidth: 1.4,
    })
    return bars + base
  }, [])
  return (
    <div className="mx-auto w-64">
      <p className="label-mono m-0 mb-hair text-ink-3">Sightings per day</p>
      <svg
        viewBox="0 0 254 110"
        className="block w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="label-mono m-0 flex justify-between px-2 text-ink-3">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </p>
    </div>
  )
}

function MessageScrollerPreview() {
  return (
    <div className="mx-auto flex w-64 flex-col gap-hair rounded-sheet border border-rule p-tight">
      <Bubble variant="muted">
        <BubbleContent>Small, brown, streaky, flicking its tail.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Cetti’s warbler, by the sound.</BubbleContent>
      </Bubble>
      <Button variant="outline" size="xs" className="self-center">
        Latest note ↓
      </Button>
    </div>
  )
}

function QuestionnairePreview() {
  return (
    <div className="sheet mx-auto w-64 p-snug text-small leading-small">
      <Progress value={50} className="mb-tight">
        <ProgressLabel className="label-mono font-medium text-ink-3">
          New expedition
        </ProgressLabel>
        <ProgressValue />
      </Progress>
      <p className="m-0 font-read text-lead leading-subhead font-semibold">
        Where will you count?
      </p>
      <div className="mt-tight flex flex-wrap gap-hair">
        <Button variant="outline" size="xs">
          Tidal flats
        </Button>
        <Button size="xs">Reed bed</Button>
        <Button variant="outline" size="xs">
          Saltings
        </Button>
      </div>
    </div>
  )
}

/** On card stock, where a loading entry usually sits; toned paper on the plate's own tone would barely show. */
function SkeletonPreview() {
  return (
    <div className="sheet mx-auto flex w-64 items-center gap-tight p-tight">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-2.5 w-4/5" />
      </div>
    </div>
  )
}

function IndexCardPreview() {
  return (
    <IndexCard
      title="Grey heron"
      kicker="No. 0412 · Tidal flats"
      seed="obs-0412"
      className="mx-auto w-44"
    />
  )
}

export const OTHER_PREVIEWS = {
  chart: ChartPreview,
  "message-scroller": MessageScrollerPreview,
  questionnaire: QuestionnairePreview,
  "index-card": IndexCardPreview,
  skeleton: SkeletonPreview,
}
