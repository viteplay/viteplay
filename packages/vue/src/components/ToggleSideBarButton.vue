<script lang="ts" setup>
import { Pepicon } from "@pepicons/vue"

const emit = defineEmits<{
  (e: "toggle"): void
}>()
</script>

<template>
  <!-- TODO: release pepicon -->
  <!-- <Pepicon
    size="1.25rem"
    class="sidebar-button"
    type="pop"
    name="menu"
    @click="() => emit('toggle')"
  /> -->
  <div class="sidebar-button">
    <svg
      class="icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="() => emit('toggle')"
    >
      <line
        x1="3"
        y1="8"
        x2="13.3077"
        y2="8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="3"
        y1="4"
        x2="17"
        y2="4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="3"
        y1="12"
        x2="17"
        y2="12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <line
        x1="3"
        y1="16"
        x2="13.3077"
        y2="16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<style>
.sidebar-button {
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 0;
  user-select: none;
}
.sidebar-button .icon {
  color: var(--c-text);
}
</style>
