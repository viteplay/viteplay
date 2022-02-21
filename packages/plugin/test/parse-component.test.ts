import { expect, test } from "vitest"
import { parseComponent } from "../src/parse-component"

test("defineProps with typescript", async () => {
  const { props } = await parseComponent(
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

  expect(props).toMatchInlineSnapshot(`
    [
      {
        "desc": "required foo",
        "name": "requiredFoo",
        "required": true,
        "type": "string",
      },
      {
        "desc": "bar
    This prop is optional",
        "name": "optionalBar",
        "required": false,
        "type": "number",
      },
      {
        "desc": "",
        "name": "someObject",
        "required": true,
        "type": "{
      foo: string;
    }",
      },
    ]
  `)
})

test("defineProps with js", async () => {
  const { props } = await parseComponent(
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

test("defineComponent props", async () => {
  const { props } = await parseComponent(
    `<script lang="ts">
defineComponent({
  props: {
    foo: String,
    /** bar prop  */
    bar: {
      type: Number,
      required: true
    },
    baz: {
      type: Object as Record<string, number>
    }
  }
})
</script>`,
    "test.vue",
  )

  expect(props).toEqual([
    { name: "foo", type: "string", required: false, desc: "" },
    { name: "bar", type: "number", required: true, desc: "bar prop" },
    {
      desc: "",
      name: "baz",
      required: false,
      type: "Record<string, number>",
    },
  ])
})
