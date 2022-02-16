import { expect, test } from "vitest"
import { parseComponent } from "../src/parse-component"

test("parseComponent", () => {
  const { props } = parseComponent(
    `<script setup lang="ts">
defineProps<{
    requiredFoo: string,
    /**
     * bar
     * This prop is optional
     */
    optionalBar?: number
    someObject: {
      foo: string
    }
}>()
</script>`,
    "test.vue",
  )

  expect(props).toEqual([
    { name: "requiredFoo", type: "string", desc: "", required: true },
    {
      name: "optionalBar",
      type: "number",
      desc: "bar\nThis prop is optional",
      required: false,
    },
    { name: "someObject", type: "object", desc: "", required: true },
  ])
})
