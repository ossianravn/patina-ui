import type { MotifName } from "@/patina/ink"
import { Print } from "@/patina/print/print"
import { Card } from "@/patina/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/patina/ui/carousel"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Carousel",
  description:
    "A row of cards to leaf through one at a time, such as the prints from a morning's sightings.",
  item: "carousel",
  group: "Data display",
}

const SIGHTINGS: {
  species: string
  latin: string
  place: string
  time: string
  motif: MotifName
}[] = [
  {
    species: "Curlew",
    latin: "Numenius arquata",
    place: "Tidal flats",
    time: "07:42",
    motif: "horizon",
  },
  {
    species: "Little egret",
    latin: "Egretta garzetta",
    place: "Sluice gate",
    time: "08:15",
    motif: "lino",
  },
  {
    species: "Avocet",
    latin: "Recurvirostra avosetta",
    place: "Saltings",
    time: "08:51",
    motif: "flow",
  },
  {
    species: "Marsh harrier",
    latin: "Circus aeruginosus",
    place: "Reed bed",
    time: "09:30",
    motif: "contours",
  },
  {
    species: "Brent goose",
    latin: "Branta bernicla",
    place: "Sea wall",
    time: "10:05",
    motif: "scatter",
  },
  {
    species: "Redshank",
    latin: "Tringa totanus",
    place: "North hide",
    time: "10:40",
    motif: "rings",
  },
]

function SightingCard({ sighting }: { sighting: (typeof SIGHTINGS)[number] }) {
  return (
    <Card size="sm" className="gap-hair overflow-hidden pt-0">
      <Print
        motif={sighting.motif}
        seed={`sighting-${sighting.species}`}
        className="aspect-square bg-paper-2"
      />
      <div className="flex flex-col gap-0.5 px-tight pt-hair">
        <span className="label-mono text-ink-3">
          {sighting.time} · {sighting.place}
        </span>
        <span className="font-read text-body leading-subhead font-semibold text-ink">
          {sighting.species}
        </span>
        <span className="text-small leading-small text-ink-2 italic">
          {sighting.latin}
        </span>
      </div>
    </Card>
  )
}

export default function CarouselDemo() {
  return (
    <>
      <DemoSection title="Horizontal">
        <div className="px-12">
          <Carousel
            opts={{ align: "start" }}
            aria-label="Sightings, Autumn wader count"
            className="max-w-[40rem]"
          >
            <CarouselContent>
              {SIGHTINGS.map((sighting, index) => (
                <CarouselItem
                  key={sighting.species}
                  aria-label={`${index + 1} of ${SIGHTINGS.length}`}
                  className="sm:basis-1/2 lg:basis-1/3"
                >
                  <SightingCard sighting={sighting} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </DemoSection>
      <DemoSection title="Vertical">
        <StateRow label="One at a time">
          <div className="py-14">
            <Carousel
              orientation="vertical"
              aria-label="Sightings at the North hide"
              className="w-[15rem]"
            >
              <CarouselContent className="h-[23rem]">
                {SIGHTINGS.slice(3).map((sighting, index) => (
                  <CarouselItem
                    key={sighting.species}
                    aria-label={`${index + 1} of 3`}
                  >
                    <SightingCard sighting={sighting} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </StateRow>
      </DemoSection>
    </>
  )
}
