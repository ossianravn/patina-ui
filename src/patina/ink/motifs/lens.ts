// A lens on crosshair guides, its accent hatched. From Mental Models' riso drawing for tools.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds } from "./pens"
import type { Motif } from "./types"

export const lens: Motif = (seed, inks) => {
  const place = stream(seed, "lens:place")
  const s = seeds(seed, "lens")
  const pen = pens(inks)
  const cx = place.between(100, 140)
  const cy = place.between(100, 135)
  const ax = cx + place.between(20, 40)
  const ay = cy - place.between(20, 40)

  return {
    line:
      sketch.circle(cx, cy, 150, { ...pen.line, seed: s("lens") }) +
      sketch.line(cx - 110, cy, cx + 110, cy + place.between(-6, 6), {
        ...pen.fine,
        strokeWidth: 2,
        seed: s("horizontal"),
      }) +
      sketch.line(cx, cy - 110, cx + place.between(-6, 6), cy + 110, {
        ...pen.fine,
        strokeWidth: 2,
        seed: s("vertical"),
      }),
    detail: dot(ax - 1, ay + 1.5, 16, inks.detail, s("focus")),
    accent: sketch.circle(ax, ay, 58, {
      ...pen.accent,
      seed: s("glint"),
      fill: inks.accent,
      fillStyle: "hachure",
      hachureGap: 5,
      fillWeight: 2.2,
      hachureAngle: -40,
    }),
  }
}
