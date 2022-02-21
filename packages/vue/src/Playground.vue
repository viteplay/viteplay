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
})

// Code to be actually evaluated
let code = ref("")
// Code to display
let displayCode = ref("")

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

onMounted(() => {
  setComponent()
})
</script>

<template>
  <div class="playground">
    <div v-if="transformed" class="playground-preview">
      <component is="style" v-if="transformed.css" v-html="transformed.css" />
      <Suspense>
        <component :is="transformed.component" v-if="transformed.component" />
      </Suspense>
    </div>
    <div :class="`playground-editor ${errors.length ? 'has-error' : ''}`">
      <div class="playground-editor__header">
        <h3>Editable Example</h3>
        <div class="playground-buttons">
          <button v-if="!errors.length" class="playground-copy-button" @click="copy.copy">
            {{ copy.copied.value ? "Copied" : "Copy" }}
          </button>
          <Pepicon
            v-if="errors.length"
            :class="`playground-icon-error ${showingError ? 'enabled' : ''}`"
            name="exclamation"
            type="pop"
            size="xl"
            @click="() => (showingError = !showingError)"
          />
        </div>
      </div>
      <Editor v-model="displayCode" :componentProps="componentProps" />
    </div>
    <div v-show="showingError" class="playground-error">
      <div v-for="(error, index) in errors" :key="index">
        {{ error }}
      </div>
    </div>
  </div>
</template>
