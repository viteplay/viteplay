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
import { PrismEditor } from "vue-prism-editor"
import { debounce, ensureSFC } from "./utils"
import { transformCodeToComponent, Transformed } from "./transform"
import { highlight } from "./highlight"
import { usePlaygroundOptions } from "."
import { useCopy } from "./hooks/useCopy"

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
  highlight: {
    type: Function as PropType<(code: string) => string>,
    default: highlight,
  },
})

// Code to be actually evaluated
let code = ref("")
// Code to display
let displayCode = ref("")

const transformed = shallowRef<Transformed | null>(null)
let errors = ref<string[]>([])
const copy = useCopy(() => displayCode.value)

const context = usePlaygroundOptions()
const modules = computed(() => ({ ...props.modules, ...context.modules }))

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

onMounted(() => {
  setComponent()
})
</script>

<template>
  <div class="vrepl">
    <div class="vrepl-preview" v-if="transformed">
      <component
        v-if="transformed.css"
        is="style"
        v-html="transformed.css"
      ></component>
      <component v-if="transformed.component" :is="transformed.component" />
    </div>
    <div class="vrepl-editor">
      <div class="vrepl-editor--header">
        <h3>Editable Example</h3>
        <button @click="copy.copy" class="vrepl-copy-button">
          {{ copy.copied.value ? "Copied" : "Copy" }}
        </button>
      </div>
      <PrismEditor
        :line-numbers="props.lineNumbers"
        :highlight="props.highlight"
        v-model="displayCode"
      />
    </div>
    <div class="vrepl-error" v-if="errors.length > 0">
      <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
    </div>
  </div>
</template>
