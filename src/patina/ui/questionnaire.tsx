"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"

import { buttonVariants, type Button } from "@/patina/ui/button"
import {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
  TICK,
} from "@/patina/ui/questionnaire-choice"

// Questions as a stack of index cards. The form is the top card; the cards still to come peek out beneath it, one
// edge per remaining question up to two, leaning by a fixed share of --tilt-max (so they stand straight when calm).
// The current card is calm: pen-boxed choices that take a hand tick or an inked dot in the drum, mono keycaps for
// shortcuts, stamped buttons (the answering parts live in questionnaire-choice.tsx). Progress is a row of ringed
// mono numbers; a passed question's ring holds a tick.
const ring = (index: number, current: boolean) =>
  sketch.circle(14, 14, 25, {
    seed: 100 + index,
    stroke: current ? "var(--ink)" : "var(--rule)",
    strokeWidth: current ? 1.5 : 1.3,
    roughness: 0.9,
  })

const card = "sheet pointer-events-none absolute inset-0"

function Questionnaire({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn(
        "group/questionnaire relative isolate mb-snug flex w-full min-w-0 flex-col gap-snug p-snug",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="questionnaire-stack"
        className={cn(
          card,
          "-z-30 hidden translate-x-1.5 translate-y-5 outline outline-line/20 brightness-[0.94] [rotate:calc(var(--tilt-max)*1.6)]",
          "group-has-[[data-slot=questionnaire-item][data-active]~[data-slot=questionnaire-item]~[data-slot=questionnaire-item]]/questionnaire:block",
        )}
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-stack"
        className={cn(
          card,
          "-z-20 hidden -translate-x-1 translate-y-2.5 outline outline-line/20 brightness-[0.97] [rotate:calc(var(--tilt-max)*-1.2)]",
          "group-has-[[data-slot=questionnaire-item][data-active]~[data-slot=questionnaire-item]]/questionnaire:block",
        )}
      />
      <span aria-hidden="true" className={cn(card, "-z-10")} />
      {children}
    </QuestionnairePrimitive.Root>
  )
}

function ProgressRings({ current, total }: { current: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="w-2.5 border-t border-dashed border-rule" />
          )}
          <span
            data-state={
              i + 1 < current ? "done" : i + 1 === current ? "current" : "next"
            }
            className="relative flex size-7 items-center justify-center font-label text-label font-semibold text-ink-3 tabular-nums data-[state=current]:text-ink"
          >
            <svg
              viewBox="0 0 28 28"
              className="absolute inset-0 size-full overflow-visible"
              dangerouslySetInnerHTML={{ __html: ring(i, i + 1 === current) }}
            />
            {i + 1 < current ? (
              <svg
                viewBox="0 0 26 26"
                className="relative size-[1.05rem] overflow-visible"
                dangerouslySetInnerHTML={{ __html: TICK }}
              />
            ) : (
              <span className="relative">{i + 1}</span>
            )}
          </span>
        </React.Fragment>
      ))}
    </span>
  )
}

function QuestionnaireProgress({
  className,
  children,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cn(
        "flex min-h-[1lh] w-fit items-center gap-tight text-ink-2",
        className,
      )}
      render={(rendered, state) => {
        const { current, total } = state as { current: number; total: number }
        return (
          <div {...rendered}>
            <ProgressRings current={current} total={total} />
            {children ? (
              <span className="label-mono text-ink-2 tabular-nums">
                {children}
              </span>
            ) : null}
          </div>
        )
      }}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "m-0 flex min-w-0 animate-in flex-col gap-tight border-0 p-0 duration-200 fade-in-0 slide-in-from-bottom-1 outline-none",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "float-left mb-0 w-full p-0 font-read text-lead leading-subhead font-semibold text-pretty text-ink [&:not(:has(~[data-slot=questionnaire-description]))]:mb-hair",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn(
        "m-0 -mt-1 mb-hair text-small leading-small text-pretty text-ink-2",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn(
        "group/questionnaire-choices grid min-w-0 gap-hair",
        className,
      )}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-control w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-tight border-t border-dashed border-rule pt-snug",
        className,
      )}
      {...props}
    />
  )
}

type Nav = Pick<React.ComponentProps<typeof Button>, "size" | "variant">
type NavPrimitive = typeof QuestionnairePrimitive.Next

// Previous, Skip, Next and Submit share one shape: a stamped button in a fixed column of the actions grid.
function navButton(
  Primitive: NavPrimitive,
  slot: string,
  place: string,
  fallback: string,
  defaultVariant: Nav["variant"],
) {
  return function QuestionnaireNavButton({
    children,
    className,
    size = "default",
    variant = defaultVariant,
    ...props
  }: React.ComponentProps<NavPrimitive> & Nav) {
    return (
      <Primitive
        data-slot={slot}
        data-size={size}
        data-variant={variant}
        className={cn(buttonVariants({ size, variant }), place, className)}
        {...props}
      >
        {children ?? fallback}
      </Primitive>
    )
  }
}

const QuestionnairePrevious = navButton(
  QuestionnairePrimitive.Previous,
  "questionnaire-previous",
  "col-start-1 row-start-1 justify-self-start",
  "Previous",
  "ghost",
)
const QuestionnaireSkip = navButton(
  QuestionnairePrimitive.Skip,
  "questionnaire-skip",
  "col-start-2 row-start-1 justify-self-end",
  "Skip",
  "outline",
)
const QuestionnaireNext = navButton(
  QuestionnairePrimitive.Next,
  "questionnaire-next",
  "col-start-3 row-start-1 justify-self-end",
  "Next",
  "default",
)
const QuestionnaireSubmit = navButton(
  QuestionnairePrimitive.Submit,
  "questionnaire-submit",
  "col-start-3 row-start-1 justify-self-end",
  "Submit",
  "default",
)

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
