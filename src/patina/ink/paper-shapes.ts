// The shape and wear of a sheet of paper, from its seed: a clip-path for its edge and an SVG of age marks. Pure
// strings, so static pages and share images can use them without React.
import { stream } from "./seed"

export const EDGES = [
  "straight",
  "deckle",
  "torn",
  "perforated",
  "pinked",
] as const
export type Edge = (typeof EDGES)[number]

const r1 = (n: number) => Math.round(n * 10) / 10

/** Points along one edge, from 0 to 100 percent, each pushed inward by a seeded depth in pixels. */
function ragged(
  seed: number,
  label: string,
  step: [number, number],
  depth: [number, number],
) {
  const s = stream(seed, label)
  const points: [number, number][] = [[0, s.between(...depth)]]
  for (let p = s.between(...step); p < 100; p += s.between(...step))
    points.push([r1(p), r1(s.between(...depth))])
  points.push([100, s.between(...depth)])
  return points
}

/**
 * A clip-path for the edge. Deckle roughens all four sides a little; torn tears the top deeply. Perforated and
 * pinked edges are masks rather than clips (see edgeMask).
 */
export function edgeClip(
  edge: Edge,
  seed: number,
  dogEar = false,
): string | undefined {
  const corner = dogEar
    ? "100% calc(100% - 2.25rem), calc(100% - 2.25rem) 100%"
    : "100% 100%"
  if (edge === "deckle") {
    const top = ragged(seed, "edge:top", [2.5, 5], [0, 2.6]).map(
      ([p, d]) => `${p}% ${r1(d)}px`,
    )
    const right = ragged(seed, "edge:right", [3, 6], [0, 2.4]).map(
      ([p, d]) => `calc(100% - ${r1(d)}px) ${p}%`,
    )
    const bottom = ragged(seed, "edge:bottom", [2.5, 5], [0, 2.6]).map(
      ([p, d]) => `${100 - p}% calc(100% - ${r1(d)}px)`,
    )
    const left = ragged(seed, "edge:left", [3, 6], [0, 2.4]).map(
      ([p, d]) => `${r1(d)}px ${100 - p}%`,
    )
    if (dogEar) {
      right.pop()
      bottom.shift()
    }
    return `polygon(${[...top, ...right, ...(dogEar ? ["calc(100% - 1px) calc(100% - 2.25rem)", "calc(100% - 2.25rem) calc(100% - 1px)"] : []), ...bottom, ...left].join(", ")})`
  }
  if (edge === "torn") {
    const tear = ragged(seed, "edge:tear", [0.8, 2.6], [0, 9]).map(
      ([p, d]) => `${p}% ${r1(d)}px`,
    )
    return `polygon(${tear.join(", ")}, ${corner}, 0 100%)`
  }
  return dogEar ? `polygon(0 0, 100% 0, ${corner}, 0 100%)` : undefined
}

/** A CSS mask for edges cut by a tool: perforations down the left, like a ticket stub; pinking along the bottom. */
export function edgeMask(edge: Edge): string | undefined {
  if (edge === "perforated")
    return "radial-gradient(circle at 0 50%, transparent 4px, #000 4.5px) 0 0 / 9px 15px repeat-y, linear-gradient(#000, #000) 9px 0 / calc(100% - 9px) 100% no-repeat"
  if (edge === "pinked")
    return "conic-gradient(from -45deg at 50% 100%, transparent 0 0, #000 1deg 89deg, transparent 90deg) 50% 100% / 12px 7px repeat-x, linear-gradient(#000, #000) 0 0 / 100% calc(100% - 6px) no-repeat"
  return undefined
}

/**
 * Seeded age marks as SVG markup. Marks in the "handled" group show from the handled level up; marks in "worn"
 * only on worn paper. Positions are percentages of the sheet; sizes are pixels, so marks keep their shape.
 */
export function ageMarks(seed: number, id: string) {
  const at = stream(seed, "age")
  const brown = "rgb(130 85 35)"
  const handled: string[] = []
  const worn: string[] = []

  // A thumb smudge near an edge, and sometimes a soft fold across the sheet.
  handled.push(
    `<ellipse cx="${r1(at.pick([8, 92]))}%" cy="${r1(at.between(55, 90))}%" rx="${r1(at.between(16, 26))}" ry="${r1(at.between(9, 14))}" fill="${brown}" opacity="0.05" filter="url(#${id}-soft)"/>`,
  )
  const fold = at.between(30, 70)
  const tilt = at.between(-4, 4)
  const crease = (opacity: number) =>
    `<g mask="url(#${id}-fade)"><line x1="0" y1="${r1(fold)}%" x2="100%" y2="${r1(fold + tilt)}%" stroke="rgb(90 60 25)" stroke-opacity="${opacity}" stroke-width="1.3"/><line x1="0" y1="${r1(fold)}%" x2="100%" y2="${r1(fold + tilt)}%" stroke="#fff" stroke-opacity="${opacity * 3}" stroke-width="1.1" transform="translate(0 1.7)"/></g>`
  if (at.next() > 0.45) handled.push(crease(0.07))
  worn.push(crease(0.12))

  // A coffee ring off one corner, with a fainter second ring where the cup was set down again.
  const ring = (cx: number, cy: number, r: number, o: number) =>
    `<svg x="${r1(cx)}%" y="${r1(cy)}%" overflow="visible"><circle r="${r1(r)}" fill="url(#${id}-ring)" opacity="${o}" filter="url(#${id}-stain)"/></svg>`
  const rx = at.pick([14, 50, 86]) + at.between(-10, 10)
  const ry = at.pick([18, 82]) + at.between(-12, 12)
  if (at.next() > 0.6)
    worn.push(
      ring(rx, ry, at.between(44, 62), 1) +
        ring(
          rx + at.between(-6, 6),
          ry + at.between(4, 9),
          at.between(40, 56),
          0.45,
        ),
    )

  // Foxing: one or two clusters of small brown spots.
  for (let c = 0; c < 1 + Math.floor(at.next() * 2); c++) {
    const cx = at.between(10, 90)
    const cy = at.between(10, 90)
    const spots = Array.from({ length: 4 + Math.floor(at.next() * 8) }, () => {
      const a = at.between(0, 6.28)
      const d = at.next() ** 1.5 * 9
      return `<circle cx="${r1(cx + Math.cos(a) * d)}%" cy="${r1(cy + Math.sin(a) * d * 1.4)}%" r="${r1(0.7 + at.next() ** 2 * 3)}" opacity="${r1(0.12 + at.next() * 0.18)}"/>`
    })
    worn.push(
      `<g fill="rgb(150 95 40)" filter="url(#${id}-fox)">${spots.join("")}</g>`,
    )
  }

  // Corner wear: a corner gone soft and slightly darker.
  const corner = at.pick(["0 0", "100% 0", "0 100%", "100% 100%"])
  worn.push(`<rect width="100%" height="100%" fill="url(#${id}-corner)"/>`)
  const [cxp, cyp] = corner.split(" ").map((v) => (v === "0" ? "0%" : "100%"))

  const defs = `<defs>
<filter id="${id}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="${id}-stain" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="${seed % 997}"/><feDisplacementMap in="SourceGraphic" scale="14" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="0.6"/></filter>
<filter id="${id}-fox" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="2" seed="${(seed + 5) % 997}"/><feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="0.7"/></filter>
<radialGradient id="${id}-ring"><stop offset="0.78" stop-color="${brown}" stop-opacity="0.04"/><stop offset="0.94" stop-color="${brown}" stop-opacity="0.26"/><stop offset="1" stop-color="${brown}" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-corner" cx="${cxp}" cy="${cyp}" r="22%"><stop offset="0" stop-color="${brown}" stop-opacity="0.14"/><stop offset="1" stop-color="${brown}" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}-fadeg"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.18" stop-color="#fff"/><stop offset="0.86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="${id}-fade"><rect width="100%" height="100%" fill="url(#${id}-fadeg)"/></mask>
</defs>`
  return `${defs}<g class="patina-age-handled">${handled.join("")}</g><g class="patina-age-worn">${worn.join("")}</g>`
}
