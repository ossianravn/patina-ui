// The drums a print uses. On the page they are CSS variables, so an ink set (data-inks) or the theme re-inks every
// print without re-rendering it; share images render without a stylesheet and pass plain colours instead.

export interface PrintInks {
  /** The line drum: structure. */
  line: string
  /** The accent drum: the point of interest. */
  accent: string
  /** A small dark detail. */
  detail: string
}

export const CSS_INKS: PrintInks = {
  line: "var(--print-line)",
  accent: "var(--print-accent)",
  detail: "var(--print-detail)",
}

/** Named ink sets, defined in styles/inks.css. */
export const INK_SETS = ["field", "fluoro", "earth", "spot"] as const
export type InkSet = (typeof INK_SETS)[number]
