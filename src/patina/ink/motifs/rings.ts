// Rings narrowing towards a pit. From Mental Models' riso drawing for traps.
import { sketch } from "../rough"
import { stream } from "../seed"
import { dot, pens, seeds } from "./pens"
import type { Motif } from "./types"

export const rings: Motif = (seed, inks) => {
  const place = stream(seed, "rings:place")
  const s = seeds(seed, "rings")
  const pen = pens(inks)
  const cx = place.between(105, 135)
  const cy = place.between(110, 130)
  const dx = place.between(-6, 6)
  const dy = place.between(4, 9)
  const pit = { x: cx + dx * 4.4, y: cy + dy * 4.4 }

  return {
    line: [190, 132, 80]
      .map((d, i) =>
        sketch.circle(cx + dx * i * 1.4, cy + dy * i * 1.4, d, {
          ...pen.line,
          seed: s(`ring-${i}`),
        }),
      )
      .join(""),
    detail: dot(pit.x, pit.y, 21, inks.detail, s("pit")),
    accent:
      dot(pit.x + 2.5, pit.y - 2, 22, inks.accent, s("pit-ink")) +
      sketch.circle(pit.x, pit.y, 46, {
        ...pen.accent,
        strokeWidth: 2.4,
        seed: s("halo"),
      }),
  }
}
