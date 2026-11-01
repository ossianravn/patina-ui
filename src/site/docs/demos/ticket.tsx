import {
  Ticket,
  TicketContent,
  TicketField,
  TicketFields,
  TicketKicker,
  TicketStub,
  TicketTitle,
} from "@/patina/extras/ticket"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Ticket",
  description:
    "Admits someone to a booked event: what, when and where in mono fields, and a perforated stub with the party size and a serial number.",
  item: "ticket",
  group: "Patina extras",
}

function BitternWatch() {
  return (
    <Ticket seed="exp-15">
      <TicketContent>
        <TicketKicker>Fieldbook · Expedition</TicketKicker>
        <TicketTitle>Bittern watch</TicketTitle>
        <TicketFields>
          <TicketField label="Date">Fri 20 Nov</TicketField>
          <TicketField label="Time">15:45</TicketField>
          <TicketField label="Meet">North hide</TicketField>
          <TicketField label="Leader">Jo Lindqvist</TicketField>
        </TicketFields>
      </TicketContent>
      <TicketStub number={207}>
        <TicketField label="Admit">2</TicketField>
      </TicketStub>
    </Ticket>
  )
}

function WaderCount() {
  return (
    <Ticket seed="exp-14" size="sm">
      <TicketContent>
        <TicketTitle>Winter wader count</TicketTitle>
        <TicketFields>
          <TicketField label="Date">Sat 14 Nov</TicketField>
          <TicketField label="Time">05:30</TicketField>
          <TicketField label="Meet">Sluice gate</TicketField>
        </TicketFields>
      </TicketContent>
      <TicketStub number={198}>
        <TicketField label="Admit">1</TicketField>
      </TicketStub>
    </Ticket>
  )
}

export default function TicketDemo() {
  return (
    <>
      <DemoSection title="Expedition ticket">
        <BitternWatch />
      </DemoSection>
      <DemoSection title="Compact">
        <WaderCount />
      </DemoSection>
      <DemoSection title="Variation">
        <StateRow label="page level">
          <WaderCount />
        </StateRow>
        <StateRow label="calm">
          <div data-variation="calm">
            <WaderCount />
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
