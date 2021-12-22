import path from "path"
import fs from "fs"
import { Plugin } from "vite"
import glob from "fast-glob"
import { escapeSFC } from "vue-repl-helpers"
import { outputFileSync } from "./fs"

export type Options = {
  pages: { title: string; files: string }[]
  modules?: Record<string, string>
}

const cacheDir = path.resolve(".cache/vite-plugin-editable-docs")

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
  let clientContent = ""

  const build = async () => {
    console.log("building!")
    const pages = await Promise.all(
      opts.pages.map(async (page, index) => {
        const files = await glob(page.files).then((files) =>
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
          throw new Error(`No files found for ${page.files}`)
        }

        const contents = `
        <script setup>
        import { Repl } from 'vue-repl'

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

        <style src="vue-repl/dist/style.css"></style>
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

    clientContent = `
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
  }

  return {
    name: "editable-docs",

    load(id) {
      if (slash(id).includes("vite-plugin-editable-docs/client")) {
        return clientContent
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
