"use client"

import { Badge } from "@/patina/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import { Progress } from "@/patina/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/patina/ui/table"

// The dashboard's lists, usable on their own: a ledger of records with a stamped status, and a survey under way as
// progress over its sectors.

/** A count in a fixed locale, so the server and every browser print the same digits. */
export const tally = (n: number) => new Intl.NumberFormat("en-GB").format(n)

export type RecordStatus = "confirmed" | "unconfirmed" | "rare"

const STATUS: Record<
  RecordStatus,
  { label: string; badge: "secondary" | "outline" | "default" }
> = {
  confirmed: { label: "Confirmed", badge: "secondary" },
  unconfirmed: { label: "Unconfirmed", badge: "outline" },
  rare: { label: "Rare", badge: "default" },
}

export interface RecordsCardProps {
  title: string
  description: string
  rows: {
    id: string
    species: string
    place: string
    status: RecordStatus
    count: number
    /** A page for the record; its species links there. */
    href?: string
  }[]
}

/** A ledger of records; the place column goes when the card is too narrow for it. */
export function RecordsCard({ title, description, rows }: RecordsCardProps) {
  return (
    <Card className="@container/records">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Species</TableHead>
              <TableHead className="@max-[30rem]/records:hidden">
                Place
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.href ? (
                    <a href={row.href}>{row.species}</a>
                  ) : (
                    row.species
                  )}
                </TableCell>
                <TableCell className="text-ink-2 @max-[30rem]/records:hidden">
                  {row.place}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS[row.status].badge}>
                    {STATUS[row.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {tally(row.count)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export interface SurveyCardProps {
  title: string
  description: string
  sectors: { name: string; counted: boolean }[]
}

/** A survey under way: the share of sectors done as progress, then each sector and whether it is counted. */
export function SurveyCard({ title, description, sectors }: SurveyCardProps) {
  const done = sectors.filter((s) => s.counted).length
  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={(done / Math.max(1, sectors.length)) * 100}
          aria-label="Sectors counted"
        />
        <p className="label-mono m-0 mt-tight text-ink-2">
          {done} of {sectors.length} sectors counted
        </p>
        <ul className="m-0 mt-snug list-none p-0">
          {sectors.map((sector) => (
            <li
              key={sector.name}
              className="flex items-baseline justify-between gap-tight border-b border-dashed border-rule py-hair"
            >
              <span className={sector.counted ? "" : "text-ink-2"}>
                {sector.name}
              </span>
              <span className="label-mono text-ink-3">
                {sector.counted ? "Counted" : "To do"}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
