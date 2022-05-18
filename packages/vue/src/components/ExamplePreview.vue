<script lang="ts" setup>
import { onBeforeUnmount, onMounted, PropType, shallowRef, watchEffect, ref } from "vue"
import { transformCodeToComponent, Transformed } from "../transform"

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  modules: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
})

const componentCode = ref("")

const transformed = shallowRef<Transformed | null>(null)

const setComponent = () => {
  const result = transformCodeToComponent(componentCode.value, props.modules)
  if (result) {
    transformed.value = result
    if (result.errors && result.errors.length > 0) {
      console.error(result.errors.join("\n"))
    }
    window.parent?.postMessage({
      action: "render-error",
      errors: result.errors,
      iframeUrl: window.location.pathname,
    })
  }
}

watchEffect(() => {
  componentCode.value = props.code
})

watchEffect(() => {
  setComponent()
})

const handleMessage = (e: MessageEvent<any>) => {
  if (e.data.action === "update-code") {
    componentCode.value = e.data.code
  }
}

onMounted(() => {
  window.addEventListener("message", handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage)
})
</script>

<template>
  <template v-if="transformed">
    <component is="style" v-if="transformed.css" v-html="transformed.css" />
    <Suspense>
      <component :is="transformed.component" v-if="transformed.component" />
    </Suspense>
  </template>
</template>
