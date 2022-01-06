import { Markdown } from "@egoist/vue-markdown-it"
import MagicString from "magic-string"
import { frontmatter } from "./frontmatter"

export const transformMarkdown = (contents: string) => {
  const fm = frontmatter(contents)

  const md = new Markdown({ html: true })
  const tokens = md.parse(fm.body, {})
  const blocks: { code: string; start: number; end: number }[] = []

  const lines = fm.body.replace(/\r\n/g, "\n").split("\n")
  const s = new MagicString(lines.join("\n"))
  const getLines = (lineStart: number, lineEnd: number) => {
    return lines.slice(lineStart, lineEnd).join("\n")
  }

  for (const token of tokens) {
    if (token.type === "fence" && token.info.includes("playground")) {
      if (!token.map) {
        throw new Error(`cannot find map for ${token}`)
      }
      const lineStart = token.map[0]
      const lineEnd = token.map[1]
      const start = getLines(0, lineStart).length + 1
      const end = start + getLines(lineStart, lineEnd).length
      blocks.push({
        code: token.content,
        start,
        end,
      })
    }
  }

  for (const block of blocks) {
    s.overwrite(
      block.start,
      block.end,
      `<Playground :code="decodeURI(\`${encodeURI(block.code)}\`)" />`,
    )
  }

  return {
    contents: `${
      fm.frontmatter ? `---\n${fm.frontmatter}\n---\n` : ""
    }${s.toString()}`,
  }
}
