import { print } from "@/patina/ink"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/patina/ui/avatar"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Avatar",
  description:
    "A person's picture in a pen circle, or a monogram print seeded by their name when there is none.",
  item: "avatar",
}

// A stand-in photo: a horizon print rendered as a self-contained image, so the demo needs no network.
const PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  print({
    motif: "horizon",
    seed: "estuary at dawn",
    standalone: true,
    inks: { line: "#2b8a78", accent: "#c2602f", detail: "#4a2b5e" },
  }).svg.replace(
    "<defs>",
    '<rect x="-20" y="-20" width="280" height="280" fill="#f2ebdb"/><defs>',
  ),
)}`

const PEOPLE = ["Mira Okafor", "Tomas Lund", "Ines Park", "Kofi Mensah"]
const SIZES = ["sm", "default", "lg"] as const

export default function AvatarDemo() {
  return (
    <>
      <DemoSection title="Sizes">
        <StateRow label="Monogram">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback name="Mira Okafor">MO</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
        <StateRow label="Image">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarImage src={PHOTO} alt="Tomas Lund" />
              <AvatarFallback name="Tomas Lund">TL</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
        <StateRow label="Initials only">
          {SIZES.map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback>JB</AvatarFallback>
            </Avatar>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Seeded by name">
        <StateRow label="Each person">
          {PEOPLE.map((name) => (
            <Avatar key={name} size="lg">
              <AvatarFallback name={name} />
            </Avatar>
          ))}
        </StateRow>
      </DemoSection>
      <DemoSection title="Badge and group">
        <StateRow label="On expedition">
          <Avatar>
            <AvatarFallback name="Ines Park">IP</AvatarFallback>
            <AvatarBadge />
          </Avatar>
          <Avatar size="lg">
            <AvatarImage src={PHOTO} alt="Tomas Lund" />
            <AvatarBadge />
          </Avatar>
        </StateRow>
        <StateRow label="Group">
          <AvatarGroup>
            {PEOPLE.slice(0, 3).map((name) => (
              <Avatar key={name}>
                <AvatarFallback name={name} />
              </Avatar>
            ))}
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
        </StateRow>
        <StateRow label="In a byline">
          <p className="m-0 flex items-center gap-tight text-small leading-small text-ink-2">
            <Avatar size="sm">
              <AvatarFallback name="Mira Okafor" />
            </Avatar>
            Recorded by{" "}
            <span className="font-semibold text-ink">Mira Okafor</span> · 07:42
          </p>
        </StateRow>
      </DemoSection>
    </>
  )
}
