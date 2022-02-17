<script setup lang="ts">
import { computed, ref } from "vue"
import { NAutoComplete } from "naive-ui"
import { useRouter } from "vue-router"
import { Pepicon } from "@pepicons/vue"
import { onKeyStroke } from "@vueuse/core"
import { useConfig } from ".."
import { resolveLink } from "./SideBarLink"
import NavBarTitle from "./NavBarTitle.vue"
import ToggleSideBarButton from "./ToggleSideBarButton.vue"
import { SideBarItem } from "./SideBar.types"

const props = defineProps<{ items: SideBarItem[] }>()

const emit = defineEmits<{
  (e: "toggle"): void
}>()

const router = useRouter()
const config = useConfig()

const searchInput = ref<undefined | string>(undefined)
const autocompleteOptions = computed(() =>
  props.items
    .map((s) => {
      return (s.headers || []).map((header) => {
        return { label: `${s.text} > ${header.title}`, value: `${s.link}#${header.slug}` }
      })
    })
    .flat()
    .filter(({ label, value }) => {
      const s = (searchInput.value || "").toLowerCase()
      const l = label.toLowerCase()
      const v = value.toLowerCase()
      return l.includes(s) || v.includes(s)
    }),
)

function openPage(link: string | number) {
  const to = resolveLink(config.base || "", `${link}`)
  router.push(to)
}

function isEditingContent(event: any) {
  const element = event.target
  const tagName = element.tagName
  return (
    element.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "SELECT" ||
    tagName === "TEXTAREA"
  )
}

onKeyStroke(["/"], (e) => {
  if (isEditingContent(e)) return

  e.preventDefault()
  const inputEl = document.querySelector(".navbar .auto-complete input")
  try {
    if (inputEl) (inputEl as any).focus()
  } catch (e) {
    /** do nothing */
  }
})
</script>

<template>
  <header class="navbar">
    <ToggleSideBarButton @toggle="emit('toggle')" />

    <NavBarTitle />
    <div class="flex-grow">
      <NAutoComplete
        v-model:value="searchInput"
        class="auto-complete"
        placeholder="Search"
        :options="autocompleteOptions"
        :blurAfterSelect="true"
        :clearAfterSelect="true"
        @select="openPage"
      >
        <template #prefix><Pepicon name="loop" type="pop" class="loop-icon" /></template>
        <template #suffix><kbd class="kbd">/</kbd></template>
      </NAutoComplete>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--z-index-navbar);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-divider);
  padding: 0.7rem 1.5rem 0.7rem 4rem;
  height: var(--header-height);
  background-color: var(--c-bg);
}

@media (min-width: 720px) {
  .navbar {
    padding: 0.7rem 1.5rem;
  }
}

.flex-grow {
  flex-grow: 1;
  display: flex;
}

.loop-icon {
  color: #e2e2e2;
}
.kbd {
  line-height: 1;
  border: thin solid var(--c-text-light-3);
  color: var(--c-text-light-3);
  padding: 0.3rem;
  border-radius: 0.3rem;
}

.auto-complete {
  width: initial;
  margin: 0 auto;
}
@media (min-width: 720px) {
  .auto-complete {
    width: 360px;
  }
}
</style>
