import { MoreHorizontalIcon } from "lucide-react"
import { Print } from "@/patina/print/print"
import { Highlight } from "@/patina/marks/highlight"
import { Badge } from "@/patina/ui/badge"
import { Button } from "@/patina/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/patina/ui/dropdown-menu"
import { STATUS_LABEL, tally, when, type Observation } from "./data"

const BADGE = {
  confirmed: "secondary",
  unconfirmed: "outline",
  rare: "default",
} as const

/** One observation as a typeset row: its print, the species, where and when, the count, its status and actions. */
export function ObservationRow({
  item,
  fresh,
  onDuplicate,
  onDelete,
}: {
  item: Observation
  fresh: boolean
  onDuplicate: () => void
  onDelete: () => void
}) {
  const status = (
    <Badge variant={BADGE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
  )
  return (
    <li className="grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-start gap-x-snug gap-y-hair border-b border-dashed border-rule py-tight md:grid-cols-[3.25rem_minmax(0,1.3fr)_minmax(0,1fr)_4.5rem_7.5rem_auto] md:items-center">
      <Print
        motif={item.motif}
        seed={item.id}
        className="row-span-2 w-[3.25rem] md:row-span-1"
      />
      <div className="min-w-0">
        <p className="m-0 line-clamp-2 font-semibold leading-subhead">
          {fresh ? <Highlight>{item.species}</Highlight> : item.species}
        </p>
        {item.latin && (
          <p
            className="m-0 truncate text-small leading-small text-ink-2 italic"
            title={item.latin}
          >
            {item.latin}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-tight gap-y-hair max-md:col-start-2 max-md:row-start-2">
        <p className="m-0 font-label text-label text-ink-2 uppercase">
          {item.place} ·{" "}
          <span className="whitespace-nowrap">{when(item.seen)}</span>
        </p>
        <span className="flex items-center gap-tight md:hidden">
          <span className="font-label text-label text-ink-2 uppercase tabular-nums">
            {tally(item.count)} seen
          </span>
          {status}
        </span>
      </div>
      <p className="m-0 text-right font-label text-small tabular-nums max-md:hidden">
        {tally(item.count)}
        <span className="sr-only"> seen</span>
      </p>
      <span className="flex max-md:hidden">{status}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${item.species}`}
            />
          }
        >
          <MoreHorizontalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDuplicate}>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  )
}
