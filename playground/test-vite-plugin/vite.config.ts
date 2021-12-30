import { defineConfig } from "vite"
import editableDocs from "vite-plugin-editable-docs"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [
    editableDocs({
      modules: {
        "my-ui": "./src/my-ui.ts",
      },
      pages: [
        {
          title: "Button",
          examples: "./src/Button/examples/*.vue",
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
