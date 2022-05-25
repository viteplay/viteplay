// Writes the pages.js file to cache dir
import fs from "node:fs"
import path from "node:path"
import { kebabCase } from "case-anything"
import { parseExample } from "./parse-example"
import { outputFileIfChanged } from "./fs"
import { getIframeHtml, getPagesFromOptions, slash } from "./utils"
import { MarkRequired } from "./types"
import { Options } from "./index"
import { renderMarkdown } from "./markdown"
import { parseComponent } from "./parse-component"

type BuildOptions = MarkRequired<Options, "cacheDir"> & {
  dev: boolean
}

export const build = async (options: BuildOptions) => {
  const base = options.base ?? "/"
  const getPath = options.getPath ?? ((slug) => `${slug}`)

  const { pages: _pages, watchFiles } = await getPagesFromOptions(options)
  const iframes: { id: string; filepath: string }[] = []

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

      const examples = await Promise.all(
        page.examples.map(async (file) => {
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
          const slug = kebabCase(title)
          const iframeId = `${page.title}-${slug}`
          return {
            title,
            /** slugified title */
            slug,
            absolutePath: path.resolve(file),
            /** Content of the example */
            contents: parsed.component,
            parsed,
            iframeId,
            iframeFilePath: path.join(options.cacheDir, `__iframe/${iframeId}.html`),
          }
        }),
      )
      if (examples.length === 0) {
        console.warn(`No examples found for ${JSON.stringify(page)}`)
      }

      for (const example of examples) {
        const iframeComponentCode = `
        <script setup>
        import { IframePreview } from '@viteplay/vue/iframe'
        const code = decodeURI(${JSON.stringify(encodeURI(example.contents))})

        const modules = {}
        ${(example.parsed.imports || [])
          .map(
            (im, imIndex) => `import ${
              im.importDefault ? "" : "* as "
            } module_${imIndex} from "${slash(
              im.source.startsWith(".")
                ? path.join(path.dirname(example.absolutePath), im.source)
                : im.source,
            )}"
          modules["${im.source}"] = module_${imIndex}
          `,
          )
          .join("\n")}
        </script>

        <template>
          <IframePreview :code="code" :modules="modules" />
        </template>
        `
        const iframeAppCode = `
        import {createApp} from 'vue'
        import App from './${example.iframeId}.vue'
        createApp(App).mount('#app')
        `
        outputFileIfChanged(
          path.join(options.cacheDir, `__iframe/${example.iframeId}.vue`),
          iframeComponentCode,
        )
        outputFileIfChanged(
          path.join(options.cacheDir, `__iframe/${example.iframeId}.js`),
          iframeAppCode,
        )
        outputFileIfChanged(
          example.iframeFilePath,
          getIframeHtml(example.iframeId, options.cacheDir),
        )
        iframes.push({
          id: example.iframeId,
          filepath: example.iframeFilePath,
        })
      }

      const contents = `
        <script setup>
        import { computed } from "vue"
        import { Example, PropsTable, PageTitle } from "@viteplay/vue"
        import { useRoute, useRouter } from "vue-router"
            
        let componentProps = ${JSON.stringify(componentProps)}
        let route = useRoute()
        let router = useRouter()
        let focusId = computed(() => route.query.focus && route.hash.slice(1))
        let shouldRender = (slug) => {
          return !route.query.focus || slug === focusId.value
        }
        let hiddenCount = computed(() => {
          return ${JSON.stringify(
            examples.map((example) => example.slug),
          )}.filter((slug) => !shouldRender(slug)).length
        })

        let showAll = () => {
          router.push({ query: {}, hash: route.hash })
        }

        let openInEditor = (file) => {
           fetch('/__open-in-editor?file=' + encodeURIComponent(file))
        }
        let examples = [
          ${examples
            .map((example) => {
              return `{
                title: ${JSON.stringify(example.title)},
                slug: ${JSON.stringify(example.slug)},
                docs: ${JSON.stringify(renderMarkdown(example.parsed.docs))},
                // encodeURI because the example will contain html tags
                // which will cause this component to be incorrectly parsed
                code: decodeURI(${JSON.stringify(encodeURI(example.contents))}),
                dark: ${JSON.stringify(example.parsed.darkExample)},
                iframeUrl: ${JSON.stringify(`/__iframe/${example.iframeId}.html`)},
                openInEditor: () => openInEditor(${JSON.stringify(slash(example.absolutePath))})
              }`
            })
            .join(",")}
        ]
        </script>
        <template>
          <PageTitle title="${page.title}" ${
        options.dev ? `:openInEditor="() => openInEditor('${slash(page.component)}')"` : ``
      } />
          <div v-if="hiddenCount > 0" class="hidden-examples-info">
            {{ hiddenCount }} example{{ hiddenCount > 1 ? "s" : null }} hidden, <a @click.prevent="showAll" type="button" style="cursor: pointer">show all</a>
          </div>
          <PropsTable componentName="${componentName}" :componentProps="componentProps" />
          <template  
            v-for="example in examples" 
            :key="example.slug">
            <Example 
              v-if="shouldRender(example.slug)"
              :example="example" 
              :componentProps="componentProps" />
          </template>
        </template>

<style scoped>
.hidden-examples-info {
  margin: 20px 0;
}
</style>
      `

      const component = path.join(options.cacheDir, `${index}-${kebabCase(page.title)}.vue`)

      outputFileIfChanged(component, contents)

      const slug = kebabCase(page.title)

      return {
        title: page.title,
        path: getPath(slug),
        component,
        props,
        children: examples,
      }
    }),
  )

  const sideBarItems = pages
    .filter((p) => p.children.length > 0)
    .map((p) => {
      const item = {
        text: p.title,
        link: p.path,
        headers: p.children.map((c) => ({
          title: c.title,
          slug: c.slug,
          level: 2,
        })),
      }
      if (p.props.length > 0) {
        item.headers.unshift({
          title: "Props",
          slug: "props",
          level: 2,
        })
      }
      return item
    })

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

  return { watchFiles, iframes }
}
