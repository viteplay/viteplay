import { FunctionalComponent, h, VNode } from "vue"
import { useRoute, RouterLink, useRouter } from "vue-router"
import { useConfig } from ".."
import { Pepicon } from "@pepicons/vue"
import type { SideBarItem, SideBarGroup, Header } from "./SideBar.types"
import { joinUrl } from "./utils"

interface HeaderWithChildren extends Header {
  children?: Header[]
}

export const SideBarLink: FunctionalComponent<{
  item: SideBarItem
  depth?: number
}> = (props) => {
  const route = useRoute()
  const depth = props.depth || 1
  const maxDepth = Infinity
  const config = useConfig()
  const router = useRouter()

  const isPageLink = depth === 1
  const text = props.item.text
  const link = isPageLink ? resolveLink(config.base || "", props.item.link) : props.item.link
  const children = (props.item as SideBarGroup).children
  const headers = (props.item as SideBarItem).headers
  const active = isPageLink ? route.path === link : route.hash === props.item.link
  const childItems =
    depth < maxDepth ? createChildren(active, children, headers as any, depth + 1) : null
  const handleEyeClick = (e: any) => {
    e.preventDefault()
    if (link?.startsWith("#")) {
      router.push({ hash: link, query: { focus: "true" } })
    }
  }
  return h("li", { class: "sidebar-link" }, [
    h(
      link ? (RouterLink as any) : "p",
      {
        "class": { "sidebar-link-item": true, active },
        "to": link,
        "data-depth": depth,
      },
      () => [
        text,
        link?.startsWith("#")
          ? h(
              "button",
              {
                onClick: handleEyeClick,
                class: { "focus-button": true, "active": active && route.query.focus },
                title: `Show this example only`,
              },
              [h(Pepicon, { name: "eye", type: "pop" })],
            )
          : undefined,
      ],
    ),
    childItems,
  ])
}

function resolveLink(base: string, path?: string): string | undefined {
  if (path === undefined) {
    return path
  }

  // keep relative hash to the same page
  if (path.startsWith("#")) {
    return path
  }

  return joinUrl(base, path)
}

function createChildren(
  active: boolean,
  children?: SideBarItem[],
  headers?: Header[],
  depth = 1,
): VNode | null {
  if (children && children.length > 0) {
    return h(
      "ul",
      { class: "sidebar-links" },
      children.map((c) => {
        return h(SideBarLink, { item: c, depth })
      }),
    )
  }
  return active && headers ? createChildren(false, resolveHeaders(headers), undefined, depth) : null
}

function resolveHeaders(headers: Header[]): SideBarItem[] {
  return mapHeaders(groupHeaders(headers))
}

function groupHeaders(headers: Header[]): HeaderWithChildren[] {
  headers = headers.map((h) => Object.assign({}, h))
  let lastH2: HeaderWithChildren
  headers.forEach((h) => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      ;(lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter((h) => h.level === 2)
}

function mapHeaders(headers: HeaderWithChildren[]): SideBarItem[] {
  return headers.map((header) => ({
    text: header.title,
    link: `#${header.slug}`,
    children: header.children ? mapHeaders(header.children) : undefined,
  }))
}
