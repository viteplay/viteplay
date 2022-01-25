<script setup lang="ts">
import { pages } from "@viteplay/vue/client"
import { computed, ref, defineAsyncComponent } from "vue"
let selected = ref(pages[0].title)

const component = computed(() => {
  const m = pages.find((page) => page.title === selected.value)
  return m && defineAsyncComponent(m.component)
})
</script>

<template>
  <div>
    <select v-model="selected">
      <option :key="page.title" v-for="page in pages" :value="page.title">
        {{ page.title }}
      </option>
    </select>
    <div v-if="component">
      <component :is="component" />
    </div>
  </div>
</template>
