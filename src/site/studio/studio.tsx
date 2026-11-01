import { useState } from "react"
import { AppearanceControl } from "@/patina/extras/appearance-control"
import { useAppearance } from "@/patina/theme"
import { ExportPanel } from "./export-panel"
import { PresetPicker } from "./preset-picker"
import { matchPreset } from "./presets"
import { FieldbookPreviews } from "./previews"
import { Specimens } from "./specimens"

/**
 * The theme studio: presets and every appearance setting in a narrow column that stays in view on wide screens,
 * live previews of Fieldbook and the parts beside it, and the export below. Settings apply to the whole site and
 * persist, like the appearance control anywhere else.
 */
export function Studio() {
  const [appearance, update] = useAppearance()
  const preset = matchPreset(appearance)
  const [customName, setCustomName] = useState<string | null>(null)
  const name = customName ?? preset?.name ?? "Custom"

  return (
    <div className="flex flex-col gap-y-section">
      {/* Side by side from 80rem, where the previews get the width Fieldbook's rows need; its own grid, so the
          sticky settings column stops where the previews end. Narrower, the settings come first. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-x-section gap-y-line xl:grid-cols-[24rem_minmax(0,1fr)]">
        <aside
          aria-label="Theme settings"
          className="grid max-w-[42rem] content-start gap-x-section gap-y-line lg:max-xl:max-w-none lg:max-xl:grid-cols-2 xl:sticky xl:top-20 xl:-mx-2 xl:max-h-[calc(100dvh-6rem)] xl:self-start xl:overflow-y-auto xl:px-2 xl:pb-tight"
        >
          <PresetPicker
            current={preset}
            onPick={(next) => {
              update(next.choices)
              setCustomName(null)
            }}
          />
          <section aria-labelledby="studio-settings">
            <h2 id="studio-settings" className="label-mono m-0 text-ink-2">
              Settings
            </h2>
            <AppearanceControl className="mt-hair [&>[data-slot=appearance-control-row]]:py-hair" />
            <a href="#export" className="label-mono mt-snug inline-block">
              Export {name}
            </a>
          </section>
        </aside>
        <div className="@container min-w-0">
          <h2 className="sr-only">Previews</h2>
          <div className="grid gap-snug @min-[40rem]:grid-cols-2">
            <FieldbookPreviews />
            <div className="@min-[40rem]:col-span-2">
              <Specimens />
            </div>
          </div>
        </div>
      </div>
      <ExportPanel name={name} onName={setCustomName} />
    </div>
  )
}
