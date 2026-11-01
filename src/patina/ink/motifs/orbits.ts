// Two orbits; an accent body drifts round the outer one. From Mental Models' riso drawing for patterns.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds } from "./pens"
import type { Motif } from "./types"

export const orbits: Motif = (seed, inks) => {
  const place = stream(seed, "orbits:place")
  const s = seeds(seed, "orbits")
  const pen = pens(inks)
  const cx = place.between(138, 152)
  const cy = place.between(98, 112)
  const outer = { x: cx - 8, y: cy + 10 }
  const angle = place.between(2.2, 2.7)
  const body = {
    x: outer.x + Math.cos(angle) * 113,
    y: outer.y + Math.sin(angle) * 113,
  }

  return {
    line:
      sketch.circle(cx, cy, 150, { ...pen.line, seed: s("inner") }) +
      sketch.circle(outer.x, outer.y, 226, { ...pen.line, seed: s("outer") }),
    detail: dot(cx, cy, 19, inks.detail, s("core")),
    accent:
      dot(cx + 2, cy - 1, 20, inks.accent, s("core-ink")) +
      sketch.circle(body.x, body.y, 54, {
        ...pen.accent,
        seed: s("body-ring"),
      }) +
      dot(body.x, body.y, 20, inks.accent, s("body")),
    pivot: outer,
  }
}
