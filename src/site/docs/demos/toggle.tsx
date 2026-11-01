import { BookmarkIcon, FootprintsIcon, MapIcon, WavesIcon } from "lucide-react"
import { Toggle } from "@/patina/ui/toggle"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Toggle",
  description:
    "A stamped button that stays pressed, for one option that is on or off within a toolbar.",
  item: "toggle",
  group: "Actions",
}

const VARIANTS = ["default", "outline"] as const

export default function ToggleDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map((variant) => (
          <StateRow key={variant} label={variant}>
            <Toggle variant={variant}>
              <FootprintsIcon data-icon="inline-start" /> Tracks
            </Toggle>
            <Toggle variant={variant} defaultPressed>
              <WavesIcon data-icon="inline-start" /> Tides
            </Toggle>
            <Toggle variant={variant} disabled>
              Hides
            </Toggle>
            <Toggle variant={variant} disabled defaultPressed>
              Trails
            </Toggle>
          </StateRow>
        ))}
        <StateRow label="Invalid">
          <Toggle variant="outline" aria-invalid="true">
            Permit checked
          </Toggle>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        <StateRow label="sm · default · lg">
          <Toggle variant="outline" size="sm" defaultPressed>
            Map
          </Toggle>
          <Toggle variant="outline" defaultPressed>
            Map
          </Toggle>
          <Toggle variant="outline" size="lg" defaultPressed>
            Map
          </Toggle>
        </StateRow>
        <StateRow label="Icon only">
          <Toggle variant="outline" size="sm" aria-label="Bookmark entry">
            <BookmarkIcon />
          </Toggle>
          <Toggle variant="outline" aria-label="Show map" defaultPressed>
            <MapIcon />
          </Toggle>
          <Toggle variant="outline" size="lg" aria-label="Bookmark entry">
            <BookmarkIcon />
          </Toggle>
        </StateRow>
      </DemoSection>
    </>
  )
}
