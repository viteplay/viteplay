<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Pepicon } from "@pepicons/vue"
import { VTooltip as vTooltip } from "floating-vue"

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
    v-tooltip="`Show this example only`"
    name="eye"
    role="button"
    type="pop"
    class="icon-button focus-button"
    :class="`icon-button ${active && focussed ? 'active' : ''}`"
    @click="(e) => handleEyeClick(e)"
  />
</template>
