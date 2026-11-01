import { ExternalLinkIcon } from "lucide-react"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/patina/ui/trace"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Trace",
  description:
    "The steps an assistant took to reach an answer, numbered in order, each one open for its detail.",
  item: "trace",
  group: "Conversation",
}

type Step = {
  title: string
  note: string
  detail: string
  status: "done" | "running" | "pending" | "error"
}

const STEPS: Step[] = [
  {
    title: "Read the description",
    note: "0.2 s",
    status: "done",
    detail:
      "Small, brown, streaky, flicking its tail, in a reed bed, at dusk. Size and habitat point to the warblers.",
  },
  {
    title: "Shortlist reed-bed warblers",
    note: "3 candidates",
    status: "done",
    detail:
      "Sedge warbler (streaky, pale stripe over the eye), reed warbler (plain, unstreaked) and Cetti’s warbler (plain rufous, cocks and flicks its tail).",
  },
  {
    title: "Check the date",
    note: "14 Nov",
    status: "done",
    detail:
      "Sedge and reed warblers winter in Africa and are gone by October. Cetti’s warbler stays all year, so it is the only one still here in November.",
  },
  {
    title: "Listen to the recording",
    note: "0:09",
    status: "running",
    detail:
      "One explosive burst, about two seconds: chet, chetti-chetti-chetti. Matching against reference calls.",
  },
  {
    title: "Write the observation",
    note: "",
    status: "pending",
    detail: "Species, place, time, evidence and confidence, as one record.",
  },
]

function Steps({ steps, open }: { steps: Step[]; open?: number }) {
  return (
    <Trace className="max-w-[34rem]">
      {steps.map((step, index) => (
        <TraceCollapsible key={step.title} defaultOpen={index === open}>
          <TraceCollapsibleTrigger>
            <TraceLine status={step.status}>
              <TraceIcon>{index + 1}</TraceIcon>
              <TraceTitle>{step.title}</TraceTitle>
              {step.note ? (
                <TraceDescription>{step.note}</TraceDescription>
              ) : null}
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>{step.detail}</TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  )
}

export default function TraceDemo() {
  return (
    <>
      <DemoSection title="An identification">
        <Steps steps={STEPS} open={2} />
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Done">
          <Trace>
            <TraceLine status="done">
              <TraceIcon>1</TraceIcon>
              <TraceTitle>Read the description</TraceTitle>
              <TraceDescription>0.2 s</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Running">
          <Trace>
            <TraceLine status="running">
              <TraceIcon>4</TraceIcon>
              <TraceTitle>Listen to the recording</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Pending">
          <Trace>
            <TraceLine status="pending">
              <TraceIcon>5</TraceIcon>
              <TraceTitle>Write the observation</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="Error">
          <Trace>
            <TraceLine status="error">
              <TraceIcon>3</TraceIcon>
              <TraceTitle>Couldn&rsquo;t read the photo</TraceTitle>
              <TraceDescription>too dark</TraceDescription>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="No status">
          <Trace>
            <TraceLine>
              <TraceIcon>2</TraceIcon>
              <TraceTitle>Shortlist reed-bed warblers</TraceTitle>
            </TraceLine>
          </Trace>
        </StateRow>
        <StateRow label="As a link">
          <Trace>
            <a href="#field-guide">
              <TraceLine status="done">
                <TraceIcon>2</TraceIcon>
                <TraceTitle>Opened the field guide</TraceTitle>
                <TraceIcon>
                  <ExternalLinkIcon />
                </TraceIcon>
              </TraceLine>
            </a>
          </Trace>
        </StateRow>
      </DemoSection>
      <DemoSection title="A step that failed">
        <Steps
          open={2}
          steps={[
            STEPS[0]!,
            STEPS[1]!,
            {
              title: "Read the photo",
              note: "too dark",
              status: "error",
              detail:
                "The bird is a brown smudge against the reeds; streaks and eye stripe can’t be told apart from noise. Carrying on with the description and the call.",
            },
            { ...STEPS[3]!, status: "done", note: "matched" },
          ]}
        />
      </DemoSection>
    </>
  )
}
