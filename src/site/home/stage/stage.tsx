import type { ReactNode } from "react"
import { MousePointer2Icon, RotateCcwIcon, TextCursorIcon } from "lucide-react"
import { cn } from "@/patina/lib/utils"
import { Button } from "@/patina/ui/button"
import type { StageHandle } from "./use-stage"

// The frame a scene plays in: a clear stage on the page's own paper that clips what runs off it, the sheet fading
// out at its foot instead of being cut, the cursor, and a Replay button once the scene has played. The scene inside is an illustration, so it is inert and hidden from assistive
// technology; the caption beside it says what it shows. Replay sits under the well, outside the inert part.

export function Stage<S>({
  stage,
  label,
  className,
  children,
}: {
  stage: StageHandle<S>
  /** What the scene shows, for the Replay button's name. */
  label: string
  className?: string
  children: ReactNode
}) {
  const { stageRef, cursorRef, phase, replay } = stage
  return (
    <div className={cn("relative w-full max-w-[40rem] min-w-0", className)}>
      <div
        ref={stageRef}
        inert
        aria-hidden="true"
        data-phase={phase}
        className="@container relative h-[23rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-3rem),transparent)] select-none @max-[30rem]:h-[22rem]"
      >
        {children}
        <div
          ref={cursorRef}
          data-kind="arrow"
          className="group/cursor pointer-events-none absolute top-0 left-0 z-30 opacity-0 transition-opacity duration-200"
        >
          <div className="relative">
            <MousePointer2Icon
              className="absolute -top-[3px] -left-[3px] size-6 fill-ink stroke-paper stroke-[1.5] opacity-100 transition-opacity duration-150 group-data-[kind=text]/cursor:opacity-0 group-data-[kind=touch]/cursor:opacity-0"
              aria-hidden="true"
            />
            <TextCursorIcon
              className="absolute -top-3 -left-3 size-6 stroke-ink stroke-[1.75] opacity-0 transition-opacity duration-150 group-data-[kind=text]/cursor:opacity-100"
              aria-hidden="true"
            />
            <span className="absolute -top-5 -left-5 hidden size-10 rounded-full border-[1.5px] border-ink/60 bg-ink/15 group-data-[kind=touch]/cursor:block" />
          </div>
        </div>
      </div>
      {/* Replay sits under the well, in a row that is always there, so the page never shifts when it appears. */}
      <div className="mt-hair flex h-7 justify-end">
        {phase === "done" && (
          <Button
            variant="ghost"
            size="xs"
            onClick={replay}
            aria-label={`Replay: ${label}`}
            className="animate-in text-ink-2 duration-300 fade-in"
          >
            <RotateCcwIcon data-icon="inline-start" />
            Replay
          </Button>
        )}
      </div>
    </div>
  )
}
