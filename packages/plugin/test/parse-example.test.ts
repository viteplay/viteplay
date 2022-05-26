import { expect, test, describe } from "vitest"
import { parseExample } from "../src/parse-example"

test("docs block", async () => {
  const parsed = await parseExample(
    `
<docs>
This is some **markdown**
</docs>    
    `,
    "foo.vue",
  )
  expect(parsed).toMatchInlineSnapshot(`
    {
      "component": "",
      "docs": {
        "attrs": {},
        "content": "
    This is some **markdown**
    ",
      },
      "imports": [],
    }
  `)
})

describe("darkExample", () => {
  test("with docs content", async () => {
    const parsed = await parseExample(
      `
        <docs darkExample>
        This is some **markdown**
        </docs>    
            `,
      "foo.vue",
    )
    expect(parsed).toMatchInlineSnapshot(`
      {
        "component": "",
        "docs": {
          "attrs": {
            "darkExample": true,
          },
          "content": "
              This is some **markdown**
              ",
        },
        "imports": [],
      }
    `)
  })

  test("with empty content", async () => {
    const parsed1 = await parseExample(
      `
          <docs darkExample></docs>    
              `,
      "foo.vue",
    )
    expect(parsed1).toMatchInlineSnapshot(`
      {
        "component": "<docs darkExample></docs>",
        "docs": {
          "attrs": {},
          "content": "",
        },
        "imports": [],
      }
    `)

    const parsed2 = await parseExample(
      `
          <docs darkExample />
              `,
      "foo.vue",
    )
    expect(parsed2).toMatchInlineSnapshot(`
      {
        "component": "<docs darkExample />",
        "docs": {
          "attrs": {},
          "content": "",
        },
        "imports": [],
      }
    `)

    const parsed3 = await parseExample(
      `
          <docs dark-example />
              `,
      "foo.vue",
    )
    expect(parsed3).toMatchInlineSnapshot(`
      {
        "component": "<docs dark-example />",
        "docs": {
          "attrs": {},
          "content": "",
        },
        "imports": [],
      }
    `)
  })
})

describe("parse import statements", () => {
  test("normal script", async () => {
    const parsed = await parseExample(
      `<script>
    import foo from './foo'
    import {bar} from './bar'
    export default {}
    </script>`,
      "foo.vue",
    )

    expect(parsed).toMatchInlineSnapshot(`
      {
        "component": "<script>
          import foo from './foo'
          import {bar} from './bar'
          export default {}
          </script>",
        "docs": {
          "attrs": {},
          "content": "",
        },
        "imports": [
          {
            "importDefault": true,
            "source": "./foo",
          },
          {
            "importDefault": false,
            "source": "./bar",
          },
        ],
      }
    `)
  })

  test("script setup", async () => {
    const parsed = await parseExample(
      `<script setup>
    import foo from './foo'
    import {bar} from './bar'
    </script>`,
      "foo.vue",
    )

    expect(parsed).toMatchInlineSnapshot(`
      {
        "component": "<script setup>
          import foo from './foo'
          import {bar} from './bar'
          </script>",
        "docs": {
          "attrs": {},
          "content": "",
        },
        "imports": [
          {
            "importDefault": true,
            "source": "./foo",
          },
          {
            "importDefault": false,
            "source": "./bar",
          },
        ],
      }
    `)
  })
})
