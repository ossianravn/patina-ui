"use client"

import * as React from "react"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import { OTPInput, OTPInputContext } from "input-otp"

// One pen-drawn box per digit, square at control height, with the digit in the mono voice. The box that takes the
// next keystroke carries the page's dashed focus ring (at a shorter offset, so it clears its neighbours); invalid
// boxes take the red line and underline, disabled ones the dashed line. The separator is a short pen dash.
const DASH = sketch.line(2, 6.5, 14, 5.5, {
  seed: 61,
  strokeWidth: 1.8,
  roughness: 0.9,
})

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/input-otp flex items-center gap-tight has-disabled:cursor-not-allowed",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-hair", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex size-control items-center justify-center rounded-sheet border-[1.5px] border-line bg-card font-label text-lead leading-none font-medium text-ink tabular-nums transition-colors",
        "data-[active=true]:z-10 data-[active=true]:border-ink data-[active=true]:outline-2 data-[active=true]:outline-offset-2 data-[active=true]:outline-k-ink data-[active=true]:outline-dashed",
        "aria-invalid:border-ink-red aria-invalid:shadow-[inset_0_-2px_0_var(--ink-red)] group-has-[input[aria-invalid=true]]/input-otp:border-ink-red group-has-[input[aria-invalid=true]]/input-otp:shadow-[inset_0_-2px_0_var(--ink-red)]",
        "group-has-disabled/input-otp:border-dashed group-has-disabled/input-otp:bg-transparent group-has-disabled/input-otp:text-ink-faint",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1.1em] w-[1.5px] animate-caret-blink bg-ink duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center text-ink-3 group-has-disabled/input-otp:text-ink-faint"
      role="separator"
      {...props}
    >
      <svg
        viewBox="0 0 16 12"
        aria-hidden="true"
        className="h-3 w-4 overflow-visible"
        dangerouslySetInnerHTML={{ __html: DASH }}
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
