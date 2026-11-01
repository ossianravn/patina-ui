// Letterpress offcuts stacked and slightly tumbling; one block inked, a type sort fallen beside them.
import { sketch } from "../rough"
import { stream } from "../seed"
import { pens, seeds, turn, type Point } from "./pens"
import type { Motif } from "./types"

function box(
  cx: number,
  cy: number,
  w: number,
  h: number,
  angle: number,
): Point[] {
  const corners: Point[] = [
    [cx - w / 2, cy - h / 2],
    [cx + w / 2, cy - h / 2],
    [cx + w / 2, cy + h / 2],
    [cx - w / 2, cy + h / 2],
  ]
  return corners.map((p) => turn(p, [cx, cy], angle))
}

export const blocks: Motif = (seed, inks) => {
  const place = stream(seed, "blocks:place")
  const s = seeds(seed, "blocks")
  const pen = pens(inks)
  const inked = 1 + Math.floor(place.next() * 3)
  let floor = 222
  const stack = Array.from({ length: 5 }, (_, i) => {
    const w = place.between(60, 118) * (1 - i * 0.08)
    const h = place.between(24, 36)
    const cx = 120 + place.between(-16, 16)
    const cy = floor - h / 2
    floor -= h - 1
    return box(cx, cy, w, h, place.between(-0.06, 0.06) * (1 + i))
  })
  const sort = box(place.between(28, 52), 214, 16, 20, place.between(0.2, 0.5))
  const solid = {
    stroke: inks.detail,
    fill: inks.detail,
    fillStyle: "solid" as const,
    strokeWidth: 1,
    roughness: 0.6,
  }
  const hatch = {
    fill: inks.accent,
    fillStyle: "hachure" as const,
    hachureGap: 5,
    hachureAngle: -35,
  }

  return {
    line: stack
      .map((b, i) =>
        i === inked
          ? ""
          : sketch.polygon(b, {
              ...pen.fine,
              strokeWidth: 2.6,
              seed: s(`block-${i}`),
            }),
      )
      .join(""),
    detail: sketch.polygon(sort, { ...solid, seed: s("sort") }),
    accent: sketch.polygon(stack[inked] ?? [], {
      ...pen.accent,
      strokeWidth: 2.6,
      ...hatch,
      seed: s("inked"),
    }),
  }
}
