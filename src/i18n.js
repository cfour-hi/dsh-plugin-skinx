/** Module-level translator bound by the client entry during `apply`. */

let translate

export function setTranslator(next) {
  translate = next
}

export function t(key, params) {
  if (typeof translate !== 'function') return key
  return translate(key, params)
}
