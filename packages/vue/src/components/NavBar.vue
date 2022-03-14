<script setup lang="ts">
import { useRouter } from "vue-router"
import { useConfig } from ".."
import { resolveLink } from "./SideBarLink"
import NavBarTitle from "./NavBarTitle.vue"
import { SideBarItem } from "./SideBar.types"
import ToggleSideBarButton from "./ToggleSideBarButton.vue"
import SearchBox, { GetSuggestions } from "./SearchBox.vue"

const props = defineProps<{ items: SideBarItem[] }>()

const emit = defineEmits<{ (e: "toggleSideBar"): void }>()

const router = useRouter()
const config = useConfig()

function openPage(link: string | number) {
  const to = resolveLink(config.base || "", `${link}`)
  router.push(to)
}

const getSuggesttions: GetSuggestions = (keyword) => {
  return props.items
    .map((s) => {
      return (s.headers || []).map((header) => {
        return {
          text: [s.text, header.title] as const,
          onClick() {
            openPage(`${s.link}#${header.slug}`)
          },
        }
      })
    })
    .flat()
    .filter(({ text }) => {
      return `${text[0]} ${text[1]}`.toLowerCase().includes(keyword.toLowerCase())
    })
}
</script>

<template>
  <header class="viteplay-navbar">
    <ToggleSideBarButton tabindex="1" @toggle="() => emit('toggleSideBar')" />

    <NavBarTitle />

    <div class="navbar-right">
      <SearchBox :getSuggessions="getSuggesttions" />
    </div>
  </header>
</template>

<style scoped lang="scss">
.viteplay-navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--viteplay-z-index-navbar);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--viteplay-c-divider);
  padding: 0.7rem 1.5rem;
  height: var(--viteplay-header-height);
  background-color: var(--viteplay-c-bg);
}

.viteplay-navbar > *:first-child {
  margin-right: 0.8rem;
}

.navbar-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  :deep(input) {
    background-color: inherit;
  }
}
</style>
