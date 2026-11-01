// @ts-check
import { existsSync, utimesSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

const demoHost = fileURLToPath(
  new URL("./src/site/docs/demo-host.tsx", import.meta.url),
)

/**
 * Dev only. The watcher reports a new file as added, and two things only react to changes: Tailwind's class
 * scanner, and the server-side demo list in demo-host.tsx (its glob is expanded when the module is transformed).
 * Touching the new file, and the demo host for a new demo, turns the add into a change both pick up.
 * @type {import("vite").Plugin}
 */
const touchNewFiles = {
  name: "patina:touch-new-files",
  apply: "serve",
  configureServer(server) {
    server.watcher.on("add", (file) => {
      if (!/[\\/]src[\\/].+\.(tsx?|astro|css)$/u.test(file)) return
      setTimeout(() => {
        const now = new Date()
        if (existsSync(file)) utimesSync(file, now, now)
        if (/[\\/]site[\\/]docs[\\/]demos[\\/][^\\/]+\.tsx$/u.test(file))
          utimesSync(demoHost, now, now)
      }, 100)
    })
  },
}

export default defineConfig({
  site: process.env.SITE_URL || "https://patina.ossianravn.dev",
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [react()],
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss(), touchNewFiles] },
})
