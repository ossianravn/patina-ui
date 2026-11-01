// A clock for one run of a scene: waits and Web Animations that pause together when the scene leaves the screen and
// resume where they stopped. Cancelling stops everything; a cancelled wait never resolves, and a cancelled animation
// rejects, so the script that awaited it ends there.

interface Timer {
  remaining: number
  started: number
  id: number
  resolve: () => void
}

export interface Clock {
  wait(ms: number): Promise<void>
  /** Runs an animation on this clock and resolves when it finishes. */
  run(animation: Animation): Promise<void>
  pause(): void
  resume(): void
  cancel(): void
  readonly cancelled: boolean
}

export function createClock(): Clock {
  let paused = false
  let cancelled = false
  const timers = new Set<Timer>()
  const animations = new Set<Animation>()

  const start = (timer: Timer) => {
    timer.started = performance.now()
    timer.id = window.setTimeout(() => {
      timers.delete(timer)
      timer.resolve()
    }, timer.remaining)
  }

  return {
    get cancelled() {
      return cancelled
    },
    wait(ms) {
      return new Promise<void>((resolve) => {
        if (cancelled) return
        const timer: Timer = { remaining: ms, started: 0, id: 0, resolve }
        timers.add(timer)
        if (!paused) start(timer)
      })
    },
    run(animation) {
      if (cancelled) {
        animation.cancel()
        return new Promise<void>(() => {})
      }
      animations.add(animation)
      if (paused) animation.pause()
      return animation.finished.then(
        () => {
          animations.delete(animation)
        },
        // Cancelled: leave the script waiting forever rather than throwing through it.
        () => new Promise<void>(() => {}),
      )
    },
    pause() {
      if (paused || cancelled) return
      paused = true
      const now = performance.now()
      for (const timer of timers) {
        window.clearTimeout(timer.id)
        timer.remaining = Math.max(0, timer.remaining - (now - timer.started))
      }
      for (const animation of animations) animation.pause()
    },
    resume() {
      if (!paused || cancelled) return
      paused = false
      for (const timer of timers) start(timer)
      for (const animation of animations) animation.play()
    },
    cancel() {
      cancelled = true
      for (const timer of timers) window.clearTimeout(timer.id)
      timers.clear()
      for (const animation of animations) animation.cancel()
      animations.clear()
    },
  }
}
