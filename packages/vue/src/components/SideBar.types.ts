export type SideBarItem = SideBarLink | SideBarGroup

export interface SideBarLink {
  text: string
  link: string
  headers?: Header[]
}

export interface SideBarGroup {
  text: string
  link?: string
  headers?: Header[]

  /**
   * @default false
   */
  collapsable?: boolean

  children: SideBarItem[]
}

export interface Header {
  level: number
  title: string
  slug: string
}
