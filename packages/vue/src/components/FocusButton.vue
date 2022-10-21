<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { VTooltip as vTooltip } from "floating-vue"
import * as pepiconsVue from "@pepicons/vue"
const { Pepicon } = pepiconsVue

const props = defineProps<{ slug: string }>()

const hash = computed(() => (props.slug[0] === "#" ? props.slug : `#${props.slug}`))

const route = useRoute()
const router = useRouter()

const active = computed(() => route.hash === hash.value)
const focussed = computed(() => route.query.focus && active.value)

const handleEyeClick = (e: any) => {
  e.preventDefault()
  const query = focussed.value ? {} : { focus: "true" }
  router.push({ hash: hash.value, query })
}
</script>

<template>
  <Pepicon
    v-tooltip="focussed ? `Show all examples again` : `Show this example only`"
    :name="focussed ? 'eye-off' : 'eye'"
    role="button"
    type="pop"
    class="viteplay-icon-button focus-button"
    :class="`viteplay-icon-button ${active && focussed ? 'active' : ''}`"
    @click="(e) => handleEyeClick(e)"
  />
</template>
