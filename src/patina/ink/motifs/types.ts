import type { PrintInks } from "../inks"

/** One print's strokes, split by drum so each drum can sit slightly out of register. */
export interface MotifDrawing {
  line: string
  detail: string
  accent: string
  /** Centre the accent drum turns around when the print animates. */
  pivot?: { x: number; y: number }
}

export interface MotifOptions {
  /** Text a motif may print, such as a monogram's initials. */
  text?: string
}

/** A motif draws inside a 240 × 240 area and may overflow it by up to 20 units on each side. */
export type Motif = (
  seed: number,
  inks: PrintInks,
  options: MotifOptions,
) => MotifDrawing
