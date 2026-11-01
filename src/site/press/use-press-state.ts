import { useCallback, useMemo, useSyncExternalStore } from "react"
import { DEFAULT_PRESS, fromSearch, toSearch, type PressState } from "./state"

// The address is the Press's state, so every print can be shared. The server renders the defaults; hydration then
// picks up the address without a mismatch.
const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener("popstate", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("popstate", onChange)
  }
}

export function usePressState() {
  const search = useSyncExternalStore(
    subscribe,
    () => location.search,
    () => "",
  )
  const state = useMemo<PressState>(
    () => ({ ...DEFAULT_PRESS, ...fromSearch(search) }),
    [search],
  )
  const set = useCallback(
    (change: Partial<PressState>) => {
      history.replaceState(null, "", toSearch({ ...state, ...change }))
      listeners.forEach((notify) => notify())
    },
    [state],
  )
  return [state, set] as const
}
