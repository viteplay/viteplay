// import { defineComponent, h, onMounted } from "vue"
import ViteplayPreviewWrapper from "./ViteplayPreviewWrapper.vue"

// const Wrapper = defineComponent((props, { slots }) => {
//   onMounted(() => {
//     document.body.style.margin = "0"
//   })
//   return () => h("div", { class: "iframe-wrapper" }, [slots.default?.()])
// })

export default {
  Wrapper: ViteplayPreviewWrapper,
}
