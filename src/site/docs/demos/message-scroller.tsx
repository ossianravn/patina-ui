import { useState, type ReactNode } from "react"
import { AudioLinesIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/patina/ui/attachment"
import { Bubble, BubbleContent } from "@/patina/ui/bubble"
import { Button } from "@/patina/ui/button"
import { Marker, MarkerContent } from "@/patina/ui/marker"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/patina/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/patina/ui/message-scroller"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/patina/ui/trace"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Message scroller",
  description:
    "The scrolling column of a conversation: it keeps the latest note in view and offers a way back when you read up.",
  item: "message-scroller",
  group: "Conversation",
}

type Note =
  | { id: string; kind: "marker"; text: string; unread?: boolean }
  | {
      id: string
      kind: "note"
      from: "mira" | "fieldbook"
      time: string
      body: ReactNode
    }

const PEOPLE = {
  mira: { name: "Mira Okafor", initials: "MO" },
  fieldbook: { name: "Fieldbook", initials: "FB" },
}

const recording = (
  <Attachment size="sm">
    <AttachmentMedia>
      <AudioLinesIcon />
    </AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>reedbed-dusk.m4a</AttachmentTitle>
      <AttachmentDescription>Audio · 0:09</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
)

const reasoning = (
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status="done">
        <TraceIcon>4</TraceIcon>
        <TraceTitle>Reasoned in four steps</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      Read the description, shortlisted three reed-bed warblers, ruled out the
      two that winter in Africa, then matched the call.
    </TraceCollapsibleContent>
  </TraceCollapsible>
)

const THREAD: Note[] = [
  { id: "day", kind: "marker", text: "Sat 14 Nov" },
  {
    id: "n1",
    kind: "note",
    from: "mira",
    time: "16:52",
    body: "Small, brown, streaky, flicking its tail in the reed bed at dusk. Gone before I got the bins on it. Any idea?",
  },
  {
    id: "n2",
    kind: "note",
    from: "fieldbook",
    time: "16:52",
    body: "Three warblers fit a small brown bird in reeds: sedge, reed and Cetti’s. The date does most of the work. Sedge and reed warblers left for Africa weeks ago, and Cetti’s stays all winter.",
  },
  {
    id: "n3",
    kind: "note",
    from: "mira",
    time: "16:53",
    body: "It called once. Really loud, sudden. I got the end of it.",
  },
  {
    id: "n4",
    kind: "note",
    from: "mira",
    time: "16:53",
    body: recording,
  },
  {
    id: "n5",
    kind: "note",
    from: "fieldbook",
    time: "16:54",
    body: (
      <>
        <Trace>{reasoning}</Trace>
        That explosive burst is the giveaway: Cetti&rsquo;s warbler. The streaks
        were probably the light; a Cetti&rsquo;s is plain rufous-brown.
      </>
    ),
  },
  { id: "new", kind: "marker", text: "New", unread: true },
  {
    id: "n6",
    kind: "note",
    from: "mira",
    time: "16:55",
    body: "Brilliant. Log it for the reserve, please.",
  },
]

const LATER: Note[] = [
  {
    id: "n7",
    kind: "note",
    from: "fieldbook",
    time: "16:55",
    body: "Logged: Cetti’s warbler, north reed bed, 16:38, with your recording as evidence.",
  },
  {
    id: "n8",
    kind: "note",
    from: "mira",
    time: "16:56",
    body: "Thank you. Heading back before the tide comes over the path.",
  },
]

function Row({ note }: { note: Note }) {
  if (note.kind === "marker") {
    return (
      <Marker
        variant="separator"
        className={note.unread ? "text-ink-red" : undefined}
      >
        <MarkerContent>{note.text}</MarkerContent>
      </Marker>
    )
  }
  const who = PEOPLE[note.from]
  const mine = note.from === "mira"
  const isText = typeof note.body === "string"
  return (
    <Message align={mine ? "end" : "start"}>
      <MessageAvatar>
        <Avatar size="sm">
          <AvatarFallback name={who.name}>{who.initials}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <b>{who.name}</b>
          <time dateTime={`2026-11-14T${note.time}`}>{note.time}</time>
        </MessageHeader>
        {isText || !mine ? (
          <Bubble variant={mine ? "default" : "secondary"}>
            <BubbleContent className="flex flex-col gap-hair">
              {note.body}
            </BubbleContent>
          </Bubble>
        ) : (
          note.body
        )}
      </MessageContent>
    </Message>
  )
}

function Thread({
  notes,
  from = "end",
}: {
  notes: Note[]
  from?: "start" | "end"
}) {
  return (
    <div className="h-[26rem] max-w-[40rem] overflow-hidden rounded-sheet border border-rule bg-paper-2">
      <MessageScrollerProvider autoScroll defaultScrollPosition={from}>
        <MessageScroller>
          <MessageScrollerViewport aria-label="Identification thread">
            <MessageScrollerContent className="p-snug">
              {notes.map((note) => (
                <MessageScrollerItem key={note.id} messageId={note.id}>
                  <Row note={note} />
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          {from === "start" ? (
            <MessageScrollerButton direction="start" />
          ) : null}
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}

export default function MessageScrollerDemo() {
  const [shown, setShown] = useState(0)
  return (
    <>
      <DemoSection title="Following the latest note">
        <Thread notes={[...THREAD, ...LATER.slice(0, shown)]} />
        <div className="mt-tight flex items-center gap-tight">
          <Button
            variant="outline"
            size="sm"
            disabled={shown >= LATER.length}
            onClick={() => setShown((n) => n + 1)}
          >
            Next note
          </Button>
          <span className="label-mono text-ink-2">
            {shown >= LATER.length
              ? "Thread complete"
              : `${LATER.length - shown} more scripted`}
          </span>
        </div>
      </DemoSection>
      <DemoSection title="Reading from the top">
        <Thread notes={[...THREAD, ...LATER]} from="start" />
      </DemoSection>
    </>
  )
}
