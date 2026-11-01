"use client"

import type * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { stream } from "@/patina/ink/seed"
import { sketch } from "@/patina/ink/rough"
import { Glyph } from "@/patina/marks/glyph"
import { useSeed } from "@/patina/print/seed-scope"
import { useAppearance } from "@/patina/theme"
import { buttonVariants } from "@/patina/ui/button"
import { Spinner } from "@/patina/ui/spinner"

// A slip of card stock taped to the page. The tape is seeded once per Toaster and leans the other way on every second
// slip; it hides at the calm level like all tape. It hangs off the content block's ::before (positioned by the slip),
// because sonner claims the slip's own pseudo-elements for its swipe and hover areas. A hand-drawn glyph names the
// kind: a tick for success, a bang for an error or warning, an "i" for information, a turning arc while loading.
// Actions are mono stamped buttons. The theme follows Patina's day or night paper instead of next-themes.
const INFO = [
  sketch.circle(12, 12, 20, { seed: 91 }),
  sketch.circle(12, 7.4, 2.6, {
    seed: 92,
    fill: "currentColor",
    fillStyle: "solid",
    roughness: 0.5,
  }),
  sketch.line(12, 11, 12, 17.5, { seed: 93, strokeWidth: 2.2, roughness: 0.6 }),
].join("")

const THEME = { system: "system", day: "light", night: "dark" } as const

const glyph = (node: React.ReactNode, className: string) => (
  <span className={className}>{node}</span>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const [{ theme }] = useAppearance()
  const place = stream(useSeed("toaster"), "tape")

  return (
    <Sonner
      theme={THEME[theme]}
      className="toaster group"
      icons={{
        success: glyph(
          <Glyph name="check" seed="toast-success" size={20} />,
          "text-k",
        ),
        info: glyph(
          <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: INFO }}
          />,
          "text-k-ink",
        ),
        warning: glyph(
          <Glyph name="bang" seed="toast-warning" size={20} />,
          "text-ink-orange",
        ),
        error: glyph(
          <Glyph name="bang" seed="toast-error" size={20} />,
          "text-ink-red",
        ),
        loading: glyph(<Spinner className="size-[1.125rem]" />, "text-ink-2"),
      }}
      style={
        {
          "--width": "22rem",
          "--toaster-tape-tilt": `${(place.signed() * 4).toFixed(1)}deg`,
          "--toaster-tape-shift": `${Math.round(place.signed() * 20)}%`,
        } as React.CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "sheet flex w-(--width) items-start gap-tight py-tight pr-tight pl-snug font-ui text-small leading-small text-ink data-[expanded=false]:data-[front=false]:*:opacity-0 [--tape-shift:var(--toaster-tape-shift)] [--tape-tilt:var(--toaster-tape-tilt)] even:[--tape-shift:calc(var(--toaster-tape-shift)*-1)] even:[--tape-tilt:calc(var(--toaster-tape-tilt)*-1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-k-ink focus-visible:outline-dashed",
          icon: "relative mt-px flex size-5 shrink-0 items-center justify-center [&>span]:flex",
          content: "flex min-w-0 flex-1 flex-col gap-0.5 py-0.5 before:tape",
          title: "font-ui text-small leading-small font-semibold text-ink",
          description: "text-small leading-small text-ink-2",
          actionButton: buttonVariants({ size: "xs", className: "shrink-0" }),
          cancelButton: buttonVariants({
            variant: "ghost",
            size: "xs",
            className: "shrink-0",
          }),
          closeButton: buttonVariants({
            variant: "ghost",
            size: "icon-xs",
            className:
              "absolute -top-2 -left-2 size-6 rounded-sheet border-[1.5px] border-line bg-card",
          }),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
