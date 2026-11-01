// Checks every text ink against every paper surface it can sit on, with the grain composited in: for each stock,
// theme and patina level it renders the texture over paper and card, blurs it to text scale, and measures the
// pair against the darkest and lightest 1% of the surface, blurred to about a glyph so single specks average out.
// Exits 1 if any pair falls below its floor. --ink-faint is left out: it is for disabled text and decoration.
// Run: npm run check:contrast
import { readFileSync } from "node:fs"
import sharp from "sharp"

const STYLES = new URL("../src/patina/styles/", import.meta.url)
const css = ["tokens.css", "stocks.css", "textures.generated.css"].map((f) =>
  readFileSync(new URL(f, STYLES), "utf8"),
)

const STOCKS = ["field", "newsprint"]
const THEMES = ["day", "night"]
const SURFACES = ["paper", "card"]
const TEXT = [
  "ink",
  "ink-2",
  "ink-3",
  "ink-blue",
  "ink-violet",
  "ink-pink",
  "ink-green",
  "ink-orange",
  "ink-red",
]
const LARGE = [
  "hand-blue",
  "hand-violet",
  "hand-pink",
  "hand-green",
  "hand-orange",
  "hand-red",
] // large bold text: 3:1
const MARKS = ["line"] // control borders and pen lines that carry meaning: 3:1
const TILE = 480

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
      const body = text.slice(open + 1, j - 1)
      const decls = Object.fromEntries(
        [...body.matchAll(/(--[\w-]+)\s*:\s*((?:url\("[^"]*"\)|[^;])+);/g)].map(
          (m) => [m[1], m[2].trim()],
        ),
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
  const matching = all.filter(({ selector }) => {
    if (!selector.startsWith(":root")) return false
    return [...selector.matchAll(/\[([\w-]+)="([^"]+)"\]/g)].every(
      ([, k, v]) =>
        attrs[k] === v ||
        (k === "data-stock" && v === "field" && stock === "field"),
    )
  })
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

async function extremes(color, layers) {
  const [r, g, b] = hex(color)
  const overlays = await Promise.all(
    layers.map(async (url) => ({
      input: await sharp(svgOf(url)).png().toBuffer(),
    })),
  )
  const { data, info } = await sharp({
    create: { width: TILE, height: TILE, channels: 3, background: { r, g, b } },
  })
    .composite(overlays)
    .blur(3)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const lum = []
  for (let p = 0; p < data.length; p += info.channels)
    lum.push(luminance([data[p], data[p + 1], data[p + 2]]))
  lum.sort((x, y) => x - y)
  return [
    lum[Math.floor(lum.length * 0.01)],
    lum[Math.floor(lum.length * 0.99)],
  ]
}

let failures = 0
for (const stock of STOCKS)
  for (const theme of THEMES) {
    const t = tokens(stock, theme)
    for (const patina of ["handled", "worn"]) {
      const layers =
        patina === "worn"
          ? [t("paper-grain"), t("paper-wear")]
          : [t("paper-grain")]
      const rows = []
      for (const surface of SURFACES) {
        const [dark, light] = await extremes(t(surface), layers)
        const check = (name, floor) => {
          const l = luminance(hex(t(name)))
          const worst = Math.min(ratio(l, dark), ratio(l, light))
          if (worst < floor) failures++
          rows.push(
            `${surface}/${name} ${worst.toFixed(2)}${worst < floor ? ` FAIL<${floor}` : ""}`,
          )
        }
        TEXT.forEach((name) => check(name, 4.5))
        LARGE.forEach((name) => check(name, 3))
        MARKS.forEach((name) => check(name, 3))
      }
      console.log(`${stock} ${theme} ${patina}\n  ${rows.join("\n  ")}`)
    }
  }
console.log(
  failures
    ? `\n${failures} pairs below their floor`
    : "\nall pairs meet their floor",
)
process.exit(failures ? 1 : 0)
