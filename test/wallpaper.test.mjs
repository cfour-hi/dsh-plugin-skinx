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
      assert.ok(!css.includes('brightness('))
      assert.ok(css.includes('--skinx-tint:color-mix(in srgb,var(--dsw-alias-bg-overlay) 85%,transparent)'))
      // The opaque-overlay rules belong to the persistent stylesheet so they
      // survive a host dialog taking over the overlay slot.
      assert.ok(!css.includes('data-shortcut-modal'), 'overlay rules must not live in the wallpaper style')
    }
  }
  assert.equal(WallpaperStyle({ wallpaper: { url: null } }), null)
})

test('host overlays are re-anchored to the opaque overlay token', () => {
  // The rules are guarded by the body attribute the client toggles, so an idle
  // install leaves the shipped UI untouched.
  for (const selector of [
    '[data-shortcut-modal="settings"]',
    '[role="dialog"][aria-modal="true"]',
    '[data-changes-hover-preview]',
    '[data-review-view]',
  ]) {
    assert.ok(CSS.includes(`body[data-skinx-wallpaper] ${selector}`), `${selector} must be guarded and opaque`)
  }
  const rule = CSS.match(/body\[data-skinx-wallpaper\] \[data-shortcut-modal="settings"\][^{]*\{([^}]+)\}/)
  assert.ok(rule, 'settings overlay tokens must be re-anchored')
  for (const token of [
    '--dsw-alias-bg-base',
    '--dsw-alias-bg-layer-1',
    '--dsw-alias-bg-layer-2',
    '--dsw-specific-sidebar-fill',
    '--dsw-alias-settings-card-fill',
  ]) {
    assert.ok(rule[1].includes(`${token}: var(--dsw-alias-bg-overlay) !important`), `${token} must stay opaque`)
  }
  // An opaque background fallback covers host rules that use a literal color.
  assert.ok(/body\[data-skinx-wallpaper\] \[data-shortcut-modal="settings"\],\s*body\[data-skinx-wallpaper\] \[data-changes-hover-preview\][^{]*\{\s*background-color: var\(--dsw-alias-bg-overlay\)/.test(CSS))
})

test('primary button uses adaptive inverse text without a brightness filter', () => {
  assert.ok(CSS.includes('--sx-on-brand: var(--dsw-alias-label-primary-inverted'))
  const button = CSS.match(/\.sx-btn-primary:hover:not\(:disabled\)\s*\{([^}]+)\}/)[1]
  assert.ok(button.includes('color: var(--sx-on-brand)'))
  assert.ok(!button.includes('filter:'))
})
