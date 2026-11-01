"use client"

import * as React from "react"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import { stream } from "@/patina/ink/seed"
import { useSeed } from "@/patina/print/seed-scope"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { Button } from "@/patina/ui/button"

// A run of cards or prints laid on the desk. At the lively level each slide takes a slight seeded tilt (within
// --tilt-max, so the calm level stands them upright); the track keeps a little room so tilted corners are not
// clipped. The arrows are drawn by hand inside calm outline buttons. Tilt is a transform: slide sizes, snap points
// and hit areas stay where an upright slide would put them.
const pen = (seed: number) => ({ seed, strokeWidth: 2, roughness: 0.9 })
const ARROW_PREV = sketch.arrow(21, 12.5, 3, 11.5, pen(81), 0.06, 7)
const ARROW_NEXT = sketch.arrow(3, 11.5, 21, 12.5, pen(82), 0.06, 7)

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  )
  // Embla is the source of truth for where the track can go; read it as an external store rather than mirroring it
  // into state from an effect.
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (!api) return () => {}
      api.on("reInit", notify)
      api.on("select", notify)
      return () => {
        api.off("reInit", notify)
        api.off("select", notify)
      }
    },
    [api],
  )
  const canScrollPrev = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollPrev() ?? false,
    () => false,
  )
  const canScrollNext = React.useSyncExternalStore(
    subscribe,
    () => api?.canScrollNext() ?? false,
    () => false,
  )

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext],
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className={cn(
        "overflow-hidden",
        orientation === "horizontal"
          ? "-my-tight py-tight"
          : "-mx-tight px-tight",
      )}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-snug" : "-mt-snug flex-col",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()
  const turn = stream(useSeed("carousel-item"), "tilt").signed()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full [rotate:calc(var(--tilt-max)*var(--slide-turn))]",
        orientation === "horizontal" ? "pl-snug" : "pt-snug",
        className,
      )}
      style={
        {
          "--slide-turn": (turn * 1.4).toFixed(2),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

function Arrow({ svg }: { svg: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 overflow-visible rtl:-scale-x-100"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <Arrow svg={ARROW_PREV} />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <Arrow svg={ARROW_NEXT} />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
}
