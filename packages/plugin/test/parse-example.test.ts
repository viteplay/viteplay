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
      "docs": "
    This is some **markdown**
    ",
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
        "darkExample": true,
        "docs": "
              This is some **markdown**
              ",
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
        "component": "",
        "darkExample": true,
        "docs": "",
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
        "component": "",
        "darkExample": true,
        "docs": "",
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
        "component": "",
        "darkExample": true,
        "docs": "",
        "imports": [],
      }
    `)
  })
})
