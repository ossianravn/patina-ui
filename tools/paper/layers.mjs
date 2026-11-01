// Paper layers as seamless SVG tiles. Each layer has its own tile size, and the sizes share no factors, so the
// stacked paper never shows a repeat. Neutral layers (relief, fibres, foxing) draw light and dark at low alpha and
// work on any stock; tinted layers (mottle, specks) take the stock's colour.

const enc = (svg) =>
  `url("data:image/svg+xml;utf8,${svg.replace(/[%#<>"]/g, (c) => encodeURIComponent(c))}")`
const tile = (size, body) =>
  enc(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${body}</svg>`,
  )
const r1 = (n) => Math.round(n * 10) / 10

export function prng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const filter = (id, body) =>
  `<filter id='${id}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>${body}</filter><rect width='100%' height='100%' filter='url(#${id})'/>`
const turbulence = (freq, octaves, seed) =>
  `<feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='${octaves}' seed='${seed}' stitchTiles='stitch'/>`

/** Relief: noise as a height map, embossed with wrapped edges (no seams) into highlights and shadows. */
export function relief(size, freq, seed, depth, shade = [0.25, 0.19, 0.11]) {
  const emboss = `${turbulence(freq, 3, seed)}<feColorMatrix values='0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1'/><feConvolveMatrix order='3' kernelMatrix='-2 -1 0 -1 0 1 0 1 2' divisor='1' bias='0.5' edgeMode='wrap' preserveAlpha='true'/>`
  const light = `${emboss}<feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 0.97  ${depth} 0 0 0 ${-depth * 0.5}'/>`
  const dark = `${emboss}<feColorMatrix values='0 0 0 0 ${shade[0]}  0 0 0 0 ${shade[1]}  0 0 0 0 ${shade[2]}  ${-depth} 0 0 0 ${depth * 0.5}'/>`
  return tile(size, filter("l", light) + filter("d", dark))
}

/** Fibres: short curved strands at seeded places and angles, drawn again across the edges so the tile wraps. */
export function fibres(size, count, seed, palette) {
  const r = prng(seed)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = r() * size
    const y = r() * size
    const a = r() * Math.PI * 2
    const len = 5 + r() ** 2 * 22
    const bend = (r() - 0.5) * len * 0.6
    const [color, alpha] = palette[Math.floor(r() * palette.length)]
    const ex = x + Math.cos(a) * len
    const ey = y + Math.sin(a) * len
    const cx = (x + ex) / 2 - Math.sin(a) * bend
    const cy = (y + ey) / 2 + Math.cos(a) * bend
    const style = `stroke='${color}' stroke-opacity='${Math.round(alpha * (0.5 + r() * 0.5) * 100) / 100}' stroke-width='${r1(0.35 + r() * 0.55)}'`
    for (const dx of [-size, 0, size])
      for (const dy of [-size, 0, size]) {
        const outside =
          Math.max(x, ex) + dx < -2 ||
          Math.min(x, ex) + dx > size + 2 ||
          Math.max(y, ey) + dy < -2 ||
          Math.min(y, ey) + dy > size + 2
        if (!outside)
          out.push(
            `<path d='M${r1(x + dx)} ${r1(y + dy)}Q${r1(cx + dx)} ${r1(cy + dy)} ${r1(ex + dx)} ${r1(ey + dy)}' ${style}/>`,
          )
      }
  }
  return tile(size, `<g fill='none' stroke-linecap='round'>${out.join("")}</g>`)
}

/** Tinted noise: alpha = a × noise + b, so low frequencies mottle and a steep slope keeps only rare specks. */
export function tinted(size, freq, octaves, seed, rgb, a, b) {
  return tile(
    size,
    filter(
      "n",
      `${turbulence(freq, octaves, seed)}<feColorMatrix values='0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  ${a} 0 0 0 ${b}'/>`,
    ),
  )
}

/** Foxing: sparse clusters of soft brown spots with ragged edges, for worn paper. */
export function foxing(size, seed, rgb, strength) {
  const r = prng(seed)
  const spots = []
  for (let c = 0; c < 5; c++) {
    const cx = r() * size
    const cy = r() * size
    const n = 3 + Math.floor(r() * 10)
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2
      const d = r() ** 1.6 * 34
      const x = (cx + Math.cos(a) * d + size) % size
      const y = (cy + Math.sin(a) * d * 1.3 + size) % size
      spots.push(
        `<circle cx='${r1(x)}' cy='${r1(y)}' r='${r1(0.7 + r() ** 2 * 3.6)}' opacity='${r1((0.12 + r() * 0.25) * strength * 10) / 10}'/>`,
      )
    }
  }
  const ragged = `<filter id='f' x='-5%' y='-5%' width='110%' height='110%'><feTurbulence type='fractalNoise' baseFrequency='0.2' numOctaves='2' seed='${seed % 997}'/><feDisplacementMap in='SourceGraphic' scale='4' xChannelSelector='R' yChannelSelector='G'/><feGaussianBlur stdDeviation='0.7'/></filter>`
  return tile(
    size,
    `${ragged}<g filter='url(#f)' fill='rgb(${rgb.join(" ")})'>${spots.join("")}</g>`,
  )
}
