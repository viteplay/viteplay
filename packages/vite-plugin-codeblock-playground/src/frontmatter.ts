import yaml from "js-yaml"

const RE_STARTING = /^(?:\r?\n)*---([a-z]+)?(?:\r?\n)+/

type Parsed = { data: any; frontmatter: string; body: string }

export const frontmatter = (content: string): Parsed => {
  const getEmpty = (): Parsed => ({
    data: {},
    frontmatter: "",
    body: content && content.trim(),
  })

  if (!content) {
    return getEmpty()
  }

  const starting = RE_STARTING.exec(content)
  if (!starting) {
    return getEmpty()
  }

  const parseType = starting[1] || "yaml"
  if (parseType !== "yaml") {
    throw new Error(`Unsupported front matter type: ${parseType}`)
  }

  const rest = content.replace(RE_STARTING, "")
  const index = rest.indexOf("\n---")
  const frontmatter = rest.slice(0, index)
  const body = rest.slice(index + 4)
  let data = yaml.load(frontmatter)

  return {
    data,
    frontmatter,
    body: body && body.trim(),
  }
}
