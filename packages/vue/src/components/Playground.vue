<script lang="ts" setup>
import { PropType, ref, watchEffect, watch, onMounted, onBeforeUnmount } from "vue"
import CodeEditor from "./CodeEditor.vue"
import { useCopy } from "../hooks/useCopy"
import { ComponentExample, PropDefinition } from "@viteplay/types"
import { PrintAngleDown, PrintAngleRight, PopReload, PopOpen, PopCheckmark, PopClipboard, PopExclamation } from "@pepicons/vue"
import { VTooltip as vTooltip } from "floating-vue"
import { ensureSFC } from "../utils"

const props = defineProps({
  example: {
    type: Object as PropType<ComponentExample>,
    required: true,
  },
  componentProps: {
    type: Object as PropType<Record<string, PropDefinition[]>>,
    default: () => ({}),
  },
})

const editorExpanded = ref(false)
const errors = ref<string[]>([])
const showingError = ref(false)
const iframe = ref<HTMLIFrameElement | null>(null)

const editorCode = ref("")

const copy = useCopy(() => editorCode.value)

watchEffect(() => {
  editorCode.value = props.example.code
})

watch(
  () => editorCode.value,
  () => {
    if (!iframe.value) return

    iframe.value.contentWindow?.postMessage(
      { action: "update-code", code: ensureSFC(editorCode.value) },
      {},
    )
  },
)

const handleMessage = (e: MessageEvent) => {
  const { data } = e
  if (typeof data === "object" && data.action) {
    if (data.iframeUrl !== props.example.iframeUrl) return

    if (data.action === "render-error") {
      errors.value = data.payload.errors || []
    } else if (data.action === "resize" && iframe.value) {
      iframe.value.style.height = `${data.payload.height}px`
    }
  }
}

const resetCode = () => {
  editorCode.value = props.example.code
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
    <div
      class="playground-preview"
      :class="[
        example.docs.attrs.previewClass,
        (example.docs.attrs.darkPreview || example.docs.attrs.darkExample) && 'dark',
      ]"
    >
      <iframe
        ref="iframe"
        :src="example.iframeUrl"
        sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
      />
    </div>
    <div :class="['playground-editor', errors.length && 'has-error', editorExpanded && 'expanded']">
      <div class="playground-header" @click="editorExpanded = !editorExpanded">
        <h3>
          <component :is="editorExpanded ? PrintAngleDown : PrintAngleRight" :size="16" />
          <span>Editable Example</span>
        </h3>
        <div class="playground-buttons">
          <PopReload
            v-if="!errors.length"
            v-tooltip="`Reset the code`"
            size="sm"
            role="button"
            @click.stop="resetCode"
          />
          <PopOpen
            v-if="example.openInEditor"
            v-tooltip="`Open the example code in editor`"
            size="sm"
            role="button"
            @click.stop="example.openInEditor"
          />
          <component
            :is="copy.copied.value ? PopCheckmark : PopClipboard"
            v-if="!errors.length"
            v-tooltip="`Copy to clipboard`"
            size="sm"
            role="button"
            @click.stop="copy.copy"
          />
          <PopExclamation
            v-if="errors.length"
            :class="`playground-icon-error ${showingError ? 'enabled' : ''}`"
            size="xl"
            role="button"
            @click.stop="() => (showingError = !showingError)"
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

<style lang="scss">
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
  cursor: se-resize;
}

.expanded .playground-header {
  cursor: nw-resize;
}

.playground-header h3 {
  font-weight: normal;
  font-size: 1rem;
  font-size: inherit;
  margin: 0;
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
