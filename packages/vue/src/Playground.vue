<script lang="ts" setup>
import { PropType, ref, watchEffect, watch, onMounted, onBeforeUnmount } from "vue"
import CodeEditor from "./components/CodeEditor.vue"

import { useCopy } from "./hooks/useCopy"
import { PropDefinition } from "@viteplay/types"
import { Pepicon } from "@pepicons/vue"
import { ensureSFC } from "./utils"

const props = defineProps({
  iframeUrl: {
    type: String,
    required: true,
  },
  code: { type: String, required: true },
  lineNumbers: {
    type: Boolean,
    default: false,
  },
  componentProps: {
    type: Object as PropType<Record<string, PropDefinition[]>>,
    default: () => ({}),
  },
  openInEditor: {
    type: Function as PropType<() => void>,
  },
  darkExample: {
    type: Boolean,
  },
})

const editorExpanded = ref(false)
const errors = ref<string[]>([])
const showingError = ref(false)
const iframe = ref<HTMLIFrameElement | null>(null)

const editorCode = ref("")

const copy = useCopy(() => editorCode.value)

watchEffect(() => {
  editorCode.value = props.code
})

watch(
  () => editorCode.value,
  () => {
    if (!iframe.value) return

    iframe.value.contentWindow.postMessage(
      { action: "update-code", code: ensureSFC(editorCode.value) },
      {},
    )
  },
)

const handleMessage = (e: MessageEvent) => {
  const { data } = e
  if (typeof data === "object" && data.action) {
    if (data.iframeUrl !== props.iframeUrl) return

    if (data.action === "render-error") {
      errors.value = data.payload.errors || []
    } else if (data.action === "resize") {
      iframe.value.style.height = `${data.payload.height}px`
    }
  }
}

const openIframe = () => {
  window.open(props.iframeUrl)
}

onMounted(() => {
  window.addEventListener("message", handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage)
})
</script>

<template>
  <div class="playground">
    <div class="playground-preview" :class="darkExample && 'dark'">
      <iframe
        ref="iframe"
        :src="iframeUrl"
        sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
      />
    </div>
    <div :class="['playground-editor', errors.length && 'has-error', editorExpanded && 'expanded']">
      <div class="playground-header">
        <h3 @click="editorExpanded = !editorExpanded">
          <Pepicon :name="editorExpanded ? 'angle-down' : 'angle-right'" :size="16" />
          <span>Editable Example</span>
        </h3>
        <div class="playground-buttons">
          <Pepicon
            v-if="props.openInEditor"
            name="open"
            type="pop"
            size="sm"
            role="button"
            aria-label="Open the example code in editor"
            class="hint--bottom hint--rounded"
            @click="props.openInEditor"
          />
          <Pepicon
            name="expand"
            size="sm"
            type="pop"
            role="button"
            aria-label="Show the example in a new tab"
            class="hint--bottom hint--rounded"
            @click="() => openIframe()"
          />
          <Pepicon
            v-if="!errors.length"
            :name="copy.copied.value ? 'checkmark' : 'clipboard'"
            type="pop"
            size="sm"
            role="button"
            aria-label="Copy to clipboard"
            class="hint--bottom hint--rounded"
            @click="copy.copy"
          />
          <Pepicon
            v-if="errors.length"
            :class="`playground-icon-error ${showingError ? 'enabled' : ''}`"
            name="exclamation"
            type="pop"
            size="xl"
            role="button"
            @click="() => (showingError = !showingError)"
          />
        </div>
      </div>
      <CodeEditor v-if="editorExpanded" v-model="editorCode" :componentProps="componentProps" />
    </div>
    <div v-show="showingError" class="playground-error">
      <div v-for="(error, index) in errors" :key="index">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-error {
  background-color: crimson;
  color: white;
  white-space: pre-wrap;
  padding: 20px;
  border-radius: 6px;
}

.playground-preview {
  border: 1px solid var(--viteplay-c-divider);
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  background-color: var(--viteplay-example-bg);
  color: var(--viteplay-example-color);
  width: 100%;
}

.playground-preview iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.playground-preview.dark {
  background-color: var(--viteplay-example-dark-bg);
  color: var(--viteplay-example-dark-color);
}

.playground-editor {
  background-color: rgb(1, 22, 39);
  color: #c4c4c4;
  border-radius: 8px;
  margin: 15px 0;
}

.playground-editor.has-error {
  outline: thick solid crimson;
}

.playground-header {
  font-size: 0.75em;
  text-transform: uppercase;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgb(155, 155, 155);
  position: relative;
  padding: 0 15px;
}

.playground-header h3 {
  font-weight: normal;
  font-size: 1rem;
  font-size: inherit;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
  width: 100%;
}

.playground-header h3 span {
  margin-left: 5px;
}

.playground-buttons {
  display: flex;
}

.playground-buttons > div + div {
  margin-left: 5px;
}

.playground-buttons > div {
  cursor: pointer;
}

.playground-buttons > div:hover:not(.playground-icon-error) {
  color: var(--viteplay-c-white);
}

.playground-icon-error {
  color: crimson;
  cursor: pointer;
  user-select: none;
  margin-top: 10px;
}

.playground-icon-error.enabled {
  border-radius: 100%;
  outline: 2px solid #6694f8;
  outline-offset: -2px;
}
</style>
