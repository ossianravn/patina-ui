import { DecisionMap, type DecisionOption } from "@/patina/extras/decision-map"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Decision map",
  description:
    "One question branching to its possible answers, each with its reason, with the best fit marked.",
  item: "decision-map",
  group: "Patina extras",
}

const REED_BIRDS: DecisionOption[] = [
  {
    id: "cettis",
    title: "Cetti’s warbler",
    answer:
      "Plain rufous, cocks its tail, an explosive burst of song from deep cover. Stays all winter.",
  },
  {
    id: "bunting",
    title: "Reed bunting",
    answer:
      "Streaky, with a pale moustache; perches up on reed heads and feeds in loose winter flocks.",
  },
  {
    id: "wren",
    title: "Wren",
    answer:
      "Tiny and round with a cocked tail; creeps low at the reed base, ticking.",
  },
]

export default function DecisionMapDemo() {
  return (
    <>
      <DemoSection title="Which bird is it?">
        <DecisionMap
          question="Small brown bird in the reeds in November?"
          options={REED_BIRDS}
          chosen="cettis"
        />
      </DemoSection>
      <DemoSection title="Nothing chosen yet">
        <DecisionMap
          question="Where should the count start?"
          options={[
            {
              id: "sluice",
              title: "Sluice gate",
              answer: "Best two hours before high water, as the flats cover.",
            },
            {
              id: "hide",
              title: "North hide",
              answer: "Shelter in a westerly; the roost gathers in view.",
            },
          ]}
        />
      </DemoSection>
      <DemoSection title="Stacked">
        <div className="max-w-[24rem]">
          <DecisionMap
            question="Small brown bird in the reeds in November?"
            options={REED_BIRDS}
            chosen="cettis"
          />
        </div>
      </DemoSection>
    </>
  )
}
