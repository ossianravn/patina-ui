// A disc over wavy horizon bands, with glints on the water and two birds.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const horizon: Motif = (seed, inks) => {
  const place = stream(seed, "horizon:place")
  const s = seeds(seed, "horizon")
  const pen = pens(inks)
  const sun: Point = [place.between(70, 170), place.between(68, 100)]
  const radius = place.between(32, 44)
  const top = sun[1] + radius + place.between(8, 20)

  const bands = Array.from({ length: 4 }, (_, k) => {
    const y = top + k * place.between(17, 22)
    const amplitude = place.between(2.5, 6)
    const phase = place.between(0, 6.28)
    const points: Point[] = Array.from({ length: 9 }, (_, i) => [
      -8 + i * 32,
      y + Math.sin(i * 0.9 + phase) * amplitude,
    ])
    return sketch.curve(points, {
      ...(k === 0 ? pen.line : pen.fine),
      seed: s(`band-${k}`),
    })
  })
  const glints = [0, 1, 2].map((k) => {
    const y = top + 9 + k * 19
    const half = 22 - k * 6
    return sketch.line(
      sun[0] - half,
      y,
      sun[0] + half,
      y + place.between(-1.5, 1.5),
      { ...pen.accent, strokeWidth: 2.6, seed: s(`glint-${k}`) },
    )
  })
  const bird = (x: number, y: number, w: number, label: string) =>
    sketch.curve(
      [
        [x - w, y - w * 0.4],
        [x, y],
        [x + w, y - w * 0.45],
      ],
      { stroke: inks.detail, strokeWidth: 2.2, roughness: 0.8, seed: s(label) },
    )
  const flock: Point = [place.between(40, 200), place.between(22, 48)]

  return {
    line: bands.join(""),
    detail:
      bird(flock[0], flock[1], 9, "bird-a") +
      bird(flock[0] + 22, flock[1] + 9, 7, "bird-b"),
    accent:
      dot(sun[0], sun[1], radius * 2, inks.accent, s("sun")) + glints.join(""),
  }
}
