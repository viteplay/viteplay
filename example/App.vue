<script setup lang="ts">
import { defineComponent, h } from "vue"
import { Repl } from "../src"

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
  <Button bg="pink" @click="inc">hi {{ count }}</Button>
</template>
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
    <Repl :code="code" :modules="modules" :line-numbers="true" />
  </div>
</template>

<style scoped>
.main {
  max-width: 800px;
  margin: 20px auto;
}
</style>
