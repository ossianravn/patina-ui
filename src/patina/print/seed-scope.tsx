"use client"

import { createContext, useContext, useId, type ReactNode } from "react"
import { fork, seedOf } from "@/patina/ink/seed"

const SeedContext = createContext<number | null>(null)

/** Gives every seeded component inside it a stable starting point, such as a page or a record id. */
export function SeedScope({
  seed,
  children,
}: {
  seed: string | number
  children: ReactNode
}) {
  return <SeedContext value={seedOf(seed)}>{children}</SeedContext>
}

/**
 * A seed for one kind of decision. An explicit or content seed wins; otherwise the nearest SeedScope and the
 * component's place in the tree, which agree between server and client but change when the tree is edited.
 */
export function useSeed(label: string, seed?: string | number): number {
  const scope = useContext(SeedContext)
  const id = useId()
  if (seed !== undefined && seed !== "") return fork(seedOf(seed), label)
  return fork(seedOf(`${scope ?? 0}:${id}`), label)
}

/** The text of string or number children, used as a content seed. */
export function textOf(children: ReactNode): string | undefined {
  if (typeof children === "string" || typeof children === "number")
    return String(children)
  if (
    Array.isArray(children) &&
    children.every((c) => typeof c === "string" || typeof c === "number")
  )
    return children.join("")
  return undefined
}

/** One of the six wobble filters, picked by a seed. */
export const roughVariant = (seed: number, offset = 0) =>
  `var(--rough-${1 + ((seed >>> offset) % 6)})`
