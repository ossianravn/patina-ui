"use client"

import { useRef, useState, type ReactNode } from "react"
import { PlusIcon, RotateCwIcon, SearchIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Print } from "@/patina/print/print"
import { Button } from "@/patina/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/patina/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/patina/ui/input-group"

// A list page with nothing to show, in three states: a first-run notebook, a search that matched nothing, and no
// connection. Each is a print, a serif title, one line on why and the one action that helps. The search state keeps
// its field, so clearing the search leaves focus where the next one starts; Try again checks the connection before
// calling onRetry and says so when it is still down.

export const meta = {
  title: "Empty states",
  description:
    "A list page with nothing to show: a first-run notebook, a search with no results and an offline state, each with a print and one action.",
  variants: ["first-run", "no-results", "offline"],
}

export interface Empty01Props {
  variant?: "first-run" | "no-results" | "offline"
  /** The search that found nothing, for the no-results state. */
  query?: string
  onAdd?: () => void
  onClearSearch?: () => void
  onRetry?: () => void
  className?: string
}

export function Empty01({
  variant = "first-run",
  query = "spoonbil",
  onAdd,
  onClearSearch,
  onRetry,
  className,
}: Empty01Props) {
  const [search, setSearch] = useState(query)
  const [status, setStatus] = useState("")
  const field = useRef<HTMLInputElement>(null)

  function retry() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("Still offline. Your notes are safe.")
      return
    }
    setStatus("")
    onRetry?.()
  }

  let state: ReactNode
  if (variant === "no-results") {
    state = search ? (
      <State
        print={
          <Print
            motif="lens"
            inks="spot"
            seed="empty:search"
            className="w-28"
          />
        }
        title={`Nothing matches “${search}”`}
        description="Check the spelling, or search by place or Latin name."
        action={
          <Button
            variant="outline"
            onClick={() => {
              setSearch("")
              field.current?.focus()
              onClearSearch?.()
            }}
          >
            Clear the search
          </Button>
        }
      />
    ) : (
      <State
        print={
          <Print
            motif="lens"
            inks="spot"
            seed="empty:search"
            className="w-28"
          />
        }
        title="Search the notebook"
        description="Species, places and Latin names all work."
      />
    )
  } else if (variant === "offline") {
    state = (
      <State
        print={
          <Print
            motif="rings"
            inks="spot"
            seed="empty:offline"
            className="w-28"
          />
        }
        title="You’re offline"
        description="Fieldbook keeps what you record on this device and sends it when the signal comes back."
        action={
          <>
            <Button variant="outline" onClick={retry}>
              <RotateCwIcon data-icon="inline-start" />
              Try again
            </Button>
            {/* A reserved line, so the answer appears without moving the page. */}
            <p aria-live="polite" className="m-0 min-h-[1lh] text-ink-2">
              {status}
            </p>
          </>
        }
      />
    )
  } else {
    state = (
      <State
        print={
          <Print
            motif="scatter"
            inks="spot"
            seed="empty:first-run"
            className="w-28"
          />
        }
        title="Start your notebook"
        description="Your first sighting on the reserve opens it."
        action={
          <Button onClick={() => onAdd?.()}>
            <PlusIcon data-icon="inline-start" />
            Add an observation
          </Button>
        }
      />
    )
  }

  return (
    <div className={cn("@container", className)}>
      <div className="mx-auto max-w-[56rem] px-snug pt-section pb-page @min-[40rem]:px-line">
        <p className="label-mono m-0 text-ink-2">Saltmarsh reserve</p>
        <h1 className="m-0 mt-hair text-h1">Observations</h1>
        {variant === "no-results" && (
          <InputGroup className="mt-snug w-[22rem] max-w-full">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              ref={field}
              type="search"
              aria-label="Search observations"
              placeholder="Species, place or Latin name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        )}
        <Empty className="mt-snug min-h-[24rem] border">{state}</Empty>
      </div>
    </div>
  )
}

function State({
  print,
  title,
  description,
  action,
}: {
  print: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <>
      <EmptyHeader>
        <EmptyMedia>{print}</EmptyMedia>
        <EmptyTitle>
          <h2 className="m-0 font-[inherit] text-[length:inherit] leading-[inherit]">
            {title}
          </h2>
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </>
  )
}

export default Empty01
