import { useMemo, useState } from "react"
import { SearchIcon } from "lucide-react"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import { Input } from "@/patina/ui/input"
import { NativeSelect, NativeSelectOption } from "@/patina/ui/native-select"
import { ToggleGroup, ToggleGroupItem } from "@/patina/ui/toggle-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/patina/ui/alert-dialog"
import {
  OBSERVATIONS,
  STATUS_LABEL,
  nextNumber,
  tally,
  type Observation,
  type Status,
} from "./data"
import { NewObservation } from "./new-observation"
import { ObservationRow } from "./observation-row"

type Filter = "all" | Status

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ...(Object.entries(STATUS_LABEL) as [Status, string][]),
]
/** Records with their own page: the static demo data. */
const PAGES = new Set(OBSERVATIONS.map((o) => o.id))
/** Rows rendered at a time; "Show more" adds another page. */
const PAGE = 50

/** Fieldbook's main screen: every observation, searchable and filterable, with add, duplicate and delete. */
export function Observations({
  initial = OBSERVATIONS,
}: {
  initial?: Observation[]
}) {
  const [items, setItems] = useState<Observation[]>(initial)
  const [next, setNext] = useState(() => nextNumber(initial))
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [limit, setLimit] = useState(PAGE)
  const [fresh, setFresh] = useState<string | null>(null)
  const [doomed, setDoomed] = useState<Observation | null>(null)
  const [message, setMessage] = useState("")

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(
      (o) =>
        (filter === "all" || o.status === filter) &&
        (!q || `${o.species} ${o.latin} ${o.place}`.toLowerCase().includes(q)),
    )
  }, [items, query, filter])

  const search = (q: string) => [setQuery(q), setLimit(PAGE)]
  const show = (f: Filter) => [setFilter(f), setLimit(PAGE)]
  const add = (item: Observation) => {
    setItems((list) => [item, ...list])
    setNext((n) => n + 1)
    setFresh(item.id)
    search("")
    show("all")
    setMessage(`Added ${item.species}.`)
  }
  const duplicate = (item: Observation) =>
    add({ ...item, id: `obs-${String(next).padStart(4, "0")}` })
  const remove = () => {
    if (!doomed) return
    setItems((list) => list.filter((o) => o.id !== doomed.id))
    setMessage(`Deleted ${doomed.species}.`)
    setDoomed(null)
  }

  return (
    <div className="mx-auto max-w-[72rem] px-snug pb-page pt-section sm:px-line">
      <header className="flex flex-wrap items-end justify-between gap-snug">
        <div>
          <p className="label-mono m-0 text-ink-2">
            Saltmarsh reserve · November
          </p>
          <h1 className="m-0 mt-hair text-h1">Observations</h1>
        </div>
        <NewObservation onAdd={add} next={next} />
      </header>

      {items.length > 0 && (
        <div className="mt-line flex flex-wrap items-center gap-x-section gap-y-tight">
          <label className="relative">
            <span className="sr-only">Search observations</span>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-tight size-4 -translate-y-1/2 text-ink-3"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="Species or place"
              className="w-[16rem] pl-9"
            />
          </label>
          <ToggleGroup
            value={[filter]}
            onValueChange={(value) => show((value[0] as Filter) ?? "all")}
            aria-label="Show"
            className="max-sm:hidden"
          >
            {FILTERS.map(([value, label]) => (
              <ToggleGroupItem key={value} value={value}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <NativeSelect
            value={filter}
            onChange={(e) => show(e.target.value as Filter)}
            aria-label="Show"
            className="w-[11rem] sm:hidden"
          >
            {FILTERS.map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <p className="label-mono m-0 text-ink-2" aria-live="polite">
            {tally(shown.length)} of {tally(items.length)}
            {message && ` · ${message}`}
          </p>
        </div>
      )}

      {shown.length ? (
        <>
          <ul className="m-0 mt-snug list-none border-t border-dashed border-rule p-0">
            {shown.slice(0, limit).map((item) => (
              <ObservationRow
                key={item.id}
                item={item}
                href={
                  PAGES.has(item.id)
                    ? `/fieldbook/observations/${item.id}`
                    : undefined
                }
                fresh={item.id === fresh}
                onDuplicate={() => duplicate(item)}
                onDelete={() => setDoomed(item)}
              />
            ))}
          </ul>
          {shown.length > limit && (
            <div className="mt-snug flex flex-wrap items-center gap-snug">
              <Button
                variant="outline"
                onClick={() => setLimit((n) => n + PAGE)}
              >
                Show more
              </Button>
              <p className="label-mono m-0 text-ink-2">
                {tally(limit)} of {tally(shown.length)} shown
              </p>
            </div>
          )}
        </>
      ) : items.length ? (
        <div className="mt-section flex flex-col items-center gap-tight text-center">
          <Print
            motif="scatter"
            seed={`empty-${query}-${filter}`}
            className="w-32"
          />
          <p className="m-0 text-lead leading-subhead font-semibold">
            Nothing matches
          </p>
          <p className="m-0 text-small leading-small text-ink-2">
            No observations fit that search and filter.
          </p>
          <Button variant="outline" onClick={() => [search(""), show("all")]}>
            Show everything
          </Button>
        </div>
      ) : (
        <div className="mt-section flex flex-col items-center gap-tight text-center">
          <Print motif="sprig" seed="empty-notebook" className="w-32" />
          <p className="m-0 text-lead leading-subhead font-semibold">
            No observations yet
          </p>
          <p className="m-0 text-small leading-small text-ink-2">
            Your first sighting starts the notebook.
          </p>
        </div>
      )}

      <AlertDialog
        open={!!doomed}
        onOpenChange={(open) => !open && setDoomed(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {doomed?.species}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the observation from {doomed?.place}. In this demo it
              comes back when you reload.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={remove}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
