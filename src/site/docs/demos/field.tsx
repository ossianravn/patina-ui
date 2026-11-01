import { Card, CardContent } from "@/patina/ui/card"
import { Checkbox } from "@/patina/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import { RadioGroup, RadioGroupItem } from "@/patina/ui/radio-group"
import { Switch } from "@/patina/ui/switch"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Field",
  description:
    "Label, control, description and error kept together in one readable column, for building forms.",
  item: "field",
  group: "Forms",
}

const WEATHER = [
  { value: "clear", label: "Clear" },
  { value: "overcast", label: "Overcast" },
  { value: "rain", label: "Rain" },
]

const SURVEYS = [
  {
    value: "dawn",
    title: "Dawn count",
    hint: "Two hours from first light, all species.",
  },
  {
    value: "high-tide",
    title: "High-tide roost",
    hint: "Waders only, from the hide at high water.",
  },
]

export default function FieldDemo() {
  return (
    <>
      <DemoSection title="States">
        <StateRow label="Default">
          <Field className="w-auto">
            <FieldLabel htmlFor="field-species">Species</FieldLabel>
            <Input
              id="field-species"
              placeholder="Grey heron"
              aria-describedby="field-species-hint"
              className="w-[18rem]"
            />
            <FieldDescription id="field-species-hint">
              Common name, as in the county list.
            </FieldDescription>
          </Field>
        </StateRow>
        <StateRow label="Invalid">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-count">Count</FieldLabel>
            <Input
              id="field-count"
              inputMode="numeric"
              defaultValue="about 12"
              aria-invalid="true"
              className="w-[8rem]"
            />
            <FieldError>Enter a whole number of birds.</FieldError>
          </Field>
        </StateRow>
        <StateRow label="Several errors">
          <Field data-invalid="true" className="w-auto">
            <FieldLabel htmlFor="field-ring">Ring number</FieldLabel>
            <Input
              id="field-ring"
              defaultValue="EX-4"
              aria-invalid="true"
              className="w-[10rem]"
            />
            <FieldError
              errors={[
                { message: "Use the scheme's prefix, such as GR." },
                { message: "Ring numbers have six digits." },
              ]}
            />
          </Field>
        </StateRow>
        <StateRow label="Disabled">
          <Field data-disabled="true" className="w-auto">
            <FieldLabel htmlFor="field-recorder">Recorder</FieldLabel>
            <Input
              id="field-recorder"
              disabled
              defaultValue="Mira Okafor"
              className="w-[14rem]"
            />
            <FieldDescription>Set by the expedition lead.</FieldDescription>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Horizontal">
        <StateRow label="Switch">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <FieldContent>
              <FieldLabel htmlFor="field-offline">Offline maps</FieldLabel>
              <FieldDescription>
                Keep the survey area's tiles on this device.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-offline" defaultChecked />
          </Field>
        </StateRow>
        <StateRow label="Checkbox">
          <Field orientation="horizontal" className="max-w-[28rem]">
            <Checkbox id="field-photos" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="field-photos">Attach photos</FieldLabel>
              <FieldDescription>
                Photos upload when you are back in signal.
              </FieldDescription>
            </FieldContent>
          </Field>
        </StateRow>
      </DemoSection>
      <DemoSection title="Fieldset">
        <StateRow label="Radio set">
          <FieldSet className="w-auto">
            <FieldLegend variant="label">Weather</FieldLegend>
            <FieldDescription>At the start of the count.</FieldDescription>
            <RadioGroup defaultValue="overcast">
              {WEATHER.map(({ value, label }) => (
                <Field key={value} orientation="horizontal">
                  <RadioGroupItem value={value} id={`weather-${value}`} />
                  <FieldLabel htmlFor={`weather-${value}`}>{label}</FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
        <StateRow label="Choice cards">
          <FieldSet className="w-full max-w-[28rem]">
            <FieldLegend>Survey</FieldLegend>
            <RadioGroup defaultValue="dawn">
              {SURVEYS.map(({ value, title, hint }) => (
                <FieldLabel key={value} htmlFor={`survey-${value}`}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{title}</FieldTitle>
                      <FieldDescription>{hint}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value={value} id={`survey-${value}`} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a form">
        <Card className="w-full max-w-[28rem]">
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="form-site">Site</FieldLabel>
                <Input
                  id="form-site"
                  defaultValue="Blakeney Freshes"
                  className="w-[16rem]"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="form-date">Date</FieldLabel>
                <Input
                  id="form-date"
                  type="date"
                  defaultValue="2026-10-31"
                  className="w-[11rem]"
                />
              </Field>
              <FieldSeparator>Or</FieldSeparator>
              <Field orientation="horizontal">
                <Checkbox id="form-repeat" />
                <FieldLabel htmlFor="form-repeat">
                  Same site as yesterday
                </FieldLabel>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </DemoSection>
    </>
  )
}
