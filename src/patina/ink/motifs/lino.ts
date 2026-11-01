// Linocut: bold parallel gouges that swell and taper like carved water, a solid form cut into them, a few chips.
import { sketch } from "../rough"
import { stream } from "../seed"
import { blob, seeds, type Point } from "./pens"
import type { Motif } from "./types"

export const lino: Motif = (seed, inks) => {
  const place = stream(seed, "lino:place")
  const s = seeds(seed, "lino")
  const swell = place.between(5, 11)
  const phase = place.between(0, 6.28)
  const form: Point = [place.between(80, 160), place.between(70, 120)]
  const radius = place.between(34, 48)

  // Gouges stop where they meet the form, as if carved around it.
  const gouges: string[] = []
  for (let k = 0; k < 9; k++) {
    const y0 = 40 + k * 20
    const points: Point[] = Array.from({ length: 13 }, (_, i) => [
      i * 20,
      y0 + Math.sin(i * 0.7 + phase + k * 0.35) * swell,
    ])
    let run: Point[] = []
    const flush = () => {
      if (run.length > 1)
        gouges.push(
          sketch.curve(run, {
            seed: s(`gouge-${k}-${gouges.length}`),
            stroke: inks.line,
            strokeWidth: 3 + ((k * 7) % 4),
            roughness: 0.6,
          }),
        )
      run = []
    }
    for (const p of points) {
      if (Math.hypot(p[0] - form[0], p[1] - form[1]) < radius + 10) flush()
      else run.push(p)
    }
    flush()
  }
  const chips = Array.from({ length: 5 }, (_, i) =>
    sketch.circle(
      place.between(20, 220),
      place.between(30, 220),
      place.between(4, 8),
      {
        seed: s(`chip-${i}`),
        stroke: inks.detail,
        fill: inks.detail,
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 0.6,
      },
    ),
  )

  return {
    line: gouges.join(""),
    accent: sketch.polygon(
      blob(form[0], form[1], radius, 0.08, [phase, phase * 2], 18),
      {
        seed: s("form"),
        stroke: inks.accent,
        fill: inks.accent,
        fillStyle: "solid",
        strokeWidth: 1,
        roughness: 0.7,
      },
    ),
    detail: chips.join(""),
  }
}
