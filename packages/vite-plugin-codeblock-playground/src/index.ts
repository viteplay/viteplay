import fs from "fs"
import { Plugin } from "vite"
import { transformMarkdown } from "./markdown"

const plugin = (): Plugin => {
  return {
    name: "playground",

    enforce: "pre",

    async load(id) {
      if (id.endsWith(".md")) {
        const contents = await fs.promises.readFile(id, "utf8")
        const transformed = transformMarkdown(contents)
        return {
          code: transformed.contents,
        }
      }
    },
  }
}

export default plugin
