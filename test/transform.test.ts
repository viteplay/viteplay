import { test } from "vitest"
import { transformCodeToComponent } from "../src/transform"

test("sfc", () => {
  transformCodeToComponent(`<script setup>
    import {ref} from 'vue'
    let count = ref(0)
    </script>
    
    <template>
    <button>{{count}}</button>
    </template>
    
    <style scoped>
    button {
      color: yellow;
    }
    </style>`)
})
