import { Print } from "@/patina/print/print"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/patina/ui/hover-card"
import {
  OBSERVATIONS,
  tally,
  when,
  type Observation,
} from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Hover card",
  description:
    "A preview that appears while a link is hovered or focused, so a reader can glance at a record without leaving the page.",
  item: "hover-card",
  group: "Overlays",
}

const find = (species: string) =>
  OBSERVATIONS.find((o) => o.species === species)!

/** A species name that previews its print, Latin name and last sighting. */
function Species({
  item,
  side,
  children,
}: {
  item: Observation
  side?: "top" | "right" | "bottom" | "left"
  children?: React.ReactNode
}) {
  return (
    <HoverCard>
      <HoverCardTrigger href={`/fieldbook#${item.id}`}>
        {children ?? item.species}
      </HoverCardTrigger>
      <HoverCardContent side={side} className="w-72">
        <div className="flex gap-tight">
          <Print
            motif={item.motif}
            seed={item.id}
            className="w-20 shrink-0 self-start"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="m-0 font-read text-body leading-subhead font-semibold">
              {item.species}
            </p>
            <p className="m-0 text-ink-2 italic">{item.latin}</p>
            <p className="label-mono m-0 mt-hair text-ink-3">Last sighting</p>
            <p className="m-0">{when(item.seen)}</p>
            <p className="m-0 text-ink-2">
              {item.place} · {tally(item.count)} seen
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default function HoverCardDemo() {
  return (
    <>
      <DemoSection title="Hover or focus a species">
        <StateRow label="In a field note">
          <p className="m-0 max-w-measure text-body leading-body">
            Dawn from the North hide: a <Species item={find("Grey heron")} />{" "}
            still on the Tidal flats, fourteen <Species item={find("Curlew")} />{" "}
            working the creek edge, and a <Species item={find("Bittern")} />{" "}
            booming twice in the Reed bed.
          </p>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sides">
        <StateRow label="Top">
          <Species item={find("Spoonbill")} side="top" />
        </StateRow>
        <StateRow label="Right">
          <Species item={find("Kingfisher")} side="right" />
        </StateRow>
        <StateRow label="Long name">
          <Species item={find("Twite")}>
            Twite (Linaria flavirostris), the mountain linnet
          </Species>
        </StateRow>
      </DemoSection>
    </>
  )
}
