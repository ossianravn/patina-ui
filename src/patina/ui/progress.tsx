"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/patina/lib/utils"

// A pen-line track on toned paper; the done part is inked in the region's drum with a hatch, the way a riso fill
// prints. Indeterminate progress hatches the whole track and pulses slowly. Label in the reading voice, value mono.

function Progress({
  className,
  children,
  value,
  locale = "en-US",
  ...props
}: ProgressPrimitive.Root.Props) {
  // A fixed locale by default, so the value reads the same on the server and in the browser (no hydration mismatch).
  return (
    <ProgressPrimitive.Root
      value={value}
      locale={locale}
      data-slot="progress"
      className={cn(
        "flex flex-wrap items-baseline gap-x-tight gap-y-hair",
        className,
      )}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-3 w-full items-center overflow-x-hidden rounded-sheet border-[1.5px] border-line bg-paper-3",
        className,
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(
        "h-full bg-k/35 [background-image:repeating-linear-gradient(-45deg,var(--k)_0_1.5px,transparent_1.5px_4.5px)] transition-[width] duration-200 ease-out data-indeterminate:w-full data-indeterminate:animate-pulse data-indeterminate:[animation-duration:2.4s]",
        className,
      )}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cn(
        "text-small leading-small font-semibold text-ink",
        className,
      )}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto font-label text-label text-ink-2 tabular-nums",
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}
