import { AppearanceControl } from "@/patina/extras/appearance-control"
import { siteAppearance } from "@/site/appearance"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Appearance control",
  description:
    "Theme, paper, inks, accent, variation, patina, density and interface face as settings rows that restyle the whole page.",
  item: "appearance-control",
  group: "Patina extras",
}

export default function AppearanceControlDemo() {
  return (
    <>
      <DemoSection title="Every row, with hints">
        <AppearanceControl
          hints
          defaults={siteAppearance}
          className="max-w-[42rem]"
        />
      </DemoSection>
      <DemoSection title="Chosen rows">
        <AppearanceControl
          defaults={siteAppearance}
          rows={["theme", "variation", "patina"]}
          className="max-w-[26rem]"
        />
      </DemoSection>
      <DemoSection title="Narrow column">
        <AppearanceControl
          defaults={siteAppearance}
          rows={["theme", "inks", "accent", "variation"]}
          className="max-w-[17rem]"
        />
      </DemoSection>
    </>
  )
}
