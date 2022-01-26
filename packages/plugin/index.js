import path from "node:path"
import { build } from "./lib/build.js"

/**
 * @type {import('./index').CreatePlugin}
 */
const plugin = (options) => {
  let cacheDir = options.cacheDir ?? ".cache/viteplay"

  return {
    name: "component-examples",

    enforce: "pre",

    config(config) {
      config.optimizeDeps = config.optimizeDeps ?? {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude ?? []
      config.optimizeDeps.exclude.push("@viteplay/vue/client")
    },

    configResolved(config) {
      cacheDir = path.resolve(config.root, cacheDir)
    },

    resolveId(id) {
      if (id.startsWith("viteplay-cache/")) {
        return id.replace("viteplay-cache", cacheDir)
      }
    },

    configureServer(server) {
      server.watcher.on("all", async (event, id) => {
        if (id.startsWith(cacheDir)) {
          return
        }

        // TODO: only rebuild when examples change
        await build({ ...options, cacheDir })
      })
    },

    async buildStart() {
      await build({ ...options, cacheDir })
    },
  }
}

export default plugin
