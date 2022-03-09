import path from "node:path"
import { Plugin } from "vite"
import createDebug from "debug"
import { build } from "./build"
import { slash } from "./utils"

const debug = createDebug(`viteplay:plugin`)

export type Page = {
  /**
   * Path to a component to create the dev page for
   *
   * @example './components/MyButton/*.vue'
   */
  component: string
  /**
   * Path to the example vue files of a component to put on the dev page
   *
   * @example './components/MyButton/*.example.vue'
   */
  examples: string | string[]
  /**
   * Defaults to the filename
   */
  title?: string
}

export type NormalizedPage = { title: string; component: string; examples: string[] }

export type Options = {
  /**
   * Path to extract components from to create dev pages for
   *
   * @example './components/*\/*.vue'
   */
  components?: string
  /**
   * Path to extract component examples from to put on each dev page
   *
   * @example './components/*\/*.example.vue'
   */
  componentExamples?: string
  /**
   * The base path the generated routes should be nested under as children.
   *
   * @example '/dev'
   */
  base?: string
  /**
   * Navbar title
   */
  title?: string
  /**
   * Navbar logo
   */
  logo?: string
  pages?: Page[]
  cacheDir?: string
  getPath?: (slug: string) => string
}

const plugin = (options: Options): Plugin => {
  let cacheDir = options.cacheDir ?? ".cache/viteplay"
  let watchFiles: Set<string> = new Set()
  let dev = false

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
      dev = true

      server.watcher.on("all", async (event, id) => {
        // For changed files, we only need to rebuild if it's already watched
        if (event === "change" && !watchFiles.has(slash(path.resolve(id)))) {
          return
        }

        // Otherwise adding or deleting any file (even if it's not an example / component) will trigger a rebuild
        debug(`rebuild: %s %s`, event, id)

        watchFiles = await build({ ...options, cacheDir, dev })
      })
    },

    async buildStart() {
      debug(`Starting initial build`)
      watchFiles = await build({ ...options, cacheDir, dev })
    },
  }
}

export default plugin
