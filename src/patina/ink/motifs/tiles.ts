// Truchet tiles: a grid of cells, each with two quarter arcs in one of two turns, a few filled quarters in accent.
import { sketch } from "../rough"
import { stream } from "../seed"
import { seeds, type Point } from "./pens"
import type { Motif } from "./types"

const CELL = 48
const ORIGIN = 24

function quarter(cx: number, cy: number, r: number, from: number): Point[] {
  return Array.from({ length: 7 }, (_, i) => {
    const a = from + (i / 6) * (Math.PI / 2)
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  })
}

export const tiles: Motif = (seed, inks) => {
  const place = stream(seed, "tiles:place")
  const s = seeds(seed, "tiles")
  const pen = { stroke: inks.line, strokeWidth: 4, roughness: 0.8 }
  const out = { line: "", accent: "", detail: "" }
  const r = CELL / 2

  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++) {
      const x = ORIGIN + col * CELL
      const y = ORIGIN + row * CELL
      const flipped = place.next() > 0.5
      // Two arcs centred on opposite corners of the cell.
      const corners: [Point, number][] = flipped
        ? [
            [[x + CELL, y], Math.PI / 2],
            [[x, y + CELL], -Math.PI / 2],
          ]
        : [
            [[x, y], 0],
            [[x + CELL, y + CELL], Math.PI],
          ]
      corners.forEach(
        ([[cx, cy], from], k) =>
          (out.line += sketch.curve(quarter(cx, cy, r, from), {
            ...pen,
            seed: s(`${row}-${col}-${k}`),
          })),
      )
      const roll = place.next()
      if (roll > 0.82) {
        const [[cx, cy], from] = corners[0] as [Point, number]
        out.accent += sketch.polygon([[cx, cy], ...quarter(cx, cy, r, from)], {
          seed: s(`fill-${row}-${col}`),
          stroke: inks.accent,
          fill: inks.accent,
          fillStyle: "solid",
          strokeWidth: 1,
          roughness: 0.6,
        })
      } else if (roll < 0.1) {
        out.detail += sketch.circle(x + r, y + r, 9, {
          seed: s(`dot-${row}-${col}`),
          stroke: inks.detail,
          fill: inks.detail,
          fillStyle: "solid",
          strokeWidth: 1,
          roughness: 0.6,
        })
      }
    }
  return out
}
