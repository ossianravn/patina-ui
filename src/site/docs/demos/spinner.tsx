import { Button } from "@/patina/ui/button"
import { Spinner } from "@/patina/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Spinner",
  description:
    "A hand-drawn arc that turns while something of unknown length is happening.",
  item: "spinner",
}

export default function SpinnerDemo() {
  return (
    <DemoSection title="States">
      <StateRow label="Sizes">
        <Spinner className="size-3" />
        <Spinner />
        <Spinner className="size-6" />
        <Spinner className="size-8 text-k-ink" />
      </StateRow>
      <StateRow label="In a button">
        <Button disabled>
          <Spinner data-icon="inline-start" /> Syncing
        </Button>
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" /> Saving
        </Button>
      </StateRow>
      <StateRow label="Inline">
        <p className="m-0 flex items-center gap-hair text-small leading-small text-ink-2">
          <Spinner className="text-k-ink" /> Uploading 3 photos from the first
          hide
        </p>
      </StateRow>
    </DemoSection>
  )
}
