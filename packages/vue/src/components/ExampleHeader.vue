<script setup lang="ts">
import { watchEffect, ref } from "vue"
import { useRoute } from "vue-router"

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
  <h2 :id="props.slug" ref="header" class="example-header" tabindex="1">{{ props.title }}</h2>
</template>

<style scoped>
.example-header:focus {
  box-sizing: border-box;
  outline-style: solid;
  outline-color: var(--c-brand);
  outline-width: 2px;
  outline-offset: 2px;
  border-radius: 6px;
}
</style>
