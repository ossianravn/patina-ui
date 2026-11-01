// A small constellation of linked ideas, one of them ringed. From Mental Models' riso drawing for concepts.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const constellation: Motif = (seed, inks) => {
  const place = stream(seed, "constellation:place")
  const s = seeds(seed, "constellation")
  const pen = pens(inks)
  const stars: Point[] = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + place.between(-0.3, 0.3)
    const radius = i === 0 ? 0 : place.between(55, 92)
    return [120 + Math.cos(angle) * radius, 120 + Math.sin(angle) * radius]
  })
  const [hub, ...rest] = stars as [Point, ...Point[]]
  const link = (a: Point, b: Point, label: string) =>
    sketch.line(a[0], a[1], b[0], b[1], { ...pen.fine, seed: s(label) })
  const target = stars[2 + Math.floor(place.next() * 3)] ?? hub

  return {
    line:
      rest.map((star, i) => link(hub, star, `spoke-${i}`)).join("") +
      link(stars[1] ?? hub, stars[2] ?? hub, "chord-a") +
      link(stars[3] ?? hub, stars[4] ?? hub, "chord-b"),
    detail: stars
      .map(([x, y], i) =>
        dot(x, y, i === 0 ? 24 : 13, inks.detail, s(`star-${i}`)),
      )
      .join(""),
    accent:
      sketch.circle(target[0], target[1], 46, {
        ...pen.accent,
        seed: s("ring"),
      }) + dot(target[0] + 2.5, target[1] - 2, 14, inks.accent, s("ring-ink")),
  }
}
