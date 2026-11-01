import { FileJsonIcon, FileCodeIcon, TerminalIcon } from "lucide-react"
import { useHighlightedCode } from "@/patina/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/patina/ui/code-block"
import { DemoSection, StateRow, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Code block",
  description:
    "Code or data set in mono on a recessed sheet, with line numbers, highlighting and a copy button.",
  item: "code-block",
  group: "Data display",
}

const RECORD = `{
  "id": "obs-2026-11-14-0412",
  "observer": "Mira Okafor",
  "site": "North reed bed",
  "seen": "2026-11-14T16:38:00Z",
  "species": "Cetti's warbler",
  "scientific": "Cettia cetti",
  "confidence": 0.82,
  "evidence": ["call", "habitat", "season"],
  "attachments": ["reedbed-dusk.m4a", "reedbed-dusk.jpg"],
  "reviewed": false
}
`

const PLATE = `import { print } from "@/patina/ink"

// Same seed, same plate, in every build.
const { svg } = print({
  motif: "horizon",
  seed: "obs-2026-11-14-0412",
  inks: "field",
  inks: "patina",
})

const plate = document.querySelector("#plate")
plate?.insertAdjacentHTML("beforeend", svg)
`

const INSTALL = "npx shadcn add @patina/code-block"

const ERROR = `Error: unknown motif "heron"
    at print (src/patina/ink/print-svg.ts:41:22)
    at plate (src/site/fieldbook/plate.ts:12:3)`

type Mark = "added" | "removed" | "highlighted"

function Code({
  code,
  language,
  marks = {},
  lineNumbers = true,
}: {
  code: string
  language: string
  marks?: Record<number, Mark>
  lineNumbers?: boolean
}) {
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlockContent lineNumbers={lineNumbers}>
      {lines.map((line, index) => (
        <CodeBlockLine key={index} variant={marks[index + 1]}>
          {line}
        </CodeBlockLine>
      ))}
    </CodeBlockContent>
  )
}

export default function CodeBlockDemo() {
  return (
    <>
      <DemoSection title="The observation">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileJsonIcon />
              observation.json
            </CodeBlockTitle>
            <span>JSON</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={RECORD} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code code={RECORD} language="json" marks={{ 6: "highlighted" }} />
        </CodeBlock>
      </DemoSection>
      <DemoSection title="A print, from code">
        <CodeBlock className="max-w-[40rem]">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <FileCodeIcon />
              plate.ts
            </CodeBlockTitle>
            <span>TypeScript</span>
            <CodeBlockActions>
              <CodeBlockCopyButton value={PLATE} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <Code
            code={PLATE}
            language="ts"
            marks={{ 7: "removed", 8: "added" }}
          />
          <CodeBlockFooter>Seeded · same output everywhere</CodeBlockFooter>
        </CodeBlock>
      </DemoSection>
      <DemoSection title="Variants">
        <StateRow label="Shell, small">
          <CodeBlock size="sm" className="max-w-[26rem]">
            <CodeBlockActions>
              <CodeBlockCopyButton value={INSTALL} />
            </CodeBlockActions>
            <Code code={INSTALL} language="bash" lineNumbers={false} />
          </CodeBlock>
        </StateRow>
        <StateRow label="Destructive">
          <CodeBlock
            variant="destructive"
            className="max-w-[40rem] contain-inline-size"
          >
            <CodeBlockHeader>
              <CodeBlockTitle>
                <TerminalIcon />
                npm run dev
              </CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>{ERROR}</CodeBlockContent>
          </CodeBlock>
        </StateRow>
        <StateRow label="Wrapped">
          <CodeBlock size="sm" className="max-w-[22rem]">
            <CodeBlockContent wrap lineNumbers>
              {`curl -s "https://fieldbook.example/api/observations?site=north-reed-bed&species=cettia-cetti&from=2026-11-01"`}
            </CodeBlockContent>
          </CodeBlock>
        </StateRow>
      </DemoSection>
    </>
  )
}
