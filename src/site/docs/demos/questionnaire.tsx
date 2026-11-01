import { useState } from "react"
import {
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
} from "@/patina/ui/questionnaire"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Questionnaire",
  description:
    "A short run of questions answered one card at a time, such as setting up a new expedition.",
  item: "questionnaire",
  group: "Forms",
}

const PLACES = [
  ["tidal-flats", "Tidal flats", "Low tide only · 2 hours either side"],
  ["reed-bed", "Reed bed", "Boardwalk from the North hide"],
  ["saltings", "Saltings", "Wellingtons · creeks fill fast"],
  ["sea-wall", "Sea wall", "Closed for repairs until December"],
] as const
const COUNTS = [
  ["waders", "Waders"],
  ["wildfowl", "Wildfowl"],
  ["raptors", "Raptors"],
  ["plants", "Saltmarsh plants"],
] as const

function NewExpedition() {
  const [saved, setSaved] = useState<string | null>(null)
  if (saved) {
    return (
      <p className="m-0 text-body leading-body text-ink">
        Expedition saved: <strong>{saved}</strong>.{" "}
        <button
          type="button"
          className="text-k-ink underline decoration-k-ink/50 underline-offset-[0.3em]"
          onClick={() => setSaved(null)}
        >
          Plan another
        </button>
      </p>
    )
  }
  return (
    <Questionnaire
      shortcuts="letters"
      className="max-w-[34rem]"
      onSubmit={(event) => {
        event.preventDefault()
        const name = new FormData(event.currentTarget).get("name")
        setSaved(String(name || "Untitled expedition"))
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="place" required>
        <QuestionnaireTitle>Where are you heading?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Sat 14 Nov · high water 11:52 at the sluice gate
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {PLACES.map(([value, label, note]) => (
            <QuestionnaireChoice
              key={value}
              value={value}
              disabled={value === "sea-wall"}
            >
              {label}
              <QuestionnaireChoiceDescription>
                {note}
              </QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="counts" multiple>
        <QuestionnaireTitle>What will you count?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose any that apply.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {COUNTS.map(([value, label]) => (
            <QuestionnaireChoice key={value} value={value}>
              {label}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="name">
        <QuestionnaireTitle>Name the expedition</QuestionnaireTitle>
        <QuestionnaireInput
          placeholder="Autumn wader count"
          className="max-w-[20rem]"
        />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit>Save expedition</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export default function QuestionnaireDemo() {
  return (
    <>
      <DemoSection title="New expedition">
        <NewExpedition />
      </DemoSection>
      <DemoSection title="Unanswered">
        <Questionnaire className="max-w-[34rem]">
          <QuestionnaireItem name="tide" required invalid>
            <QuestionnaireTitle>
              Which tide will you walk on?
            </QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="rising">Rising</QuestionnaireChoice>
              <QuestionnaireChoice value="falling">Falling</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireSubmit>Continue</QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
      </DemoSection>
    </>
  )
}
