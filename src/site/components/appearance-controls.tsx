import { APPEARANCE, useAppearance, type Appearance } from "@/patina/theme"

const GROUPS: {
  key: keyof Appearance
  legend: string
  labels: Record<string, string>
}[] = [
  {
    key: "theme",
    legend: "Theme",
    labels: { system: "System", day: "Day", night: "Night" },
  },
  {
    key: "stock",
    legend: "Paper",
    labels: { field: "Field", newsprint: "Newsprint" },
  },
  {
    key: "variation",
    legend: "Variation",
    labels: { calm: "Calm", lively: "Lively" },
  },
  {
    key: "patina",
    legend: "Patina",
    labels: { clean: "Clean", handled: "Handled", worn: "Worn" },
  },
]

/** The specimen's appearance settings: one segmented control per setting. */
export function AppearanceControls() {
  const [appearance, update] = useAppearance()
  return (
    <div className="flex flex-wrap items-center gap-x-section gap-y-tight">
      {GROUPS.map(({ key, legend, labels }) => (
        <div
          key={key}
          role="radiogroup"
          aria-labelledby={`appearance-${key}`}
          className="flex items-center gap-tight"
        >
          <span
            id={`appearance-${key}`}
            className="label-mono min-w-[5.5rem] text-ink-2 sm:min-w-0"
          >
            {legend}
          </span>
          <div className="inline-flex rounded-sheet border-[1.5px] border-line">
            {APPEARANCE[key].map((option) => (
              <label
                key={option}
                className="label-mono relative flex h-9 cursor-pointer items-center px-tight text-ink-2 select-none first:rounded-l-[2px] last:rounded-r-[2px] hover:text-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-k-ink has-focus-visible:outline-dashed"
              >
                <input
                  type="radio"
                  name={key}
                  value={option}
                  checked={appearance[key] === option}
                  onChange={() => update({ [key]: option })}
                  className="sr-only"
                />
                {labels[option]}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
