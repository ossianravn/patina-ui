// Seeded 2D value noise for flow fields and wobbly contours: a lattice of random values, smoothly interpolated.
import { prng } from "./seed"

const SIZE = 16

export function valueNoise(seed: number, scale: number) {
  const next = prng(seed)
  const lattice = Array.from({ length: SIZE * SIZE }, () => next())
  const at = (x: number, y: number) =>
    lattice[
      (((y % SIZE) + SIZE) % SIZE) * SIZE + (((x % SIZE) + SIZE) % SIZE)
    ] ?? 0
  const smooth = (t: number) => t * t * (3 - 2 * t)
  /** Noise in [0, 1) at a point; `scale` is the lattice spacing in drawing units. */
  return (px: number, py: number) => {
    const x = px / scale
    const y = py / scale
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = smooth(x - x0)
    const ty = smooth(y - y0)
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx
    return top + (bottom - top) * ty
  }
}
