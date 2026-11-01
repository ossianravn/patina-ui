// Where each edge's mono label goes in a concept map: the middle of its edge when that spot is clear of nodes and
// earlier labels, else a little to either side, else nowhere, since the line's dash, its ink and the legend still name
// the type. Deterministic: labels are placed in edge order.

type Point = readonly [number, number]

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

const r1 = (n: number) => Math.round(n * 10) / 10
const along = (a: Point, b: Point, u: number) =>
  [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u] as const

export function placeLabels(
  edges: readonly { text: string; path: readonly [Point, Point, Point] }[],
  nodes: readonly Box[],
): (Box | null)[] {
  const taken: Box[] = nodes.map((n) => ({ ...n, w: n.w + 6, h: n.h + 4 }))
  return edges.map(({ text, path: [start, mid, end] }) => {
    // JetBrains Mono at 11.5px with 0.06em tracking is about 7.6px a character.
    const w = text.length * 7.6 + 8
    const h = 15
    for (const t of [0.5, 0.4, 0.6, 0.3, 0.7]) {
      const [x, y] =
        t <= 0.5 ? along(start, mid, t * 2) : along(mid, end, (t - 0.5) * 2)
      const clear = taken.every(
        (o) =>
          Math.abs(o.x - x) * 2 >= o.w + w || Math.abs(o.y - y) * 2 >= o.h + h,
      )
      if (clear) {
        const box = { x: r1(x), y: r1(y), w, h }
        taken.push(box)
        return box
      }
    }
    return null
  })
}
