export type SideBarItem = SideBarLink

export interface SideBarLink {
  text: string
  link: string
  headers?: Header[]
}

export interface Header {
  level: number
  title: string
  slug: string
}
