import { useState } from "react"
import { Checkbox } from "@/patina/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/patina/ui/table"
import { OBSERVATIONS, tally, when } from "@/site/fieldbook/data"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"
import { DataTable } from "./table/data-table"
import { LongLedger } from "./table/long-ledger"

export const meta: DemoMeta = {
  title: "Table",
  description:
    "A ledger for records that compare across columns: mono headings, dashed row rules and typeset figures that line up.",
  item: "table",
  group: "Data display",
}

const WEEK = OBSERVATIONS.slice(0, 6)
const TIDES = [
  { time: "03:10", kind: "High water", height: "6.1" },
  { time: "09:24", kind: "Low water", height: "0.9" },
  { time: "15:33", kind: "High water", height: "5.8" },
]

export default function TableDemo() {
  const [chosen, setChosen] = useState<string[]>(["09:24"])
  const choose = (time: string, on: boolean) =>
    setChosen((list) => (on ? [...list, time] : list.filter((t) => t !== time)))
  return (
    <>
      <DemoSection title="Ledger">
        <StateRow label="Default">
          <div className="w-full max-w-[44rem] [contain:inline-size]">
            <Table>
              <TableCaption>
                The six latest observations, Tuesday to Saturday.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Seen</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WEEK.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-semibold">{o.species}</TableCell>
                    <TableCell>{o.place}</TableCell>
                    <TableCell className="font-label text-small text-ink-2">
                      {when(o.seen)}
                    </TableCell>
                    <TableCell className="text-right">
                      {tally(o.count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Birds counted</TableCell>
                  <TableCell className="text-right">
                    {tally(WEEK.reduce((sum, o) => sum + o.count, 0))}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </StateRow>
        <StateRow label="Selected row">
          <div className="w-full max-w-[28rem] [contain:inline-size]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <span className="sr-only">Chosen</span>
                  </TableHead>
                  <TableHead>Tide</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Height m</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIDES.map((t) => (
                  <TableRow
                    key={t.time}
                    data-state={
                      chosen.includes(t.time) ? "selected" : undefined
                    }
                  >
                    <TableCell>
                      <Checkbox
                        aria-label={`Plan the walk for ${t.kind.toLowerCase()} at ${t.time}`}
                        checked={chosen.includes(t.time)}
                        onCheckedChange={(on) => choose(t.time, on)}
                      />
                    </TableCell>
                    <TableCell>{t.kind}</TableCell>
                    <TableCell className="font-label text-small text-ink-2">
                      {t.time}
                    </TableCell>
                    <TableCell className="text-right">{t.height}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </StateRow>
      </DemoSection>
      <DemoSection title="Data table">
        <DataTable />
      </DemoSection>
      <DemoSection title="200 rows, sticky heading">
        <LongLedger />
      </DemoSection>
    </>
  )
}
