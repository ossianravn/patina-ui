import type { Appearance } from "@/patina/theme"

/** What a theme fixes: every appearance setting but day or night, which the export covers both of. */
export type ThemeChoices = Omit<Appearance, "theme">

export interface Preset {
  name: string
  /** The look in a few words. */
  note: string
  choices: ThemeChoices
}

export const PRESETS: Preset[] = [
  {
    name: "Archive",
    note: "Ivory, verdigris, handled",
    choices: {
      stock: "archive",
      inks: "patina",
      accent: "green",
      variation: "lively",
      patina: "handled",
      density: "comfortable",
      face: "serif",
    },
  },
  {
    name: "Field notes",
    note: "Grey stock, riso inks, worn",
    choices: {
      stock: "field",
      inks: "field",
      accent: "blue",
      variation: "lively",
      patina: "worn",
      density: "comfortable",
      face: "serif",
    },
  },
  {
    name: "Newsprint",
    note: "Ink and spot red, calm",
    choices: {
      stock: "newsprint",
      inks: "spot",
      accent: "red",
      variation: "calm",
      patina: "handled",
      density: "comfortable",
      face: "serif",
    },
  },
  {
    name: "Ledger",
    note: "Sans, compact, clean",
    choices: {
      stock: "archive",
      inks: "earth",
      accent: "orange",
      variation: "calm",
      patina: "clean",
      density: "compact",
      face: "sans",
    },
  },
]

export const CHOICE_KEYS = [
  "stock",
  "inks",
  "accent",
  "variation",
  "patina",
  "density",
  "face",
] as const satisfies readonly (keyof ThemeChoices)[]

export const choicesOf = (appearance: Appearance) =>
  Object.fromEntries(
    CHOICE_KEYS.map((key) => [key, appearance[key]]),
  ) as unknown as ThemeChoices

/** The preset the page currently shows, if any. */
export const matchPreset = (appearance: Appearance) =>
  PRESETS.find((preset) =>
    CHOICE_KEYS.every((key) => preset.choices[key] === appearance[key]),
  )
