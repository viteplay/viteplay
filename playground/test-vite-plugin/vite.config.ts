import { defineConfig } from "vite"
import editableDocs from "vite-plugin-editable-docs"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [
    // @ts-expect-error
    editableDocs({
      modules: {
        "my-ui": "./src/my-ui.ts",
      },
      pages: [
        {
          title: "Button",
          files: "./src/Button/examples/*.vue",
        },
        // {
        //   title: "Form",
        //   files: "./src/Form/examples/*.vue",
        // },
      ],
    }),
    vue(),
  ],
})
