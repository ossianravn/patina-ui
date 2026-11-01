// A branching stem with leaves on alternate sides, two of them inked, and berries at the tip.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const sprig: Motif = (seed, inks) => {
  const place = stream(seed, "sprig:place")
  const s = seeds(seed, "sprig")
  const pen = pens(inks)
  const base: Point = [place.between(100, 140), 230]
  const tip: Point = [base[0] + place.between(-45, 45), place.between(28, 48)]
  const bend: Point = [(base[0] + tip[0]) / 2 + place.between(-40, 40), 130]
  // Multiplication rather than **: engines may compute x ** 2 differently depending on how the code was optimised.
  const along = (t: number): Point => {
    const u = 1 - t
    return [
      u * u * base[0] + 2 * u * t * bend[0] + t * t * tip[0],
      u * u * base[1] + 2 * u * t * bend[1] + t * t * tip[1],
    ]
  }
  const stem = Array.from({ length: 9 }, (_, i) => along(i / 8))
  const inked = new Set([
    1 + Math.floor(place.next() * 2),
    3 + Math.floor(place.next() * 3),
  ])

  const leaves = [0.22, 0.34, 0.46, 0.58, 0.7, 0.82].map((t, i) => {
    const p = along(t)
    const q = along(t + 0.02)
    const side = i % 2 ? 1 : -1
    const heading =
      Math.atan2(q[1] - p[1], q[0] - p[0]) + side * place.between(0.85, 1.15)
    const length = place.between(44, 56) * (1 - t * 0.45)
    const end: Point = [
      p[0] + Math.cos(heading) * length,
      p[1] + Math.sin(heading) * length,
    ]
    const mid: Point = [(p[0] + end[0]) / 2, (p[1] + end[1]) / 2]
    const w = length * 0.36
    const normal: Point = [-Math.sin(heading) * w, Math.cos(heading) * w]
    const outline: Point[] = [
      p,
      [mid[0] + normal[0], mid[1] + normal[1]],
      end,
      [mid[0] - normal[0], mid[1] - normal[1]],
    ]
    if (!inked.has(i))
      return {
        line: sketch.loop(outline, { ...pen.fine, seed: s(`leaf-${i}`) }),
        accent: "",
      }
    const fill = {
      fill: inks.accent,
      fillStyle: "hachure" as const,
      hachureGap: 4.5,
      hachureAngle: (heading * 180) / Math.PI + 40,
    }
    return {
      line: "",
      accent: sketch.loop(outline, {
        ...pen.accent,
        strokeWidth: 2.4,
        ...fill,
        seed: s(`leaf-${i}`),
      }),
    }
  })

  return {
    line:
      sketch.curve(stem, { ...pen.fine, strokeWidth: 3, seed: s("stem") }) +
      leaves.map((l) => l.line).join(""),
    detail: [0, 1, 2]
      .map((k) =>
        dot(
          tip[0] + place.between(-12, 12),
          tip[1] + place.between(-12, 6),
          11,
          inks.detail,
          s(`berry-${k}`),
        ),
      )
      .join(""),
    accent: leaves.map((l) => l.accent).join(""),
  }
}
