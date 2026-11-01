import { useMemo, useSyncExternalStore } from "react"
import { DownloadIcon } from "lucide-react"
import { useHighlightedCode } from "@/patina/hooks/use-highlighted-code"
import { cn } from "@/patina/lib/utils"
import { useAppearance } from "@/patina/theme"
import { Button } from "@/patina/ui/button"
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
import { Input } from "@/patina/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/patina/ui/tabs"
import { choicesOf } from "./presets"
import {
  download,
  readTheme,
  registryItem,
  slugOf,
  themeCss,
} from "./theme-export"

// The copy button's stamped frame (code-block.tsx), so Download reads as its twin.
const STAMP =
  "relative isolate min-w-[6.25rem] border-transparent bg-card text-ink-2 hover:bg-paper-3 hover:text-ink before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-sheet before:border-2 before:border-current before:opacity-70 before:[filter:var(--rough-2)] after:pointer-events-none after:absolute after:inset-[3px] after:-z-10 after:rounded-sheet after:border after:border-current after:opacity-40 after:[filter:var(--rough-2)]"

function ExportBlock({
  file,
  language,
  code,
  type,
  footer,
}: {
  file: string
  language: string
  code: string
  type: string
  footer?: string
}) {
  const lines = useHighlightedCode(code, language)
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{file}</CodeBlockTitle>
        <CodeBlockActions>
          <Button
            variant="outline"
            size="xs"
            className={STAMP}
            onClick={() => download(file, code, type)}
          >
            <DownloadIcon data-icon="inline-start" />
            Download
          </Button>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers className="max-h-[32rem]">
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
      {footer && (
        <CodeBlockFooter className="tracking-normal normal-case">
          <code>{footer}</code>
        </CodeBlockFooter>
      )}
    </CodeBlock>
  )
}

const noSubscription = () => () => {}

/** The current choices as a stylesheet and as a shadcn registry:theme item, named, copyable and downloadable. */
export function ExportPanel({
  name,
  onName,
  className,
}: {
  name: string
  onName: (name: string) => void
  className?: string
}) {
  const [appearance] = useAppearance()
  const choices = useMemo(() => choicesOf(appearance), [appearance])
  // The values come from the page's stylesheets, so they are read once the page has hydrated in the browser.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  )
  const theme = useMemo(
    () => (hydrated ? readTheme(choices) : undefined),
    [hydrated, choices],
  )
  const title = name.trim() || "Custom"
  const slug = slugOf(title)
  const css = theme ? themeCss(title, choices, theme) : ""
  const json = theme
    ? `${JSON.stringify(registryItem(title, css), null, 2)}\n`
    : ""

  return (
    <section
      id="export"
      aria-labelledby="export-title"
      className={cn("scroll-mt-24", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-x-section gap-y-tight">
        <h2 id="export-title" className="m-0 text-h2">
          Export
        </h2>
        <label className="flex items-center gap-tight">
          <span className="label-mono text-ink-2">Theme name</span>
          <Input
            value={name}
            onChange={(e) => onName(e.target.value)}
            spellCheck={false}
            className="w-[14rem]"
          />
        </label>
      </div>
      <Tabs defaultValue="css" className="mt-snug">
        <TabsList>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="shadcn">shadcn item</TabsTrigger>
        </TabsList>
        <TabsContent value="css">
          <ExportBlock
            file={`${slug}.css`}
            language="css"
            code={css}
            type="text/css"
          />
        </TabsContent>
        <TabsContent value="shadcn">
          <ExportBlock
            file={`${slug}.json`}
            language="json"
            code={json}
            type="application/json"
            footer={`npx shadcn add ./${slug}.json`}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
