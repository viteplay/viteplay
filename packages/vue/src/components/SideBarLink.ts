import { FunctionalComponent, h } from "vue"
import { useRoute, RouterLink, useRouter } from "vue-router"
import { useConfig } from ".."
import { Pepicon } from "@pepicons/vue"
import type { SideBarItem } from "./SideBar.types"
import { joinUrl } from "./utils"

export const SideBarLink: FunctionalComponent<{
  item: SideBarItem
  depth?: number
}> = (props) => {
  const route = useRoute()
  const depth = props.depth || 1
  const config = useConfig()
  const router = useRouter()

  const isPageLink = depth === 1
  const text = props.item.text
  const link = isPageLink ? resolveLink(config.base || "", props.item.link) : props.item.link
  const active = isPageLink ? route.path === link : route.hash === props.item.link

  const handleEyeClick = (e: any) => {
    e.preventDefault()
    if (link.startsWith("#")) {
      router.push({ hash: link, query: { focus: "true" } })
    }
  }
  return h("li", { class: "sidebar-link" }, [
    h(
      RouterLink,
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
    active &&
      props.item.headers &&
      h(
        "ul",
        { class: "sidebar-links" },
        props.item.headers.map((header) => {
          return h(SideBarLink, {
            key: header.title + header.slug,
            item: { text: header.title, link: `#${header.slug}` },
            depth: depth + 1,
          })
        }),
      ),
  ])
}

export function resolveLink(base: string, path: string): string {
  // keep relative hash to the same page
  if (path.startsWith("#")) {
    return path
  }

  return joinUrl(base, path)
}
