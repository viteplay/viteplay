import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import process from "node:process"
import glob from "fast-glob"
import { Page } from "."

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
}): Promise<Page[]> {
  if (options.pages) {
    return options.pages
  }

  const { components, componentExamples } = options

  if (!components || !componentExamples) {
    throw new Error("You must provide both `components` and `componentExamples` in `options`")
  }

  const exampleFiles = await glob(componentExamples)
  const files = await glob(components)
  const componentFiles = files.filter((p) => !exampleFiles.includes(p))

  return componentFiles.map((p) => {
    const fileName = (p.split("/").pop() ?? "").replace(/\.vue$/, "")
    const folder = path.dirname(p)
    const examples = exampleFiles.filter((_p) => _p.startsWith(folder))
    return { title: fileName, examples }
  })
}
