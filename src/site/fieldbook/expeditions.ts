import type { MotifName } from "@/patina/ink"

// Fieldbook's expeditions: planned walks and counts on the reserve, and the ones already done. The demo clock is
// Sat 14 Nov 2026, so the wader count is today.

export type ExpeditionStatus = "done" | "today" | "planned"

export interface Member {
  name: string
  role: string
}

export interface Expedition {
  id: string
  name: string
  /** Local start time, ISO 8601. */
  start: string
  meet: string
  leader: string
  members: string[]
  status: ExpeditionStatus
  /** What the expedition is for, in a sentence. */
  aim: string
  /** Observation ids recorded on it. */
  observations: string[]
  motif: MotifName
}

export const MEMBERS: Record<string, Member> = {
  "Mira Okafor": { name: "Mira Okafor", role: "Volunteer, wader counts" },
  "Tom Achterberg": { name: "Tom Achterberg", role: "Reserve warden" },
  "Priya Raman": { name: "Priya Raman", role: "County recorder" },
  "Jo Lindqvist": { name: "Jo Lindqvist", role: "Volunteer, reed bed" },
  "Seán O'Brien": { name: "Seán O'Brien", role: "Volunteer, ringing" },
}

export const EXPEDITIONS: Expedition[] = [
  {
    id: "exp-14",
    name: "Winter wader count",
    start: "2026-11-14T05:30",
    meet: "Sluice gate",
    leader: "Mira Okafor",
    members: ["Mira Okafor", "Tom Achterberg", "Seán O'Brien"],
    status: "today",
    aim: "The monthly count of waders on the falling tide, flats to saltings.",
    observations: ["obs-0412", "obs-0411"],
    motif: "horizon",
  },
  {
    id: "exp-15",
    name: "Bittern watch",
    start: "2026-11-20T15:45",
    meet: "North hide",
    leader: "Jo Lindqvist",
    members: ["Jo Lindqvist", "Mira Okafor"],
    status: "planned",
    aim: "Dusk watch over the reed bed after Friday's booming.",
    observations: [],
    motif: "sprig",
  },
  {
    id: "exp-16",
    name: "Brent goose roost count",
    start: "2026-12-06T07:15",
    meet: "Sea wall",
    leader: "Tom Achterberg",
    members: ["Tom Achterberg", "Priya Raman", "Seán O'Brien", "Jo Lindqvist"],
    status: "planned",
    aim: "Count the roost as it lifts at first light.",
    observations: [],
    motif: "scatter",
  },
  {
    id: "exp-13",
    name: "Saltings walk",
    start: "2026-11-12T07:00",
    meet: "Saltings gate",
    leader: "Priya Raman",
    members: ["Priya Raman", "Mira Okafor"],
    status: "done",
    aim: "Avocets and redshank in the pools behind the sea wall.",
    observations: ["obs-0407", "obs-0406", "obs-0405"],
    motif: "contours",
  },
  {
    id: "exp-12",
    name: "Reed bed survey",
    start: "2026-11-11T08:30",
    meet: "Reed bed boardwalk",
    leader: "Jo Lindqvist",
    members: ["Jo Lindqvist", "Seán O'Brien"],
    status: "done",
    aim: "Rails, harriers and anything that calls from the reeds.",
    observations: ["obs-0404", "obs-0403"],
    motif: "flow",
  },
]
