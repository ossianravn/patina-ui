import { useState } from "react"
import {
  AudioLinesIcon,
  FileJsonIcon,
  ImageIcon,
  RotateCcwIcon,
  XIcon,
} from "lucide-react"
import { print } from "@/patina/ink"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/patina/ui/attachment"
import { Spinner } from "@/patina/ui/spinner"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Attachment",
  description:
    "A file handed over with a message, as a small ticket: what it is, how big, and whether it has arrived.",
  item: "attachment",
  group: "Conversation",
}

// A stand-in photo of the reed bed at dusk: a horizon print rendered as a self-contained image, so no network.
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  print({
    motif: "horizon",
    seed: "reed bed at dusk",
    standalone: true,
    inks: { line: "#4a2b5e", accent: "#c2602f", detail: "#304a8c" },
  }).svg.replace(
    "<defs>",
    '<rect x="-20" y="-20" width="280" height="280" fill="#e9d9c0"/><defs>',
  ),
)}`

function Remove({ name, onClick }: { name: string; onClick?: () => void }) {
  return (
    <AttachmentActions>
      <AttachmentAction aria-label={`Remove ${name}`} onClick={onClick}>
        <XIcon />
      </AttachmentAction>
    </AttachmentActions>
  )
}

function Recording({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia>
        <AudioLinesIcon />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>reedbed-dusk.m4a</AttachmentTitle>
        <AttachmentDescription>Audio · 0:09 · 412 KB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="reedbed-dusk.m4a" onClick={onRemove} />
    </Attachment>
  )
}

function Photo({ onRemove }: { onRemove?: () => void }) {
  return (
    <Attachment>
      <AttachmentMedia variant="image">
        <img src={PHOTO} alt="" />
      </AttachmentMedia>
      <AttachmentContent>
        <AttachmentTitle>reedbed-dusk.jpg</AttachmentTitle>
        <AttachmentDescription>Photo · 2.1 MB</AttachmentDescription>
      </AttachmentContent>
      <Remove name="reedbed-dusk.jpg" onClick={onRemove} />
    </Attachment>
  )
}

function Composer() {
  const [files, setFiles] = useState(["audio", "photo", "record"])
  const drop = (file: string) => () =>
    setFiles((current) => current.filter((f) => f !== file))
  return (
    <div className="max-w-[34rem]">
      <AttachmentGroup>
        {files.includes("audio") ? (
          <Recording onRemove={drop("audio")} />
        ) : null}
        {files.includes("photo") ? <Photo onRemove={drop("photo")} /> : null}
        {files.includes("record") ? (
          <Attachment size="sm">
            <AttachmentMedia>
              <FileJsonIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>observation.json</AttachmentTitle>
              <AttachmentDescription>Record · 1 KB</AttachmentDescription>
            </AttachmentContent>
            <Remove name="observation.json" onClick={drop("record")} />
          </Attachment>
        ) : null}
      </AttachmentGroup>
      {files.length === 0 ? (
        <p className="m-0 py-tight text-small leading-small text-ink-2">
          Nothing attached.{" "}
          <button
            type="button"
            className="cursor-pointer text-k-ink underline decoration-[1.5px] underline-offset-[0.2em]"
            onClick={() => setFiles(["audio", "photo", "record"])}
          >
            Put them back
          </button>
        </p>
      ) : null}
    </div>
  )
}

export default function AttachmentDemo() {
  return (
    <>
      <DemoSection title="Sound and photo">
        <StateRow label="Tickets">
          <Recording />
          <Photo />
        </StateRow>
        <StateRow label="Tile">
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>reedbed-dusk.jpg</AttachmentTitle>
              <AttachmentDescription>2.1 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger aria-label="Open reedbed-dusk.jpg" />
            <Remove name="reedbed-dusk.jpg" />
          </Attachment>
          <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="Reed bed at dusk" />
            </AttachmentMedia>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="States">
        <StateRow label="Idle">
          <Attachment state="idle">
            <AttachmentMedia>
              <ImageIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>reedbed-2.jpg</AttachmentTitle>
              <AttachmentDescription>Waiting · 1.8 MB</AttachmentDescription>
            </AttachmentContent>
            <Remove name="reedbed-2.jpg" />
          </Attachment>
        </StateRow>
        <StateRow label="Uploading">
          <Attachment state="uploading">
            <AttachmentMedia variant="image">
              <img src={PHOTO} alt="" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>reedbed-dusk.jpg</AttachmentTitle>
              <AttachmentDescription>Uploading · 64%</AttachmentDescription>
            </AttachmentContent>
            <Remove name="reedbed-dusk.jpg" />
          </Attachment>
        </StateRow>
        <StateRow label="Processing">
          <Attachment state="processing">
            <AttachmentMedia>
              <Spinner />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>reedbed-dusk.m4a</AttachmentTitle>
              <AttachmentDescription>Listening for calls</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
        <StateRow label="Error">
          <Attachment state="error">
            <AttachmentMedia>
              <AudioLinesIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>reedbed-dusk-2.m4a</AttachmentTitle>
              <AttachmentDescription>Empty file · 0 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Try reedbed-dusk-2.m4a again">
                <RotateCcwIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </StateRow>
        <StateRow label="Name only">
          <Attachment>
            <AttachmentContent>
              <AttachmentTitle>tide-table-nov.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 88 KB</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </StateRow>
      </DemoSection>
      <DemoSection title="Sizes">
        {(["default", "sm", "xs"] as const).map((size) => (
          <StateRow key={size} label={size}>
            <Attachment size={size}>
              <AttachmentMedia>
                <AudioLinesIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>reedbed-dusk.m4a</AttachmentTitle>
                {size === "xs" ? null : (
                  <AttachmentDescription>Audio · 412 KB</AttachmentDescription>
                )}
              </AttachmentContent>
            </Attachment>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="In a composer">
        <Composer />
      </DemoSection>
    </>
  )
}
