// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import componentExamples from "vite-plugin-component-examples";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    componentExamples({
      pages: [
        {
          title: "Button",
          examples: "./components/button/*.example.vue"
        },
        {
          title: "Input",
          examples: "./components/input/*.example.vue"
        }
      ]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiXG5pbXBvcnQgY29tcG9uZW50RXhhbXBsZXMgZnJvbSBcInZpdGUtcGx1Z2luLWNvbXBvbmVudC1leGFtcGxlc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBjb21wb25lbnRFeGFtcGxlcyh7XG4gICAgICAvLyBQYXRoIHRvIGV4dHJhY3QgY29tcG9uZW50cyBmcm9tIHRvIGNyZWF0ZSBkZXYgcGFnZXMgZm9yXG4gICAgICAvLyBjb21wb25lbnRzOiBcIi4vY29tcG9uZW50cy8qLyoudnVlXCIsXG4gICAgICAvLyBQYXRoIHRvIGV4dHJhY3QgY29tcG9uZW50IGV4YW1wbGVzIGZyb20gdG8gcHV0IG9uIGVhY2ggZGV2IHBhZ2VcbiAgICAgIC8vIGNvbXBvbmVudEV4YW1wbGVzOiBcIi4vY29tcG9uZW50cy8qLyouZXhhbXBsZS52dWVcIixcbiAgICAgIC8vIHBhcmVudFBhdGg6IFwiL2RldlwiLFxuICAgICAgcGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBcIkJ1dHRvblwiLFxuICAgICAgICAgIGV4YW1wbGVzOiBcIi4vY29tcG9uZW50cy9idXR0b24vKi5leGFtcGxlLnZ1ZVwiLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IFwiSW5wdXRcIixcbiAgICAgICAgICBleGFtcGxlczogXCIuL2NvbXBvbmVudHMvaW5wdXQvKi5leGFtcGxlLnZ1ZVwiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQUE7QUFDQTtBQUNBO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1A7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLE1BTWhCLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUE7QUFBQSxRQUVaO0FBQUEsVUFDRSxPQUFPO0FBQUEsVUFDUCxVQUFVO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
