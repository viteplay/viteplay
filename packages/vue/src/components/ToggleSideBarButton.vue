<script lang="ts" setup>
// TODO: replace with new pepicon WIP

// import { Pepicon } from "@pepicons/vue"
const emit = defineEmits<{ (e: "toggle"): void }>()
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
  <button class="sidebar-button" @click.stop="() => emit('toggle')">
    <svg
      class="icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  </button>
</template>

<style lang="scss">
.sidebar-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 0;
  user-select: none;
}
.sidebar-button .icon {
  color: var(--viteplay-c-text);
}
</style>
