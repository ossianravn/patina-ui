// Small shapes spaced apart across a round field: rings, ticks, triangles, crosses and dots.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds, turn, type Point } from "./pens"
import type { Motif } from "./types"

export const scatter: Motif = (seed, inks) => {
  const place = stream(seed, "scatter:place")
  const s = seeds(seed, "scatter")
  const pen = pens(inks)
  const spots: Point[] = []
  for (let tries = 0; tries < 240 && spots.length < 30; tries++) {
    const a = place.between(0, 6.28)
    const r = Math.sqrt(place.next()) * 108
    const p: Point = [120 + Math.cos(a) * r, 120 + Math.sin(a) * r]
    if (spots.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) >= 27))
      spots.push(p)
  }

  const out = { line: "", detail: "", accent: "" }
  spots.forEach(([x, y], i) => {
    const kind = Math.floor(place.next() * 5)
    const angle = place.between(0, 6.28)
    const at = (dx: number, dy: number) => turn([x + dx, y + dy], [x, y], angle)
    const stroke = (a: Point, b: Point, label: string) =>
      sketch.line(a[0], a[1], b[0], b[1], {
        ...pen.accent,
        strokeWidth: 2.6,
        seed: s(label),
      })
    if (kind === 0)
      out.line += sketch.circle(x, y, place.between(13, 19), {
        ...pen.fine,
        seed: s(i),
      })
    else if (kind === 1)
      out.line += sketch.curve([at(-7, 0), at(-2, 6), at(8, -7)], {
        ...pen.fine,
        strokeWidth: 2.6,
        seed: s(i),
      })
    else if (kind === 2)
      out.accent += sketch.polygon([at(0, -9), at(8, 6), at(-8, 6)], {
        ...pen.accent,
        strokeWidth: 2.4,
        seed: s(i),
      })
    else if (kind === 3)
      out.accent +=
        stroke(at(-7, 0), at(7, 0), `${i}a`) +
        stroke(at(0, -7), at(0, 7), `${i}b`)
    else out.detail += dot(x, y, place.between(7, 11), inks.detail, s(i))
  })
  return out
}
