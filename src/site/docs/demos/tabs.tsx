import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/patina/ui/tabs"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Tabs",
  description:
    "Mono labels on a dashed rule that switch between views of one record, the active one underlined by hand.",
  item: "tabs",
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <p className="m-0 max-w-measure text-body leading-body text-ink-2">
      {children}
    </p>
  )
}

export default function TabsDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="default">
          <Tabs defaultValue="entry" className="w-full max-w-[40rem]">
            <TabsList>
              <TabsTrigger value="entry">Entry</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="audio" disabled>
                Audio
              </TabsTrigger>
            </TabsList>
            <TabsContent value="entry">
              <Panel>
                Two little egrets feeding on the falling tide, 40 m east of the
                sluice.
              </Panel>
            </TabsContent>
            <TabsContent value="photos">
              <Panel>
                Three photos from the hide, the last one blurred by rain.
              </Panel>
            </TabsContent>
            <TabsContent value="notes">
              <Panel>
                Both birds left north-east when the dog walkers reached the sea
                wall.
              </Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
        <StateRow label="line">
          <Tabs defaultValue="week" className="w-full max-w-[40rem]">
            <TabsList variant="line">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="season">Season</TabsTrigger>
            </TabsList>
            <TabsContent value="day">
              <Panel>Eleven observations today, four of them waders.</Panel>
            </TabsContent>
            <TabsContent value="week">
              <Panel>
                Sixty-two observations this week across three survey squares.
              </Panel>
            </TabsContent>
            <TabsContent value="season">
              <Panel>
                Four hundred and nine observations since the spring count began.
              </Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="Expedition">
          <Tabs
            defaultValue="route"
            orientation="vertical"
            className="w-full max-w-[40rem]"
          >
            <TabsList>
              <TabsTrigger value="route">Route</TabsTrigger>
              <TabsTrigger value="kit">Kit list</TabsTrigger>
              <TabsTrigger value="tides">Tide times</TabsTrigger>
            </TabsList>
            <TabsContent value="route">
              <Panel>
                Blakeney Point by the shingle ridge, back along the saltmarsh
                path.
              </Panel>
            </TabsContent>
            <TabsContent value="kit">
              <Panel>
                Binoculars, hand lens, tide table, waterproof notebook.
              </Panel>
            </TabsContent>
            <TabsContent value="tides">
              <Panel>
                High water 07:42 and 20:05; the causeway floods an hour before
                each.
              </Panel>
            </TabsContent>
          </Tabs>
        </StateRow>
      </DemoSection>
    </>
  )
}
