"use client"

import * as React from "react"
import rough from "roughjs"
import {
  Sector,
  type BarShapeProps,
  type CurveProps,
  type PieSectorShapeProps,
} from "recharts"
import { seedOf } from "@/patina/ink/seed"

// Drawn data marks. rough.js redraws each stroke as two loose pen passes with preserveVertices, so every vertex (a
// data point, a bar's corner) stays exactly where Recharts put it and only the stretch between two vertices wobbles,
// by under a pixel at this roughness. Fills stay exact geometry. Seeds come from the series and its data, never
// from layout, and inputs are snapped to hundredths as in ink/rough, so server and browser draw the same strokes.

type Point = [number, number]
type Op = { op: "move" | "lineTo" | "bcurveTo"; data: number[] }

const gen = rough.generator()
const PEN = {
  roughness: 0.5,
  bowing: 0.6,
  maxRandomnessOffset: 2,
  preserveVertices: true,
  stroke: "currentColor",
  strokeWidth: 1.5,
}
const q = (n: number) => Math.round(n * 100) / 100
const tenth = (n: number) => Math.round(n * 10) / 10

// Recharts re-renders shapes on hover and while animating; a small cache keeps a redraw of the same geometry free.
const cache = new Map<string, Op[]>()
function roughOps(d: string, seed: number): Op[] {
  const key = `${seed}|${d}`
  let ops = cache.get(key)
  if (!ops) {
    const drawable = gen.path(d, { ...PEN, seed: seed || 1 })
    ops = drawable.sets.flatMap((set) => set.ops as Op[])
    cache.set(key, ops)
    if (cache.size > 400) cache.delete(cache.keys().next().value as string)
  }
  return ops
}

function opsToPath(ops: Op[]) {
  return ops
    .map(({ op, data }) => {
      const n = data.map(tenth).join(" ")
      return op === "move" ? `M${n}` : op === "lineTo" ? `L${n}` : `C${n}`
    })
    .join("")
}

/** The ink a drawn outline takes: an explicit stroke, else the colour of the series whose hatch fills it. */
function inkOf(fill: unknown, stroke: unknown, key: unknown) {
  if (typeof stroke === "string" && stroke !== "none" && stroke !== "#fff")
    return stroke
  const hatch = typeof fill === "string" && fill.match(/--hatch-([\w-]+)/)
  if (hatch) return `var(--color-${hatch[1]})`
  if (typeof key === "string") return `var(--color-${key}, var(--ink))`
  return typeof fill === "string" ? fill : "var(--ink)"
}

// ---- Curves -------------------------------------------------------------------------------------------------------

type CurveFactory = Extract<
  NonNullable<CurveProps["type"]>,
  (...args: never[]) => unknown
>
type CurveContext = Parameters<CurveFactory>[0]
type Segment = { to: Point; c1?: Point; c2?: Point }

// d3's monotoneX tangents, so a drawn line and its area follow the same curve and never overshoot the data.
function slope3([x0, y0]: Point, [x1, y1]: Point, [x2, y2]: Point) {
  const h0 = x1 - x0
  const h1 = x2 - x1
  const s0 = (y1 - y0) / (h0 || (h1 < 0 ? -0 : 0))
  const s1 = (y2 - y1) / (h1 || (h0 < 0 ? -0 : 0))
  const p = (s0 * h1 + s1 * h0) / (h0 + h1)
  const sign = (v: number) => (v < 0 ? -1 : 1)
  return (
    (sign(s0) + sign(s1)) *
      Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
  )
}
function slope2([x0, y0]: Point, [x1, y1]: Point, t: number) {
  const h = x1 - x0
  return h ? ((3 * (y1 - y0)) / h - t) / 2 : t
}

function segments(points: Point[], interpolation: "monotone" | "linear") {
  const n = points.length
  if (interpolation === "linear" || n < 3)
    return points.slice(1).map((to): Segment => ({ to }))
  const t: number[] = new Array(n).fill(0)
  for (let i = 1; i < n - 1; i++)
    t[i] = slope3(points[i - 1]!, points[i]!, points[i + 1]!)
  t[0] = slope2(points[0]!, points[1]!, t[1]!)
  t[n - 1] = slope2(points[n - 2]!, points[n - 1]!, t[n - 2]!)
  return points.slice(1).map((to, i): Segment => {
    const [x0, y0] = points[i]!
    const [x1, y1] = to
    const dx = (x1 - x0) / 3
    return {
      c1: [x0 + dx, y0 + dx * t[i]!],
      c2: [x1 - dx, y1 - dx * t[i + 1]!],
      to,
    }
  })
}

function trace(
  ctx: CurveContext,
  start: Point,
  segs: Segment[],
  join: boolean,
) {
  if (join) ctx.lineTo(...start)
  else ctx.moveTo(...start)
  for (const { c1, c2, to } of segs) {
    if (c1 && c2) ctx.bezierCurveTo(...c1, ...c2, ...to)
    else ctx.lineTo(...to)
  }
}

function draw(ctx: CurveContext, start: Point, segs: Segment[], seed: number) {
  if (!segs.length) {
    ctx.moveTo(...start)
    ctx.closePath()
    return
  }
  const p = ([x, y]: Point) => `${q(x)} ${q(y)}`
  const d =
    `M${p(start)}` +
    segs
      .map(({ c1, c2, to }) =>
        c1 && c2 ? `C${p(c1)} ${p(c2)} ${p(to)}` : `L${p(to)}`,
      )
      .join("")
  for (const { op, data } of roughOps(d, seed)) {
    const [a = 0, b = 0, c = 0, e = 0, f = 0, g = 0] = data.map(tenth)
    if (op === "move") ctx.moveTo(a, b)
    else if (op === "lineTo") ctx.lineTo(a, b)
    else ctx.bezierCurveTo(a, b, c, e, f, g)
  }
}

/**
 * A curve for `<Line type>` and `<Area type>` whose stroke looks drawn: two pen passes through the exact data
 * points. An area's fill keeps the plain curve, so fill and stroke meet. Horizontal layouts.
 */
export function drawnCurve(
  interpolation: "monotone" | "linear" = "monotone",
  seed: string | number = "chart",
): CurveFactory {
  const s = seedOf(seed) || 1
  return (context: CurveContext) => {
    let inArea = false
    let closing = false
    let points: Point[] = []
    return {
      areaStart() {
        inArea = true
        closing = false
      },
      areaEnd() {
        inArea = false
      },
      lineStart() {
        points = []
      },
      point(x: number, y: number) {
        const last = points[points.length - 1]
        if (!last || last[0] !== +x || last[1] !== +y) points.push([+x, +y])
      },
      lineEnd() {
        const [start] = points
        if (start && inArea) {
          trace(context, start, segments(points, interpolation), closing)
          if (closing) context.closePath()
        } else if (start) {
          draw(context, start, segments(points, interpolation), s)
        }
        if (inArea) closing = !closing
      },
    }
  }
}

// ---- Bars and slices ----------------------------------------------------------------------------------------------

function DrawnBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill,
  stroke,
  dataKey,
  index,
  value,
}: BarShapeProps & { dataKey?: unknown }) {
  const x0 = Math.min(x, x + width)
  const y0 = Math.min(y, y + height)
  const w = Math.abs(width)
  const h = Math.abs(height)
  const seed = seedOf(`${String(dataKey)}:${index}:${String(value)}`)
  const d = React.useMemo(() => {
    if (w < 1 || h < 1) return null
    const [l, t, r, b] = [q(x0), q(y0), q(x0 + w), q(y0 + h)]
    return opsToPath(
      roughOps(`M${l} ${t}L${r} ${t}L${r} ${b}L${l} ${b}Z`, seed),
    )
  }, [x0, y0, w, h, seed])
  return (
    <g className="patina-chart-bar">
      <rect x={x0} y={y0} width={w} height={h} fill={fill} />
      {d && (
        <path
          d={d}
          fill="none"
          stroke={inkOf(fill, stroke, dataKey)}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  )
}

/** A bar for `<Bar shape>`: the exact rectangle in its fill, outlined by a drawn pen line. */
export function drawnBar(props: BarShapeProps) {
  return <DrawnBar {...props} />
}

const RADIAN = Math.PI / 180
function polar(cx: number, cy: number, r: number, angle: number): string {
  return `${q(cx + Math.cos(-RADIAN * angle) * r)} ${q(cy + Math.sin(-RADIAN * angle) * r)}`
}

function DrawnSector(props: PieSectorShapeProps) {
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0 } = props
  const { startAngle = 0, endAngle = 0, fill, stroke, name, value } = props
  const seed = seedOf(`${String(name)}:${String(value)}`)
  const d = React.useMemo(() => {
    const delta =
      Math.sign(endAngle - startAngle) *
      Math.min(Math.abs(endAngle - startAngle), 359.999)
    const end = startAngle + delta
    if (Math.abs(delta) < 0.5 || outerRadius < 1) return null
    const large = Math.abs(delta) > 180 ? 1 : 0
    const ro = q(outerRadius)
    let path = `M${polar(cx, cy, ro, startAngle)}A${ro} ${ro} 0 ${large} ${+(startAngle > end)} ${polar(cx, cy, ro, end)}`
    if (innerRadius > 0) {
      const ri = q(innerRadius)
      path += `L${polar(cx, cy, ri, end)}A${ri} ${ri} 0 ${large} ${+(startAngle <= end)} ${polar(cx, cy, ri, startAngle)}Z`
    } else path += `L${q(cx)} ${q(cy)}Z`
    return opsToPath(roughOps(path, seed))
  }, [cx, cy, innerRadius, outerRadius, startAngle, endAngle, seed])
  return (
    <g className="patina-chart-sector">
      <Sector {...props} stroke="none" />
      {d && (
        <path
          d={d}
          fill="none"
          stroke={inkOf(fill, stroke, undefined)}
          strokeWidth={props.isActive ? 2.25 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </g>
  )
}

/** A slice for `<Pie shape>`: the exact sector in its fill, outlined by a drawn pen line, heavier when active. */
export function drawnSector(props: PieSectorShapeProps) {
  return <DrawnSector {...props} />
}
