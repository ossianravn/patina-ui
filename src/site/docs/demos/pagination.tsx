import { useState } from "react"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { PagePicker } from "./table/page-picker"

export const meta: DemoMeta = {
  title: "Pagination",
  description:
    "Mono page numbers for moving through a long list a page at a time, the current page ringed by hand.",
  item: "pagination",
  group: "Navigation",
}

/** Pagination over a fixed number of pages, starting on the given one. */
function Pages({ start, pages }: { start: number; pages: number }) {
  const [page, setPage] = useState(start)
  return (
    <div className="flex flex-col gap-hair">
      <PagePicker page={page} pages={pages} onPage={setPage} />
      <p className="label-mono m-0 text-ink-3" aria-live="polite">
        Observations {(page - 1) * 25 + 1}–{Math.min(page * 25, pages * 25 - 9)}{" "}
        of {pages * 25 - 9}
      </p>
    </div>
  )
}

export default function PaginationDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="First page">
          <Pages start={1} pages={3} />
        </StateRow>
        <StateRow label="Middle, with gaps">
          <Pages start={6} pages={17} />
        </StateRow>
        <StateRow label="Last page">
          <Pages start={17} pages={17} />
        </StateRow>
      </DemoSection>
    </>
  )
}
