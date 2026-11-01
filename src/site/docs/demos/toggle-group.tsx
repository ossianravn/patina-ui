import { ListIcon, MapIcon, CalendarDaysIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle group",
  description:
    "A row of stamped toggles: a segmented control for two to four views, or a set of filters that switch on and off.",
  item: "toggle-group",
}

export default function ToggleGroupDemo() {
  return (
    <>
      <DemoSection title="Segmented">
        <StateRow label="One choice">
          <ToggleGroup
            aria-label="View"
            variant="outline"
            spacing={0}
            defaultValue={["list"]}
          >
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="map">Map</ToggleGroupItem>
            <ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="With icons · sm">
          <ToggleGroup
            aria-label="View"
            variant="outline"
            size="sm"
            spacing={0}
            defaultValue={["map"]}
          >
            <ToggleGroupItem value="list" aria-label="List">
              <ListIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="map" aria-label="Map">
              <MapIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="timeline" aria-label="Timeline">
              <CalendarDaysIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Disabled">
          <ToggleGroup
            aria-label="View"
            variant="outline"
            spacing={0}
            defaultValue={["list"]}
            disabled
          >
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="map">Map</ToggleGroupItem>
            <ToggleGroupItem value="timeline">Timeline</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ToggleGroup
            aria-label="Survey season"
            variant="outline"
            spacing={0}
            orientation="vertical"
            defaultValue={["spring"]}
          >
            <ToggleGroupItem value="spring">Spring</ToggleGroupItem>
            <ToggleGroupItem value="summer">Summer</ToggleGroupItem>
            <ToggleGroupItem value="autumn">Autumn</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Filters">
        <StateRow label="Several on">
          <ToggleGroup
            aria-label="Map layers"
            multiple
            defaultValue={["tides", "hides"]}
          >
            <ToggleGroupItem value="tides">Tides</ToggleGroupItem>
            <ToggleGroupItem value="trails">Trails</ToggleGroupItem>
            <ToggleGroupItem value="hides">Hides</ToggleGroupItem>
            <ToggleGroupItem value="nests" disabled>
              Nests
            </ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
        <StateRow label="Outline">
          <ToggleGroup
            aria-label="Map layers"
            variant="outline"
            multiple
            defaultValue={["trails"]}
          >
            <ToggleGroupItem value="tides">Tides</ToggleGroupItem>
            <ToggleGroupItem value="trails">Trails</ToggleGroupItem>
            <ToggleGroupItem value="hides">Hides</ToggleGroupItem>
          </ToggleGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
