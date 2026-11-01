import { Sidenote, SidenoteLayout, SidenoteRef } from "@/patina/extras/sidenote"
import { Typography, TypographyKicker } from "@/patina/ui/typography"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Sidenote",
  description:
    "Adds a numbered aside to an article without breaking the line of reading: in the margin when there is room, after the paragraph when there is not.",
  item: "sidenote",
  group: "Patina extras",
}

export default function SidenoteDemo() {
  return (
    <DemoSection title="A field journal entry">
      <Typography>
        <TypographyKicker>Field journal · Fri 13 Nov 2026</TypographyKicker>
        <h2>Booming at dusk</h2>
        <SidenoteLayout>
          <p>
            Jo heard it first from the North hide at ten to five: a low, hollow
            note, three times, like someone blowing across the neck of a bottle.
            A bittern booming in November is unusual
            <SidenoteRef to="note-booming" />, and it came from the reed bed
            west of the sluice, where the water stays open longest.
          </p>
          <Sidenote id="note-booming">
            Males boom to hold territory in spring. A winter call is rare, but
            the county recorder has two November records from the reserve since
            2019.
          </Sidenote>
          <p>
            We stayed until the light went. The bird showed once, briefly, at
            the reed edge: streaked buff, neck stretched straight up, swaying
            with the stems until it was almost impossible to keep in the glass.
          </p>
          <p>
            On the walk back along the sea wall a water rail squealed from the
            ditch
            <SidenoteRef to="note-rail" />, and a barn owl crossed the saltings
            low enough to hear. We logged the bittern as rare and asked Priya to
            check the recording before it goes to the county.
          </p>
          <Sidenote id="note-rail">
            Water rails are heard far more often than seen. The squeal carries
            further than you would expect in still air.
          </Sidenote>
        </SidenoteLayout>
      </Typography>
    </DemoSection>
  )
}
