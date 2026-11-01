"use client"

import { useId, useMemo, type ComponentProps, type CSSProperties } from "react"
import { sketch, type Pen } from "@/patina/ink/rough"
import { fork, stream } from "@/patina/ink/seed"
import { cn } from "@/patina/lib/utils"
import { useSeed } from "@/patina/print/seed-scope"

// A circular dated cancellation mark: two rough rings with the place set round the top and the date round the bottom
// in mono, a small star at the centre, and wavy cancellation lines running off to the side. It prints in the region's
// text ink, multiplied into the paper (screened at night), with a faint second impression a little out of register
// by --misregister. Its seed draws the strokes and turns it a few degrees at the lively level; calm sets it straight.

const R = 60 // centre of the ring, in viewBox units
const WIDE = 286 // viewBox width with cancellation lines
const FONT = 10.5
const SPACING = 1.3

type Drum = "blue" | "pink" | "green" | "orange" | "violet"

export interface PostmarkProps extends Omit<ComponentProps<"svg">, "children"> {
  place: string
  /** The date as it should be struck, such as "14 NOV 2026". */
  date: string
  /** The ring's diameter in pixels. */
  size?: number
  /** Wavy cancellation lines beside the ring. */
  lines?: boolean
  /** Re-inks the mark in one drum; it follows the region's ink otherwise. */
  ink?: Drum
  /** Same seed, same strokes and turn. Defaults to the place and date. */
  seed?: string | number
  /** The accessible name; defaults to "Postmark, <place>, <date>". */
  label?: string
}

const pen = (seed: number, extra: Partial<Pen> = {}): Pen => ({
  seed,
  stroke: "currentColor",
  strokeWidth: 2,
  roughness: 0.9,
  bowing: 0.6,
  ...extra,
})

/** Rings, separators, the centre star and the cancellation lines, as SVG paths. */
function strike(s: number, lines: boolean) {
  const at = stream(s, "postmark")
  const parts = [
    sketch.circle(R, R, 112, pen(fork(s, "outer"), { strokeWidth: 2.4 })),
    sketch.circle(R, R, 74, pen(fork(s, "inner"), { strokeWidth: 1.4 })),
    sketch.circle(R - 46.5, R, 3.2, dot(fork(s, "left"))),
    sketch.circle(R + 46.5, R, 3.2, dot(fork(s, "right"))),
    sketch.polygon(
      Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2
        const r = i % 2 ? 4 : 9.5
        return [R + Math.cos(a) * r, R + 1 + Math.sin(a) * r] as [
          number,
          number,
        ]
      }),
      pen(fork(s, "star"), { strokeWidth: 1.5, roughness: 0.6 }),
    ),
  ]
  if (lines) {
    // Parallel waves, as cut in one die; each starts just clear of the outer ring.
    const phase = at.between(0, Math.PI * 2)
    const wave = at.between(28, 34)
    for (let i = 0; i < 5; i++) {
      const y = R + (i - 2) * 12.5
      const x0 = R + Math.sqrt(58 * 58 - (y - R) * (y - R)) + 5
      const x1 = WIDE - 4 - at.between(0, 14)
      const points: [number, number][] = []
      for (let x = x0; x < x1; x += 5)
        points.push([
          x,
          y + Math.sin(((x - R) / wave) * Math.PI * 2 + phase) * 3.4,
        ])
      parts.push(sketch.curve(points, pen(fork(s, `line:${i}`))))
    }
  }
  return parts.join("")
}

const dot = (seed: number): Pen => ({
  seed,
  stroke: "currentColor",
  strokeWidth: 1,
  fill: "currentColor",
  fillStyle: "solid",
  roughness: 0.4,
})

/** Squeezes text that would run too far round the ring. */
const fit = (text: string, max: number) =>
  text.length * (FONT * 0.6 + SPACING) > max
    ? { textLength: max, lengthAdjust: "spacingAndGlyphs" as const }
    : {}

/** A circular dated cancellation mark with wavy lines. */
export function Postmark({
  place,
  date,
  size = 112,
  lines = true,
  ink,
  seed,
  label,
  className,
  style,
  ...props
}: PostmarkProps) {
  const s = useSeed("postmark", seed ?? `${place}:${date}`)
  const id = `postmark${useId().replace(/[^\w-]/g, "")}`
  const drawing = useMemo(() => strike(s, lines), [s, lines])
  const drift = stream(s, "register")
  const width = lines ? WIDE : 120
  const vars = {
    "--postmark-turn": stream(s, "turn").signed().toFixed(2),
  } as CSSProperties
  const type = {
    fontFamily: "var(--face-label)",
    fontSize: FONT,
    fontWeight: 700,
    letterSpacing: SPACING,
  }

  return (
    <svg
      data-slot="postmark"
      data-ink={ink}
      role="img"
      aria-label={label ?? `Postmark, ${place}, ${date}`}
      viewBox={`0 0 ${width} 120`}
      width={(size * width) / 120}
      height={size}
      className={cn(
        "inline-block shrink-0 overflow-visible text-k-ink opacity-90 mix-blend-multiply night:mix-blend-screen",
        "[rotate:calc(var(--tilt-max)*var(--postmark-turn)*5)]",
        className,
      )}
      style={{ ...vars, ...style }}
      {...props}
    >
      <defs>
        <path id={`${id}-top`} d="M 17.5 60 A 42.5 42.5 0 0 1 102.5 60" />
        <path id={`${id}-bottom`} d="M 10 60 A 50 50 0 0 0 110 60" />
      </defs>
      <g id={`${id}-ink`} filter="url(#patina-ink)">
        <g dangerouslySetInnerHTML={{ __html: drawing }} />
        <text fill="currentColor" style={type}>
          <textPath
            href={`#${id}-top`}
            startOffset="50%"
            textAnchor="middle"
            {...fit(place, 104)}
          >
            {place.toUpperCase()}
          </textPath>
        </text>
        <text fill="currentColor" style={type}>
          <textPath
            href={`#${id}-bottom`}
            startOffset="50%"
            textAnchor="middle"
            {...fit(date, 118)}
          >
            {date.toUpperCase()}
          </textPath>
        </text>
      </g>
      {/* A faint second impression, out of register by the variation level's --misregister. */}
      <use
        href={`#${id}-ink`}
        opacity={0.22}
        style={{
          translate: `calc(var(--misregister) * ${drift.signed().toFixed(2)}) calc(var(--misregister) * ${drift.signed().toFixed(2)})`,
        }}
      />
    </svg>
  )
}
