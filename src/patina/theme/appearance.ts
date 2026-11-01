// Appearance lives as attributes on <html>, so CSS does the work and every island reads the same state.
// Saved choices persist in localStorage; "system" follows the operating system's light or dark setting.

export const APPEARANCE = {
  theme: ["system", "day", "night"],
  stock: ["archive", "field", "newsprint"],
  /** The print ink sets in styles/inks.css (INK_SETS in ink/inks.ts lists the same five). */
  inks: ["patina", "field", "fluoro", "earth", "spot"],
  /** The drum that is the document's accent, --k. Ochre has no text ink, so it never carries marks. */
  accent: ["green", "orange", "blue", "pink", "violet", "red"],
  variation: ["calm", "lively"],
  patina: ["clean", "handled", "worn"],
  density: ["comfortable", "compact"],
  /** The interface face, --face-ui: the reading serif, or Instrument Sans. Prose keeps the serif. */
  face: ["serif", "sans"],
} as const

export type ThemePreference = (typeof APPEARANCE.theme)[number]
export type Stock = (typeof APPEARANCE.stock)[number]
export type Variation = (typeof APPEARANCE.variation)[number]
export type PatinaLevel = (typeof APPEARANCE.patina)[number]
export type InkSetName = (typeof APPEARANCE.inks)[number]
export type AccentDrum = (typeof APPEARANCE.accent)[number]
export type Density = (typeof APPEARANCE.density)[number]
export type InterfaceFace = (typeof APPEARANCE.face)[number]

export interface Appearance {
  theme: ThemePreference
  stock: Stock
  variation: Variation
  patina: PatinaLevel
  inks: InkSetName
  accent: AccentDrum
  density: Density
  face: InterfaceFace
}

export const defaultAppearance: Appearance = {
  theme: "system",
  stock: "archive",
  variation: "lively",
  patina: "handled",
  inks: "patina",
  accent: "green",
  density: "comfortable",
  face: "serif",
}

export const STORAGE_KEY = "patina-appearance"

const KEYS = Object.keys(APPEARANCE) as (keyof Appearance)[]
/** Settings written to <html> under their own name: data-stock, data-inks, data-accent and so on. */
const ATTRIBUTES = KEYS.filter((key) => key !== "theme")

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
  const next: Record<string, string> = {}
  for (const key of KEYS)
    next[key] = pick<string>(APPEARANCE[key], value[key], defaults[key])
  return next as unknown as Appearance
}

export function readSaved(defaults = defaultAppearance): Appearance {
  try {
    return normalize(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") ?? {},
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
  for (const key of ATTRIBUTES) root.dataset[key] = appearance[key]
}

/** The appearance currently applied to the document. */
export function current(
  root: HTMLElement = document.documentElement,
): Appearance {
  const value: Partial<Record<keyof Appearance, unknown>> = {
    theme: root.dataset.themePreference,
  }
  for (const key of ATTRIBUTES) value[key] = root.dataset[key]
  return normalize(value)
}

/** The <html> attributes useAppearance watches. */
export const APPEARANCE_ATTRIBUTES = [
  "data-theme-preference",
  ...ATTRIBUTES.map((key) => `data-${key}`),
]
