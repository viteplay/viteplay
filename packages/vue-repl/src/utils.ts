export function debounce(fn: Function, n = 100) {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return Boolean(value)
}

export function ensureSFC(code: string) {
  if (!code.includes("</script>") && !code.includes("</template>")) {
    code = `<template>${code}</template>`
  }
  return code
}
