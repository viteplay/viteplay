import { expect, test } from "vitest"
import { parseComponent } from "../src/parse-component"

test("defineProps with typescript", () => {
  const { props } = parseComponent(
    `<script setup lang="ts">
defineProps<{
    /** required foo */
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
    { name: "requiredFoo", type: "string", desc: "required foo", required: true },
    {
      name: "optionalBar",
      type: "number",
      desc: "bar\nThis prop is optional",
      required: false,
    },
    { name: "someObject", type: "object", desc: "", required: true },
  ])
})

test("defineProps with js", () => {
  const { props } = parseComponent(
    `<script setup lang="ts">
defineProps({
  foo: String,
  /** bar prop  */
  bar: {
    type: Number,
    required: true
  }
})
</script>`,
    "test.vue",
  )

  expect(props).toEqual([
    { name: "foo", type: "string", required: false, desc: "" },
    { name: "bar", type: "number", required: true, desc: "bar prop" },
  ])
})
