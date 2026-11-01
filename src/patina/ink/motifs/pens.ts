// Shared pens for motifs, so every print draws with the same weights as Mental Models' riso illustrations.
import type { PrintInks } from "../inks"
import { sketch } from "../rough"
import { fork } from "../seed"

export type Point = [number, number]

export function pens(inks: PrintInks) {
  return {
    /** Structure in the line drum. */
    line: { stroke: inks.line, strokeWidth: 4.2, roughness: 0.9 },
    /** Secondary structure in the line drum. */
    fine: { stroke: inks.line, strokeWidth: 2.2, roughness: 0.9 },
    /** The point of interest in the accent drum. */
    accent: { stroke: inks.accent, strokeWidth: 3.8, roughness: 0.9 },
  }
}

/** A filled, slightly rough dot. */
export function dot(
  x: number,
  y: number,
  d: number,
  color: string,
  seed: number,
) {
  return sketch.circle(x, y, d, {
    seed,
    stroke: color,
    fill: color,
    fillStyle: "solid",
    strokeWidth: 1,
    roughness: 0.6,
  })
}

/** Seeds for each drawn element, forked by motif and label so adding an element never shifts the others. */
export const seeds =
  (seed: number, motif: string) => (label: string | number) =>
    fork(seed, `${motif}:${label}`)

/** Points around an irregular closed shape: radius modulated by two seeded waves. */
export function blob(
  cx: number,
  cy: number,
  r: number,
  wobble: number,
  phase: [number, number],
  count = 14,
): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    const k =
      1 +
      wobble *
        (Math.sin(a * 3 + phase[0]) * 0.6 + Math.sin(a * 5 + phase[1]) * 0.4)
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]
  })
}

/** Rotates a point around a centre. */
export function turn([x, y]: Point, [cx, cy]: Point, angle: number): Point {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]
}
