import { useId } from "react"
import { useAppearance, type Variation } from "@/patina/theme"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"

// Calm or Lively for the home page's index cards. It is the real variation setting, the one the theme studio and
// Fieldbook's settings change: it applies to the whole page at once and is saved for the next visit.

const OPTIONS: { value: Variation; label: string }[] = [
  { value: "calm", label: "Calm" },
  { value: "lively", label: "Lively" },
]

export function VariationSwitch() {
  const [appearance, update] = useAppearance()
  const id = useId()
  return (
    <div className="flex items-center gap-tight">
      <span id={id} className="label-mono text-ink-2">
        Variation
      </span>
      <ToggleGroup
        aria-labelledby={id}
        variant="outline"
        spacing={0}
        value={[appearance.variation]}
        onValueChange={(next: unknown[]) => {
          const value = next[0] as Variation | undefined
          if (value) update({ variation: value })
        }}
      >
        {OPTIONS.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
