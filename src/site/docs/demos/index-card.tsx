import { EditionNumber } from "@/patina/extras/edition-number"
import { IndexCard } from "@/patina/extras/index-card"
import { OBSERVATIONS, type Observation } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Index card",
  description:
    "Presents one entry as a card to pick from a collection: a cover print, its number and place, a title and a one-line hook.",
  item: "index-card",
  group: "Patina extras",
}

const number = (o: Observation) => Number(o.id.replace(/\D/g, ""))

function Entry({
  o,
  href = true,
  className,
}: {
  o: Observation
  href?: boolean
  className?: string
}) {
  return (
    <IndexCard
      seed={o.id}
      motif={o.motif}
      kicker={
        <>
          <EditionNumber value={number(o)} /> · {o.place}
        </>
      }
      title={o.species}
      hook={o.notes}
      href={href ? `/fieldbook/observations/${o.id}` : undefined}
      className={className}
    />
  )
}

const GRID = OBSERVATIONS.slice(0, 6)
const [, curlew, bittern] = GRID as [Observation, Observation, Observation]

export default function IndexCardDemo() {
  return (
    <>
      <DemoSection title="A loose grid">
        <div className="grid max-w-[60rem] gap-x-line gap-y-section pt-tight sm:grid-cols-2 lg:grid-cols-3">
          {GRID.map((o) => (
            <Entry key={o.id} o={o} />
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Variation">
        <StateRow label="lively">
          <div data-variation="lively">
            <Entry o={bittern} className="mt-tight w-72" />
          </div>
        </StateRow>
        <StateRow label="calm">
          <div data-variation="calm">
            <Entry o={bittern} className="mt-tight w-72" />
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Link, plain and without a print">
        <StateRow label="with href">
          <Entry o={curlew} className="mt-tight w-72" />
        </StateRow>
        <StateRow label="without href">
          <Entry o={curlew} href={false} className="mt-tight w-72" />
        </StateRow>
        <StateRow label="no print">
          <IndexCard
            seed="exp-15"
            motif={false}
            kicker="Expedition · Fri 20 Nov"
            title="Bittern watch"
            hook="Dusk watch over the reed bed after Friday's booming."
            className="mt-tight w-72"
          />
        </StateRow>
      </DemoSection>
    </>
  )
}
