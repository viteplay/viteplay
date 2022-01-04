declare const pages: {
  title: string
  component: () => Promise<any>
}[]

declare const Menu: import("vue").DefineComponent<{}>

export { pages }
