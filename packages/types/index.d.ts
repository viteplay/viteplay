declare type PropDefinition = {
  name: string
  desc: string
  type: "string" | "number" | "array" | "boolean" | "object" | "any" | string
  required?: boolean
}

declare type ComponentExample = {
  slug: string
  title: string
  code: string
  docs?: string
  dark?: boolean
  iframeUrl: string
  openInEditor?: () => void
}

export { PropDefinition, ComponentExample }
