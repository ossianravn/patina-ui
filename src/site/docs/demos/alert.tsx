import { Glyph } from "@/patina/marks/glyph"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/patina/ui/alert"
import { Button } from "@/patina/ui/button"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Alert",
  description:
    "A wash of colour with a drawn glyph that tells the reader something about the page they are on.",
  item: "alert",
}

export default function AlertDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="Default">
          <Alert className="max-w-[40rem]">
            <Glyph name="asterisk" />
            <AlertTitle>The tide turns at 14:20</AlertTitle>
            <AlertDescription>
              Leave the flats by 13:50; the path past the second hide floods
              first.
            </AlertDescription>
          </Alert>
        </StateRow>
        <StateRow label="Title only">
          <Alert className="max-w-[40rem]">
            <Glyph name="check" />
            <AlertTitle>Sighting saved to the Saltmarsh walk</AlertTitle>
          </Alert>
        </StateRow>
        <StateRow label="Destructive">
          <Alert variant="destructive" className="max-w-[40rem]">
            <Glyph name="bang" />
            <AlertTitle>3 observations didn’t upload</AlertTitle>
            <AlertDescription>
              They are kept on this device. Check your signal and sync again
              from the expedition page.
            </AlertDescription>
          </Alert>
        </StateRow>
      </DemoSection>
      <DemoSection title="With an action">
        <StateRow label="Action">
          <Alert className="max-w-[40rem]">
            <Glyph name="minus" />
            <AlertTitle>Grey heron removed</AlertTitle>
            <AlertDescription>It leaves today’s count.</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline">
                Undo
              </Button>
            </AlertAction>
          </Alert>
        </StateRow>
        <StateRow label="Re-inked region">
          <div data-ink="blue" className="w-full max-w-[40rem]">
            <Alert>
              <Glyph name="arrow" />
              <AlertTitle>Night moths: trap check at 05:30</AlertTitle>
              <AlertDescription>
                Bring the red torch; white light scatters them before the count.
              </AlertDescription>
            </Alert>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
