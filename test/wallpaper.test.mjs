import assert from 'node:assert/strict'
import { test } from 'node:test'
import { setReact } from '../src/react.js'
import { WallpaperStyle } from '../src/ui/components.js'
import { CSS } from '../src/ui/styles.js'

setReact({ createElement: (type, props, ...children) => ({ type, props, children }) })

test('both wallpaper layers protect transparent content in every scope and fit', () => {
  for (const scope of ['full', 'sidebar', 'hero']) {
    for (const fit of ['contain', 'cover']) {
      const element = WallpaperStyle({ wallpaper: { url: 'blob:test', scope, fit, aspect: 1.5 } })
      const css = element.children.join('')
      assert.equal((css.match(/background-image:linear-gradient\(var\(--skinx-tint\)/g) ?? []).length, 2)
      assert.ok(css.includes('html,body{background-color:var(--dsw-alias-bg-overlay)}'))
      assert.ok(css.includes('body{isolation:isolate}'))
      assert.ok(css.startsWith('body{--skinx-wallpaper:'), 'resolve tint in the body theme scope')
      assert.ok(css.includes('[data-changes-hover-preview],[data-review-view]{'))
      assert.ok(!css.includes('brightness('))
      assert.ok(css.includes('--skinx-tint:color-mix(in srgb,var(--dsw-alias-bg-overlay) 85%,transparent)'))
    }
  }
  assert.equal(WallpaperStyle({ wallpaper: { url: null } }), null)
})

test('primary button uses adaptive inverse text without a brightness filter', () => {
  assert.ok(CSS.includes('--sx-on-brand: var(--dsw-alias-label-primary-inverted'))
  const button = CSS.match(/\.sx-btn-primary:hover:not\(:disabled\)\s*\{([^}]+)\}/)[1]
  assert.ok(button.includes('color: var(--sx-on-brand)'))
  assert.ok(!button.includes('filter:'))
})
