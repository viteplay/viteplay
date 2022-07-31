// import { defineComponent, h, onMounted } from "vue"
import VitePlayWrapper from "./VitePlayWrapper.vue"

// const Wrapper = defineComponent((props, { slots }) => {
//   onMounted(() => {
//     document.body.style.margin = "0"
//   })
//   return () => h("div", { class: "iframe-wrapper" }, [slots.default?.()])
// })

export default {
  Wrapper: VitePlayWrapper,
}
