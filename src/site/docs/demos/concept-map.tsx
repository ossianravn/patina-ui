import { ConceptMap } from "@/patina/extras/concept-map"
import { DemoSection, type DemoMeta } from "../demo-kit"
import { HERON, SLUICE } from "./concept-map/maps"

export const meta: DemoMeta = {
  title: "Concept map",
  description:
    "A hand-drawn map of how one thing connects to others, by kind of connection, that turns into a list on phones.",
  item: "concept-map",
  group: "Patina extras",
}

export default function ConceptMapDemo() {
  return (
    <>
      <DemoSection title="Laid out by its seed">
        <ConceptMap
          label="How the grey heron connects to the reserve"
          center="heron"
          seed="grey-heron"
          {...HERON}
        />
      </DemoSection>
      <DemoSection title="Placed by hand">
        <ConceptMap
          label="The sluice gate at high water"
          center="sluice"
          seed="sluice-gate"
          {...SLUICE}
        />
      </DemoSection>
      <DemoSection title="As a list">
        <div className="max-w-[24rem]">
          <ConceptMap
            label="How the grey heron connects to the reserve"
            center="heron"
            seed="grey-heron"
            {...HERON}
          />
        </div>
      </DemoSection>
    </>
  )
}
