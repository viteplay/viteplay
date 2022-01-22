declare type GeneratedPage = {
  title: string
  path: string
  component: () => Promise<any>
  children?: GeneratedPage[]
}
declare const pages: GeneratedPage[]

export { pages }
