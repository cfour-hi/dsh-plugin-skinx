/**
 * Tiny module-level store shared by the dock button and the dialog, which are
 * two separate slot roots. Immutable updates plus a listener set keep the two
 * React trees in sync without leaking state across plugin runs.
 *
 * @module @cfour-hi/dsh-plugin-skinx/store
 */

import { getReact } from './react.js'

const initialState = {
  open: false,
  loading: true,
  busy: false,
  error: null,
  skins: [],
  activeId: null,
  draft: null,
  wallpaper: { url: null, opacity: 0.85, blur: 0, scope: 'full', fit: 'contain', aspect: null },
}

let state = initialState
const listeners = new Set()

export function getState() {
  return state
}

export function setState(patch) {
  state = typeof patch === 'function' ? patch(state) : { ...state, ...patch }
  for (const listener of [...listeners]) {
    try {
      listener()
    } catch (error) {
      console.error('[skinx] store listener failed:', error)
    }
  }
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Subscribe a component to the store; returns the latest snapshot. */
export function useSkinxState() {
  const React = getReact()
  const [, forceRender] = React.useState(0)
  React.useEffect(() => subscribe(() => forceRender((value) => value + 1)), [])
  return getState()
}
