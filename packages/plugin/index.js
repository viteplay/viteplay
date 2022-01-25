import path from "path"
import { build } from "./lib/build.js"
import { getPagesFromOptions } from "./lib/utils.js"

/**
 * @type {import('./index').CreatePlugin}
 */
const plugin = (options) => {
  let cacheDir = options.cacheDir || ".cache/viteplay"
  const getPath = options.getPath || ((slug) => `${slug}`)
  // TODO: maybe rename to `base`?
  const pathParent = options.pathParent || "/"

  return {
    name: "component-examples",

    enforce: "pre",

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
        build({ pages, pathParent, cacheDir, getPath })
      })
    },

    async buildStart() {
      const pages = await getPagesFromOptions(options)
      await build({ pages, pathParent, cacheDir, getPath })
    },
  }
}

export default plugin
