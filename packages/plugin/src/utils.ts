import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"
import process from "node:process"
import glob from "fast-glob"
import { camelCase } from "case-anything"
import { Page, NormalizedPage, OptionExamples } from "."

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

function pathToFilename(fullpath: string): string {
  return path.basename(fullpath, path.extname(fullpath))
}

/**
 * @returns eg. ['/Users/mesqueeb/my-project/src/components/examples/*.vue']
 */
async function componentPathToExamplePaths(
  componentPath: string,
  componentExamples: OptionExamples,
): Promise<string[]> {
  const p = componentPath

  /** @example 'MyButton' */
  const name = pathToFilename(p)

  /** @example 'MyButton.vue' */
  const filename = path.basename(p)

  /** @example '/Users/mesqueeb/my-project/src/components/MyButton' */
  const folderPath = path.dirname(p)

  /** @example './examples/*.vue' */
  const componentExamplesPath =
    typeof componentExamples === "function"
      ? componentExamples({
          name,
          filename,
          path: folderPath,
        })
      : componentExamples

  /** @example '/Users/mesqueeb/my-project/src/components/MyButton/./examples/*.vue' */
  const pathToExamples = folderPath + "/" + componentExamplesPath

  /** @example ['/Users/mesqueeb/my-project/src/components/examples/*.vue'] */
  const examplePaths = await glob(pathToExamples, { absolute: true, onlyFiles: true }).then(
    (items) => items.map((v) => slash(v)).sort(),
  )

  return examplePaths
}

export async function getPagesFromOptions(options: {
  pages?: Page[]
  components?: string
  componentExamples?: OptionExamples
}): Promise<NormalizedPage[]> {
  if (options.pages) {
    const pages = await Promise.all(
      options.pages.map(async (page) => {
        const title = page.title || pathToFilename(page.component)

        const exampleFiles = await componentPathToExamplePaths(page.component, page.examples)

        return { ...page, title, examples: exampleFiles }
      }),
    )

    return pages.filter(nonNullable)
  }

  const { components, componentExamples } = options

  if (!components || !componentExamples) {
    throw new Error(
      "You must either provide `pages` or both `components` and `componentExamples` when configuring VitePlay",
    )
  }

  /**
   * This makes sure that files like `MyButton.example.vue` are not included
   * @example './src/components/** /!(*.*.vue|!(*.vue))'
   */
  const componentsGlob = components.endsWith("/*.vue")
    ? components.replace("/*.vue", "/!(*.*.vue|!(*.vue))")
    : components

  /**
   * @example ['/Users/mesqueeb/my-project/src/components/MyButton/MyButton.vue']
   */
  const componentPaths = await glob(componentsGlob, {
    absolute: true,
    onlyFiles: true,
  }).then((items) => items.map((v) => slash(v)).sort())

  const pages = await Promise.all(
    componentPaths.map(async (p) => {
      const examplePaths = await componentPathToExamplePaths(p, componentExamples)

      return { title: pathToFilename(p), component: p, examples: examplePaths }
    }),
  )

  return pages.filter(nonNullable)
}

export function pagesToWatchfiles(pages: NormalizedPage[]): Set<string> {
  return new Set(pages.flatMap((page) => [page.component, ...(page?.examples || [])]))
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
