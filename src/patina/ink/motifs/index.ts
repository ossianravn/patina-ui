import { blocks } from "./blocks"
import { collage } from "./collage"
import { constellation } from "./constellation"
import { contours } from "./contours"
import { flow } from "./flow"
import { halftone } from "./halftone"
import { horizon } from "./horizon"
import { lens } from "./lens"
import { lino } from "./lino"
import { monogram } from "./monogram"
import { orbits } from "./orbits"
import { rings } from "./rings"
import { scatter } from "./scatter"
import { sprig } from "./sprig"
import { tiles } from "./tiles"
import type { Motif } from "./types"

/** Every motif, in the order the Press lists them. */
export const motifs = {
  collage,
  tiles,
  lino,
  rings,
  lens,
  orbits,
  constellation,
  contours,
  halftone,
  flow,
  horizon,
  sprig,
  blocks,
  scatter,
  monogram,
} satisfies Record<string, Motif>

export type MotifName = keyof typeof motifs
export const MOTIFS = Object.keys(motifs) as MotifName[]
export { initials } from "./monogram"
export type { Motif, MotifDrawing, MotifOptions } from "./types"
