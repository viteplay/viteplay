<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue"
import { EditorState, basicSetup } from "@codemirror/basic-setup"
import { EditorView, ViewUpdate, keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { html } from "../codemirror/lang-html"
import { oneDark } from "../codemirror/theme"
import { PropDefinition } from "@viteplay/types"

const editorEl = ref<HTMLDivElement | null>(null)
const editor = ref<EditorView | null>(null)

const props = defineProps<{
  modelValue: string
  componentProps: Record<string, PropDefinition[]>
}>()

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void
}>()

const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
  if (vu.docChanged) {
    const doc = vu.state.doc
    const value = doc.toString()
    emit("update:modelValue", value)
  }
})

onMounted(() => {
  if (!editorEl.value) return
  editor.value = new EditorView({
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        keymap.of([indentWithTab]),
        html({ componentProps: props.componentProps }),
        oneDark,
        updateListener,
      ],
    }),
    parent: editorEl.value,
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

// Update editor state when `modelValue` changes
watchEffect(() => {
  if (editor.value) {
    const currentValue = editor.value.state.doc.toString() || ""
    const nextValue = props.modelValue || ""
    if (nextValue && nextValue !== currentValue) {
      editor.value.dispatch({
        changes: { from: 0, to: currentValue.length, insert: nextValue },
      })
    }
  }
})
</script>

<template>
  <div ref="editorEl"></div>
</template>
