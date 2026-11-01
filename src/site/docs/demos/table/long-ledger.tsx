import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/patina/ui/table"
import { tally } from "@/site/fieldbook/data"
import { LEDGER_ROWS } from "./ledger-rows"

// Two hundred rows in a fixed-height container: the heading row sticks while the body scrolls. Cells are plain text
// with static CSS, nothing drawn per row, so the scroll stays smooth.
export function LongLedger() {
  return (
    <div className="w-full max-w-[52rem] border-b-[1.5px] border-line *:data-[slot=table-container]:h-[26rem]">
      <Table aria-label="Season ledger, 200 observations">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No.</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Species</TableHead>
            <TableHead>Place</TableHead>
            <TableHead className="text-right">Tide m</TableHead>
            <TableHead className="text-right">Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {LEDGER_ROWS.map((row) => (
            <TableRow key={row.no}>
              <TableCell className="font-label text-small text-ink-3">
                {row.no}
              </TableCell>
              <TableCell className="font-label text-small text-ink-2">
                {row.date}, {row.time}
              </TableCell>
              <TableCell>
                <span className="font-semibold">{row.species}</span>{" "}
                <span className="text-small text-ink-2 italic">
                  {row.latin}
                </span>
              </TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell className="text-right">{row.tide}</TableCell>
              <TableCell className="text-right">{tally(row.count)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
