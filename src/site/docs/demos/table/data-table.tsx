import { useMemo, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Badge } from "@/patina/ui/badge"
import { Checkbox } from "@/patina/ui/checkbox"
import { Input } from "@/patina/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/patina/ui/table"
import {
  OBSERVATIONS,
  STATUS_LABEL,
  tally,
  when,
  type Observation,
} from "@/site/fieldbook/data"
import { PagePicker } from "./page-picker"

// A data table from Table and the existing primitives alone: sortable headings, a search field, row selection with
// a header checkbox that goes indeterminate, and pagination. No table library.

type Column = "species" | "place" | "seen" | "count"
type Sort = { column: Column; dir: "asc" | "desc" }

const PAGE_SIZE = 5
const BADGE = {
  confirmed: "secondary",
  unconfirmed: "outline",
  rare: "default",
} as const

function compare(a: Observation, b: Observation, column: Column) {
  return column === "count"
    ? a.count - b.count
    : a[column].localeCompare(b[column], "en-GB")
}

function SortHead({
  column,
  label,
  sort,
  onSort,
  numeric = false,
  className,
}: {
  column: Column
  label: string
  sort: Sort
  onSort: (column: Column) => void
  numeric?: boolean
  className?: string
}) {
  const dir = sort.column === column ? sort.dir : undefined
  const Arrow = dir === "asc" ? ArrowUpIcon : ArrowDownIcon
  return (
    <TableHead
      aria-sort={
        dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none"
      }
      className={cn(numeric && "text-right", className)}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "-mx-1 inline-flex h-control-compact cursor-pointer items-center gap-1 px-1 uppercase transition-colors hover:text-ink",
          numeric && "flex-row-reverse",
          dir && "text-ink",
        )}
      >
        {label}
        {dir ? (
          <Arrow aria-hidden="true" className="size-3.5" />
        ) : (
          <ChevronsUpDownIcon
            aria-hidden="true"
            className="size-3.5 text-ink-faint"
          />
        )}
      </button>
    </TableHead>
  )
}

export function DataTable() {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>({ column: "seen", dir: "desc" })
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(["obs-0411"]),
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const found = OBSERVATIONS.filter((o) =>
      [o.species, o.latin, o.place].some((f) => f.toLowerCase().includes(q)),
    )
    const sign = sort.dir === "asc" ? 1 : -1
    return found.sort((a, b) => sign * compare(a, b, sort.column))
  }, [query, sort])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const onPage = shown.filter((o) => selected.has(o.id)).length
  const all = shown.length > 0 && onPage === shown.length

  const onSort = (column: Column) =>
    setSort((s) =>
      s.column === column
        ? { column, dir: s.dir === "asc" ? "desc" : "asc" }
        : {
            column,
            dir: column === "species" || column === "place" ? "asc" : "desc",
          },
    )
  const toggle = (ids: string[], on: boolean) =>
    setSelected((s) => {
      const next = new Set(s)
      for (const id of ids) {
        if (on) next.add(id)
        else next.delete(id)
      }
      return next
    })

  return (
    <div className="flex w-full max-w-[52rem] flex-col gap-tight">
      <Input
        type="search"
        aria-label="Search observations"
        placeholder="Search species or place"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(1)
        }}
        className="w-full sm:w-[17rem]"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select every observation on this page"
                checked={all}
                indeterminate={onPage > 0 && !all}
                onCheckedChange={(on) =>
                  toggle(
                    shown.map((o) => o.id),
                    on,
                  )
                }
              />
            </TableHead>
            <SortHead
              column="species"
              label="Species"
              sort={sort}
              onSort={onSort}
            />
            <SortHead
              className="w-[8.5rem]"
              column="place"
              label="Place"
              sort={sort}
              onSort={onSort}
            />
            <SortHead
              className="w-[12rem]"
              column="seen"
              label="Seen"
              sort={sort}
              onSort={onSort}
            />
            <SortHead
              className="w-[6rem]"
              column="count"
              label="Count"
              sort={sort}
              onSort={onSort}
              numeric
            />
            <TableHead className="w-[8.5rem]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((o) => (
            <TableRow
              key={o.id}
              data-state={selected.has(o.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${o.species}, ${when(o.seen)}`}
                  checked={selected.has(o.id)}
                  onCheckedChange={(on) => toggle([o.id], on)}
                />
              </TableCell>
              <TableCell>
                <span className="font-semibold">{o.species}</span>{" "}
                <span className="text-small text-ink-2 italic">{o.latin}</span>
              </TableCell>
              <TableCell>{o.place}</TableCell>
              <TableCell className="font-label text-small text-ink-2">
                {when(o.seen)}
              </TableCell>
              <TableCell className="text-right">{tally(o.count)}</TableCell>
              <TableCell>
                <Badge variant={BADGE[o.status]}>
                  {STATUS_LABEL[o.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {shown.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-snug text-center text-ink-2">
                No observations match “{query.trim()}”.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-tight">
        <p className="label-mono m-0 text-ink-2" aria-live="polite">
          {selected.size} of {OBSERVATIONS.length} selected
        </p>
        <PagePicker page={current} pages={pages} onPage={setPage} />
      </div>
    </div>
  )
}
