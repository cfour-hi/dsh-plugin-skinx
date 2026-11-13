/**
 * Client entry: registers the dock button and the frame-wide dialog, wires the
 * locale namespace, starts the runtime that owns the token layer, keeps the
 * brand slots in sync with the active picture, and installs the drag intake.
 *
 * @module @cfour-hi/dsh-plugin-skinx/client
 */

import { en, zh } from './dicts.js'
import { setTranslator, t } from './i18n.js'
import { h, setReact } from './react.js'
import { currentBrandImageUrl, disposeRuntime, initRuntime, openDialog, selectImage } from './runtime.js'
import { getState, subscribe } from './store.js'
import { BrandMark, DockButton, OverlayRoot } from './ui/components.js'
import { CSS } from './ui/styles.js'

const NAMESPACE = 'skinx'

/** Keep the two single brand slots occupied only while a picture is set. */
function createBrandSlots(ctx) {
  let injectDisposers = []
  let lastUrl = null

  const dispose = () => {
    for (const disposer of injectDisposers.splice(0)) {
      try {
        disposer()
      } catch (error) {
        console.error('[skinx] could not dispose a brand mark:', error)
      }
    }
  }

  const sync = () => {
    const url = currentBrandImageUrl()
    if (url === lastUrl) return
    lastUrl = url
    dispose()
    if (url === null) return

    const register = (name, variant) => {
      const injectDisposer = ctx.slots.inject(name, () =>
        ctx.slots.register({ name, locale: NAMESPACE }, (props) =>
          h(BrandMark, { url, variant, size: props?.size }),
        ),
      )
      injectDisposers.push(injectDisposer)
    }

    try {
      register('sidebar.brand.mark', 'sidebar')
      register('conversation.hero.brand.mark', 'hero')
    } catch (error) {
      console.error('[skinx] could not register brand marks:', error)
      dispose()
      lastUrl = null
    }
  }

  return { sync, dispose }
}

function installImageIntake(ctx) {
  const isEditable = (target) => {
    if (target === null || target === undefined || typeof target.closest !== 'function') return false
    return (
      target.closest(
        'input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"]',
      ) !== null
    )
  }
  const pickImage = (files) => {
    if (!files) return undefined
    for (const file of files) {
      if (typeof file?.type === 'string' && file.type.startsWith('image/')) return file
    }
    return undefined
  }

  const onDragOver = (event) => {
    if (getState().open) return
    if (isEditable(event.target)) return
    const types = event.dataTransfer?.types
    if (!types || ![...types].includes('Files')) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const onDrop = (event) => {
    if (getState().open) return
    if (isEditable(event.target)) return
    const file = pickImage(event.dataTransfer?.files)
    if (file === undefined) return
    event.preventDefault()
    openDialog()
    selectImage(file)
  }

  document.addEventListener('dragover', onDragOver, true)
  document.addEventListener('drop', onDrop, true)
  return () => {
    document.removeEventListener('dragover', onDragOver, true)
    document.removeEventListener('drop', onDrop, true)
  }
}

export function createClient(React) {
  setReact(React)
  return {
    inject: ['slots', 'locale', 'theme'],
    apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement('style')
        style.setAttribute('data-skinx', '')
        style.textContent = CSS
        document.head.appendChild(style)
        return () => {
          style.remove()
        }
      }, 'skinx: styles')

      ctx.effect(() => ctx.locale.register(NAMESPACE, { en, zh }), 'skinx: locale')
      setTranslator(ctx.locale.bind(NAMESPACE))

      initRuntime(ctx)
      ctx.effect(
        () => () => {
          disposeRuntime()
        },
        'skinx: runtime',
      )

      ctx.effect(() => {
        const brandSlots = createBrandSlots(ctx)
        const unsubscribe = subscribe(brandSlots.sync)
        brandSlots.sync()
        return () => {
          unsubscribe()
          brandSlots.dispose()
        }
      }, 'skinx: brand marks')

      ctx.effect(() => installImageIntake(ctx), 'skinx: global drag intake')

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: 'skinx',
            order: 40,
            locale: NAMESPACE,
            label: () => t('dock.label'),
          },
          DockButton,
        ),
      )

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'skinx',
            order: 100,
          },
          OverlayRoot,
        ),
      )
    },
  }
}
