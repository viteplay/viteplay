import path from "path"
import fs from "fs"
import { Plugin } from "vite"
import glob from "fast-glob"
import { escapeSFC } from "vue-repl-helpers"
import { outputFileSync } from "./fs"

export type Options = {
  pages: { title: string; examples: string }[]
  modules?: Record<string, string>
  cacheDir?: string
}

const slash = (p: string) => p.replace(/\\/g, "/")

const stringifyModules = (modules: Record<string, string>) => {
  return `
  ${Object.keys(modules)
    .map((k, i) => {
      return `import module_${i} from "${slash(path.resolve(modules[k]))}"`
    })
    .join("\n")}

  let modules = {}

  ${Object.keys(modules).map((k, i) => {
    return `modules['${k}'] = module_${i}`
  })}
  `
}

const plugin = (opts: Options): Plugin => {
  let cacheDir = opts.cacheDir || ".cache/vite-plugin-editable-docs"

  const build = async () => {
    console.log("building!")
    const pages = await Promise.all(
      opts.pages.map(async (page, index) => {
        const files = await glob(page.examples).then((files) =>
          Promise.all(
            files.map(async (file) => {
              const contents = await fs.promises.readFile(file, "utf8")
              return {
                path: file,
                contents,
              }
            }),
          ),
        )

        if (files.length === 0) {
          throw new Error(`No files found for ${page.examples}`)
        }

        const contents = `
        <script setup>
        import { Repl } from "vue-repl"
        
        // Can't use "style src" tag because of this issue https://github.com/vitejs/vite/pull/6233
        import "vue-repl/dist/style.css"

       ${opts.modules ? stringifyModules(opts.modules) : "let modules = {}"}


        let examples = [
          ${files
            .map((file) => {
              return `{
            path: "${file.path}",
            code: ${JSON.stringify(escapeSFC(file.contents))}
          }`
            })
            .join(",\n")}
        ]
        </script>

        <template>
          <div>
          
          <section :key="example.path" v-for="example in examples">
          
            <Repl :modules="modules" :code="example.code" /></section>

          </div>
        </template>

        <style src="prismjs/themes/prism-tomorrow.css"></style>
      `

        const component = path.join(
          cacheDir,
          `${index}-${page.title.replace(/[^\w]+/, "-")}.vue`,
        )

        outputFileSync(component, contents)

        return {
          title: page.title,
          component,
        }
      }),
    )

    const clientContent = `
    let pages = [
      ${pages
        .map((page) => {
          return `{
          title: "${page.title}",
          component: () => import("${slash(page.component)}")
        }`
        })
        .join(",\n")}
    ]

    export { pages }
    `

    outputFileSync(path.join(cacheDir, "client.js"), clientContent)
  }

  return {
    name: "editable-docs",

    configResolved(config) {
      cacheDir = path.resolve(config.root, cacheDir)
    },

    resolveId(id) {
      if (id.startsWith("editable-docs-cache/")) {
        return id.replace("editable-docs-cache", cacheDir)
      }
      if (id === "vite-plugin-editable-docs/client") {
        return path.join(__dirname, "../client.js")
      }
    },

    configureServer(server) {
      server.watcher.on("all", (event, id) => {
        if (id.startsWith(cacheDir)) return
        // TODO: only rebuild when examples change
        build()
      })
    },

    async buildStart() {
      await build()
    },
  }
}

export default plugin
