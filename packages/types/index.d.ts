declare type PropDefinition = {
  name: string
  desc: string
  type: "string" | "number" | "array" | "boolean" | "object" | "any"
  required?: boolean
}

export { PropDefinition }
