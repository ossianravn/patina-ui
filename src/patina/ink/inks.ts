// The drums a print uses. On the page they are CSS variables, so an ink set (data-inks) or the theme re-inks every
// print without re-rendering it; share images render without a stylesheet and pass plain colours instead.

export interface PrintInks {
  /** The line drum: structure. */
  line: string
  /** The accent drum: the point of interest. */
  accent: string
  /** A small dark detail. */
  detail: string
  /** Letters a motif prints, such as a monogram; falls back to the detail drum. */
  text?: string
}

export const CSS_INKS: PrintInks = {
  line: "var(--print-line)",
  accent: "var(--print-accent)",
  detail: "var(--print-detail)",
  text: "var(--ink)",
}

/** Named ink sets, defined in styles/inks.css. */
export const INK_SETS = ["patina", "field", "fluoro", "earth", "spot"] as const
export type InkSet = (typeof INK_SETS)[number]
