import path from "node:path"
import { Plugin } from "vite"
import createDebug from "debug"
import { build } from "./build"
import { getIframeHtml, slash } from "./utils"

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

export type NormalizedPage = {
  title: string
  /** Absolute path of the component */
  component: string
  /** Absolute path of example files */
  examples: string[]
}

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

const plugin = (options: Options): Plugin[] => {
  let cacheDir = options.cacheDir ?? ".cache/viteplay"
  let watchFiles: Set<string> = new Set()
  let root = process.cwd()

  return [
    {
      name: "viteplay",

      async config(config, env) {
        root = config.root || process.cwd()
        const rootHtmlFile = path.join(root, "index.html")
        cacheDir = path.resolve(root, cacheDir)

        debug(`Starting initial build`)
        const dev = env.command === "serve"
        const buildResult = await build({ ...options, cacheDir, dev, root })
        watchFiles = buildResult.watchFiles

        const input = buildResult.iframes.reduce<Record<string, string>>((res, iframe) => {
          return { ...res, [`__iframe/${iframe.id}`]: iframe.filepath }
        }, {})

        input.index = rootHtmlFile

        return {
          optimizeDeps: {
            exclude: ["@viteplay/vue/client"],
          },
          build: {
            rollupOptions: {
              input: input,
            },
          },
        }
      },

      resolveId(id) {
        if (id.startsWith("viteplay-cache/")) {
          return id.replace("viteplay-cache", cacheDir)
        }
      },

      configureServer(server) {
        server.watcher.on("all", async (event, id) => {
          id = slash(path.resolve(id))

          // Ignore changes in cache dir
          if (id.startsWith(cacheDir)) {
            return
          }

          // For changed files, we only need to rebuild if it's already watched
          if (event === "change" && !watchFiles.has(id)) {
            return
          }

          // Otherwise adding or deleting any file (even if it's not an example / component) will trigger a rebuild
          debug(`rebuild: %s %s`, event, id)

          const buildResult = await build({ ...options, cacheDir, dev: true, root })
          watchFiles = buildResult.watchFiles
        })

        server.middlewares.use(async (req, res, next) => {
          if (!req.url) return next()

          if (!req.url.startsWith("/__iframe/")) {
            return next()
          }

          try {
            const iframeId = req.url.replace("/__iframe/", "").replace(".html", "")
            const html = getIframeHtml(iframeId, cacheDir)
            const result = await server.transformIndexHtml(req.url, html)

            res.setHeader("content-type", "text/html")
            res.end(result)
          } catch (error) {
            next(error)
          }
        })
      },
    },
    {
      name: "viteplay:move-html",

      // After Vite's default html plugin
      enforce: "post",

      generateBundle(_, bundle) {
        for (const k of Object.keys(bundle)) {
          const file = bundle[k]
          if (file.type === "asset" && k.includes("/__iframe/") && k.endsWith(".html")) {
            delete bundle[k]
            const fileName = `__iframe/${path.basename(k)}`
            this.emitFile({
              type: "asset",
              source: file.source,
              fileName,
            })
          }
        }
      },
    },
  ]
}

export default plugin
