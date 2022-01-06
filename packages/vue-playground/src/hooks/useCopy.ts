import { ref } from "vue"
import { clipboardCopy } from "../copy"

export const useCopy = (getText: () => string) => {
  const copied = ref(false)
  let timeoutId: number | undefined

  const copy = async () => {
    timeoutId && clearTimeout(timeoutId)
    const text = getText()
    await clipboardCopy(text)
    copied.value = true
    timeoutId = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  return {
    copy,
    copied,
  }
}
