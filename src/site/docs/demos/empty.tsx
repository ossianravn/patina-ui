import { MapIcon, PlusIcon, RotateCwIcon } from "lucide-react"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/patina/ui/empty"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Empty",
  description:
    "What a list shows when it has nothing in it yet: a print, a heading, one line on why, and the one action that helps.",
  item: "empty",
  group: "Data display",
}

const FRAME = "max-w-[34rem] border"

export default function EmptyDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="No data yet">
          <Empty className={FRAME}>
            <EmptyHeader>
              <EmptyMedia>
                <Print
                  motif="scatter"
                  inks="spot"
                  seed="empty:first-visit"
                  className="w-28"
                />
              </EmptyMedia>
              <EmptyTitle>No observations yet</EmptyTitle>
              <EmptyDescription>
                Your first sighting on the reserve will start the notebook.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>
                <PlusIcon data-icon="inline-start" />
                Add an observation
              </Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="No search results">
          <Empty className={FRAME}>
            <EmptyHeader>
              <EmptyMedia>
                <Print
                  motif="lens"
                  inks="spot"
                  seed="empty:search"
                  className="w-28"
                />
              </EmptyMedia>
              <EmptyTitle>Nothing matches “spoonbil”</EmptyTitle>
              <EmptyDescription>
                Check the spelling, or search by place or Latin name.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">Clear the search</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
        <StateRow label="Error">
          <Empty className={FRAME} data-ink="orange">
            <EmptyHeader>
              <EmptyMedia>
                <Print
                  motif="rings"
                  inks="spot"
                  seed="empty:error"
                  className="w-28"
                />
              </EmptyMedia>
              <EmptyTitle>The tide table didn’t load</EmptyTitle>
              <EmptyDescription>
                The connection dropped at the North hide. Your notes are safe.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline">
                <RotateCwIcon data-icon="inline-start" />
                Try again
              </Button>
            </EmptyContent>
          </Empty>
        </StateRow>
      </DemoSection>
      <DemoSection title="Icon media">
        <StateRow label="icon">
          <Empty className={FRAME}>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MapIcon />
              </EmptyMedia>
              <EmptyTitle>No expeditions planned</EmptyTitle>
              <EmptyDescription>
                Plan a walk and invite the volunteers on the next tide.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Plan an expedition</Button>
            </EmptyContent>
          </Empty>
        </StateRow>
      </DemoSection>
    </>
  )
}
