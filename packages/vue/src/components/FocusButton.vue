<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Pepicon } from "@pepicons/vue"

const props = defineProps<{ slug: string }>()

const hash = computed(() => (props.slug[0] === "#" ? props.slug : `#${props.slug}`))

const route = useRoute()
const router = useRouter()

const active = computed(() => route.hash === hash.value)
const focussed = computed(() => route.query.focus)

const handleEyeClick = (e: any) => {
  e.preventDefault()
  const query = focussed.value ? {} : { focus: "true" }
  router.push({ hash: hash.value, query })
}
</script>

<template>
  <button
    :class="`focus-button ${active && focussed ? 'active' : ''}`"
    title="Show this example only"
  >
    <Pepicon name="eye" type="pop" @click="handleEyeClick" />
  </button>
</template>

<style scoped>
.focus-button {
  border: none;
  background-color: transparent;
  color: var(--viteplay-c-text);
  cursor: pointer;
  opacity: 0;
  border-radius: 33px;
  width: 32px;
  height: 32px;
}
.focus-button:not(.active):hover {
  background-color: var(--viteplay-c-bg-light);
}

.focus-button.active {
  color: var(--viteplay-c-brand);
  opacity: 1;
}
</style>
