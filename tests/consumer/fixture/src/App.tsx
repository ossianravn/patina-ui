import { useState } from "react"
import { SignIn01 } from "@/patina/blocks/sign-in-01"
import { PatinaDefs } from "@/patina/defs/patina-defs"
import { Circle } from "@/patina/marks/hand-marks"
import { MarginNote } from "@/patina/marks/notes"
import { Stamp } from "@/patina/marks/stamp"
import { Paper } from "@/patina/paper/paper"
import { Print } from "@/patina/print/print"
import { SeedScope } from "@/patina/print/seed-scope"
import { Button } from "@/patina/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/patina/ui/card"
import { Checkbox } from "@/patina/ui/checkbox"
import { Input } from "@/patina/ui/input"

// A newsletter sign-up: one sheet of printed matter beside a calm form, using the parts the install test adds, and
// the sign-in block below it.
export function App() {
  const [digest, setDigest] = useState(true)

  return (
    <SeedScope seed="consumer">
      <PatinaDefs />
      <main className="mx-auto grid max-w-measure gap-section p-page">
        <Paper edge="deckle" dogEar tilt seed="masthead" className="p-line">
          <Print motif="rings" inks="patina" title="Rings" className="w-48" />
          <h1 className="font-read text-h1">
            The <Circle>quarterly</Circle> letter
          </h1>
          <MarginNote>printed by hand</MarginNote>
          <Stamp variant="solid">Issue 12</Stamp>
        </Paper>
        <Card>
          <CardHeader>
            <CardTitle>Subscribe</CardTitle>
          </CardHeader>
          <CardContent className="grid justify-items-start gap-tight">
            <Input
              type="email"
              aria-label="Email"
              placeholder="you@example.com"
              className="w-72"
            />
            <label className="flex items-center gap-tight">
              <Checkbox
                checked={digest}
                onCheckedChange={(checked) => setDigest(checked)}
              />
              Monthly digest
            </label>
            <Button type="submit">Subscribe</Button>
          </CardContent>
        </Card>
      </main>
      <SignIn01 product="The quarterly letter" redirectTo="/" />
    </SeedScope>
  )
}
