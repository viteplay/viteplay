<script lang="ts" setup>
import {
  onBeforeUnmount,
  onMounted,
  PropType,
  shallowRef,
  watchEffect,
  ref,
  onBeforeMount,
} from "vue"
import { transformCodeToComponent, Transformed } from "../transform"
import { debounce } from "../utils"

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

const sendMessageToParent = (action: string, payload: any) => {
  window.parent?.postMessage({
    action,
    payload,
    iframeUrl: window.location.pathname,
  })
}

const setComponent = () => {
  const result = transformCodeToComponent(componentCode.value, props.modules)
  if (result) {
    transformed.value = result
    if (result.errors && result.errors.length > 0) {
      console.error(result.errors.join("\n"))
    }
    sendMessageToParent("render-error", {
      errors: result.errors,
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

const getDocumentHeight = () => {
  const body = document.body
  const html = document.documentElement

  const height = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  )

  return height > 800 ? 800 : height
}

const observerCallback = () => {
  sendMessageToParent("resize", {
    height: getDocumentHeight(),
  })
}

const observer = new MutationObserver(debounce(observerCallback, 250))

onBeforeMount(() => {
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  })
})

onMounted(() => {
  window.addEventListener("message", handleMessage)
})

onBeforeUnmount(() => {
  observer.disconnect()
  window.removeEventListener("message", handleMessage)
})
</script>

<template>
  <template v-if="transformed">
    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
    <component is="style" v-if="transformed.css" v-html="transformed.css" />
    <Suspense>
      <component :is="transformed.component" v-if="transformed.component" />
    </Suspense>
  </template>
</template>
