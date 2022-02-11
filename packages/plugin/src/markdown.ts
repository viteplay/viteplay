import Markdown from "markdown-it"

export const renderMarkdown = (content: string) => {
  const md = new Markdown()

  return md.render(content)
}
