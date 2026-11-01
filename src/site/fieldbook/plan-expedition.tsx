import { Fragment, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Button } from "@/patina/ui/button"
import { Calendar } from "@/patina/ui/calendar"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/patina/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/patina/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/patina/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/patina/ui/sheet"
import { Textarea } from "@/patina/ui/textarea"
import { MOTIFS } from "@/patina/ink"
import { PLACES } from "./data"
import { MEMBERS, type Expedition } from "./expeditions"

const TODAY = new Date(2026, 10, 14)
const PEOPLE = Object.keys(MEMBERS)
const places = PLACES.map((p) => ({ label: p, value: p }))
const trigger =
  "h-control w-[13rem] justify-start gap-hair px-tight font-ui text-ui font-normal tracking-normal normal-case data-[empty=true]:text-ink-3 [&_svg]:text-ink-2"

/** "Plan expedition" and its sheet: name, day and time, meeting place, who is coming and what for. */
export function PlanExpedition({
  next,
  onPlan,
}: {
  next: number
  onPlan: (expedition: Expedition) => void
}) {
  const anchor = useComboboxAnchor()
  const [open, setOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [name, setName] = useState("")
  const [day, setDay] = useState<Date | undefined>()
  const [time, setTime] = useState("07:00")
  const [meet, setMeet] = useState<string>(PLACES[0])
  const [who, setWho] = useState<string[]>(["Mira Okafor"])
  const [aim, setAim] = useState("")
  const [tried, setTried] = useState(false)
  const errors = {
    name: name.trim() ? "" : "Give the expedition a name.",
    day: day ? "" : "Pick the day.",
  }

  function save(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (errors.name || errors.day || !day) return
    onPlan({
      id: `exp-${next}`,
      name: name.trim(),
      start: `${format(day, "yyyy-MM-dd")}T${time}`,
      meet,
      leader: who[0] ?? "Mira Okafor",
      members: who.length ? who : ["Mira Okafor"],
      status: "planned",
      aim: aim.trim(),
      observations: [],
      motif: MOTIFS[next % MOTIFS.length] ?? "orbits",
    })
    setOpen(false)
    setName("")
    setDay(undefined)
    setAim("")
    setTried(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" /> Plan expedition
      </SheetTrigger>
      <SheetContent className="data-[side=right]:sm:max-w-[28rem]">
        <form
          onSubmit={save}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <SheetHeader>
            <SheetTitle>Plan an expedition</SheetTitle>
            <SheetDescription>
              It joins the list for everyone on the reserve.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-snug py-snug">
            <Field data-invalid={tried && !!errors.name}>
              <FieldLabel htmlFor="exp-name">Name</FieldLabel>
              <Input
                id="exp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={tried && !!errors.name}
                placeholder="Dawn roost count"
                className="w-[20rem] max-w-full"
              />
              {tried && errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>
            <div className="flex flex-wrap gap-x-section gap-y-snug">
              <Field data-invalid={tried && !!errors.day} className="w-auto">
                <FieldLabel id="exp-day-label">Day</FieldLabel>
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                  <PopoverTrigger
                    aria-labelledby="exp-day-label"
                    aria-invalid={tried && !!errors.day}
                    render={
                      <Button
                        variant="outline"
                        data-empty={!day}
                        className={trigger}
                      />
                    }
                  >
                    <CalendarIcon />
                    {day ? format(day, "EEE d MMM yyyy") : "Pick a day"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      today={TODAY}
                      defaultMonth={day ?? TODAY}
                      selected={day}
                      disabled={{ before: TODAY }}
                      onSelect={(d) => [setDay(d), setPickerOpen(false)]}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
                {tried && errors.day && <FieldError>{errors.day}</FieldError>}
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="exp-time">Time</FieldLabel>
                <Input
                  id="exp-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-[8rem]"
                />
              </Field>
            </div>
            <Field className="w-auto">
              <FieldLabel htmlFor="exp-meet">Meet at</FieldLabel>
              <Select
                items={places}
                value={meet}
                onValueChange={(v) => setMeet(String(v))}
              >
                <SelectTrigger id="exp-meet" className="w-[12rem]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {places.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Who is coming</FieldLabel>
              <Combobox
                multiple
                autoHighlight
                items={PEOPLE}
                value={who}
                onValueChange={(v) => setWho(v as string[])}
              >
                <ComboboxChips ref={anchor} className="w-full max-w-[24rem]">
                  <ComboboxValue>
                    {(values: string[]) => (
                      <Fragment>
                        {values.map((v) => (
                          <ComboboxChip key={v}>{v}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput
                          aria-label="Who is coming"
                          placeholder={values.length ? "" : "Add people"}
                        />
                      </Fragment>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                  <ComboboxEmpty>Nobody by that name.</ComboboxEmpty>
                  <ComboboxList>
                    {(person: string) => (
                      <ComboboxItem key={person} value={person}>
                        {person}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel htmlFor="exp-aim">What for</FieldLabel>
              <Textarea
                id="exp-aim"
                value={aim}
                onChange={(e) => setAim(e.target.value)}
                placeholder="Count the roost as it lifts at first light."
              />
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit">Save expedition</Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Cancel
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
