// Appearance lives as attributes on <html>, so CSS does the work and every island reads the same state.
// Saved choices persist in localStorage; "system" follows the operating system's light or dark setting.

export const APPEARANCE = {
  theme: ["system", "day", "night"],
  stock: ["field", "newsprint"],
  variation: ["calm", "lively"],
  patina: ["clean", "handled", "worn"],
} as const

export type ThemePreference = (typeof APPEARANCE.theme)[number]
export type Stock = (typeof APPEARANCE.stock)[number]
export type Variation = (typeof APPEARANCE.variation)[number]
export type PatinaLevel = (typeof APPEARANCE.patina)[number]

export interface Appearance {
  theme: ThemePreference
  stock: Stock
  variation: Variation
  patina: PatinaLevel
}

export const defaultAppearance: Appearance = {
  theme: "system",
  stock: "field",
  variation: "lively",
  patina: "handled",
}

export const STORAGE_KEY = "patina-appearance"

const pick = <T extends string>(
  options: readonly T[],
  value: unknown,
  fallback: T,
): T => (options.includes(value as T) ? (value as T) : fallback)

/** Keeps only known values, so a stale or hand-edited entry never breaks the page. */
export function normalize(
  value: Partial<Record<keyof Appearance, unknown>>,
  defaults = defaultAppearance,
): Appearance {
  return {
    theme: pick(APPEARANCE.theme, value.theme, defaults.theme),
    stock: pick(APPEARANCE.stock, value.stock, defaults.stock),
    variation: pick(APPEARANCE.variation, value.variation, defaults.variation),
    patina: pick(APPEARANCE.patina, value.patina, defaults.patina),
  }
}

export function readSaved(defaults = defaultAppearance): Appearance {
  try {
    return normalize(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"),
      defaults,
    )
  } catch {
    return defaults
  }
}

export function save(appearance: Appearance) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance))
  } catch {
    // Private windows and blocked storage keep the choice for this page only.
  }
}

export function resolveTheme(theme: ThemePreference): "day" | "night" {
  if (theme !== "system") return theme
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day"
}

export function apply(
  appearance: Appearance,
  root: HTMLElement = document.documentElement,
) {
  root.dataset.theme = resolveTheme(appearance.theme)
  root.dataset.themePreference = appearance.theme
  root.dataset.stock = appearance.stock
  root.dataset.variation = appearance.variation
  root.dataset.patina = appearance.patina
}

/** The appearance currently applied to the document. */
export function current(
  root: HTMLElement = document.documentElement,
): Appearance {
  const { themePreference, stock, variation, patina } = root.dataset
  return normalize({ theme: themePreference, stock, variation, patina })
}
