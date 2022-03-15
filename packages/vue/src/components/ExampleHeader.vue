<script setup lang="ts">
import { watchEffect, ref } from "vue"
import { useRoute } from "vue-router"
import FocusButton from "./FocusButton.vue"

const props = defineProps<{
  title: string
  slug: string
}>()

const route = useRoute()

const header = ref<HTMLHeadingElement | null>(null)

watchEffect(() => {
  if (route.hash && header.value && route.hash === `#${header.value.id}`) {
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(decodeURIComponent(route.hash))
      if (el) {
        window.scrollTo({
          top: el.offsetTop,
        })
        el.focus()
      }
    }, 50)
  }
})
</script>

<template>
  <h2 :id="props.slug" ref="header" class="example-header">
    {{ props.title }}
    <a class="header-anchor" :href="`#${props.slug}`">#</a>
    <FocusButton :slug="props.slug" style="margin-left: auto" />
  </h2>
</template>

<style scoped lang="scss">
.example-header {
  position: relative;
  display: flex;
  align-items: center;
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
</style>
