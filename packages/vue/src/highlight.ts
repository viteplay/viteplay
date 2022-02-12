import Prism from "prismjs"

export const highlight = (code: string) => {
  return Prism.highlight(code, Prism.languages.html, "html")
}
