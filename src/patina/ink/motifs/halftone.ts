// A halftone field shaped like a seeded blob, with a second screen at another angle printing into moiré.
import { stream } from "../seed"
import { dot, seeds, turn, type Point } from "./pens"
import type { Motif } from "./types"

const r1 = (n: number) => Math.round(n * 10) / 10

function screen(
  centre: Point,
  reach: number,
  pitch: number,
  angle: number,
  size: number,
  color: string,
) {
  const out: string[] = []
  for (let y = -130; y <= 130; y += pitch)
    for (let x = -130; x <= 130; x += pitch) {
      const [px, py] = turn([centre[0] + x, centre[1] + y], centre, angle)
      const t = 1 - Math.hypot(px - centre[0], py - centre[1]) / reach
      if (t <= 0.04) continue
      out.push(
        `<circle cx="${r1(px)}" cy="${r1(py)}" r="${r1(size * t * (1.2 - 0.2 * t))}" style="fill:${color}"/>`,
      )
    }
  return out.join("")
}

export const halftone: Motif = (seed, inks) => {
  const place = stream(seed, "halftone:place")
  const s = seeds(seed, "halftone")
  const centre: Point = [place.between(100, 140), place.between(100, 140)]
  const a = place.between(0, 6.28)
  const offset = place.between(32, 48)
  const second: Point = [
    centre[0] + Math.cos(a) * offset,
    centre[1] + Math.sin(a) * offset,
  ]

  return {
    line: screen(
      centre,
      place.between(106, 118),
      11,
      place.between(-0.2, 0.2),
      5.8,
      inks.line,
    ),
    detail: dot(second[0], second[1], 12, inks.detail, s("eye")),
    accent: screen(
      second,
      place.between(62, 74),
      10,
      place.between(0.35, 0.6),
      5.2,
      inks.accent,
    ),
  }
}
