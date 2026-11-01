// The drums a print can use. Colours are passed in: CSS variables on the page, plain hex for share images, which
// render without a stylesheet.

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
