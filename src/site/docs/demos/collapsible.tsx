import {
  Collapsible,
  CollapsibleChevron,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/patina/ui/collapsible"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Collapsible",
  description:
    "A section that opens and closes in place, for detail a reader asks for rather than reads by default.",
  item: "collapsible",
  group: "Data display",
}

const WHY = [
  {
    q: "Why not a reed warbler?",
    a: "Reed warblers leave for Africa by early October, so one on 14 November would be weeks overdue. Their song is a steady chatter, not a sudden burst.",
  },
  {
    q: "Why not a sedge warbler?",
    a: "Sedge warblers are the streaky ones, which fits, but they leave even earlier. At dusk a plain brown back can easily read as streaked.",
  },
]

function Reason({
  q,
  a,
  defaultOpen,
  disabled,
}: {
  q: string
  a: string
  defaultOpen?: boolean
  disabled?: boolean
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      disabled={disabled}
      className="w-full"
    >
      <CollapsibleTrigger className="flex min-h-control-compact cursor-pointer items-center gap-hair rounded-sheet text-left font-read text-ui leading-ui text-ink hover:text-k-ink disabled:cursor-not-allowed disabled:text-ink-faint">
        <CollapsibleChevron className="text-ink-3 in-disabled:text-ink-faint" />
        {q}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="m-0 max-w-measure ps-[1.5rem] pt-1.5 pb-tight text-small leading-small text-ink-2">
          {a}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function CollapsibleDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Closed">
          <Reason {...WHY[0]!} />
        </StateRow>
        <StateRow label="Open">
          <Reason {...WHY[1]!} defaultOpen />
        </StateRow>
        <StateRow label="Disabled">
          <Reason q="Why not a Savi's warbler?" a="" disabled />
        </StateRow>
      </DemoSection>
      <DemoSection title="In a record">
        <div className="sheet max-w-[34rem] p-snug">
          <p className="label-mono m-0 text-ink-2">Identification · 16:54</p>
          <p className="m-0 mt-hair font-read text-lead leading-subhead font-semibold">
            Cetti&rsquo;s warbler
          </p>
          <p className="m-0 mt-hair max-w-measure text-small leading-small text-ink-2">
            A loud, sudden call from deep in the reeds, a bird that stays all
            winter, and a tail that flicks.
          </p>
          <div className="mt-tight border-t border-dashed border-rule pt-hair">
            {WHY.map((reason) => (
              <Reason key={reason.q} {...reason} />
            ))}
          </div>
        </div>
      </DemoSection>
    </>
  )
}
