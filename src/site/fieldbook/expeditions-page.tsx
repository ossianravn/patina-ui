import { useState } from "react"
import { Print } from "@/patina/print/print"
import { AspectRatio } from "@/patina/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarGroup } from "@/patina/ui/avatar"
import { Badge } from "@/patina/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/patina/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/patina/ui/hover-card"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/patina/ui/item"
import { when } from "./data"
import { EXPEDITIONS, MEMBERS, type Expedition } from "./expeditions"
import { PlanExpedition } from "./plan-expedition"

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

const count = (n: number) => (n === 1 ? "1 observation" : `${n} observations`)

/** A name that shows who the person is on hover or focus. */
function Person({ name }: { name: string }) {
  const member = MEMBERS[name]
  const led = EXPEDITIONS.filter((e) => e.leader === name).length
  return (
    <HoverCard>
      <HoverCardTrigger href="/fieldbook/expeditions">{name}</HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="flex items-center gap-tight">
          <Avatar>
            <AvatarFallback name={name}>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="m-0 font-semibold">{name}</p>
            <p className="m-0 text-small leading-small text-ink-2">
              {member?.role}
            </p>
          </div>
        </div>
        <p className="label-mono m-0 mt-tight text-ink-3">
          Leads {led} of {EXPEDITIONS.length} expeditions
        </p>
      </HoverCardContent>
    </HoverCard>
  )
}

function ExpeditionCard({ trip }: { trip: Expedition }) {
  return (
    <Card className="overflow-hidden pt-0">
      <AspectRatio ratio={5 / 2} className="rounded-none">
        <Print motif={trip.motif} seed={trip.id} />
      </AspectRatio>
      <CardHeader>
        <CardTitle>{trip.name}</CardTitle>
        <CardDescription>
          {when(trip.start)} · {trip.meet}
        </CardDescription>
        {trip.status === "today" && (
          <CardAction>
            <Badge>Today</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="m-0 text-ink-2">{trip.aim || "No aim written yet."}</p>
        <p className="m-0 mt-tight text-small leading-small text-ink-2">
          Led by <Person name={trip.leader} />
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <AvatarGroup>
          {trip.members.map((m) => (
            <Avatar key={m} size="sm">
              <AvatarFallback name={m}>{initials(m)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <span className="label-mono text-ink-2">
          {trip.members.length === 1
            ? "1 going"
            : `${trip.members.length} going`}
        </span>
      </CardFooter>
    </Card>
  )
}

/** Fieldbook's expeditions: today's and coming ones as cards, past ones as a list, and planning a new one. */
export function ExpeditionsPage() {
  const [trips, setTrips] = useState(EXPEDITIONS)
  const coming = trips
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.start.localeCompare(b.start))
  const done = trips.filter((t) => t.status === "done")

  return (
    <div className="mx-auto max-w-[72rem] px-snug pb-page pt-section sm:px-line">
      <header className="flex flex-wrap items-end justify-between gap-snug">
        <div>
          <p className="label-mono m-0 text-ink-2">
            Saltmarsh reserve · Winter
          </p>
          <h1 className="m-0 mt-hair text-h1">Expeditions</h1>
        </div>
        <PlanExpedition
          next={17 + trips.length - EXPEDITIONS.length}
          onPlan={(trip) => setTrips((list) => [...list, trip])}
        />
      </header>

      <section aria-labelledby="coming" className="mt-section">
        <h2 id="coming" className="label-mono m-0 mb-snug text-ink-2">
          Today and coming up
        </h2>
        <ul className="m-0 grid list-none gap-snug p-0 sm:grid-cols-2 lg:grid-cols-3">
          {coming.map((trip) => (
            <li key={trip.id} className="flex">
              <ExpeditionCard trip={trip} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="done" className="mt-section max-w-[44rem]">
        <h2 id="done" className="label-mono m-0 mb-tight text-ink-2">
          Done
        </h2>
        <ItemGroup>
          {done.map((trip) => (
            <Item key={trip.id} variant="outline">
              <ItemMedia>
                <Print motif={trip.motif} seed={trip.id} className="w-10" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{trip.name}</ItemTitle>
                <ItemDescription>
                  {when(trip.start)} · {trip.meet} · led by {trip.leader}
                </ItemDescription>
              </ItemContent>
              <span className="label-mono shrink-0 text-ink-2">
                {count(trip.observations.length)}
              </span>
            </Item>
          ))}
        </ItemGroup>
      </section>
    </div>
  )
}
