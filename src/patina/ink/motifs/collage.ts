// Cut paper: three to five shapes (torn slabs, half discs, triangles, strips, a dot) in solid ink, scattered and
// overlapping so the drums overprint. The seed picks the shapes, their order, places and turns.
import { sketch } from "../rough"
import { stream } from "../seed"
import { seeds, turn, type Point } from "./pens"
import type { Motif } from "./types"

type Place = ReturnType<typeof stream>
type Shape = (p: Place, c: Point, size: number) => Point[]

const around = (points: Point[], centre: Point, angle: number) =>
  points.map((p) => turn(p, centre, angle))

/** A rectangle with one torn edge. */
const slab: Shape = (p, [cx, cy], size) => {
  const w = size * p.between(1.1, 1.6)
  const h = size * p.between(0.6, 0.9)
  const top: Point[] = Array.from({ length: 9 }, (_, i) => [
    cx - w / 2 + (w * i) / 8,
    cy - h / 2 + p.between(-5, 5),
  ])
  return around(
    [...top, [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]],
    [cx, cy],
    p.between(-0.4, 0.4),
  )
}

/** A half disc. */
const half: Shape = (p, [cx, cy], size) => {
  const r = size * p.between(0.45, 0.6)
  const arc: Point[] = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI + (i / 12) * Math.PI
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
  })
  return around(arc, [cx, cy], p.between(0, 6.28))
}

/** A triangle. */
const triangle: Shape = (p, [cx, cy], size) => {
  const s = size * p.between(0.4, 0.55)
  return around(
    [
      [cx, cy - s],
      [cx + s * 0.9, cy + s * 0.55],
      [cx - s * 0.8, cy + s * 0.5],
    ],
    [cx, cy],
    p.between(0, 6.28),
  )
}

/** A long strip, like a cut-off edge of a sheet. */
const strip: Shape = (p, [cx, cy], size) => {
  const w = size * p.between(1.4, 2)
  const h = size * p.between(0.14, 0.22)
  return around(
    [
      [cx - w / 2, cy - h / 2],
      [cx + w / 2, cy - h / 2 + p.between(-3, 3)],
      [cx + w / 2, cy + h / 2],
      [cx - w / 2, cy + h / 2],
    ],
    [cx, cy],
    p.between(-0.9, 0.9),
  )
}

const SHAPES = [slab, half, triangle, strip]

export const collage: Motif = (seed, inks) => {
  const place = stream(seed, "collage:place")
  const s = seeds(seed, "collage")
  const out = { line: "", accent: "", detail: "" }
  const solid = (color: string, label: string) => ({
    seed: s(label),
    stroke: color,
    fill: color,
    fillStyle: "solid" as const,
    strokeWidth: 1,
    roughness: 0.7,
  })
  const count = 3 + Math.floor(place.next() * 3)

  for (let i = 0; i < count; i++) {
    const shape = place.pick(SHAPES)
    const centre: Point = [place.between(88, 152), place.between(88, 152)]
    const size = place.between(60, 92) * (i === 0 ? 1.15 : 1)
    // The first and largest shape prints in the line drum; the rest alternate drums.
    const drum = i === 0 ? "line" : place.next() > 0.35 ? "accent" : "line"
    out[drum] += sketch.polygon(
      shape(place, centre, size),
      solid(inks[drum], `shape-${i}`),
    )
  }
  const dot: Point = [place.between(40, 200), place.between(40, 200)]
  out.detail += sketch.circle(
    dot[0],
    dot[1],
    place.between(16, 28),
    solid(inks.detail, "dot"),
  )
  return out
}
