<script lang="ts" setup>
import {
  computed,
  onErrorCaptured,
  onMounted,
  PropType,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from "vue"
import Editor from "./components/Editor.vue"
import { debounce, ensureSFC } from "./utils"
import { transformCodeToComponent, Transformed } from "./transform"
import { useConfig } from "."
import { useCopy } from "./hooks/useCopy"
import { PropDefinition } from "@viteplay/types"
import { Pepicon } from "@pepicons/vue"

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  modules: {
    type: Object,
    default: () => ({}),
  },
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

// Code to be actually evaluated
let code = ref("")
// Code to display
let displayCode = ref("")
const editorExpanded = ref(true)

const transformed = shallowRef<Transformed | null>(null)
let errors = ref<string[]>([])
const copy = useCopy(() => displayCode.value)

const config = useConfig()
const modules = computed(() => ({ ...config.modules, ...props.modules }))

const transform = (code: string) => {
  const transformed = transformCodeToComponent(code, modules.value)
  return transformed
}

const setComponent = () => {
  const result = transform(code.value)
  if (result) {
    transformed.value = result
    errors.value = result.errors || []
    if (errors.value.length === 0) {
      showingError.value = false
    }
  }
}

const setComponentDebounced = debounce(setComponent, 250)

watchEffect(() => {
  displayCode.value = props.code.trim()
})

watchEffect(() => {
  code.value = ensureSFC(displayCode.value)
})

// Catch errors in the child components (solely for the component we create)
onErrorCaptured((error) => {
  errors.value = [error.message]
  // Stop the error from bubbling up to the parent
  return false
})

watch(code, setComponentDebounced)

const showingError = ref(false)

const playgroundCSSVariables = computed(() =>
  props.darkExample
    ? `--viteplay-example-bg: rgb(13, 17, 23); --viteplay-example-color: #fff;`
    : undefined,
)

onMounted(() => {
  setComponent()
})
</script>

<template>
  <div class="playground" :style="playgroundCSSVariables">
    <div v-if="transformed" class="playground-preview">
      <component is="style" v-if="transformed.css" v-html="transformed.css" />
      <Suspense>
        <component :is="transformed.component" v-if="transformed.component" />
      </Suspense>
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
            title="Open the example in editor"
            @click="props.openInEditor"
          />
          <Pepicon
            v-if="!errors.length"
            title="Copy to clipboard"
            :name="copy.copied.value ? 'checkmark' : 'clipboard'"
            type="pop"
            size="sm"
            role="button"
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
      <Editor v-if="editorExpanded" v-model="displayCode" :componentProps="componentProps" />
    </div>
    <div v-show="showingError" class="playground-error">
      <div v-for="(error, index) in errors" :key="index">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./css/variables.scss";

.playground-error {
  background-color: crimson;
  color: white;
  white-space: pre-wrap;
  padding: 20px;
  border-radius: 6px;
}

.playground-preview {
  border: 1px solid $c-divider;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  background-color: var(--viteplay-example-bg);
  color: var(--viteplay-example-color);
}

.playground-editor {
  background-color: rgb(1, 22, 39);
  color: #c4c4c4;
  border-radius: 8px;
  margin: 15px 0;
  padding: 0 15px;
}

.playground-editor.expanded {
  padding-bottom: 15px;
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
  color: $c-white;
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
