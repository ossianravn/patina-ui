// Topographic lines round a peak and a smaller hill, with a dashed route up in the accent drum.
import { sketch } from "../rough"
import { stream } from "../seed"
import { blob, dot, pens, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const contours: Motif = (seed, inks) => {
  const place = stream(seed, "contours:place")
  const s = seeds(seed, "contours")
  const pen = pens(inks)
  const peak: Point = [place.between(105, 140), place.between(100, 130)]
  const phase: [number, number] = [
    place.between(0, 6.28),
    place.between(0, 6.28),
  ]
  const drift: Point = [place.between(-2.5, 2.5), place.between(-2.5, 2.5)]
  const away = place.between(0, 6.28)
  const hill: Point = [
    peak[0] + Math.cos(away) * 92,
    peak[1] + Math.sin(away) * 80,
  ]

  const levels = [20, 40, 61, 83, 106].map((r, k) =>
    sketch.loop(
      blob(
        peak[0] + drift[0] * k,
        peak[1] + drift[1] * k,
        r,
        0.1 + k * 0.025,
        phase,
        16,
      ),
      {
        ...pen.fine,
        strokeWidth: k === 4 ? 3.2 : 2.2,
        seed: s(`level-${k}`),
      },
    ),
  )
  const hills = [14, 30].map((r, k) =>
    sketch.loop(blob(hill[0], hill[1], r, 0.14, [phase[1], phase[0]], 12), {
      ...pen.fine,
      seed: s(`hill-${k}`),
    }),
  )
  const start: Point = [
    peak[0] + Math.cos(away + 2.6) * 125,
    peak[1] + Math.sin(away + 2.6) * 115,
  ]
  const bend: Point = [
    (start[0] + peak[0]) / 2 + place.between(-25, 25),
    (start[1] + peak[1]) / 2 + place.between(-25, 25),
  ]

  return {
    line: levels.join("") + hills.join(""),
    detail: dot(peak[0], peak[1], 13, inks.detail, s("summit")),
    accent:
      sketch.curve([start, bend, [peak[0] + 9, peak[1] + 7]], {
        ...pen.accent,
        strokeWidth: 3,
        strokeLineDash: [9, 8],
        seed: s("route"),
      }) + dot(start[0], start[1], 16, inks.accent, s("trailhead")),
  }
}
