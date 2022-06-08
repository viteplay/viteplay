import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import process from "node:process"
import glob from "fast-glob"
import { Page, NormalizedPage } from "."
import { camelCase } from "case-anything"

const nonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined
}

const dirname =
  typeof __dirname === "undefined" ? path.dirname(fileURLToPath(import.meta.url)) : __dirname

export const OWN_DIR = path.join(dirname, "..")

export const slash = (input: string) => input.replace(/\\/g, "/")

export const resolveFrom = (id: string, dir: string) => {
  const req =
    typeof globalThis.require === "function" ? globalThis.require : createRequire(import.meta.url)
  const resolved = req.resolve(id, { paths: [dir] })
  return req(resolved)
}

export const localRequire = (id: string) => {
  return resolveFrom(id, process.cwd())
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
  const componentFiles = await glob(components, {
    absolute: true,
    onlyFiles: true,
    ignore: [componentExamples],
  }).then((items) => items.map((v) => slash(v)).sort())

  return {
    watchFiles: new Set([...componentFiles, ...exampleFiles]),
    pages: componentFiles
      .map((p) => {
        const fileName = path.basename(p, path.extname(p))
        const folder = path.dirname(p)
        const folderName = path.basename(folder)
        // Only use the component if its filename matches its folder name
        // case insensitive
        if (folderName.toLowerCase() !== fileName.toLowerCase()) {
          return null
        }
        const examples = exampleFiles.filter((_p) => _p.startsWith(folder + "/")).sort()
        return { title: fileName, component: p, examples }
      })
      .filter(nonNullable),
  }
}

export const getIframeHtml = (iframeId: string, cacheDir: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${slash(path.join(cacheDir, `__iframe/${iframeId}.js`))}"></script>
  </body>
</html>
`

export const resolveFile = async (files: string[], cwd: string): Promise<string | undefined> => {
  const result = await glob(files, { cwd, absolute: true, onlyFiles: true })
  return result[0]
}

export const getEmptyDocsBlock = (code: string) => {
  const EMPTY_DOCS_BLOCK_RE = /^<docs\s+([^/>]+)\/?>(<\/docs>)?/m
  const HTML_ATTR_RE = /(\w+)(?:="([^"]+)")?/g
  const [, attrString] = EMPTY_DOCS_BLOCK_RE.exec(code) || []
  if (attrString) {
    const attrs: Record<string, any> = {}
    attrString.replace(HTML_ATTR_RE, (_, key, value) => {
      attrs[key] =
        value === undefined || value === "true" ? true : value === "false" ? false : value
      return ""
    })
    return { attrs, component: code.replace(EMPTY_DOCS_BLOCK_RE, "") }
  }
}

export const camelCaseKeys = (obj: Record<string, any>) => {
  const result: Record<string, any> = {}
  for (const key in obj) {
    result[camelCase(key)] = obj[key]
  }
  return result
}
