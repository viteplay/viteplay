declare type PropDefinition = {
  name: string
  desc: string
  type: "string" | "number" | "array" | "boolean" | "object" | "any" | string
  required?: boolean
}

export { PropDefinition }
