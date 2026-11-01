import { prng, seedOf } from "@/patina/ink"
import type { Observation } from "./data"

// What an observation's own page shows beyond its row: conditions, the field journal, attachments and the
// reviewers' thread. Three records are written out; the rest draw their conditions from their id, so every visit
// shows the same page.

export interface Attachment {
  name: string
  kind: "image" | "audio"
  size: string
}

export interface Comment {
  author: string
  time: string
  body: string
}

export interface Detail {
  observer: string
  weather: string
  wind: string
  tide: string
  /** Paragraphs of the field journal. The first may carry a highlighted phrase between ==marks==. */
  journal: string[]
  /** A handwritten aside beside the journal. */
  aside?: string
  attachments: Attachment[]
  comments: Comment[]
}

const WRITTEN: Record<string, Detail> = {
  "obs-0412": {
    observer: "Mira Okafor",
    weather: "Clear, 4 °C",
    wind: "NW 2",
    tide: "Falling, 2.1 m",
    journal: [
      "Tide out by six. The heron was already there, standing in the shallows ==as if it had waited for us==. It held still for eleven minutes, then a single strike, and an eel.",
      "It walked the creek edge north towards the sluice and lifted when the first dog walkers came along the sea wall.",
    ],
    aside: "same bird as Thursday?",
    attachments: [
      { name: "heron-creek-0542.jpg", kind: "image", size: "2.4 MB" },
    ],
    comments: [
      {
        author: "Tom Achterberg",
        time: "Sat 14 Nov, 08:10",
        body: "Lovely notes. The eel is a first for this winter.",
      },
    ],
  },
  "obs-0410": {
    observer: "Mira Okafor",
    weather: "Overcast, 7 °C",
    wind: "SW 3",
    tide: "Rising, 1.4 m",
    journal: [
      "Heard ==booming twice== from the far side of the reed bed at dusk, about ten minutes apart.",
      "A brief view as it crossed the gap by the old pump: heavy, brown, neck drawn in. Gone into the reeds within seconds.",
    ],
    aside: "first since March",
    attachments: [
      { name: "reed-bed-boom-1658.m4a", kind: "audio", size: "880 KB" },
    ],
    comments: [
      {
        author: "Priya Raman",
        time: "Fri 13 Nov, 19:02",
        body: "The recording settles it: that is a bittern boom. Marking it rare for the county report.",
      },
      {
        author: "Mira Okafor",
        time: "Fri 13 Nov, 19:20",
        body: "Thank you. I will check the same gap tomorrow at dusk.",
      },
    ],
  },
  "obs-0408": {
    observer: "Jo Lindqvist",
    weather: "Bright, 6 °C",
    wind: "Calm",
    tide: "Low, 0.6 m",
    journal: [
      "A flash of blue past the sluice gate, ==low over the water==, heading for the drain. No perch seen and no call heard.",
    ],
    aside: "needs a second look",
    attachments: [],
    comments: [
      {
        author: "Tom Achterberg",
        time: "Fri 13 Nov, 09:40",
        body: "Plausible here in winter. Leave it unconfirmed until someone sees it perched.",
      },
    ],
  },
}

const SKIES = ["Clear", "Bright", "Overcast", "Light rain", "Mist"]
const WINDS = ["Calm", "NW 2", "W 3", "SW 3", "N 4"]
const TIDES = ["Rising", "High", "Falling", "Low"]
const OBSERVERS = [
  "Mira Okafor",
  "Jo Lindqvist",
  "Priya Raman",
  "Tom Achterberg",
]

/** The detail for an observation: written out where there is one, otherwise drawn from its id. */
export function detailOf(item: Observation): Detail {
  const written = WRITTEN[item.id]
  if (written) return written
  const r = prng(seedOf(item.id))
  const pick = <T>(list: T[]) => list[Math.floor(r() * list.length)]!
  return {
    observer: pick(OBSERVERS),
    weather: `${pick(SKIES)}, ${3 + Math.floor(r() * 8)} °C`,
    wind: pick(WINDS),
    tide: `${pick(TIDES)}, ${(0.4 + r() * 2.4).toFixed(1)} m`,
    journal: [item.notes],
    attachments: [],
    comments: [],
  }
}
