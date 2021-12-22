export const escapeSFC = (code: string) => {
  return (
    code
      // <script setup> -> LT@script setup@GT
      .replace(/<(script|template|style)([^\>]*)>/g, "LT@$1$2@GT")
      // </script> -> LT/@script@GT
      .replace(/<\/(script|template|style)>/g, "LT/@$1@GT")
  )
}

export const restoreSFC = (code: string) => {
  return (
    code
      // LT@script setup@GT -> <script setup>
      .replace(/LT@(script|template|style)([^\@]*)@GT/g, "<$1$2>")
      // LT/@script@GT -> </script>
      .replace(/LT\/@(script|template|style)@GT/g, "</$1>")
  )
}
