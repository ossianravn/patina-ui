import type { ReactNode } from "react"
import { Highlight } from "@/patina/marks/highlight"
import { MarginNote } from "@/patina/marks/notes"
import { Print } from "@/patina/print/print"
import { Badge } from "@/patina/ui/badge"
import { Button } from "@/patina/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import { Checkbox } from "@/patina/ui/checkbox"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { NativeSelect, NativeSelectOption } from "@/patina/ui/native-select"
import { Progress } from "@/patina/ui/progress"
import { Switch } from "@/patina/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/patina/ui/tabs"
import { PLACES } from "@/site/fieldbook/data"

function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-center gap-x-snug gap-y-hair border-b border-dashed border-rule py-tight last:border-b-0 @min-[34rem]:grid-cols-[6rem_minmax(0,1fr)]">
      <span className="label-mono text-ink-3">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-tight">
        {children}
      </div>
    </div>
  )
}

/** One of each kind of part, in Fieldbook's words, so a setting shows on every surface it touches. */
export function Specimens() {
  return (
    <Card className="@container">
      <CardHeader>
        <CardTitle>Components</CardTitle>
        <CardDescription>Actions, fields, status and marks</CardDescription>
      </CardHeader>
      <CardContent>
        <Line label="Buttons">
          <Button>Save observation</Button>
          <Button variant="outline">Export</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="link">View on map</Button>
        </Line>
        <Line label="Fields">
          <Input
            aria-label="Species"
            defaultValue="Grey heron"
            className="w-[12rem]"
          />
          <NativeSelect aria-label="Place" defaultValue="Tidal flats">
            {PLACES.map((place) => (
              <NativeSelectOption key={place} value={place}>
                {place}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Line>
        <Line label="Choices">
          <Label>
            <Checkbox defaultChecked /> Rare for the county
          </Label>
          <Label>
            <Switch defaultChecked /> Tide alerts
          </Label>
        </Line>
        <Line label="Status">
          <Badge variant="secondary">Confirmed</Badge>
          <Badge variant="outline">Unconfirmed</Badge>
          <Badge>Rare</Badge>
          <span className="flex items-center gap-tight">
            <Progress
              value={62.5}
              aria-label="Sectors counted"
              className="w-[9rem]"
            />
            <span className="label-mono text-ink-2">5 of 8</span>
          </span>
        </Line>
        <Line label="Tabs">
          <Tabs defaultValue="list">
            <TabsList className="w-fit">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </Tabs>
        </Line>
        <Line label="Print, marks">
          <div className="grid w-full items-start gap-snug @min-[26rem]:grid-cols-[6.5rem_minmax(0,1fr)]">
            <Print
              motif="horizon"
              seed="obs-0412"
              title="A horizon print for the grey heron"
              className="w-[6.5rem]"
            />
            <div className="min-w-0 max-w-measure">
              <p className="m-0 font-read">
                Still for eleven minutes, then{" "}
                <Highlight>a single strike</Highlight> at the{" "}
                <Highlight accent>channel edge</Highlight>.
              </p>
              <MarginNote seed="studio-heron" className="mt-hair">
                same bird as Tuesday?
              </MarginNote>
            </div>
          </div>
        </Line>
      </CardContent>
    </Card>
  )
}
