/**
 * The module loader seeds React through the factory's `require('react')`.
 * Keep the runtime here so every UI module can build elements without JSX.
 *
 * @module @cfour-hi/dsh-plugin-skinx/react
 */

let runtime

export function setReact(react) {
  runtime = react
}

export function getReact() {
  if (runtime === undefined) throw new Error('[skinx] React was not seeded by the module loader')
  return runtime
}

/** Create a React element from the seeded runtime. */
export function h(type, props, ...children) {
  return getReact().createElement(type, props, ...children)
}
