import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import { Button } from "@/patina/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/patina/ui/button-group"
import { Input } from "@/patina/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/patina/ui/select"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Button group",
  description:
    "Related actions joined in one frame, so a toolbar reads as a single control rather than a row of loose buttons.",
  item: "button-group",
  group: "Actions",
}

const UNITS = { m: "m", ft: "ft" }

export default function ButtonGroupDemo() {
  return (
    <>
      <DemoSection title="Orientation">
        <StateRow label="Horizontal">
          <ButtonGroup aria-label="Observation actions">
            <Button variant="outline">Edit</Button>
            <Button variant="outline">Duplicate</Button>
            <Button variant="outline">Archive</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Vertical">
          <ButtonGroup orientation="vertical" aria-label="Map zoom">
            <Button variant="outline" size="icon" aria-label="Zoom in">
              <PlusIcon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Zoom out">
              <MinusIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Nested">
          <ButtonGroup aria-label="Sighting pager">
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon"
                aria-label="Previous sighting"
              >
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next sighting">
                <ChevronRightIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button variant="outline">Share</Button>
            </ButtonGroup>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="With fields">
        <StateRow label="Input">
          <ButtonGroup className="w-[19rem] max-w-full">
            <Input aria-label="Search species" placeholder="Search species" />
            <Button variant="outline" aria-label="Search">
              <SearchIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Select">
          <ButtonGroup>
            <Input
              aria-label="Tide height"
              inputMode="decimal"
              defaultValue="3.2"
              className="w-[5rem]"
            />
            <Select items={UNITS} defaultValue="m">
              <SelectTrigger aria-label="Unit" className="w-[4.75rem]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(UNITS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Text">
          <ButtonGroup aria-label="Count">
            <ButtonGroupText>Count</ButtonGroupText>
            <Button variant="outline" size="icon" aria-label="One fewer">
              <MinusIcon />
            </Button>
            <ButtonGroupText className="w-[3rem] justify-center bg-card text-ink tabular-nums">
              12
            </ButtonGroupText>
            <Button variant="outline" size="icon" aria-label="One more">
              <PlusIcon />
            </Button>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
      <DemoSection title="Variants and states">
        <StateRow label="Separator">
          <ButtonGroup aria-label="Export">
            <Button variant="secondary">Export CSV</Button>
            <ButtonGroupSeparator />
            <Button variant="secondary">Export GPX</Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Small">
          <ButtonGroup aria-label="Tide window">
            <Button variant="outline" size="sm">
              Rising
            </Button>
            <Button variant="outline" size="sm">
              High
            </Button>
            <Button variant="outline" size="sm">
              Falling
            </Button>
          </ButtonGroup>
        </StateRow>
        <StateRow label="Disabled member">
          <ButtonGroup aria-label="Draft actions">
            <Button variant="outline">Save draft</Button>
            <Button variant="outline" disabled>
              Publish
            </Button>
          </ButtonGroup>
        </StateRow>
      </DemoSection>
    </>
  )
}
