import path from "path"
import { build } from "./lib/build.js"
import { getDirnameFromImportMetaUrl } from "./lib/utils.js"

/**
 * @type {import('./index').CreatePlugin}
 */
const plugin = (options) => {
  let cacheDir = options.cacheDir || ".cache/vite-plugin-component-examples"
  return {
    name: "component-examples",

    enforce: "pre",

    configResolved(config) {
      cacheDir = path.resolve(config.root, cacheDir)
    },

    resolveId(id) {
      if (id.startsWith("component-examples-cache/")) {
        return id.replace("component-examples-cache", cacheDir)
      }
      if (id === "vite-plugin-component-examples/client") {
        return path.join(
          getDirnameFromImportMetaUrl(import.meta.url),
          "client.js",
        )
      }
    },

    configureServer(server) {
      server.watcher.on("all", (event, id) => {
        if (id.startsWith(cacheDir)) return
        // TODO: only rebuild when examples change
        build({ pages: options.pages, cacheDir })
      })
    },

    async buildStart() {
      await build({ pages: options.pages, cacheDir })
    },
  }
}

export default plugin
