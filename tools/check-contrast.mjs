// Checks every text ink against every paper surface it can sit on, with the paper composited in: for each stock,
// theme and patina level it stacks the texture layers at their own tile sizes over paper and card, adds half the
// edge toning (text rarely sits in the darkest corner), blurs to about a glyph so single specks average out, and
// measures each pair against the darkest and lightest 1% of the surface. Exits 1 if any pair falls below its floor.
// --ink-faint is left out: it is for disabled text and decoration.
//
//   npm run check:contrast                 check
//   node tools/check-contrast.mjs --suggest   also print, per stock and theme, the drum-to-ink mixes
//                                             that meet each floor on that stock
import { readFileSync } from "node:fs"
import sharp from "sharp"

const STYLES = new URL("../src/patina/styles/", import.meta.url)
const css = ["tokens.css", "stocks.css", "textures.generated.css"].map((f) =>
  readFileSync(new URL(f, STYLES), "utf8"),
)
const SUGGEST = process.argv.includes("--suggest")

const STOCKS = ["archive", "field", "newsprint"]
const THEMES = ["day", "night"]
const SURFACES = ["paper", "card"]
const DRUMS = ["blue", "violet", "pink", "green", "orange", "red"]
const TEXT = ["ink", "ink-2", "ink-3", ...DRUMS.map((d) => `ink-${d}`)]
const LARGE = DRUMS.map((d) => `hand-${d}`) // handwriting is large bold text: 3:1
const MARKS = ["line"] // control borders and pen lines that carry meaning: 3:1
const SIZES = {
  specks: 877,
  fibres: 613,
  tooth: 353,
  relief: 541,
  mottle: 1201,
  foxing: 1613,
}
const LEVELS = {
  handled: {
    layers: ["specks", "fibres", "tooth", "relief", "mottle"],
    tone: 0.07,
  },
  worn: {
    layers: ["foxing", "specks", "fibres", "tooth", "relief", "mottle"],
    tone: 0.16,
  },
}
const CANVAS = 1201
const TONE = [150, 105, 45]

// Top-level rules only; @media blocks (responsive leading) do not hold colours.
function rules(source, order) {
  const out = []
  const text = source.replace(/\/\*[\s\S]*?\*\//g, "")
  let i = 0
  while (i < text.length) {
    const open = text.indexOf("{", i)
    if (open < 0) break
    const selector = text.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (depth && j < text.length)
      ((depth += text[j] === "{" ? 1 : text[j] === "}" ? -1 : 0), j++)
    if (!selector.startsWith("@")) {
      const decls = Object.fromEntries(
        [
          ...text
            .slice(open + 1, j - 1)
            .matchAll(/(--[\w-]+)\s*:\s*((?:url\("[^"]*"\)|[^;])+);/g),
        ].map((m) => [m[1], m[2].trim()]),
      )
      for (const s of selector.split(","))
        out.push({ selector: s.trim(), decls, order: order + out.length })
    }
    i = j
  }
  return out
}

const all = css.flatMap((source, n) => rules(source, n * 10000))

function tokens(stock, theme) {
  const attrs = { "data-stock": stock, "data-theme": theme }
  const matching = all.filter(
    ({ selector }) =>
      selector.startsWith(":root") &&
      [...selector.matchAll(/\[([\w-]+)="([^"]+)"\]/g)].every(
        ([, k, v]) => attrs[k] === v,
      ),
  )
  matching.sort(
    (a, b) =>
      a.selector.split("[").length - b.selector.split("[").length ||
      a.order - b.order,
  )
  const vars = Object.assign({}, ...matching.map((r) => r.decls))
  const resolve = (value, depth = 0) =>
    depth > 8
      ? value
      : value.replace(/var\((--[\w-]+)(?:,[^)]*)?\)/g, (_, name) =>
          resolve(vars[name] ?? "", depth + 1),
        )
  return (name) => resolve(vars[`--${name}`] ?? "")
}

const hex = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16))
const toHex = (rgb) =>
  `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`
const channel = (c) =>
  (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
const svgOf = (url) =>
  Buffer.from(
    decodeURIComponent(
      url.replace(/^url\("data:image\/svg\+xml;utf8,/, "").replace(/"\)$/, ""),
    ),
  )

async function extremes(color, t, level) {
  const [r, g, b] = hex(color)
  const { layers, tone } = LEVELS[level]
  const overlays = []
  for (const name of [...layers].reverse()) {
    const size = SIZES[name]
    const side = Math.min(size, CANVAS)
    const png = await sharp(svgOf(t(`tex-${name}`)))
      .resize(size, size)
      .extract({ left: 0, top: 0, width: side, height: side })
      .png()
      .toBuffer()
    overlays.push({ input: png, tile: true, gravity: "northwest" })
  }
  const toning = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: TONE[0], g: TONE[1], b: TONE[2], alpha: tone / 2 },
    },
  })
    .png()
    .toBuffer()
  const { data, info } = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 3,
      background: { r, g, b },
    },
  })
    .composite([...overlays, { input: toning }])
    .blur(3)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const lum = []
  for (let p = 0; p < data.length; p += info.channels * 3)
    lum.push(luminance([data[p], data[p + 1], data[p + 2]]))
  lum.sort((x, y) => x - y)
  return [
    lum[Math.floor(lum.length * 0.01)],
    lum[Math.floor(lum.length * 0.99)],
  ]
}

let failures = 0
const worst = {} // per stock and theme: the darkest and lightest surface luminance
for (const stock of STOCKS)
  for (const theme of THEMES) {
    const t = tokens(stock, theme)
    const w = (worst[`${stock} ${theme}`] = { dark: 1, light: 0 })
    for (const level of Object.keys(LEVELS)) {
      const notes = []
      let min = Infinity
      for (const surface of SURFACES) {
        const [dark, light] = await extremes(t(surface), t, level)
        w.dark = Math.min(w.dark, dark)
        w.light = Math.max(w.light, light)
        const check = (name, floor) => {
          const l = luminance(hex(t(name)))
          const r = Math.min(ratio(l, dark), ratio(l, light))
          min = Math.min(min, r / floor)
          if (r < floor)
            (failures++,
              notes.push(`${surface}/${name} ${r.toFixed(2)}<${floor}`))
        }
        TEXT.forEach((name) => check(name, 4.5))
        LARGE.forEach((name) => check(name, 3))
        MARKS.forEach((name) => check(name, 3))
      }
      console.log(
        `${stock.padEnd(9)} ${theme.padEnd(5)} ${level.padEnd(7)} ${notes.length ? `FAIL ${notes.join(", ")}` : `ok (closest pair at ${min.toFixed(2)}× its floor)`}`,
      )
    }
  }

if (SUGGEST) {
  // Mix each drum toward the stock's ink until it clears the floor on that stock's worst surface.
  const mixTo = (from, to, key, floor) => {
    const target = key.endsWith("day") ? worst[key].dark : worst[key].light
    const a = hex(from)
    const b = hex(to)
    for (let s = 0; s <= 1; s += 0.005) {
      const c = a.map((v, i) => v + (b[i] - v) * s)
      if (ratio(luminance(c), target) >= floor * 1.02) return toHex(c)
    }
    return to
  }
  for (const stock of STOCKS)
    for (const theme of THEMES) {
      const key = `${stock} ${theme}`
      const t = tokens(stock, theme)
      const lines = [`--ink-3: ${mixTo(t("ink-faint"), t("ink"), key, 4.5)};`]
      for (const d of DRUMS)
        lines.push(`--ink-${d}: ${mixTo(t(`print-${d}`), t("ink"), key, 4.5)};`)
      for (const d of DRUMS)
        lines.push(`--hand-${d}: ${mixTo(t(`print-${d}`), t("ink"), key, 3)};`)
      console.log(`\n${key}:\n  ${lines.join("\n  ")}`)
    }
}

console.log(
  failures
    ? `\n${failures} pairs below their floor`
    : "\nall pairs meet their floor",
)
process.exit(failures ? 1 : 0)
