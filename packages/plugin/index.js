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

    /** @param {any} config */
    config(config) {
      config.optimizeDeps = config.optimizeDeps ?? {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude ?? []
      config.optimizeDeps.exclude.push("@viteplay/vue/client")
    },

    /** @param {any} config */
    configResolved(config) {
      cacheDir = path.resolve(config.root, cacheDir)
    },

    /** @param {string} id */
    resolveId(id) {
      if (id.startsWith("viteplay-cache/")) {
        return id.replace("viteplay-cache", cacheDir)
      }
    },

    /** @param {any} server */
    configureServer(server) {
      server.watcher.on(
        "all",
        /**
         * @param {any} _event
         * @param {string} id
         */
        async (_event, id) => {
          if (id.startsWith(cacheDir)) {
            return
          }

          // TODO: only rebuild when examples change
          await build({ ...options, cacheDir })
        },
      )
    },

    async buildStart() {
      await build({ ...options, cacheDir })
    },
  }
}

export default plugin
