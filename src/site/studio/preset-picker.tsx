import { Glyph } from "@/patina/marks/glyph"
import { cn } from "@/patina/lib/utils"
import { PRESETS, type Preset } from "./presets"

/** The preset's print drums and, apart, its accent drum. */
function Inks({ preset }: { preset: Preset }) {
  const dot = "size-2.5 rounded-full shadow-[0_0_0_1.5px_var(--card)]"
  return (
    <span
      aria-hidden="true"
      data-inks={preset.choices.inks}
      className="flex items-center gap-hair"
    >
      <span className="flex -space-x-1">
        {["line", "accent", "detail"].map((drum) => (
          <span
            key={drum}
            className={dot}
            style={{ background: `var(--print-${drum})` }}
          />
        ))}
      </span>
      <span
        className={dot}
        style={{ background: `var(--print-${preset.choices.accent})` }}
      />
    </span>
  )
}

/** Named sets of choices, as small cards; the one the page matches is pressed and ticked. */
export function PresetPicker({
  current,
  onPick,
}: {
  current?: Preset
  onPick: (preset: Preset) => void
}) {
  return (
    <section aria-labelledby="studio-presets">
      <h2 id="studio-presets" className="label-mono m-0 text-ink-2">
        Presets
      </h2>
      <ul className="m-0 mt-tight grid list-none grid-cols-2 gap-hair p-0">
        {PRESETS.map((preset) => {
          const on = preset === current
          return (
            <li key={preset.name} className="flex">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onPick(preset)}
                className="flex w-full cursor-pointer flex-col items-start gap-1 rounded-sheet border-[1.5px] border-rule bg-card px-tight py-hair text-left transition-colors hover:border-line aria-pressed:border-line aria-pressed:bg-paper-3"
              >
                <span className="flex w-full items-center justify-between gap-hair">
                  <span className="font-semibold leading-subhead">
                    {preset.name}
                  </span>
                  <Glyph
                    name="check"
                    size={18}
                    seed={preset.name}
                    className={cn("text-k-ink", !on && "invisible")}
                  />
                </span>
                <Inks preset={preset} />
                <span className="text-small leading-small text-ink-2">
                  {preset.note}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
