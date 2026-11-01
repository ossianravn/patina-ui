import { Glyph } from "@/patina/marks/glyph"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/patina/ui/bubble"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Bubble",
  description:
    "A slip of paper holding one turn of a conversation, cut from a different stock for each side.",
  item: "bubble",
  group: "Conversation",
}

const VARIANTS = [
  ["default", "Small, brown, streaky, flicking its tail in the reed bed."],
  ["secondary", "Three warblers fit: sedge, reed and Cetti’s."],
  ["muted", "The date rules out two of them."],
  ["tinted", "Play the recording again"],
  ["outline", "Show me a Cetti’s warbler"],
  ["ghost", "Logged at 16:55 in the north reed bed."],
  ["destructive", "The recording is empty. Try attaching it again."],
] as const

const SUGGESTIONS = ["Play the recording again", "Compare with a sedge warbler"]

export default function BubbleDemo() {
  return (
    <>
      <DemoSection title="Stocks">
        {VARIANTS.map(([variant, text]) => (
          <StateRow key={variant} label={variant}>
            <Bubble variant={variant}>
              <BubbleContent>{text}</BubbleContent>
            </Bubble>
          </StateRow>
        ))}
      </DemoSection>
      <DemoSection title="Both sides">
        <BubbleGroup className="max-w-[38rem] gap-tight">
          <Bubble align="end">
            <BubbleContent>
              Small, brown, streaky, flicking its tail in the reed bed at dusk.
              Gone before I got the bins on it.
            </BubbleContent>
          </Bubble>
          <Bubble variant="secondary">
            <BubbleContent>
              Three warblers fit a small brown bird in reeds: sedge, reed and
              Cetti&rsquo;s. The date does most of the work. Sedge and reed
              warblers left for Africa weeks ago; Cetti&rsquo;s stays all
              winter.
            </BubbleContent>
          </Bubble>
          <Bubble align="end">
            <BubbleContent>It called once. Really loud, sudden.</BubbleContent>
          </Bubble>
          <Bubble variant="secondary" className="mb-tight">
            <BubbleContent>
              That explosive burst is the giveaway: Cetti&rsquo;s warbler.
            </BubbleContent>
            <BubbleReactions>
              <Glyph name="check" size={12} className="text-k-ink" />2
            </BubbleReactions>
          </Bubble>
        </BubbleGroup>
      </DemoSection>
      <DemoSection title="As buttons">
        <StateRow label="Suggestions">
          {SUGGESTIONS.map((text) => (
            <Bubble key={text} variant="outline">
              <BubbleContent render={<button type="button" />}>
                {text}
              </BubbleContent>
            </Bubble>
          ))}
        </StateRow>
        <StateRow label="Tinted link">
          <Bubble variant="tinted">
            <BubbleContent render={<a href="#cettis-warbler" />}>
              Cetti&rsquo;s warbler in the field guide
            </BubbleContent>
          </Bubble>
        </StateRow>
      </DemoSection>
    </>
  )
}
