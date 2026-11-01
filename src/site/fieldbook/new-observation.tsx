import { useState, type FormEvent } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/patina/ui/button"
import { Checkbox } from "@/patina/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/patina/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/patina/ui/field"
import { Input } from "@/patina/ui/input"
import { Label } from "@/patina/ui/label"
import { RadioGroup, RadioGroupItem } from "@/patina/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/patina/ui/select"
import { Textarea } from "@/patina/ui/textarea"
import { MOTIFS } from "@/patina/ink"
import { PLACES, type Observation } from "./data"

const places = PLACES.map((p) => ({ label: p, value: p }))

/** The "New observation" button and its dialog. Calls onAdd with the new record once the form is valid. */
export function NewObservation({
  onAdd,
  next,
}: {
  onAdd: (item: Observation) => void
  next: number
}) {
  const [open, setOpen] = useState(false)
  const [species, setSpecies] = useState("")
  const [count, setCount] = useState("1")
  const [place, setPlace] = useState<string>(PLACES[0])
  const [sure, setSure] = useState("confirmed")
  const [rare, setRare] = useState(false)
  const [notes, setNotes] = useState("")
  const [tried, setTried] = useState(false)

  const countValue = Number(count.replace(/[\s,]/g, ""))
  const errors = {
    species: species.trim()
      ? ""
      : "Name the species, even if you are not sure of it.",
    count:
      Number.isInteger(countValue) && countValue > 0
        ? ""
        : "Count in whole birds, one or more.",
  }
  const reset = () => [
    setSpecies(""),
    setCount("1"),
    setPlace(PLACES[0]),
    setSure("confirmed"),
    setRare(false),
    setNotes(""),
    setTried(false),
  ]

  function save(event: FormEvent) {
    event.preventDefault()
    setTried(true)
    if (errors.species || errors.count) return
    const id = `obs-${String(next).padStart(4, "0")}`
    onAdd({
      id,
      species: species.trim(),
      latin: "Species to be checked",
      place,
      seen: "2026-11-14T07:30",
      count: countValue,
      status: rare
        ? "rare"
        : sure === "confirmed"
          ? "confirmed"
          : "unconfirmed",
      motif: MOTIFS[next % MOTIFS.length] ?? "sprig",
      notes: notes.trim(),
    })
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" /> New observation
      </DialogTrigger>
      <DialogContent className="sm:max-w-[34rem]">
        <form onSubmit={save} noValidate>
          <DialogHeader>
            <DialogTitle>New observation</DialogTitle>
            <DialogDescription>
              Saltmarsh reserve · Sat 14 Nov, 07:30
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-snug">
            <Field data-invalid={tried && !!errors.species}>
              <FieldLabel htmlFor="obs-species">Species</FieldLabel>
              <Input
                id="obs-species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                aria-invalid={tried && !!errors.species}
                placeholder="Grey heron"
                className="w-[18rem] max-w-full"
                autoFocus
              />
              {tried && errors.species && (
                <FieldError>{errors.species}</FieldError>
              )}
            </Field>
            <div className="flex flex-wrap gap-x-section gap-y-snug">
              <Field data-invalid={tried && !!errors.count} className="w-auto">
                <FieldLabel htmlFor="obs-count">Count</FieldLabel>
                <Input
                  id="obs-count"
                  inputMode="numeric"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  aria-invalid={tried && !!errors.count}
                  className="w-[6rem]"
                />
                {tried && errors.count && (
                  <FieldError>{errors.count}</FieldError>
                )}
              </Field>
              <Field className="w-auto">
                <FieldLabel htmlFor="obs-place">Place</FieldLabel>
                <Select
                  items={places}
                  value={place}
                  onValueChange={(value) => setPlace(String(value))}
                >
                  <SelectTrigger id="obs-place" className="w-[12rem]">
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
            </div>
            <Field>
              <FieldLabel>How sure are you?</FieldLabel>
              <RadioGroup
                value={sure}
                onValueChange={(value) => setSure(String(value))}
                className="flex flex-wrap gap-x-section"
              >
                <Label>
                  <RadioGroupItem value="confirmed" /> Seen well
                </Label>
                <Label>
                  <RadioGroupItem value="unconfirmed" /> Glimpsed or heard
                </Label>
              </RadioGroup>
            </Field>
            <Label>
              <Checkbox
                checked={rare}
                onCheckedChange={(checked) => setRare(checked === true)}
              />{" "}
              Rare for this site
            </Label>
            <Field>
              <FieldLabel htmlFor="obs-notes">Notes</FieldLabel>
              <Textarea
                id="obs-notes"
                data-ruled="true"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was it doing?"
                className="max-w-[30rem]"
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save observation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
