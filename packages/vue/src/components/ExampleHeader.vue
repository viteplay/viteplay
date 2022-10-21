<script setup lang="ts">
import { watchEffect, ref } from "vue"
import { useRoute } from "vue-router"
import { Pepicon } from "@pepicons/vue"
import { VTooltip as vTooltip } from "floating-vue"
import FocusButton from "./FocusButton.vue"

const props = defineProps<{
  title: string
  slug: string
  iframeUrl?: string
}>()

const route = useRoute()

const header = ref<HTMLHeadingElement | null>(null)

watchEffect(() => {
  if (route.hash && header.value && route.hash === `#${header.value.id}`) {
    setTimeout(() => {
      const el =
        header.value?.id === "props"
          ? document.querySelector<HTMLDivElement>(".page-title")
          : document.querySelector<HTMLDivElement>(decodeURIComponent(route.hash))
      if (el) {
        window.scrollTo({
          top: el.offsetTop,
        })
        el.focus()
      }
    }, 50)
  }
})

const openIframe = () => {
  if (props.iframeUrl) {
    window.open(props.iframeUrl)
  }
}
</script>

<template>
  <h2 :id="props.slug" ref="header" class="example-header">
    {{ props.title }}
    <a class="header-anchor" :href="`#${props.slug}`">#</a>
    <div class="example-header-buttons">
      <Pepicon
        v-tooltip="`Open the preview in a new tab`"
        name="expand"
        size="sm"
        type="pop"
        role="button"
        class="viteplay-icon-button"
        @click="() => openIframe()"
      />
      <FocusButton :slug="props.slug" />
    </div>
  </h2>
</template>

<style lang="scss">
.example-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

a.header-anchor {
  position: absolute;
  top: 0.1em;
  left: -0.8em;
  font-size: 0.85em;
  opacity: 0;
  padding: 0 0.1em;
  color: var(--viteplay-c-brand);
}

.example-header:hover a.header-anchor,
a.header-anchor:focus {
  opacity: 1;
  text-decoration: none;
}

.example-header-buttons {
  display: flex;
  align-items: center;
  > *:not(.active) {
    opacity: 0;
  }
}

.viteplay-example:hover .example-header-buttons > * {
  opacity: 1;
}
</style>
