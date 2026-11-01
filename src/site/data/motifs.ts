import type { MotifName } from "@/patina/ink"

/** What each motif pictures and what it suits, for the gallery and the Press. */
export const MOTIF_INFO: Record<MotifName, { picture: string; suits: string }> =
  {
    rings: {
      picture: "Concentric rings narrowing to a pit",
      suits: "Warnings, traps, focus",
    },
    lens: {
      picture: "A lens on crosshair guides",
      suits: "Tools, search, inspection",
    },
    orbits: {
      picture: "Two orbits and a drifting body",
      suits: "Systems, cycles, sync",
    },
    constellation: {
      picture: "Linked nodes, one ringed",
      suits: "Concepts, networks, teams",
    },
    contours: {
      picture: "Contour lines and a route to the top",
      suits: "Maps, places, progress",
    },
    halftone: {
      picture: "Two halftone screens in moiré",
      suits: "Covers, heroes, backgrounds",
    },
    flow: {
      picture: "Streamlines through a noise field",
      suits: "Movement, data, weather",
    },
    horizon: {
      picture: "A disc over horizon bands",
      suits: "Covers, onboarding, travel",
    },
    sprig: {
      picture: "A stem with leaves and berries",
      suits: "Growth, nature, notes",
    },
    blocks: {
      picture: "Stacked letterpress offcuts",
      suits: "Products, storage, building",
    },
    scatter: {
      picture: "Small shapes spaced apart",
      suits: "Celebration, variety, empty states",
    },
    monogram: {
      picture: "Initials over a blob in a ring",
      suits: "Avatars, workspaces, marks",
    },
  }

export const SAMPLE_SEEDS = ["quiet-heron", "amber-field", "late-ferry"]
export const SAMPLE_NAMES = ["Ossian Ravn", "Mira Okafor", "Juno"]
