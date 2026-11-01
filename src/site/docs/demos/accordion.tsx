import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/patina/ui/accordion"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Accordion",
  description:
    "Rows of questions or sections that open one at a time, so a long page of guidance stays scannable.",
  item: "accordion",
  group: "Data display",
}

const BEFORE = [
  {
    value: "tides",
    title: "When is it safe to cross the flats?",
    body: "Only on a falling tide, and back on the sea wall an hour before low water turns. The creeks fill from behind you first.",
  },
  {
    value: "kit",
    title: "What should I bring on a count?",
    body: "Binoculars, a tally counter, the tide table and a waterproof notebook. A scope helps at the North hide.",
  },
  {
    value: "disturbance",
    title: "What if the birds lift before I have counted them?",
    body: "Record what you saw, mark the count as partial and note what flushed them: a dog, a harrier, a boat.",
  },
]

export default function AccordionDemo() {
  return (
    <>
      <DemoSection title="Modes">
        <StateRow label="One at a time">
          <Accordion defaultValue={["tides"]} className="max-w-[38rem]">
            {BEFORE.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <p>{item.body}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StateRow>
        <StateRow label="Several open">
          <Accordion
            multiple
            defaultValue={["route", "meet"]}
            className="max-w-[38rem]"
          >
            <AccordionItem value="route">
              <AccordionTrigger>Route</AccordionTrigger>
              <AccordionContent>
                <p>
                  Sluice gate to the Saltings along the sea wall, then back by
                  the reed bed boardwalk.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="meet">
              <AccordionTrigger>Meeting point</AccordionTrigger>
              <AccordionContent>
                <p>The Sluice gate at 05:30. Mira Okafor leads the count.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="audio" disabled>
              <AccordionTrigger>Sound recordings</AccordionTrigger>
              <AccordionContent>
                <p>No recordings on this walk.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </StateRow>
      </DemoSection>
    </>
  )
}
