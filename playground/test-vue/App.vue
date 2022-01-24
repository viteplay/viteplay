<script setup lang="ts">
import "@viteplay/vue/dist/style.css"
import "prismjs/themes/prism-tomorrow.css"
import { defineComponent, h } from "vue"
import { Playground } from "@viteplay/vue"

const code =
  `
<script setup>
import { ref } from 'vue'
import ` +
  `{ Button } from 'my-ui'
let count = ref(0)
let inc = () => count.value++
</` +
  `script>

<template>
  <div class="example">
    <Button bg="pink" @click="inc">hi {{ count }}</Button>
  </div>
</template>

<style scoped>
.example::v-deep(button) {
  color: red;
}
</style>
`

const Button = defineComponent({
  name: "Button",
  props: {
    bg: {
      type: String,
      required: true,
    },
  },
  setup({ bg }, { slots }) {
    return () => {
      return h(
        "button",
        { style: `background:${bg}` },
        slots.default && slots.default(),
      )
    }
  },
})

const modules = {
  "my-ui": {
    Button,
  },
}
</script>

<template>
  <div class="main">
    <Playground :code="code" :modules="modules" />
  </div>
</template>

<style scoped>
.main {
  max-width: 800px;
  margin: 20px auto;
}
</style>
