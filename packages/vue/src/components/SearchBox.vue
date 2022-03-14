<script lang="ts">
export type Suggestion = {
  text: readonly [string, string]
  onClick: () => void
}

export type GetSuggestions = (keyword: string) => Suggestion[]
</script>

<script lang="ts" setup>
import { ref, watchEffect } from "vue"
import { Pepicon } from "@pepicons/vue"
import { onClickOutside, onKeyStroke } from "@vueuse/core"

const keyword = ref("")
const suggestions = ref<Suggestion[]>([])
const searchBoxRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const open = ref(false)
const focused = ref(false)
const selectedIndex = ref(-1)

const props = defineProps<{
  getSuggessions: GetSuggestions
}>()

const handleFocus = () => {
  open.value = !!keyword.value
  focused.value = true
}

const handleClick = (cb: () => void) => {
  keyword.value = ""
  open.value = false
  cb()
}

watchEffect(() => {
  suggestions.value = props.getSuggessions(keyword.value)
  open.value = !!keyword.value
})

onClickOutside(searchBoxRef, () => {
  open.value = false
})

const isEditingContent = (event: any) => {
  const element = event.target
  const tagName = element.tagName
  return (
    element.isContentEditable ||
    tagName === "INPUT" ||
    tagName === "SELECT" ||
    tagName === "TEXTAREA"
  )
}

onKeyStroke(["/"], (e) => {
  if (isEditingContent(e)) return

  e.preventDefault()
  inputRef.value?.focus()
})

onKeyStroke(["ArrowUp"], () => {
  if (!focused.value) return

  selectedIndex.value =
    selectedIndex.value === 0 ? suggestions.value.length - 1 : selectedIndex.value - 1
})

onKeyStroke(["ArrowDown"], () => {
  if (!focused.value) return

  selectedIndex.value =
    selectedIndex.value === suggestions.value.length - 1 ? 0 : selectedIndex.value + 1
})

onKeyStroke(["Enter"], () => {
  if (!focused.value) return

  const suggestion = suggestions.value[selectedIndex.value]
  if (suggestion) {
    selectedIndex.value = -1

    handleClick(suggestion.onClick)
  }
})
</script>

<template>
  <div ref="searchBoxRef" :class="$style.search">
    <div :class="[$style.search_input_wrapper, focused && $style.search_input_wrapper__focused]">
      <Pepicon name="loop" :class="$style.search_icon" />
      <input
        ref="inputRef"
        v-model="keyword"
        type="text"
        :class="$style.search_input"
        @focus="handleFocus"
        @blur="focused = false"
      />
    </div>
    <div v-if="open" :class="$style.search_result">
      <div :class="$style.search_result_content">
        <ul v-if="suggestions.length > 0">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            :class="[
              $style.search_result_item,
              index === selectedIndex && $style.search_result_item__selected,
            ]"
          >
            <div @click="handleClick(suggestion.onClick)">
              <span>{{ suggestion.text[0] }}</span>
              <span>&gt;</span>
              <span>{{ suggestion.text[1] }}</span>
            </div>
          </li>
        </ul>
        <div v-else :class="$style.no_result">No results found</div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.search {
  position: relative;
}

.search_input_wrapper {
  border-radius: 999px;
  display: flex;
  border: 1px solid #e2e2e2;
  overflow: hidden;
  padding: 0 5px;
  height: 32px;
}

.search_input_wrapper__focused {
  border-color: var(--viteplay-c-brand);
  outline: 1px solid var(--viteplay-c-brand);
}

.search_icon {
  color: #ccc;
}

.search_input {
  border: none;
  min-width: 50px;
}

.search_input:focus {
  outline: none;
}

.search_result {
  position: absolute;

  right: 0;
  font-size: 14px;
}

.search_result_content {
  border: 1px solid #e2e2e2;
  background: var(--viteplay-c-bg);
  margin-top: 3px;
  min-width: 260px;
  border-radius: 6px;
  padding: 5px;
  max-height: 80vh;
  overflow: auto;
}

.search_result_content > ul {
  margin: 0;
  padding: 0;
}

.search_result_item {
  list-style: none;
}

.search_result_item + .search_result_item {
  margin-top: 1px;
}

.search_result_item > div {
  padding: 3px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 6px;
}

.search_result_item > div:hover,
.search_result_item__selected > div {
  background: #e7e7e7;
  color: var(--viteplay-c-brand);
}

.search_result_item > div > span + span {
  margin-left: 5px;
}

.search_result_item > div > span:first-child {
  font-weight: bold;
}

.no_result {
  padding: 5px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  .search_input_wrapper {
    max-width: 120px;
  }
}
</style>
