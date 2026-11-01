// Two orbits; an accent body drifts round the outer one. From Mental Models' riso drawing for patterns.
import { sketch } from "../rough"
import { fork, stream } from "../seed"
import type { Motif } from "./types"

export const orbits: Motif = (seed, inks) => {
  const place = stream(seed, "orbits:place")
  const pen = (label: string) => fork(seed, `orbits:${label}`)
  const line = { stroke: inks.line, strokeWidth: 4.2, roughness: 0.9 }
  const accent = { stroke: inks.accent, strokeWidth: 3.8, roughness: 0.9 }
  const dot = (x: number, y: number, d: number, color: string, s: number) =>
    sketch.circle(x, y, d, {
      seed: s,
      stroke: color,
      fill: color,
      fillStyle: "solid",
      strokeWidth: 1,
      roughness: 0.6,
    })

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
      sketch.circle(cx, cy, 150, { ...line, seed: pen("inner") }) +
      sketch.circle(outer.x, outer.y, 226, { ...line, seed: pen("outer") }),
    detail: dot(cx, cy, 19, inks.detail, pen("core")),
    accent:
      dot(cx + 2, cy - 1, 20, inks.accent, pen("core-ink")) +
      sketch.circle(body.x, body.y, 54, { ...accent, seed: pen("body-ring") }) +
      dot(body.x, body.y, 20, inks.accent, pen("body")),
    pivot: outer,
  }
}
