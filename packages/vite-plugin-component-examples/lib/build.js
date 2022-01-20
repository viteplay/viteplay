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
 * @param {{pages:import('../index').Page[], parentPath: string, cacheDir: string, getPath: (slug: string) => string}} opts
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
            const title =
              file
                .split("/")
                .pop()
                // `[number]-` is used to to control order
                ?.replace(/^\d+\-/, "")
                ?.replace(/\.vue$/, "")
                ?.replace(/\.example$/, "") || ""
            // TODO: grab title/description/markdown content from example file content
            return {
              title,
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
        import { Playground } from "vue-playground"
        
        // Can't use "style src" tag because of this issue https://github.com/vitejs/vite/pull/6233
        import "vue-playground/dist/style.css"

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
            <h1>${page.title}</h1>
            ${files
              .map((file, index) => {
                return `
            <section>
            <h2>${file.title}</h2>
            <Playground :modules="modules_${index}" :code="decodeURI(\`${encodeURI(
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

  // const _children = pages
  // .map((page) => {
  //   const slug = page.title.toLowerCase().replace(/[^\w]+/g, "-")
  //   return `{
  //   title: "${page.title}",
  //   path: "${opts.getPath(slug)}",
  //   component: () => import("${slash(page.component)}")
  // }`
  // })
  // .join(",\n")
  const clientContent = `
    let pages = [
      {
        path: "${opts.parentPath || "/dev"}",
        component: () => '<template><router-view></router-view></template>',
        children: [
          ${pages
            .map((page) => {
              const slug = page.title.toLowerCase().replace(/[^\w]+/g, "-")
              return `{
              title: "${page.title}",
              path: "${opts.getPath(slug)}",
              component: () => import("${slash(page.component)}")
            }`
            })
            .join(",\n")}
        ],
      },
    ]
    export { pages }
    `

  outputFileIfChanged(path.join(opts.cacheDir, "client.js"), clientContent)
}
