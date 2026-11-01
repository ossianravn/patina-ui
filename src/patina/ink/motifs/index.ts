import { orbits } from "./orbits"
import type { Motif } from "./types"

export const motifs = { orbits } satisfies Record<string, Motif>

export type MotifName = keyof typeof motifs
export type { Motif, MotifDrawing } from "./types"
