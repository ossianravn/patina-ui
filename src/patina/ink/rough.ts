// Hand-drawn shapes as SVG path strings. rough.js gives the wobble; a seed per call keeps every build identical.
// Ported from Mental Models' sketch.ts.
import rough from "roughjs"

const gen = rough.generator()

export interface Pen {
  seed: number
  stroke?: string
  strokeWidth?: number
  roughness?: number
  bowing?: number
  fill?: string
  fillStyle?:
    | "hachure"
    | "solid"
    | "zigzag"
    | "cross-hatch"
    | "dots"
    | "dashed"
    | "zigzag-line"
  hachureGap?: number
  hachureAngle?: number
  fillWeight?: number
  strokeLineDash?: number[]
  disableMultiStroke?: boolean
  preserveVertices?: boolean
  /** Keep the stroke width constant when the SVG is stretched to hug content. */
  nonScaling?: boolean
}

// rough.js writes coordinates with 15+ digits; one decimal is a tenth of a pixel or less at every size we draw,
// and it cuts the inline SVG by about two thirds.
const tidy = (d: string) =>
  d
    .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))
    .replace(/, /g, " ")

type Drawable = ReturnType<typeof gen.circle>

function toSvg(drawable: Drawable, pen: Pen) {
  const dash = pen.strokeLineDash
    ? `;stroke-dasharray:${pen.strokeLineDash.join(" ")}`
    : ""
  const scaling = pen.nonScaling ? ";vector-effect:non-scaling-stroke" : ""
  return gen
    .toPaths(drawable)
    .map(
      (p) =>
        `<path d="${tidy(p.d)}" style="stroke:${p.stroke};stroke-width:${p.strokeWidth};fill:${p.fill ?? "none"};stroke-linecap:round;stroke-linejoin:round${dash}${scaling}"/>`,
    )
    .join("")
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- nonScaling is ours, not rough.js's
const opts = ({ nonScaling, ...pen }: Pen) => ({
  roughness: 1.2,
  bowing: 1,
  stroke: "currentColor",
  strokeWidth: 1.6,
  ...pen,
})

type Point = [number, number]

// Inputs are snapped to hundredths before rough.js sees them. JavaScript engines can differ in the last bit of
// Math.sin, Math.cos and similar, and rough.js turns a last-bit difference into a different stroke; snapping keeps
// the same seed drawing the same print on every engine.
const q = (n: number) => Math.round(n * 100) / 100
const qs = (points: Point[]): Point[] => points.map(([x, y]) => [q(x), q(y)])

export const sketch = {
  circle: (x: number, y: number, d: number, pen: Pen) =>
    toSvg(gen.circle(q(x), q(y), q(d), opts(pen)), pen),
  ellipse: (x: number, y: number, w: number, h: number, pen: Pen) =>
    toSvg(gen.ellipse(q(x), q(y), q(w), q(h), opts(pen)), pen),
  rect: (x: number, y: number, w: number, h: number, pen: Pen) =>
    toSvg(gen.rectangle(q(x), q(y), q(w), q(h), opts(pen)), pen),
  line: (x1: number, y1: number, x2: number, y2: number, pen: Pen) =>
    toSvg(gen.line(q(x1), q(y1), q(x2), q(y2), opts(pen)), pen),
  curve: (points: Point[], pen: Pen) =>
    toSvg(gen.curve(qs(points), opts(pen)), pen),
  path: (d: string, pen: Pen) => toSvg(gen.path(d, opts(pen)), pen),
  polygon: (points: Point[], pen: Pen) =>
    toSvg(gen.polygon(qs(points), opts(pen)), pen),

  /** A closed, smooth loop through the points (the curve wraps past its start so the join does not kink). */
  loop: (points: Point[], pen: Pen) =>
    toSvg(gen.curve(qs([...points, ...points.slice(0, 3)]), opts(pen)), pen),

  /** A slightly bent arrow from (x1,y1) to (x2,y2) with an open head. */
  arrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    pen: Pen,
    bend = 0.12,
    head = 9,
  ) {
    const cx = (x1 + x2) / 2 - (y2 - y1) * bend
    const cy = (y1 + y2) / 2 + (x2 - x1) * bend
    const body = toSvg(
      gen.curve(
        [
          [x1, y1],
          [cx, cy],
          [x2, y2],
        ],
        opts(pen),
      ),
      pen,
    )
    const angle = Math.atan2(y2 - cy, x2 - cx)
    const barb = (a: number) =>
      toSvg(
        gen.line(
          x2,
          y2,
          x2 + Math.cos(a) * head,
          y2 + Math.sin(a) * head,
          opts({ ...pen, seed: pen.seed + 1 }),
        ),
        pen,
      )
    return body + barb(angle + Math.PI * 0.82) + barb(angle - Math.PI * 0.82)
  },
}
