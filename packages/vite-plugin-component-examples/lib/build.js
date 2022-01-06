// Writes the pages.js file to cache dir
import fs from "fs"
import path from "path"
import glob from "fast-glob"
import { getImports } from "./get-imports.js"
import { outputFileIfChanged } from "./fs.js"

/**
 * @param {string} input
 * @returns string
 */
const slash = (input) => input.replace(/\\/g, "/")

/**
 *
 * @param {{pages:import('../index').Page[], cacheDir: string}} opts
 */
export const build = async (opts) => {
  console.log("building!")
  const pages = await Promise.all(
    opts.pages.map(async (page, index) => {
      const files = await glob(page.examples).then((files) =>
        Promise.all(
          files.sort().map(async (file) => {
            const contents = await fs.promises.readFile(file, "utf8")
            const imports = await getImports(contents, file)
            return {
              path: file,
              absolutePath: path.resolve(file),
              contents,
              imports,
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

        ${files
          .map((file, index) => {
            return `
            let modules_${index} = {}
            ${(file.imports || [])
              .map(
                (im, imIndex) => `import ${
                  im.imported === "default" ? "" : "* as "
                } module_${index}_${imIndex} from "${slash(
                  im.source[0] === "."
                    ? path.join(path.dirname(file.absolutePath), im.source)
                    : im.source,
                )}"
              modules_${index}["${im.source}"] = module_${index}_${imIndex}
              `,
              )
              .join("\n")}
            `
          })
          .join("\n")}
        </script>
        <template>
          <div>
          
          ${files
            .map((file, index) => {
              return `
            <section>
              <Repl :modules="modules_${index}" :code="decodeURI(\`${encodeURI(
                file.contents,
              )}\`)" />
            </section>
              `
            })
            .join("\n")}
          </div>
        </template>
        <style src="prismjs/themes/prism-tomorrow.css"></style>
      `

      const component = path.join(
        opts.cacheDir,
        `${index}-${page.title.replace(/[^\w]+/, "-")}.vue`,
      )

      outputFileIfChanged(component, contents)

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

  outputFileIfChanged(path.join(opts.cacheDir, "client.js"), clientContent)
}
