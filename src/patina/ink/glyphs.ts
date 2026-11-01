// A small set of hand-drawn glyphs in a 24 × 24 box, drawn in currentColor. The kind glyphs (pit, lens, orbit,
// constellation) and the list bullets (arrow, bang, hook) come from Mental Models.
import { sketch, type Pen } from "./rough"
import { fork } from "./seed"

export const GLYPHS = [
  "check",
  "cross",
  "plus",
  "minus",
  "arrow",
  "bang",
  "hook",
  "asterisk",
  "star",
  "dot",
  "ring",
  "box",
  "pit",
  "lens",
  "orbit",
  "constellation",
] as const
export type GlyphName = (typeof GLYPHS)[number]

type Draw = (pen: (n: number) => Pen, fill: (n: number) => Pen) => string

const DRAW: Record<GlyphName, Draw> = {
  check: (pen) =>
    sketch.curve(
      [
        [4, 13],
        [10, 20],
        [21, 4],
      ],
      { ...pen(0), strokeWidth: 2.4 },
    ),
  cross: (pen) =>
    sketch.line(5, 5, 19, 19, pen(0)) + sketch.line(19, 5, 5, 19, pen(1)),
  plus: (pen) =>
    sketch.line(12, 4, 12, 20, pen(0)) + sketch.line(4, 12, 20, 12, pen(1)),
  minus: (pen) => sketch.line(4, 12, 20, 12.5, pen(0)),
  arrow: (pen) => sketch.arrow(3, 13, 21, 11, pen(0), 0.1, 6),
  bang: (pen, fill) =>
    sketch.circle(12, 12, 20, pen(0)) +
    sketch.line(12, 6, 12, 13.5, { ...pen(1), strokeWidth: 2.2 }) +
    sketch.circle(12, 17.5, 2.2, fill(2)),
  hook: (pen) =>
    sketch.curve(
      [
        [5, 2],
        [5, 12],
        [8, 16],
        [20, 16],
      ],
      pen(0),
    ) +
    sketch.line(20, 16, 15, 11, pen(1)) +
    sketch.line(20, 16, 15, 20, pen(2)),
  asterisk: (pen) =>
    [0, 1, 2]
      .map((i) => {
        const a = (i / 3) * Math.PI + Math.PI / 2
        return sketch.line(
          12 - Math.cos(a) * 8,
          12 - Math.sin(a) * 8,
          12 + Math.cos(a) * 8,
          12 + Math.sin(a) * 8,
          pen(i),
        )
      })
      .join(""),
  star: (pen) =>
    sketch.polygon(
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 ? 4.2 : 10
        return [12 + Math.cos(a) * r, 12.5 + Math.sin(a) * r] as [
          number,
          number,
        ]
      }),
      pen(0),
    ),
  dot: (_, fill) => sketch.circle(12, 12, 9, fill(0)),
  ring: (pen) => sketch.circle(12, 12, 18, pen(0)),
  box: (pen) => sketch.rect(3, 3, 18, 18, pen(0)),
  pit: (pen, fill) =>
    sketch.circle(12, 12, 20, pen(0)) +
    sketch.circle(12, 13, 11, pen(1)) +
    sketch.circle(12, 14, 4.5, fill(2)),
  lens: (pen) =>
    sketch.circle(12, 12, 15, pen(0)) +
    sketch.line(1, 12, 23, 12.5, pen(1)) +
    sketch.line(12, 1, 12.5, 23, pen(2)),
  orbit: (pen, fill) =>
    sketch.circle(10, 10, 15, pen(0)) +
    sketch.circle(9, 11, 4.5, fill(1)) +
    sketch.circle(19.5, 19, 5, fill(2)),
  constellation: (pen, fill) =>
    sketch.line(5, 18, 12, 6, pen(0)) +
    sketch.line(12, 6, 20, 15, pen(1)) +
    [
      [5, 18],
      [12, 6],
      [20, 15],
    ]
      .map(([x, y], i) => sketch.circle(x ?? 0, y ?? 0, 5, fill(2 + i)))
      .join(""),
}

/** The paths of one glyph, seeded so two glyphs of the same name can differ. */
export function glyph(name: GlyphName, seed = 0) {
  const base = fork(seed, `glyph:${name}`)
  const pen = (n: number): Pen => ({
    seed: base + n,
    stroke: "currentColor",
    strokeWidth: 1.7,
    roughness: 0.8,
  })
  const fill = (n: number): Pen => ({
    ...pen(n),
    fill: "currentColor",
    fillStyle: "solid",
    strokeWidth: 1,
  })
  return DRAW[name](pen, fill)
}
