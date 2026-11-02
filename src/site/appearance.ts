import type { Appearance } from "@/patina/theme"

/**
 * Where the site starts before a visitor chooses: day newsprint, Patina's inks with an oxblood accent, calm, clean
 * and compact. The layouts' pre-paint script and every island that renders appearance on the server use it. The kit's
 * own defaults (defaultAppearance) stay what an install starts from, and the theme studio exports against those.
 */
export const siteAppearance: Appearance = {
  theme: "day",
  stock: "newsprint",
  variation: "calm",
  patina: "clean",
  inks: "patina",
  accent: "red",
  density: "compact",
  face: "serif",
}
