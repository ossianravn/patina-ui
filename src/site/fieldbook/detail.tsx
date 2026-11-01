import { FileAudioIcon, ImageIcon } from "lucide-react"
import { Highlight } from "@/patina/marks/highlight"
import { MarginNote } from "@/patina/marks/notes"
import { Print } from "@/patina/print/print"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/patina/ui/attachment"
import { Badge } from "@/patina/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/patina/ui/breadcrumb"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/patina/ui/item"
import { Typography } from "@/patina/ui/typography"
import {
  OBSERVATIONS,
  STATUS_LABEL,
  tally,
  when,
  type Observation,
} from "./data"
import { DetailThread } from "./detail-thread"
import { detailOf } from "./details"
import { EXPEDITIONS } from "./expeditions"

const BADGE = {
  confirmed: "secondary",
  unconfirmed: "outline",
  rare: "default",
} as const

/** "a ==marked== phrase" → the phrase under a highlighter stroke. */
function Marked({ text }: { text: string }) {
  return text
    .split("==")
    .map((part, i) => (i % 2 ? <Highlight key={i}>{part}</Highlight> : part))
}

/** One observation's own page: what was seen, the field journal, attachments, conditions and the reviewers' notes. */
export function ObservationDetail({ item }: { item: Observation }) {
  const detail = detailOf(item)
  const expedition = EXPEDITIONS.find((e) => e.observations.includes(item.id))
  const nearby = OBSERVATIONS.filter(
    (o) => o.place === item.place && o.id !== item.id,
  )
  const facts: [string, string][] = [
    ["Observer", detail.observer],
    ["Seen", when(item.seen)],
    ["Count", tally(item.count)],
    ["Weather", detail.weather],
    ["Wind", detail.wind],
    ["Tide", detail.tide],
  ]

  return (
    <div className="mx-auto max-w-[72rem] px-snug pb-page pt-section sm:px-line">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/fieldbook">Observations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{item.species}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-snug flex flex-wrap items-center gap-x-line gap-y-snug">
        <Print
          motif={item.motif}
          seed={item.id}
          className="w-24 shrink-0 sm:w-32"
        />
        <div className="min-w-0">
          <p className="label-mono m-0 text-ink-2">
            {item.place} · {when(item.seen)}
          </p>
          <h1 className="m-0 mt-hair text-h1">{item.species}</h1>
          {item.latin && <p className="m-0 text-ink-2 italic">{item.latin}</p>}
          <p className="m-0 mt-tight flex flex-wrap items-center gap-tight">
            <Badge variant={BADGE[item.status]}>
              {STATUS_LABEL[item.status]}
            </Badge>
            <span className="label-mono text-ink-2">
              {tally(item.count)} seen
            </span>
          </p>
        </div>
      </header>

      <div className="mt-section grid gap-x-page gap-y-section lg:grid-cols-[minmax(0,1fr)_17rem]">
        <article className="min-w-0">
          <h2 className="label-mono m-0 mb-snug text-ink-2">Field journal</h2>
          <Typography>
            {detail.journal.map((p, i) => (
              <p key={i}>
                <Marked text={p} />
              </p>
            ))}
          </Typography>
          {detail.aside && (
            <MarginNote className="mt-tight" seed={item.id}>
              {detail.aside}
            </MarginNote>
          )}

          {detail.attachments.length > 0 && (
            <section aria-labelledby="files" className="mt-section">
              <h2 id="files" className="label-mono m-0 mb-snug text-ink-2">
                Attached
              </h2>
              <AttachmentGroup>
                {detail.attachments.map((file) => (
                  <Attachment key={file.name}>
                    <AttachmentMedia>
                      {file.kind === "audio" ? (
                        <FileAudioIcon />
                      ) : (
                        <ImageIcon />
                      )}
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{file.name}</AttachmentTitle>
                      <AttachmentDescription>
                        {file.kind === "audio" ? "Recording" : "Photo"} ·{" "}
                        {file.size}
                      </AttachmentDescription>
                    </AttachmentContent>
                  </Attachment>
                ))}
              </AttachmentGroup>
            </section>
          )}

          <DetailThread initial={detail.comments} />
        </article>

        <aside className="min-w-0">
          <h2 className="label-mono m-0 mb-tight text-ink-2">Conditions</h2>
          <dl className="m-0 border-t border-dashed border-rule">
            {facts.map(([term, value]) => (
              <div
                key={term}
                className="flex items-baseline justify-between gap-snug border-b border-dashed border-rule py-hair"
              >
                <dt className="label-mono text-ink-3">{term}</dt>
                <dd className="m-0 text-right tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          {expedition && (
            <p className="m-0 mt-snug text-small leading-small text-ink-2">
              Recorded on <a href="/fieldbook/expeditions">{expedition.name}</a>
              , led by {expedition.leader}.
            </p>
          )}

          {nearby.length > 0 && (
            <section aria-labelledby="nearby" className="mt-section">
              <h2 id="nearby" className="label-mono m-0 mb-tight text-ink-2">
                Also at {item.place}
              </h2>
              <ItemGroup>
                {nearby.map((o) => (
                  <Item
                    key={o.id}
                    size="sm"
                    render={<a href={`/fieldbook/observations/${o.id}`} />}
                  >
                    <ItemMedia>
                      <Print motif={o.motif} seed={o.id} className="w-9" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{o.species}</ItemTitle>
                      <ItemDescription>{when(o.seen)}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
