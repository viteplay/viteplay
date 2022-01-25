import path from "path"
import { build } from "./lib/build.js"
import { getPagesFromOptions } from "./lib/utils.js"

/**
 * @type {import('./index').CreatePlugin}
 */
const plugin = (options) => {
  let cacheDir = options.cacheDir || ".cache/viteplay"
  const getPath = options.getPath || ((slug) => `${slug}`)
  const base = options.base || "/"

  return {
    name: "component-examples",

    enforce: "pre",

    config(config) {
      config.optimizeDeps = config.optimizeDeps || {}
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || []
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
        if (id.startsWith(cacheDir)) return
        const pages = await getPagesFromOptions(options)
        // TODO: only rebuild when examples change
        build({ pages, base, cacheDir, getPath })
      })
    },

    async buildStart() {
      const pages = await getPagesFromOptions(options)
      await build({ pages, base, cacheDir, getPath })
    },
  }
}

export default plugin
