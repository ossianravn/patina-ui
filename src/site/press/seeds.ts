import { seedOf, stream } from "@/patina/ink"

// Two short word lists make seeds people can read, remember and share ("quiet-heron").
const ADJECTIVES = [
  "quiet",
  "amber",
  "late",
  "early",
  "salt",
  "paper",
  "copper",
  "faded",
  "north",
  "soft",
  "bright",
  "slow",
  "hidden",
  "small",
  "tidal",
  "dusty",
  "linen",
  "inky",
  "pale",
  "rusty",
  "steady",
  "wild",
  "folded",
  "winter",
  "summer",
  "hollow",
  "low",
  "high",
  "far",
  "near",
  "open",
  "still",
  "wet",
  "dry",
  "green",
  "blue",
]
const NOUNS = [
  "heron",
  "field",
  "ferry",
  "harbour",
  "orchard",
  "lantern",
  "atlas",
  "comet",
  "meadow",
  "pebble",
  "thicket",
  "kettle",
  "compass",
  "ledger",
  "quarry",
  "spire",
  "willow",
  "badger",
  "beacon",
  "cinder",
  "delta",
  "fjord",
  "garnet",
  "hollow",
  "island",
  "juniper",
  "kestrel",
  "lichen",
  "marsh",
  "nettle",
  "oriole",
  "pine",
  "quill",
  "reed",
  "sparrow",
  "tern",
]

const word = (list: string[], index: number) =>
  list[index % list.length] ?? list[0] ?? ""

/** A fresh memorable seed. Called from a click, not while rendering, so it may use Math.random. */
export function rerollSeed() {
  return `${word(ADJECTIVES, Math.floor(Math.random() * ADJECTIVES.length))}-${word(NOUNS, Math.floor(Math.random() * NOUNS.length))}`
}

/** Neighbouring seeds for the contact sheet: always the same for the same seed. */
export function sheetSeeds(seed: string, count: number) {
  const pick = stream(seedOf(seed), "press:sheet")
  const seeds = new Set<string>()
  while (seeds.size < count) {
    seeds.add(
      `${word(ADJECTIVES, Math.floor(pick.next() * ADJECTIVES.length))}-${word(NOUNS, Math.floor(pick.next() * NOUNS.length))}`,
    )
  }
  return [...seeds]
}
