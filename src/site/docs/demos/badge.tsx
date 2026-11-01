import { CheckIcon, ImageIcon } from "lucide-react"
import { Badge } from "@/patina/ui/badge"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Badge",
  description: "A small stamp that labels an entry's status or kind.",
  item: "badge",
  group: "Data display",
}

const VARIANTS = [
  { variant: "default", label: "Verified" },
  { variant: "secondary", label: "Draft" },
  { variant: "destructive", label: "Rejected" },
  { variant: "outline", label: "Low tide" },
  { variant: "ghost", label: "12 photos" },
  { variant: "link", label: "Saltmarsh walk" },
] as const

const ENTRIES = [
  {
    species: "Grey heron",
    time: "07:42",
    status: "Verified",
    variant: "default",
  },
  {
    species: "Little egret",
    time: "08:05",
    status: "Draft",
    variant: "secondary",
  },
  {
    species: "Spoonbill?",
    time: "08:31",
    status: "Rejected",
    variant: "destructive",
  },
] as const

export default function BadgeDemo() {
  return (
    <>
      <DemoSection title="Variants">
        {VARIANTS.map(({ variant, label }) => (
          <StateRow key={variant} label={variant}>
            <Badge variant={variant}>{label}</Badge>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="As a link">
        <StateRow label="Hover and focus">
          <Badge render={<a href="#badge-list" />}>Verified</Badge>
          <Badge variant="outline" render={<a href="#badge-list" />}>
            Low tide
          </Badge>
          <Badge variant="destructive" render={<a href="#badge-list" />}>
            Rejected
          </Badge>
          <Badge variant="link" render={<a href="#badge-list" />}>
            Saltmarsh walk
          </Badge>
        </StateRow>
      </DemoSection>
      <DemoSection title="With icon and invalid">
        <StateRow label="Icon">
          <Badge>
            <CheckIcon data-icon="inline-start" /> Verified
          </Badge>
          <Badge variant="outline">
            <ImageIcon data-icon="inline-start" /> 3 photos
          </Badge>
        </StateRow>
        <StateRow label="Invalid">
          <Badge variant="outline" aria-invalid="true">
            No location
          </Badge>
        </StateRow>
      </DemoSection>
      <DemoSection title="In a list">
        <ul id="badge-list" className="m-0 max-w-[28rem] list-none p-0">
          {ENTRIES.map(({ species, time, status, variant }) => (
            <li
              key={species}
              className="flex items-center gap-tight border-b border-dashed border-rule py-tight"
            >
              <span className="font-semibold">{species}</span>
              <span className="font-label text-label text-ink-2">{time}</span>
              <Badge variant={variant} className="ml-auto">
                {status}
              </Badge>
            </li>
          ))}
        </ul>
      </DemoSection>
    </>
  )
}
