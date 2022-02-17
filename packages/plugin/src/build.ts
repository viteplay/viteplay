// Writes the pages.js file to cache dir
import fs from "node:fs"
import path from "node:path"
import { kebabCase } from "case-anything"
import { parseExample } from "./parse-example"
import { outputFileIfChanged } from "./fs"
import { getPagesFromOptions } from "./utils"
import { MarkRequired } from "./types"
import { Options } from "./index"
import { renderMarkdown } from "./markdown"
import { parseComponent } from "./parse-component"

const slash = (input: string) => input.replace(/\\/g, "/")

type BuildOptions = MarkRequired<Options, "cacheDir">

export const build = async (options: BuildOptions) => {
  const base = options.base ?? "/"
  const getPath = options.getPath ?? ((slug) => `${slug}`)

  const { pages: _pages, watchFiles } = await getPagesFromOptions(options)

  const pages = await Promise.all(
    _pages.map(async (page, index) => {
      const { props } = await parseComponent(
        await fs.promises.readFile(page.component, "utf8"),
        page.component,
      )
      const componentName = path.basename(page.component, path.extname(page.component))
      const componentProps = {
        [componentName]: props,
      }
      const files = await Promise.all(
        page.examples.sort().map(async (file) => {
          const contents = await fs.promises.readFile(file, "utf8")
          const parsed = await parseExample(contents, file)
          const title =
            file
              .split("/")
              .pop()
              // `[number]-` is used to to control order
              ?.replace(/^\d+-/, "")
              ?.replace(/\.vue$/, "")
              ?.replace(/\.example$/, "") ?? ""
          // TODO: grab title/description/markdown content from example file content
          const slug = kebabCase(title)
          return {
            title,
            slug,
            path: file,
            absolutePath: path.resolve(file),
            contents: parsed.component,
            parsed,
          }
        }),
      )
      if (files.length === 0) {
        console.warn(`No examples found for ${JSON.stringify(page)}`)
      }

      const contents = `
        <script setup>
        import { computed } from "vue"
        import { Playground, PropsTable } from "@viteplay/vue"
        import { useRoute, useRouter } from "vue-router"
                
        ${files
          .map(
            (file, index) => `
            let modules_${index} = {}
            ${(file.parsed.imports || [])
              .map(
                (im, imIndex) => `import ${
                  im.imported === "default" ? "" : "* as "
                } module_${index}_${imIndex} from "${slash(
                  im.source.startsWith(".")
                    ? path.join(path.dirname(file.absolutePath), im.source)
                    : im.source,
                )}"
              modules_${index}["${im.source}"] = module_${index}_${imIndex}
              `,
              )
              .join("\n")}
            `,
          )
          .join("\n")}

        let componentProps = ${JSON.stringify(componentProps)}
        let route = useRoute()
        let router = useRouter()
        let focusId = computed(() => route.query.focus && route.hash.slice(1))
        let shouldRender = (slug) => {
          return !route.query.focus || slug === focusId.value
        }
        let hiddenCount = computed(() => {
          return ${JSON.stringify(
            files.map((file) => file.slug),
          )}.filter((slug) => !shouldRender(slug)).length
        })

        let showAll = () => {
          router.push({ query: {}, hash: route.hash })
        }
        </script>
        <template>
          <div>
            <h1>${page.title}</h1>
            <div v-if="hiddenCount > 0" class="hidden-examples-info">
              {{ hiddenCount }} example{{ hiddenCount > 1 ? "s" : null }} hidden, <button @click="showAll" type="button">show all</button>
            </div>
            <PropsTable componentName="${componentName}" :componentProps="componentProps" />
            ${files
              .map(
                (file, index) => `
            <section v-if="shouldRender('${file.slug}')">
            <h2 id="${file.slug}">${file.title}</h2>

            ${renderMarkdown(file.parsed.docs)}

            <Playground :componentProps="componentProps" :modules="modules_${index}" :code="decodeURI(\`${encodeURI(
                  file.contents,
                )}\`)" />
            </section>
              `,
              )
              .join("\n")}
          </div>
        </template>
      `

      const component = path.join(options.cacheDir, `${index}-${kebabCase(page.title)}.vue`)

      outputFileIfChanged(component, contents)

      const slug = kebabCase(page.title)

      return {
        title: page.title,
        path: getPath(slug),
        component,
        children: files,
      }
    }),
  )

  const sideBarItems = pages
    .filter((p) => p.children.length > 0)
    .map((p) => ({
      text: p.title,
      link: p.path,
      headers: p.children.map((c) => ({
        title: c.title,
        slug: c.slug,
        level: 2,
      })),
    }))
  const layoutContents = `
<script setup>
import "@viteplay/vue/dist/style.css"
import { RouteLayout, provideConfig } from "@viteplay/vue"

const items = ${JSON.stringify(sideBarItems)}

provideConfig(${JSON.stringify({
    base,
    title: options.title,
    logo: options.logo,
  })})
</script>

<template>
  <RouteLayout :items="items"  />
</template>
`

  const layoutComponent = path.join(options.cacheDir, "AutoGeneratedLayout.vue")

  outputFileIfChanged(layoutComponent, layoutContents)

  const clientContent = `
    let pages = [
      {
        path: "${base}",
        component: () => import("${slash(layoutComponent)}"),
        children: [
          ${pages
            .map(
              (page) => `{
              title: "${page.title}",
              path: "${page.path}",
              component: () => import("${slash(page.component)}")
            }`,
            )
            .join(",\n")}
        ],
      },
    ]
    export { pages }
    `

  outputFileIfChanged(path.join(options.cacheDir, "client.js"), clientContent)

  return watchFiles
}
