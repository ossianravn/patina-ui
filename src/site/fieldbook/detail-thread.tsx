import { useState, type FormEvent } from "react"
import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import { Button } from "@/patina/ui/button"
import { Field, FieldLabel } from "@/patina/ui/field"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "@/patina/ui/message"
import { Textarea } from "@/patina/ui/textarea"
import type { Comment } from "./details"

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

/** The reviewers' notes on an observation, and a box to add one. New notes live until reload. */
export function DetailThread({ initial }: { initial: Comment[] }) {
  const [notes, setNotes] = useState(initial)
  const [draft, setDraft] = useState("")

  function add(event: FormEvent) {
    event.preventDefault()
    const body = draft.trim()
    if (!body) return
    setNotes((list) => [
      ...list,
      { author: "Mira Okafor", time: "Sat 14 Nov, 09:30", body },
    ])
    setDraft("")
  }

  return (
    <section aria-labelledby="thread" className="mt-section">
      <h2 id="thread" className="label-mono m-0 mb-snug text-ink-2">
        Notes from reviewers
      </h2>
      {notes.length > 0 ? (
        <MessageGroup className="gap-snug">
          {notes.map((note, i) => (
            <Message key={i}>
              <MessageAvatar>
                <Avatar>
                  <AvatarFallback name={note.author}>
                    {initials(note.author)}
                  </AvatarFallback>
                </Avatar>
              </MessageAvatar>
              <MessageContent>
                <MessageHeader>
                  <b>{note.author}</b>
                  <time>{note.time}</time>
                </MessageHeader>
                <p className="m-0 max-w-measure">{note.body}</p>
              </MessageContent>
            </Message>
          ))}
        </MessageGroup>
      ) : (
        <p className="m-0 text-ink-2">No notes yet.</p>
      )}
      <form
        onSubmit={add}
        className="mt-snug flex max-w-measure flex-col gap-tight"
      >
        <Field>
          <FieldLabel htmlFor="note">Add a note</FieldLabel>
          <Textarea
            id="note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="A second look, a question, a correction"
          />
        </Field>
        <Button type="submit" variant="outline" className="self-start">
          Add note
        </Button>
      </form>
    </section>
  )
}
