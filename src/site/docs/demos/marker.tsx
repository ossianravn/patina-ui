import { AudioLinesIcon, PaperclipIcon, UserPlusIcon } from "lucide-react"
import { Marker, MarkerContent, MarkerIcon } from "@/patina/ui/marker"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Marker",
  description:
    "A line in a thread that is not a message: the day, where unread notes begin, or something that happened.",
  item: "marker",
  group: "Conversation",
}

export default function MarkerDemo() {
  return (
    <>
      <DemoSection title="Variants">
        <StateRow label="Separator">
          <Marker variant="separator">
            <MarkerContent>Sat 14 Nov</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Unread">
          <Marker variant="separator" className="text-ink-red">
            <MarkerContent>New</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Event">
          <Marker>
            <MarkerIcon>
              <PaperclipIcon />
            </MarkerIcon>
            <MarkerContent>Mira Okafor attached reedbed-dusk.m4a</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="Border">
          <Marker variant="border">
            <MarkerContent>Earlier this week</MarkerContent>
          </Marker>
        </StateRow>
        <StateRow label="With a link">
          <Marker>
            <MarkerIcon>
              <UserPlusIcon />
            </MarkerIcon>
            <MarkerContent>
              Tomas Lund joined from{" "}
              <a href="#north-reed-bed">North reed bed</a>
            </MarkerContent>
          </Marker>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a thread">
        <div className="flex max-w-[38rem] flex-col gap-tight">
          <Marker variant="separator">
            <MarkerContent>Sat 14 Nov</MarkerContent>
          </Marker>
          <p className="m-0 max-w-measure font-read text-body leading-lead">
            Small, brown, streaky, flicking its tail in the reed bed at dusk.
          </p>
          <Marker className="text-k-ink">
            <MarkerIcon>
              <AudioLinesIcon />
            </MarkerIcon>
            <MarkerContent>Listening to the recording · 0:09</MarkerContent>
          </Marker>
          <Marker variant="separator" className="text-ink-red">
            <MarkerContent>New</MarkerContent>
          </Marker>
          <p className="m-0 max-w-measure font-read text-body leading-lead">
            That explosive burst is the giveaway: Cetti&rsquo;s warbler.
          </p>
        </div>
      </DemoSection>
    </>
  )
}
