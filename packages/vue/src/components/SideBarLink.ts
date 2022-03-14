import { FunctionalComponent, h, ref, UnwrapRef, watchEffect } from "vue"
import { useRoute, RouterLink, useLink } from "vue-router"
import { useConfig } from ".."
import type { SideBarItem } from "./SideBar.types"
import { joinUrl } from "./utils"
import FocusButton from "./FocusButton.vue"

export const SideBarLink: FunctionalComponent<
  {
    item: SideBarItem
    depth?: number
    slug?: string
  },
  {
    closeSideBar: () => void
  }
> = (props, { emit }) => {
  const route = useRoute()
  const depth = props.depth || 1
  const config = useConfig()
  const sidebarLinkRef = ref<HTMLAnchorElement | null>(null)

  const isPageLink = depth === 1
  const text = props.item.text
  const link = isPageLink ? resolveLink(config.base || "", props.item.link) : props.item.link
  const active = isPageLink ? route.path === link : route.hash === props.item.link

  // Scroll the header in sidebar into view
  watchEffect(() => {
    if (route.hash && props.slug && route.hash === `#${props.slug}` && sidebarLinkRef.value) {
      sidebarLinkRef.value.scrollIntoView()
    }
  })

  return h("li", { class: "sidebar-link" }, [
    h(
      RouterLink,
      {
        to: link,
        custom: true,
      },
      {
        default: ({ navigate, href }: UnwrapRef<ReturnType<typeof useLink>>) => {
          return h(
            "a",
            {
              "ref": sidebarLinkRef,
              href,
              "onClick": navigate,
              "data-depth": depth,
              "class": { "sidebar-link-item": true, active },
            },
            [
              text,
              link?.startsWith("#")
                ? h(FocusButton, {
                    slug: link,
                    onCloseSideBar: () => {
                      console.log(`1 → `, 1)
                      emit("closeSideBar")
                    },
                  })
                : undefined,
            ],
          )
        },
      },
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
            slug: header.slug,
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
