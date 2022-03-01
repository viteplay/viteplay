<script setup lang="ts">
import { computed, ref } from "vue"
import { NAutoComplete } from "naive-ui"
import { useRouter } from "vue-router"
import { Pepicon } from "@pepicons/vue"
import { onKeyStroke, useMediaQuery } from "@vueuse/core"
import { useConfig } from ".."
import { resolveLink } from "./SideBarLink"
import NavBarTitle from "./NavBarTitle.vue"
import { SideBarItem } from "./SideBar.types"
import ToggleSideBarButton from "./ToggleSideBarButton.vue"

const props = defineProps<{ items: SideBarItem[] }>()

const emit = defineEmits<{
  (e: "toggle"): void
}>()

const router = useRouter()
const config = useConfig()

const searchFocused = ref(false)
const searchBarWidth = computed(() => (searchFocused.value ? "100%" : "160px"))
const isSmallScreen = useMediaQuery(`(max-width: 768px)`)

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

    <NavBarTitle v-if="!searchFocused || !isSmallScreen" />

    <div class="navbar-right">
      <NAutoComplete
        v-model:value="searchInput"
        class="auto-complete"
        placeholder="Search"
        :options="autocompleteOptions"
        :blurAfterSelect="true"
        :clearAfterSelect="true"
        @select="openPage"
        @focus="searchFocused = true"
        @blur="searchFocused = false"
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
  padding: 0.7rem 1.5rem;
  height: var(--header-height);
  background-color: var(--c-bg);
}

.navbar > *:first-child {
  margin-right: 0.8rem;
}

.navbar-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
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
  width: 260px;
}

@media (max-width: 720px) {
  .auto-complete {
    width: v-bind(searchBarWidth);
  }
}

::v-deep(.auto-complete > *) {
  --n-caret-color: var(--c-brand) !important;
  --n-border-hover: 1px solid var(--c-brand) !important;
  --n-border-focus: 1px solid var(--c-brand) !important;
  --n-loading-color: var(--c-brand) !important;
  --n-box-shadow-focus: 0 0 0 2px rgba(36, 0, 140, 0.2) !important;
}

::v-deep(.n-auto-complete-menu) {
  --n-group-header-text-color: rgb(118, 124, 130);
  --n-option-check-color: var(--c-brand) !important;
  --n-option-color-pending: rgba(36, 0, 140, 0.2) !important;
  --n-option-color-active: rgba(36, 0, 140, 0.2) !important;
  --n-option-text-color: rgb(51, 54, 57);
  --n-option-text-color-active: var(--c-brand-light) !important;
  --n-option-text-color-pressed: var(--c-brand) !important;
  --n-loading-color: var(--c-brand) !important;
}
</style>
