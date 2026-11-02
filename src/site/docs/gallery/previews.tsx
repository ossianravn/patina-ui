import type { ComponentType } from "react"
import { OTHER_PREVIEWS } from "./previews-other"
import { OVERLAY_PREVIEWS } from "./previews-overlays"

// Previews made for the Components index, by demo name, where a demo's first example row would not show the part.
export const PREVIEWS: Record<string, ComponentType> = {
  ...OVERLAY_PREVIEWS,
  ...OTHER_PREVIEWS,
}
