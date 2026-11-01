import { useCallback, useEffect, useRef, useState } from "react"
import { createClock, type Clock } from "./clock"

// Runs a Stageshow-style scene: a script of beats that changes the scene's state and moves a cursor. The server
// renders the poster frame (the payoff). Once hydrated, a scene that is still off screen snaps to its first frame
// and plays when most of it is in view; it pauses when it scrolls away and resumes when it returns, then ends on the
// poster frame with a Replay button. A scene already in view when it hydrates keeps its poster frame and offers
// Replay. With reduced motion asked for, the poster frame is all there is.

/** Where the cursor goes: a [data-target] name or a selector (with fractions of its box), or fractions of the stage. */
export type Spot =
  string | { at?: string; css?: string; x?: number; y?: number }
export type CursorKind = "arrow" | "text"

export interface Act<S> {
  put(change: Partial<S>): void
  wait(ms: number): Promise<void>
  /** Shows the cursor at a spot without travelling. */
  place(spot: Spot): void
  move(spot: Spot, options?: { ms?: number; easing?: string }): Promise<void>
  press(): Promise<void>
  kind(kind: CursorKind): void
  hide(): void
}

export type Phase = "poster" | "ready" | "playing" | "done" | "still"

export interface StageOptions<S> {
  initial: S
  poster: S
  script: (act: Act<S>) => Promise<void>
}

const TRAVEL = "cubic-bezier(0.45, 0, 0.1, 1)"
/** Below this stage width the cursor becomes a touch: it lands where it taps instead of travelling. */
const TOUCH_BELOW = 480
const translate = ({ x, y }: { x: number; y: number }) =>
  `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`

export function useStage<S>({ initial, poster, script }: StageOptions<S>) {
  const stageRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState(poster)
  const [phase, setPhase] = useState<Phase>("poster")
  const phaseRef = useRef<Phase>("poster")
  const clockRef = useRef<Clock | null>(null)
  const at = useRef({ x: 0, y: 0 })

  const go = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const run = useCallback(
    (delay: number) => {
      clockRef.current?.cancel()
      const clock = createClock()
      clockRef.current = clock
      const stage = stageRef.current
      const cursor = cursorRef.current
      if (!stage || !cursor) return
      const touch = stage.clientWidth < TOUCH_BELOW
      const body = cursor.firstElementChild as HTMLElement | null
      const show = (on: boolean) => (cursor.style.opacity = on ? "1" : "0")
      const locate = (spot: Spot) => {
        const box = stage.getBoundingClientRect()
        const {
          at: name,
          css,
          x = 0.5,
          y = 0.5,
        } = typeof spot === "string" ? { at: spot, css: undefined } : spot
        const el = stage.querySelector(css ?? `[data-target="${name}"]`)
        const r = el ? el.getBoundingClientRect() : box
        return {
          x: r.left - box.left + r.width * x,
          y: r.top - box.top + r.height * y,
        }
      }
      const jump = (spot: Spot) => {
        at.current = locate(spot)
        cursor.style.transform = translate(at.current)
      }
      cursor.dataset.kind = touch ? "touch" : "arrow"

      const act: Act<S> = {
        put: (change) => {
          if (!clock.cancelled) setState((s) => ({ ...s, ...change }))
        },
        wait: (ms) => clock.wait(ms),
        place: (spot) => {
          jump(spot)
          show(!touch)
        },
        async move(spot, { ms, easing = TRAVEL } = {}) {
          if (touch) {
            show(false)
            await clock.wait(160)
            jump(spot)
            return
          }
          const from = at.current
          const to = locate(spot)
          const distance = Math.hypot(to.x - from.x, to.y - from.y)
          const duration = ms ?? Math.min(1100, 420 + distance * 0.9)
          at.current = to
          cursor.style.transform = translate(to)
          await clock.run(
            cursor.animate(
              [{ transform: translate(from) }, { transform: translate(to) }],
              { duration, easing },
            ),
          )
        },
        async press() {
          if (touch) show(true)
          if (!body) return
          await clock.run(
            body.animate([{ scale: 1 }, { scale: 0.82 }, { scale: 1 }], {
              duration: 240,
              easing: "ease-out",
            }),
          )
        },
        kind: (kind) => {
          if (!touch) cursor.dataset.kind = kind
        },
        hide: () => show(false),
      }

      go("playing")
      void (async () => {
        if (delay) await clock.wait(delay)
        await script(act)
        if (clock.cancelled) return
        show(false)
        setState(poster)
        go("done")
      })()
    },
    [go, poster, script],
  )

  const replay = useCallback(() => {
    // The reset is caused by the press: everything the run added leaves in one motion, then the run starts again.
    setState(initial)
    run(650)
  }, [initial, run])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let first = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        const ratio = entry.intersectionRatio
        if (first) {
          first = false
          if (matchMedia("(prefers-reduced-motion: reduce)").matches)
            return go("still")
          if (entry.isIntersecting) return go("done")
          // Off screen: snap back to the first frame while nobody sees it.
          setState(initial)
          go("ready")
          return
        }
        const phase = phaseRef.current
        if (phase === "ready" && ratio >= 0.6) run(0)
        else if (phase === "playing") {
          if (ratio < 0.25) clockRef.current?.pause()
          else if (ratio >= 0.6) clockRef.current?.resume()
        }
      },
      { threshold: [0, 0.25, 0.6] },
    )
    observer.observe(stage)
    return () => {
      observer.disconnect()
      clockRef.current?.cancel()
    }
  }, [go, initial, run])

  return { stageRef, cursorRef, state, phase, replay }
}

export type StageHandle<S> = ReturnType<typeof useStage<S>>
