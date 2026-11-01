// Where a concept map's nodes sit and how its edges are drawn: a pure function of the nodes, edges, types and seed,
// so the same map draws the same way on the server and in the browser. Nodes without a position ring the centre,
// grouped by how they connect to it, at seeded angles; overlapping labels are then pushed apart.
import { sketch, type Pen } from "@/patina/ink/rough"
import { fork, stream } from "@/patina/ink/seed"
import { placeLabels } from "./concept-map-labels"

export interface ConceptNode {
  id: string
  label: string
  /** Position across the map, 0 to 1. Omit x and y to let the seed place the node. */
  x?: number
  /** Position down the map, 0 to 1. */
  y?: number
  shape?: "ellipse" | "box"
}

export interface ConceptEdge {
  from: string
  to: string
  /** The id of one of the map's types. */
  type: string
}

export interface ConceptEdgeType {
  id: string
  /** The type's name in the legend and the list ("Feeds on"). */
  label: string
  /** Words on the edge itself; defaults to the label. */
  short?: string
  /** Draw an arrowhead at the `to` end. */
  directed?: boolean
}

export const MAP_W = 680
export const MAP_H = 460

// Each type gets its own pen: a dash pattern first, an ink from the print set second, so types differ without colour.
const DASHES: (number[] | undefined)[] = [
  undefined,
  [9, 6],
  [1.5, 5],
  [12, 5, 2, 5],
  [18, 7],
]
const INKS = [
  "var(--print-line)",
  "var(--print-accent)",
  "var(--print-detail)",
  "var(--ink-2)",
]
export const edgePen = (index: number) => ({
  dash: DASHES[index % DASHES.length],
  ink: INKS[index % INKS.length]!,
})

const r1 = (n: number) => Math.round(n * 10) / 10
type Point = [number, number]

/** One line, or two balanced lines for a long label. */
function wrap(text: string): string[] {
  if (text.length <= 14 || !text.includes(" ")) return [text]
  const words = text.split(" ")
  let best = [text]
  let diff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ")
    const b = words.slice(i).join(" ")
    if (Math.abs(a.length - b.length) < diff)
      [best, diff] = [[a, b], Math.abs(a.length - b.length)]
  }
  return best
}

export interface PlacedNode {
  id: string
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  hub: boolean
  shape: "ellipse" | "box"
  outline: string
  /** A seeded share of --tilt-max, from −2.5 to 2.5. */
  turn: number
}

export interface DrawnEdge {
  svg: string
  /** Where the type's words sit on the edge, or null where there was no clear spot. */
  label: { text: string; x: number; y: number } | null
}

/** Where a ray from a node's centre, heading (dx, dy), leaves its outline, plus a little air. */
function exit(n: PlacedNode, dx: number, dy: number) {
  const a = n.w / 2 + 5
  const b = n.h / 2 + 5
  const k =
    n.shape === "box"
      ? Math.min(a / Math.abs(dx || 1e-6), b / Math.abs(dy || 1e-6))
      : 1 / Math.sqrt((dx / a) * (dx / a) + (dy / b) * (dy / b))
  return [n.x + dx * k, n.y + dy * k] as const
}

export function drawMap(
  nodes: readonly ConceptNode[],
  edges: readonly ConceptEdge[],
  types: readonly ConceptEdgeType[],
  centerId: string | undefined,
  seed: number,
) {
  const hubId = centerId ?? nodes[0]?.id
  const typeIndex = new Map(types.map((t, i) => [t.id, i]))
  const rank = (id: string) => {
    const e =
      edges.find(
        (e) =>
          (e.from === id && e.to === hubId) ||
          (e.to === id && e.from === hubId),
      ) ?? edges.find((e) => e.from === id || e.to === id)
    return e ? (typeIndex.get(e.type) ?? 99) : 99
  }
  const ring = nodes
    .filter((n) => n.id !== hubId && (n.x === undefined || n.y === undefined))
    .sort((a, b) => rank(a.id) - rank(b.id))
  const angle = stream(seed, "layout")
  const start = angle.between(-Math.PI, Math.PI)
  const auto = new Map(
    ring.map((n, i) => {
      const a = start + (i / ring.length) * Math.PI * 2 + angle.signed() * 0.1
      const r = 1 + angle.signed() * 0.06
      return [
        n.id,
        [
          MAP_W / 2 + Math.cos(a) * (MAP_W / 2 - 96) * r,
          MAP_H / 2 + Math.sin(a) * (MAP_H / 2 - 52) * r,
        ],
      ] as const
    }),
  )

  const placed: (PlacedNode & { fixed: boolean })[] = nodes.map((n) => {
    const hub = n.id === hubId
    const lines = wrap(n.label)
    const longest = Math.max(...lines.map((l) => l.length))
    const box = n.shape === "box"
    const w = longest * (hub ? 10 : 8.1) + (hub ? 50 : box ? 26 : 36)
    const h = lines.length * (hub ? 22 : 18) + (hub ? 30 : box ? 16 : 22)
    const given = n.x !== undefined && n.y !== undefined
    const [x, y] = given
      ? [n.x! * MAP_W, n.y! * MAP_H]
      : hub
        ? [MAP_W / 2, MAP_H / 2]
        : auto.get(n.id)!
    return {
      id: n.id,
      x,
      y,
      w,
      h,
      lines,
      hub,
      outline: "",
      turn: stream(fork(seed, n.id), "tilt").signed() * 2.5,
      fixed: given || hub,
      shape: box ? ("box" as const) : ("ellipse" as const),
    }
  })

  // Push overlapping labels apart, then keep every node inside the map. Deterministic: no randomness here.
  // Connected neighbours keep extra room, so the edge between them stays long enough to read.
  const linked = new Set(
    edges.flatMap((e) => [`${e.from}|${e.to}`, `${e.to}|${e.from}`]),
  )
  for (let pass = 0; pass < 60; pass++) {
    for (let i = 0; i < placed.length; i++)
      for (let j = i + 1; j < placed.length; j++) {
        const a = placed[i]!
        const b = placed[j]!
        const air = linked.has(`${a.id}|${b.id}`) ? 2.5 : 1
        const ox = (a.w + b.w) / 2 + 28 * air - Math.abs(a.x - b.x)
        const oy = (a.h + b.h) / 2 + 14 * air - Math.abs(a.y - b.y)
        if (ox <= 0 || oy <= 0 || (a.fixed && b.fixed)) continue
        const share = a.fixed || b.fixed ? 1 : 0.5
        const horizontal = ox / (a.w + b.w) < oy / (a.h + b.h)
        const push = (horizontal ? ox : oy) * share
        const sign = (horizontal ? a.x - b.x : a.y - b.y) >= 0 ? 1 : -1
        const key = horizontal ? "x" : "y"
        if (!a.fixed) a[key] += push * sign
        if (!b.fixed) b[key] -= push * sign
      }
    for (const n of placed) {
      n.x = Math.min(MAP_W - n.w / 2 - 4, Math.max(n.w / 2 + 4, n.x))
      n.y = Math.min(MAP_H - n.h / 2 - 4, Math.max(n.h / 2 + 4, n.y))
    }
  }

  const ground = "var(--concept-map-ground)"
  for (const n of placed) {
    n.x = r1(n.x)
    n.y = r1(n.y)
    const s = fork(seed, `node:${n.id}`)
    const pen: Pen = {
      seed: s,
      stroke: "var(--line)",
      strokeWidth: 1.3,
      roughness: 1.1,
      fill: ground,
      fillStyle: "solid",
    }
    n.outline = n.hub
      ? sketch.ellipse(n.x, n.y, n.w - 8, n.h - 6, {
          seed: s + 3,
          stroke: "none",
          fill: "color-mix(in srgb, var(--k) var(--wash-alpha), var(--concept-map-ground))",
          fillStyle: "solid",
        }) +
        sketch.ellipse(n.x, n.y, n.w, n.h, {
          seed: s,
          stroke: "var(--k)",
          strokeWidth: 2.2,
          roughness: 1.3,
        }) +
        sketch.ellipse(n.x + 2, n.y - 1, n.w - 6, n.h - 4, {
          seed: s + 2,
          stroke: "var(--k)",
          strokeWidth: 1,
          roughness: 1.6,
        })
      : n.shape === "box"
        ? sketch.rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, {
            ...pen,
            roughness: 0.9,
          })
        : sketch.ellipse(n.x, n.y, n.w, n.h, pen)
  }

  const byId = new Map(placed.map((n) => [n.id, n]))
  const drawn: { svg: string; text: string; path: [Point, Point, Point] }[] = []
  edges.forEach((e, i) => {
    const a = byId.get(e.from)
    const b = byId.get(e.to)
    const index = typeIndex.get(e.type)
    if (!a || !b || index === undefined) return
    const type = types[index]!
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const dx = (b.x - a.x) / len
    const dy = (b.y - a.y) / len
    const [sx, sy] = exit(a, dx, dy)
    const [ex, ey] = exit(b, -dx, -dy)
    const s = fork(seed, `edge:${i}:${e.from}:${e.to}`)
    const bend = stream(s, "bend").signed() * 0.1 * len
    const mx = r1((sx + ex) / 2 - dy * bend)
    const my = r1((sy + ey) / 2 + dx * bend)
    const { dash, ink } = edgePen(index)
    const pen: Pen = { seed: s, stroke: ink, strokeWidth: 1.6, roughness: 1 }
    let svg = sketch.curve(
      [
        [sx, sy],
        [mx, my],
        [ex, ey],
      ],
      { ...pen, ...(dash ? { strokeLineDash: dash } : {}) },
    )
    if (type.directed) {
      const head = Math.atan2(ey - my, ex - mx)
      for (const side of [0.82, -0.82])
        svg += sketch.line(
          ex,
          ey,
          ex + Math.cos(head + Math.PI * side) * 9,
          ey + Math.sin(head + Math.PI * side) * 9,
          { ...pen, seed: s + (side > 0 ? 1 : 2) },
        )
    }
    drawn.push({
      svg,
      text: (type.short ?? type.label).toUpperCase(),
      path: [
        [sx, sy],
        [mx, my],
        [ex, ey],
      ],
    })
  })

  const spots = placeLabels(drawn, placed)
  const lines: DrawnEdge[] = drawn.map((e, i) => {
    const spot = spots[i]
    return { svg: e.svg, label: spot ? { text: e.text, ...spot } : null }
  })
  return { nodes: placed, edges: lines }
}
