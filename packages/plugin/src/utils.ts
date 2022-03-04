import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import process from "node:process"
import glob from "fast-glob"
import { Page, NormalizedPage } from "."

export const slash = (input: string) => input.replace(/\\/g, "/")

export const localRequire = (id: string) => {
  const req =
    typeof globalThis.require === "function" ? globalThis.require : createRequire(import.meta.url)
  const resolved = req.resolve(id, { paths: [process.cwd()] })
  return req(resolved)
}

export const getDirnameFromImportMetaUrl = (url: string) => {
  const p = fileURLToPath(url)
  return path.dirname(p)
}

export async function getPagesFromOptions(options: {
  pages?: Page[]
  components?: string
  componentExamples?: string
}): Promise<{ pages: NormalizedPage[]; watchFiles: Set<string> }> {
  if (options.pages) {
    const watchFiles: Set<string> = new Set()
    return {
      watchFiles,
      pages: await Promise.all(
        options.pages.map(async (page) => {
          const title = page.title || path.basename(page.component, path.extname(page.component))
          const exampleFiles = await glob(page.examples, { absolute: true, onlyFiles: true })
          exampleFiles.forEach((file) => {
            watchFiles.add(file)
          })
          watchFiles.add(path.resolve(page.component))
          return {
            ...page,
            title,
            examples: exampleFiles,
          }
        }),
      ),
    }
  }

  const { components, componentExamples } = options

  if (!components || !componentExamples) {
    throw new Error(
      "You must either provide `pages` or both `components` and `componentExamples` when configuring VitePlay",
    )
  }

  const exampleFiles = await glob(componentExamples, { absolute: true, onlyFiles: true }).then(
    (items) => items.map((v) => slash(v)).sort(),
  )
  const files = await glob(components, { absolute: true, onlyFiles: true }).then((items) =>
    items.map((v) => slash(v)).sort(),
  )
  const componentFiles = files.filter((p) => !exampleFiles.includes(p))

  return {
    watchFiles: new Set([...componentFiles, ...exampleFiles]),
    pages: componentFiles.map((p) => {
      const fileName = path.basename(p, path.extname(p))
      const folder = path.dirname(p)
      const examples = exampleFiles.filter((_p) => _p.startsWith(folder + "/"))
      return { title: fileName, component: p, examples }
    }),
  }
}
