// Streamlines through a seeded noise field; a few of them print in the accent drum.
import { valueNoise } from "../noise"
import { sketch } from "../rough"
import { fork, stream } from "../seed"
import { dot, pens, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const flow: Motif = (seed, inks) => {
  const place = stream(seed, "flow:place")
  const s = seeds(seed, "flow")
  const pen = pens(inks)
  const field = valueNoise(fork(seed, "flow:field"), 80)
  const base = place.between(0, 6.28)
  const direction = (x: number, y: number) => base + (field(x, y) - 0.5) * 4.4

  const lines: Point[][] = []
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++) {
      let p: Point = [
        28 + col * 61 + place.between(-14, 14),
        28 + row * 61 + place.between(-14, 14),
      ]
      const path: Point[] = [p]
      for (let step = 0; step < 18; step++) {
        const a = direction(p[0], p[1])
        p = [p[0] + Math.cos(a) * 7, p[1] + Math.sin(a) * 7]
        if (p[0] < -12 || p[0] > 252 || p[1] < -12 || p[1] > 252) break
        path.push(p)
      }
      if (path.length > 4) lines.push(path)
    }
  const accented = new Set([
    Math.floor(place.next() * lines.length),
    Math.floor(place.next() * lines.length),
  ])

  return {
    line: lines
      .map((path, i) =>
        accented.has(i)
          ? ""
          : sketch.curve(path, { ...pen.fine, seed: s(`line-${i}`) }),
      )
      .join(""),
    detail: [...accented]
      .map((i) =>
        dot(
          lines[i]?.[0]?.[0] ?? 0,
          lines[i]?.[0]?.[1] ?? 0,
          11,
          inks.detail,
          s(`start-${i}`),
        ),
      )
      .join(""),
    accent: [...accented]
      .map((i) =>
        sketch.curve(lines[i] ?? [], {
          ...pen.accent,
          strokeWidth: 3.2,
          seed: s(`accent-${i}`),
        }),
      )
      .join(""),
  }
}
