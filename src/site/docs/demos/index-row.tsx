import { EditionNumber } from "@/patina/extras/edition-number"
import { IndexList, IndexRow } from "@/patina/extras/index-row"
import { Glyph } from "@/patina/marks/glyph"
import { Print } from "@/patina/print/print"
import { EXPEDITIONS } from "@/site/fieldbook/expeditions"
import { OBSERVATIONS } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Index row",
  description:
    "Lists entries the way a printed index does: a number, a title, its hook on the same line when it fits, and a leader to a reference.",
  item: "index-row",
  group: "Patina extras",
}

const COLUMN = "w-full max-w-[40rem]"

// Species A to Z, each pointing at the record that first logged it this week.
const SPECIES = [...OBSERVATIONS].sort((a, b) =>
  a.species.localeCompare(b.species),
)
const LETTERS = [...new Set(SPECIES.map((o) => o.species[0]))]
const recordOf = (id: string) => Number(id.replace(/\D/g, ""))

export default function IndexRowDemo() {
  return (
    <>
      <DemoSection title="Species, A to Z">
        <div className={COLUMN}>
          {LETTERS.map((letter) => (
            <section
              key={letter}
              aria-labelledby={`species-${letter}`}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline"
            >
              <h3
                id={`species-${letter}`}
                className="m-0 pt-tight font-read text-lead leading-none font-semibold text-k-ink"
              >
                {letter}
              </h3>
              <IndexList>
                {SPECIES.filter((o) => o.species[0] === letter).map((o) => (
                  <IndexRow
                    key={o.id}
                    title={o.species}
                    hook={<i>{o.latin}</i>}
                    meta={<EditionNumber value={recordOf(o.id)} prefix="" />}
                    href={`/fieldbook/observations/${o.id}`}
                  />
                ))}
              </IndexList>
            </section>
          ))}
        </div>
      </DemoSection>
      <DemoSection title="Numbered, as a contents list">
        <IndexList className={COLUMN}>
          {EXPEDITIONS.map((e, i) => (
            <IndexRow
              key={e.id}
              number={<EditionNumber value={i + 1} digits={2} />}
              title={e.name}
              hook={e.aim}
              href="/fieldbook/expeditions"
            />
          ))}
        </IndexList>
      </DemoSection>
      <DemoSection title="Parts">
        <StateRow label="title only">
          <IndexList className={COLUMN}>
            <IndexRow title="Tidal flats" />
          </IndexList>
        </StateRow>
        <StateRow label="with glyph">
          <IndexList className={COLUMN}>
            <IndexRow
              media={<Glyph name="lens" seed="north-hide" size={22} />}
              title="North hide"
              hook="Best for spoonbill and teal on a rising tide."
            />
          </IndexList>
        </StateRow>
        <StateRow label="with print">
          <IndexList className={COLUMN}>
            <IndexRow
              media={<Print motif="horizon" seed="obs-0412" />}
              title="Grey heron"
              hook={<i>Ardea cinerea</i>}
              meta={<EditionNumber value={412} prefix="" />}
            />
          </IndexList>
        </StateRow>
        <StateRow label="long hook">
          <IndexList className={COLUMN}>
            <IndexRow
              number={<EditionNumber value={404} />}
              title="Marsh harrier"
              hook="Quartering the reed bed into the wind, then dropping twice on something near the sluice before drifting over the sea wall."
              meta="p. 14"
            />
          </IndexList>
        </StateRow>
      </DemoSection>
    </>
  )
}
