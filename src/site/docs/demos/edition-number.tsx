import { EditionNumber } from "@/patina/extras/edition-number"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Edition number",
  description:
    "Numbers an entry in a run, zero padded in mono so a column of numbers lines up: No. 0012, or No. 0012 of 0200.",
  item: "edition-number",
  group: "Patina extras",
}

export default function EditionNumberDemo() {
  return (
    <>
      <DemoSection title="Inline">
        <p className="m-0 max-w-measure text-body leading-body">
          Mira logged the grey heron as{" "}
          <EditionNumber value={412} className="text-[0.86em]" />, the first
          record of the winter wader count, and the reserve&rsquo;s printed tide
          card for November is{" "}
          <EditionNumber value={12} of={200} className="text-[0.86em]" />.
        </p>
      </DemoSection>
      <DemoSection title="As a kicker">
        <div className="flex max-w-measure flex-col gap-hair">
          <span className="label-mono text-k-ink">
            <EditionNumber value={412} /> · Tidal flats
          </span>
          <span className="font-read text-h2 leading-heading font-semibold">
            Grey heron
          </span>
          <span className="text-ui leading-small text-ink-2">
            Still for eleven minutes, then a single strike.
          </span>
        </div>
      </DemoSection>
      <DemoSection title="Padding and totals">
        <StateRow label="digits 4">
          <span className="label-mono text-ink-2">
            <EditionNumber value={7} />
          </span>
        </StateRow>
        <StateRow label="digits 2">
          <span className="label-mono text-ink-2">
            <EditionNumber value={7} digits={2} />
          </span>
        </StateRow>
        <StateRow label="of a total">
          <span className="label-mono text-ink-2">
            <EditionNumber value={12} of={200} />
          </span>
        </StateRow>
        <StateRow label="in a column">
          <span className="label-mono flex flex-col text-ink-2">
            <EditionNumber value={1} />
            <EditionNumber value={48} />
            <EditionNumber value={230} />
            <EditionNumber value={1411} />
          </span>
        </StateRow>
        <StateRow label="other prefix">
          <span className="label-mono text-ink-2">
            <EditionNumber value={3} digits={2} prefix="Vol." label="Volume" />
          </span>
        </StateRow>
      </DemoSection>
    </>
  )
}
