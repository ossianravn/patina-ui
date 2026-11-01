"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"
import { cn } from "@/patina/lib/utils"
import { sketch } from "@/patina/ink/rough"
import { Glyph } from "@/patina/marks/glyph"

// The answering parts of a questionnaire card: a choice is a pen-bordered row whose box takes a hand tick (several
// answers) or whose circle takes an inked dot (one answer), both in the drum; a typed answer is a control-field;
// the error prints in the red text ink beside a drawn bang. Shortcut letters sit on mono keycaps.
export const TICK = sketch.curve(
  [
    [4, 13],
    [10, 20],
    [24, 2],
  ],
  { seed: 26, stroke: "var(--k)", strokeWidth: 2.8, roughness: 0.8 },
)
export const DOT = sketch.circle(12, 12, 11, {
  seed: 33,
  stroke: "var(--k)",
  strokeWidth: 1.2,
  fill: "var(--k)",
  fillStyle: "solid",
  roughness: 1.1,
})

function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        "group/questionnaire-choice relative flex min-h-control cursor-pointer items-start gap-tight rounded-sheet border-[1.5px] border-rule bg-card px-tight py-2.5 text-start text-ui leading-ui text-ink transition-colors select-none hover:border-line has-[>input:focus-visible]:outline-2 has-[>input:focus-visible]:outline-offset-4 has-[>input:focus-visible]:outline-k-ink has-[>input:focus-visible]:outline-dashed data-checked:border-line data-checked:bg-paper-2 data-invalid:border-ink-red",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-dashed data-disabled:bg-transparent data-disabled:text-ink-faint",
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 focus-visible:outline-none"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative mt-[0.15rem] flex size-[1.15rem] shrink-0 items-center justify-center rounded-[3px_5px_4px_3px] border-[1.5px] border-line bg-card group-data-checked/questionnaire-choice:border-ink group-data-disabled/questionnaire-choice:border-dashed group-data-[type=radio]/questionnaire-choice:rounded-full"
      >
        <svg
          viewBox="0 0 24 24"
          data-slot="questionnaire-choice-indicator-dot"
          className="hidden size-3 overflow-visible group-data-checked/questionnaire-choice:block group-data-[type=checkbox]/questionnaire-choice:hidden!"
          dangerouslySetInnerHTML={{ __html: DOT }}
        />
        <svg
          viewBox="0 0 26 26"
          data-slot="questionnaire-choice-indicator-check"
          className="absolute -top-1.5 -left-0.5 hidden size-[1.6rem] overflow-visible group-data-checked/questionnaire-choice:block group-data-[type=radio]/questionnaire-choice:hidden!"
          dangerouslySetInnerHTML={{ __html: TICK }}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className="pointer-events-none ms-auto mt-0.5 hidden h-5 min-w-5 shrink-0 items-center justify-center rounded-sheet border border-b-[2.5px] border-line bg-card px-1 font-label text-label leading-none font-semibold text-ink-2 group-data-[shortcut]/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-small leading-small text-ink-2", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "control-field h-control w-full min-w-0 px-tight py-hair",
          className,
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn(
        "m-0 flex items-start gap-hair text-small leading-small text-ink-red",
        className,
      )}
      render={({ children, ...rendered }) => (
        <p {...rendered}>
          <Glyph
            name="bang"
            seed="questionnaire-error"
            size={16}
            className="mt-[0.15em]"
          />
          <span className="min-w-0">{children as React.ReactNode}</span>
        </p>
      )}
      {...props}
    />
  )
}

export {
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireError,
  QuestionnaireInput,
}
