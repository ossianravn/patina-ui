"use client"

import * as React from "react"
import { sketch } from "@/patina/ink/rough"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"
import {
  drawMap,
  edgePen,
  MAP_H,
  MAP_W,
  type ConceptEdge,
  type ConceptEdgeType,
  type ConceptNode,
} from "./concept-map-layout"

// A hand-drawn graph of typed connections (Mental Models' ConnectionMap). The centre node sits in a double ring over a
// wash of the drum; the others are serif labels in drawn ellipses or boxes, each leaning by a seeded share of
// --tilt-max. Edges are rough lines whose type shows in a dash pattern, an ink and a mono label, with a legend below.
// A graph does not read at phone width, so a narrow container gets the grouped list instead; that list is also what
// assistive technology reads at every width, and the drawing is hidden from it.

export type { ConceptEdge, ConceptEdgeType, ConceptNode }

export interface ConceptMapProps extends Omit<
  React.ComponentProps<"figure">,
  "children"
> {
  nodes: readonly ConceptNode[]
  edges: readonly ConceptEdge[]
  /** The kinds of connection, in legend order. */
  types: readonly ConceptEdgeType[]
  /** The id of the node the map is about. Defaults to the first node. */
  center?: string
  /** The map's accessible name, e.g. "How the grey heron connects". */
  label: string
  seed?: string | number
}

const sample = (index: number, directed?: boolean) => {
  const { dash, ink } = edgePen(index)
  const pen = { seed: 7 + index, stroke: ink, strokeWidth: 1.6, roughness: 0.7 }
  return (
    sketch.line(2, 5, 34, 5, {
      ...pen,
      ...(dash ? { strokeLineDash: dash } : {}),
    }) +
    (directed
      ? sketch.line(34, 5, 28, 1.5, pen) + sketch.line(34, 5, 28, 8.5, pen)
      : "")
  )
}

function ConceptMap({
  nodes,
  edges,
  types,
  center,
  label,
  seed,
  className,
  ...props
}: ConceptMapProps) {
  const s = useSeed("concept-map", seed ?? label)
  const map = React.useMemo(
    () => drawMap(nodes, edges, types, center, s),
    [nodes, edges, types, center, s],
  )
  const samples = React.useMemo(
    () => types.map((t, i) => sample(i, t.directed)),
    [types],
  )
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const hub = byId.get(center ?? "") ?? nodes[0]
  const groups = types
    .map((type) => ({ type, edges: edges.filter((e) => e.type === type.id) }))
    .filter((g) => g.edges.length > 0)

  return (
    <figure
      data-slot="concept-map"
      aria-label={label}
      className={cn(
        "@container/concept-map m-0 w-full min-w-0 [--concept-map-ground:var(--paper)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="concept-map-graph"
        className="hidden max-w-[46rem] flex-col gap-tight @min-[40rem]/concept-map:flex"
      >
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="block h-auto w-full overflow-visible"
        >
          {map.edges.map((e, i) => (
            <g key={i} dangerouslySetInnerHTML={{ __html: e.svg }} />
          ))}
          {map.edges.map((e, i) =>
            e.label ? (
              <text
                key={i}
                x={e.label.x}
                y={e.label.y + 4}
                textAnchor="middle"
                className="font-label text-[11.5px] font-semibold tracking-[0.06em]"
                style={{
                  fill: "var(--ink-2)",
                  stroke: "var(--concept-map-ground)",
                  strokeWidth: 5,
                  strokeLinejoin: "round",
                  paintOrder: "stroke",
                }}
              >
                {e.label.text}
              </text>
            ) : null,
          )}
          {map.nodes.map((n) => (
            <g
              key={n.id}
              data-hub={n.hub || undefined}
              style={{
                rotate: `calc(var(--tilt-max) * ${n.turn.toFixed(2)})`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            >
              <g dangerouslySetInnerHTML={{ __html: n.outline }} />
              {n.lines.map((line, i) => (
                <text
                  key={i}
                  x={n.x}
                  y={
                    n.y +
                    (n.hub ? 6.5 : 5.5) -
                    ((n.lines.length - 1) * (n.hub ? 22 : 18)) / 2 +
                    i * (n.hub ? 22 : 18)
                  }
                  textAnchor="middle"
                  className={cn(
                    "font-read",
                    n.hub
                      ? "text-[19px] font-bold"
                      : "text-[15px] font-semibold",
                  )}
                  style={{ fill: "var(--ink)" }}
                >
                  {line}
                </text>
              ))}
            </g>
          ))}
        </svg>
        <ul
          data-slot="concept-map-legend"
          className="m-0 flex list-none flex-wrap gap-x-snug gap-y-hair p-0"
        >
          {types.map((type, i) => (
            <li
              key={type.id}
              className="flex items-center gap-hair font-label text-label leading-[1.45] font-medium tracking-[0.06em] text-ink-2 uppercase"
            >
              <svg
                viewBox="0 0 36 10"
                className="h-2.5 w-9 shrink-0 overflow-visible"
                dangerouslySetInnerHTML={{ __html: samples[i]! }}
              />
              {type.label}
            </li>
          ))}
        </ul>
      </div>
      <div
        data-slot="concept-map-list"
        className="sr-only @max-[40rem]/concept-map:not-sr-only @max-[40rem]/concept-map:flex @max-[40rem]/concept-map:flex-col"
      >
        {hub ? (
          <p className="m-0 border-b-[1.5px] border-line pb-hair font-read text-body leading-subhead font-semibold text-ink">
            {hub.label}
          </p>
        ) : null}
        <dl className="m-0">
          {groups.map(({ type, edges: group }) => (
            <div
              key={type.id}
              className="border-b border-dashed border-rule py-tight last:border-b-0"
            >
              <dt className="label-mono text-k-ink">{type.label}</dt>
              <dd className="m-0 mt-1">
                <ul className="m-0 flex list-none flex-wrap p-0 text-ui leading-ui text-ink">
                  {group.map((e, i) => {
                    const from = byId.get(e.from)?.label ?? e.from
                    const to = byId.get(e.to)?.label ?? e.to
                    const other =
                      e.from === hub?.id ? to : e.to === hub?.id ? from : null
                    return (
                      <li
                        key={i}
                        className="after:mx-1.5 after:text-ink-faint after:content-['·'_/_''] last:after:content-none"
                      >
                        {other ?? (
                          <>
                            {from} <span aria-hidden="true">→</span>
                            <span className="sr-only">
                              {(type.short ?? type.label).toLowerCase()}
                            </span>{" "}
                            {to}
                          </>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </figure>
  )
}

export { ConceptMap }
