// SVG filters that make clean geometry look printed and drawn. Shared filters live once in the document
// (PatinaDefs); grain filters are per print. Values come from Mental Models' Base.astro and riso.ts.

/** How many wobble variants exist per level; a component picks one from its seed. */
export const ROUGH_VARIANTS = 6

/** Displacement filter for wobbly pen lines. Lively variants wobble about three times as far as calm ones. */
export function roughFilter(
  id: string,
  variant: number,
  level: "calm" | "lively",
) {
  const frequency = (0.018 + (variant % 3) * 0.006).toFixed(3)
  const scale =
    level === "lively" ? 3.4 + (variant % 4) * 0.4 : 1.1 + (variant % 3) * 0.25
  return `<filter id="${id}" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${variant * 7 + 4}"/><feDisplacementMap in="SourceGraphic" scale="${scale.toFixed(2)}" xChannelSelector="R" yChannelSelector="G"/></filter>`
}

/** Rough edges plus starved-ink speckle, for riso-style ink. Put inside <defs>. */
export function grainFilter(id: string, seed: number, edge = 2.2, speckle = 1) {
  return `<filter id="${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${seed % 1000}" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="${edge}" xChannelSelector="R" yChannelSelector="G" result="rough"/><feTurbulence type="fractalNoise" baseFrequency="${0.9 * speckle}" numOctaves="1" seed="${(seed + 7) % 1000}" result="speck"/><feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.7 0 0 0 1.62" result="mask"/><feComposite in="rough" in2="mask" operator="in"/></filter>`
}

/** Watercolour wash: a heavily displaced, softened and grained blob. */
export function washFilter(id: string) {
  return `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="1.2" result="b"/><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="2" result="grain"/><feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 0 0 0 1.25" result="gm"/><feComposite in="b" in2="gm" operator="in"/></filter>`
}

/** Every shared filter, as one string for a hidden <svg>. */
export function sharedFilters() {
  const rough = Array.from({ length: ROUGH_VARIANTS }, (_, i) =>
    [
      roughFilter(`patina-rough-${i + 1}`, i, "lively"),
      roughFilter(`patina-rough-calm-${i + 1}`, i, "calm"),
    ].join(""),
  ).join("")
  return (
    rough + grainFilter("patina-ink", 3, 1.4, 1.3) + washFilter("patina-wash")
  )
}
