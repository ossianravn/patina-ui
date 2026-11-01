import type * as React from "react"
import type { GrammarState, HighlighterCore, ThemedToken } from "shiki/core"

// Syntax highlighting with Shiki, loaded on first use: the core, the engine and each grammar are separate chunks, so
// a page pays nothing until a code block asks. Colours come from Shiki's CSS-variables theme, and every variable
// falls back to a Patina text ink, so highlighted code reads at 4.5:1 on paper-2 in day and night paper alike.
// Override any of them (--shiki-token-keyword and so on) on a parent to re-ink the code.

// Add the languages you need. Each one loads the first time it is used.
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

// Token roles to text inks. Comments use ink-3, the quietest ink that still reads as text.
const INKS = {
  foreground: "var(--ink)",
  background: "transparent",
  "token-constant": "var(--ink-blue)",
  "token-string": "var(--ink-green)",
  "token-comment": "var(--ink-3)",
  "token-keyword": "var(--ink-violet)",
  "token-parameter": "var(--ink-orange)",
  "token-function": "var(--ink-blue)",
  "token-string-expression": "var(--ink-green)",
  "token-punctuation": "var(--ink-2)",
  "token-link": "var(--ink-blue)",
  "token-inserted": "var(--ink-green)",
  "token-deleted": "var(--ink-red)",
  "token-changed": "var(--ink-orange)",
  "ansi-black": "var(--ink)",
  "ansi-red": "var(--ink-red)",
  "ansi-green": "var(--ink-green)",
  "ansi-yellow": "var(--ink-orange)",
  "ansi-blue": "var(--ink-blue)",
  "ansi-magenta": "var(--ink-violet)",
  "ansi-cyan": "var(--ink-blue)",
  "ansi-white": "var(--ink-2)",
  "ansi-bright-black": "var(--ink-3)",
  "ansi-bright-red": "var(--ink-red)",
  "ansi-bright-green": "var(--ink-green)",
  "ansi-bright-yellow": "var(--ink-orange)",
  "ansi-bright-blue": "var(--ink-blue)",
  "ansi-bright-magenta": "var(--ink-pink)",
  "ansi-bright-cyan": "var(--ink-blue)",
  "ansi-bright-white": "var(--ink)",
}

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
  ]).then(([{ createHighlighterCore, createCssVariablesTheme }, engine]) =>
    createHighlighterCore({
      themes: [
        createCssVariablesTheme({
          name: "patina",
          variablePrefix: "--shiki-",
          variableDefaults: INKS,
          fontStyle: true,
        }),
      ],
      langs: [],
      engine: engine.createJavaScriptRegexEngine({ forgiving: true }),
    }),
  )

  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()

  if (name === "ansi") {
    return name
  }

  if (name in languages) {
    return name as keyof typeof languages
  }

  return aliases[name] ?? null
}

// Shiki's font-style bit flags: 1 italic, 2 bold, 4 underline.
function tokenStyle(token: ThemedToken): React.CSSProperties {
  const flags = token.fontStyle ?? 0
  return {
    color: token.color,
    fontStyle: flags & 1 ? "italic" : undefined,
    fontWeight: flags & 2 ? 700 : undefined,
    textDecorationLine: flags & 4 ? "underline" : undefined,
  }
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
  const lang = getLanguage(language)

  if (!lang) {
    return null
  }

  const shiki = await getHighlighter()

  if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
    await shiki.loadLanguage(languages[lang])
  }

  return {
    // Returns one React node per line, and the grammar state after the last
    // line. Pass that state back to continue where the code left off.
    highlight(code: string, state?: GrammarState) {
      const tokenize = (text: string) =>
        shiki.codeToTokens(text, {
          lang,
          theme: "patina",
          grammarState: state,
        }).tokens

      // ANSI has no grammar state, so each line is tokenized on its own and
      // gets the same colors whether it arrives in one piece or streams.
      const tokens =
        lang === "ansi"
          ? code.split("\n").flatMap((line) => tokenize(line))
          : tokenize(code)

      return {
        lines: tokens.map((line) =>
          line.map((token, index) => (
            <span key={index} style={tokenStyle(token)}>
              {token.content}
            </span>
          )),
        ),
        state: shiki.getLastGrammarState(tokens),
      }
    },
  }
}

// Returns one React node per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
  const highlighter = await loadHighlighter(language)

  return highlighter ? highlighter.highlight(code).lines : null
}
