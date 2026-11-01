// Initials printed over a seeded blob inside a drawn ring, for avatars, workspaces and marks.
import { sketch } from "../rough"
import { stream } from "../seed"
import { blob, pens, seeds } from "./pens"
import type { Motif } from "./types"

/** Up to two initials from a name: "Ossian Ravn" gives "OR", "patina" gives "P". */
export function initials(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const letters = words.length > 1 ? [words[0], words[words.length - 1]] : words
  return letters.map((w) => [...(w ?? "")][0]?.toUpperCase() ?? "").join("")
}

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

export const monogram: Motif = (seed, inks, { text }) => {
  const place = stream(seed, "monogram:place")
  const s = seeds(seed, "monogram")
  const pen = pens(inks)
  const phase: [number, number] = [
    place.between(0, 6.28),
    place.between(0, 6.28),
  ]
  const shape = blob(
    120 + place.between(-6, 6),
    120 + place.between(-6, 6),
    74,
    0.09,
    phase,
    16,
  )
  const letters = initials(text)
  const size = letters.length > 1 ? 84 : 104
  const type = `fill:${inks.text ?? inks.detail};font-family:var(--face-read, Georgia, serif);font-size:${size}px;font-weight:650;letter-spacing:-0.02em`

  return {
    line: sketch.circle(
      120 + place.between(-4, 4),
      120 + place.between(-4, 4),
      196,
      { ...pen.fine, strokeWidth: 3, seed: s("ring") },
    ),
    accent: sketch.polygon(shape, {
      seed: s("blob"),
      stroke: inks.accent,
      fill: inks.accent,
      fillStyle: "solid",
      strokeWidth: 1.5,
      roughness: 0.8,
    }),
    detail: letters
      ? `<text x="120" y="122" text-anchor="middle" dominant-baseline="central" style="${type}">${escape(letters)}</text>`
      : "",
  }
}
