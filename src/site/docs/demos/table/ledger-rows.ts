import { prng } from "@/patina/ink/seed"
import { PLACES } from "@/site/fieldbook/data"

// Two hundred ledger lines for the long-table demo, drawn from a seed so every build and every browser prints the
// same rows. Three lines a day, counting back from the demo clock (Sat 14 Nov 2026).

const SPECIES = [
  ["Curlew", "Numenius arquata"],
  ["Redshank", "Tringa totanus"],
  ["Brent goose", "Branta bernicla"],
  ["Little egret", "Egretta garzetta"],
  ["Avocet", "Recurvirostra avosetta"],
  ["Dunlin", "Calidris alpina"],
  ["Grey plover", "Pluvialis squatarola"],
  ["Shelduck", "Tadorna tadorna"],
  ["Wigeon", "Mareca penelope"],
  ["Teal", "Anas crecca"],
  ["Marsh harrier", "Circus aeruginosus"],
  ["Grey heron", "Ardea cinerea"],
  ["Black-tailed godwit", "Limosa limosa"],
  ["Oystercatcher", "Haematopus ostralegus"],
  ["Knot", "Calidris canutus"],
  ["Reed bunting", "Emberiza schoeniclus"],
] as const

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Sep", "Oct", "Nov"]

export interface LedgerRow {
  no: string
  date: string
  time: string
  species: string
  latin: string
  place: string
  tide: string
  count: number
}

function build(): LedgerRow[] {
  const next = prng(1114)
  const pick = <T>(items: readonly T[]) =>
    items[Math.floor(next() * items.length)] as T
  return Array.from({ length: 200 }, (_, i) => {
    const day = new Date(Date.UTC(2026, 10, 14 - Math.floor(i / 3)))
    const hour = 17 - (i % 3) * 5 - Math.floor(next() * 3)
    const minute = Math.floor(next() * 60)
    const [species, latin] = pick(SPECIES)
    const flock = next() < 0.35
    return {
      no: String(412 - i).padStart(4, "0"),
      date: `${DAYS[day.getUTCDay()]} ${day.getUTCDate()} ${MONTHS[day.getUTCMonth() - 8]}`,
      time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      species,
      latin,
      place: pick(PLACES),
      tide: (0.4 + next() * 6.4).toFixed(1),
      count: flock
        ? 20 + Math.floor(next() * 380)
        : 1 + Math.floor(next() * 12),
    }
  })
}

export const LEDGER_ROWS = build()
