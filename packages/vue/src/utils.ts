type AnyFunction = (...params: any[]) => any

export function debounce(fn: AnyFunction, n = 100) {
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

/** Check if an element has a class. If not, check if its parent or any of its grandparents has the class. */
export function elHasClass(
  element: HTMLElement | Node | EventTarget | undefined | null,
  classNameRegex: RegExp,
): boolean {
  do {
    if (element && "className" in element && classNameRegex.exec(element.className)) {
      return true
    }
    element = element && "parentNode" in element ? element?.parentNode : undefined
  } while (element)
  return false
}
