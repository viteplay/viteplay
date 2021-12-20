<script lang="ts" setup>
import "prismjs/themes/prism.css"
import "vue-prism-editor/dist/prismeditor.min.css"
import {
  onErrorCaptured,
  PropType,
  ref,
  shallowRef,
  watch,
  watchEffect,
} from "vue"
import { PrismEditor } from "vue-prism-editor"
import { debounce } from "./utils"
import { highlight } from "./highlight"
import { transformCodeToComponent } from "./transform"

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  components: {
    type: Object,
  },
  modules: {
    type: Object,
  },
  setup: {
    type: Function as PropType<() => any>,
  },
  lineNumbers: {
    type: Boolean,
  },
})

let code = ref("")
const component = shallowRef<any>(null)
const compileError = ref<string | null>(null)

const toComponent = (code: string) => {
  // Clean up previous error
  compileError.value = null

  try {
    // Create a Vue component from "code"
    const component = transformCodeToComponent(code, props.modules)

    return component
  } catch (error: any) {
    // Handle compiler error
    console.error(error)
    const loc = error.loc as any
    if (loc) {
      compileError.value = `${error.message} at line ${loc.start}`
    } else {
      compileError.value = error.message
    }
  }
}

const setComponent = debounce(() => {
  const c = toComponent(code.value)
  if (c) {
    component.value = c
  }
}, 250)

watchEffect(() => {
  code.value = props.code.trim()
})

// Catch errors in the child components (solely for the component we create)
onErrorCaptured((error) => {
  compileError.value = error.message
  // Stop the error from bubbling up to the parent
  return false
})

watch(
  code,
  () => {
    setComponent()
  },
  { immediate: true },
)
</script>

<template>
  <div class="vue-repl">
    <div class="vue-repl-preview" v-if="component">
      <component :is="component" />
    </div>
    <div class="vue-repl--editor">
      <PrismEditor
        :line-numbers="props.lineNumbers"
        :highlight="highlight"
        v-model="code"
      />
    </div>
    <div class="vue-repl--error" v-if="compileError">
      {{ compileError }}
    </div>
  </div>
</template>

<style scoped>
.vue-repl {
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
}

.vue-repl--editor {
}

.vue-repl--error {
  background-color: red;
  color: white;
  white-space: pre-wrap;
  padding: 10px;
}
</style>

<style>
.prism-editor__textarea:focus {
  outline: none;
}
</style>
