/**
 * SkinX Client UI: a sidebar-foot dock button plus a frame-wide dialog. Both
 * read the shared store so either slot can drive the other.
 *
 * The dialog follows Ant Design's visual language: 8px spacing rhythm, one
 * 14px body size, 8px control radius, section cards with a single header, and
 * a persistent footer that owns the primary action.
 *
 * @module @cfour-hi/dsh-plugin-skinx/ui/components
 */

import { t } from '../i18n.js'
import { wallpaperSurfaceOpacity, wallpaperStrength, opacityForStrength } from '../tokens.js'
import { getReact, h } from '../react.js'
import * as runtime from '../runtime.js'
import { useSkinxState } from '../store.js'
import {
  AlertIcon,
  BrandIcon,
  CloseIcon,
  DockIcon,
  DropIcon,
  EmptyIcon,
  PencilIcon,
  RestoreIcon,
  TrashIcon,
} from './icons.js'

const SCOPE_MASKS = {
  sidebar: 'linear-gradient(to right, #000 0, #000 240px, transparent 340px)',
  hero: 'radial-gradient(ellipse 62% 46% at 50% 32%, #000 0, #000 38%, transparent 74%)',
}

/** Soften the sharp picture's edge so it blends into the blurred backdrop. */
const FEATHER_PX = 52

function maskLayerCss(layers) {
  if (layers.length === 0) return ''
  const images = layers.map((layer) => layer.image).join(',')
  const sizes = layers.map((layer) => layer.size).join(',')
  const positions = layers.map((layer) => layer.position).join(',')
  const repeats = layers.map(() => 'no-repeat').join(',')
  return (
    `-webkit-mask-image:${images};-webkit-mask-size:${sizes};` +
    `-webkit-mask-position:${positions};-webkit-mask-repeat:${repeats};` +
    `-webkit-mask-composite:source-in;` +
    `mask-image:${images};mask-size:${sizes};mask-position:${positions};` +
    `mask-repeat:${repeats};mask-composite:${layers.length > 1 ? 'intersect' : 'add'};`
  )
}

export function WallpaperStyle({ wallpaper }) {
  if (!wallpaper || typeof wallpaper.url !== 'string') return null
  const url = JSON.stringify(wallpaper.url)
  const tint = `color-mix(in srgb,var(--dsw-alias-bg-overlay) ${wallpaperSurfaceOpacity(wallpaper.opacity) * 100}%,transparent)`
  const blur = Math.max(0, Number(wallpaper.blur) || 0)
  const scope = typeof wallpaper.scope === 'string' ? wallpaper.scope : 'full'
  const fit = wallpaper.fit === 'cover' ? 'cover' : 'contain'
  const aspect =
    typeof wallpaper.aspect === 'number' && wallpaper.aspect > 0.05 && wallpaper.aspect < 20
      ? wallpaper.aspect
      : null

  const scopeMask = SCOPE_MASKS[scope]
  const backdropLayers = scopeMask === undefined ? [] : [{ image: scopeMask, size: '100% 100%', position: 'center' }]

  const foregroundLayers = [...backdropLayers]
  if (fit === 'contain' && aspect !== null) {
    // Size the feather mask to the exact contain box, so the fade sits on the
    // picture's own edges instead of the viewport edges.
    const box = `min(100vw, calc(100vh * ${aspect.toFixed(4)})) min(100vh, calc(100vw / ${aspect.toFixed(4)}))`
    const horizontal =
      `linear-gradient(to right, transparent 0, #000 ${FEATHER_PX}px, ` +
      `#000 calc(100% - ${FEATHER_PX}px), transparent 100%)`
    const vertical =
      `linear-gradient(to bottom, transparent 0, #000 ${FEATHER_PX}px, ` +
      `#000 calc(100% - ${FEATHER_PX}px), transparent 100%)`
    foregroundLayers.push({ image: horizontal, size: box, position: 'center' })
    foregroundLayers.push({ image: vertical, size: box, position: 'center' })
  }

  const css =
    `body{--skinx-wallpaper:url(${url});--skinx-blur:${blur}px;--skinx-tint:${tint}}` +
    'html,body{background-color:var(--dsw-alias-bg-overlay)}' +
    // Keep negative-z wallpaper above the body background and below content.
    // Without a local stacking context it falls behind the opaque body.
    'body{isolation:isolate}' +
    // Host overlays (settings panel, modal dialogs, code-review previews) are
    // kept opaque by the persistent stylesheet in ui/styles.js, guarded by
    // body[data-skinx-wallpaper]. Keeping that rule here would tie it to this
    // wallpaper style element, which can be unmounted when a host dialog owns
    // the overlay slot.
    // Backdrop: cover-sized and permanently blurred so the picture fills the
    // letterbox bands without cropping the sharp layer, and its tone sits close
    // to the sharp copy to hide the seam.
    'body::before{content:"";position:fixed;inset:-40px;z-index:-2;' +
    'background-image:linear-gradient(var(--skinx-tint),var(--skinx-tint)),var(--skinx-wallpaper);background-position:center;background-size:cover;' +
    'background-repeat:no-repeat;filter:blur(38px);' +
    'transform:scale(1.05);pointer-events:none;opacity:.9;' +
    maskLayerCss(backdropLayers) +
    '}' +
    // Foreground: contain keeps the whole picture visible; the blur slider
    // applies here only, and the feather mask fades its edges.
    'body::after{content:"";position:fixed;inset:0;z-index:-1;' +
    'background-image:linear-gradient(var(--skinx-tint),var(--skinx-tint)),var(--skinx-wallpaper);background-position:center;' +
    `background-size:${fit};` +
    'background-repeat:no-repeat;filter:blur(var(--skinx-blur));pointer-events:none;' +
    maskLayerCss(foregroundLayers) +
    '}'
  return h('style', { 'data-skinx-wallpaper': '' }, css)
}

export function DockButton() {
  const state = useSkinxState()
  const className =
    'sx-dock' + (state.open ? ' is-open' : '') + (state.activeId !== null ? ' is-active' : '')
  const thumbnail = runtime.currentBrandImageUrl()
  return h(
    'button',
    {
      type: 'button',
      className,
      title: t('dock.title'),
      'aria-label': t('dock.title'),
      'aria-haspopup': 'dialog',
      'aria-expanded': state.open === true,
      onClick: runtime.toggleDialog,
    },
    thumbnail !== null
      ? h('img', { className: 'sx-dock-thumb', src: thumbnail, alt: '', draggable: false })
      : h(DockIcon),
    state.activeId !== null ? h('span', { className: 'sx-dock-dot' }) : null,
  )
}

export function OverlayRoot() {
  const React = getReact()
  const state = useSkinxState()
  return h(
    React.Fragment,
    null,
    h(WallpaperStyle, { wallpaper: state.wallpaper }),
    state.open ? h(Dialog) : null,
  )
}

/**
 * The brand mark the host draws in the sidebar and above a blank Session. It
 * renders the active skin's picture cropped into the requested square.
 */
export function BrandMark({ url, variant, size }) {
  const edge = typeof size === 'number' && size > 0 ? size : variant === 'hero' ? 48 : 24
  return h('img', {
    className: 'sx-brand-mark' + (variant === 'hero' ? ' sx-brand-mark-hero' : ''),
    src: url,
    alt: '',
    draggable: false,
    style: { width: `${edge}px`, height: `${edge}px` },
  })
}

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */

function Section({ title, description, extra, bodyClass, children }) {
  return h(
    'section',
    { className: 'sx-section' },
    h(
      'div',
      { className: 'sx-section-head' },
      h(
        'div',
        { className: 'sx-section-heading' },
        h('h3', { className: 'sx-section-title' }, title),
        description === undefined ? null : h('p', { className: 'sx-section-desc' }, description),
      ),
      extra === undefined ? null : extra,
    ),
    h('div', { className: 'sx-section-body' + (bodyClass === undefined ? '' : ` ${bodyClass}`) }, children),
  )
}

function Field({ label, value, hint, children }) {
  return h(
    'label',
    { className: 'sx-field' },
    h(
      'span',
      { className: 'sx-label-row' },
      h('span', { className: 'sx-label' }, label),
      value === undefined ? null : h('span', { className: 'sx-value' }, value),
    ),
    children,
    hint === undefined ? null : h('span', { className: 'sx-hint' }, hint),
  )
}

function Switch({ checked, onChange, label }) {
  return h(
    'button',
    {
      type: 'button',
      className: 'sx-switch' + (checked === true ? ' is-on' : ''),
      role: 'switch',
      'aria-checked': checked === true,
      'aria-label': label,
      onClick: () => onChange(checked !== true),
    },
    h('span', { className: 'sx-switch-thumb' }),
  )
}

function SwitchRow({ label, description, checked, onChange, preview }) {
  return h(
    'div',
    { className: 'sx-switch-row' },
    preview === undefined ? null : preview,
    h(
      'div',
      { className: 'sx-switch-text' },
      h('span', { className: 'sx-switch-label' }, label),
      description === undefined ? null : h('span', { className: 'sx-switch-desc' }, description),
    ),
    h(Switch, { checked, onChange, label }),
  )
}

function Slider({ label, min, max, step, value, onChange, format }) {
  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100
  return h(
    'label',
    { className: 'sx-slider' },
    h(
      'span',
      { className: 'sx-slider-head' },
      h('span', { className: 'sx-label' }, label),
      h('span', { className: 'sx-slider-value' }, format === undefined ? String(value) : format(value)),
    ),
    h('input', {
      className: 'sx-range',
      style: { '--sx-range-fill': `${Math.max(0, Math.min(100, percent))}%` },
      type: 'range',
      min,
      max,
      step: step === undefined ? 1 : step,
      value,
      onChange: (event) => onChange(Number(event.target.value)),
    }),
  )
}

function Segmented({ label, options, value, onChange }) {
  return h(
    'div',
    { className: 'sx-field' },
    h('span', { className: 'sx-label' }, label),
    h(
      'div',
      { className: 'sx-segmented is-block', role: 'radiogroup', 'aria-label': label },
      options.map((option) =>
        h(
          'button',
          {
            key: option.value,
            type: 'button',
            role: 'radio',
            'aria-checked': value === option.value,
            className: 'sx-segment' + (value === option.value ? ' is-active' : ''),
            onClick: () => onChange(option.value),
          },
          option.label,
        ),
      ),
    ),
  )
}

function ScopeSelect({ value, onChange }) {
  return h(Segmented, {
    label: t('dialog.scope'),
    value,
    onChange,
    options: ['full', 'sidebar', 'hero'].map((scope) => ({ value: scope, label: t(`scope.${scope}`) })),
  })
}

function FitSelect({ value, onChange }) {
  return h(Segmented, {
    label: t('dialog.fit'),
    value,
    onChange,
    options: ['contain', 'cover'].map((fit) => ({ value: fit, label: t(`fit.${fit}`) })),
  })
}

function Swatches({ colors }) {
  return h(
    'div',
    { className: 'sx-swatches' },
    (colors ?? []).map((color, index) =>
      h('span', { key: index, className: 'sx-swatch', style: { background: color }, title: color }),
    ),
  )
}

function Alert({ message, onClose }) {
  return h(
    'div',
    { className: 'sx-alert', role: 'alert' },
    h('span', { className: 'sx-alert-icon' }, h(AlertIcon, { size: 16 })),
    h('span', { className: 'sx-alert-body' }, message),
    h(
      'button',
      {
        type: 'button',
        className: 'sx-alert-close',
        title: t('dialog.close'),
        'aria-label': t('dialog.close'),
        onClick: onClose,
      },
      h(CloseIcon, { size: 14 }),
    ),
  )
}

function EmptyState() {
  return h(
    'div',
    { className: 'sx-empty' },
    h('span', { className: 'sx-empty-icon' }, h(EmptyIcon, { size: 26 })),
    h('p', { className: 'sx-empty-title' }, t('dialog.emptyTitle')),
    h('p', { className: 'sx-empty-hint' }, t('dialog.emptyHint')),
  )
}

function SkeletonRows() {
  return h(
    'div',
    { className: 'sx-skeleton-grid', 'aria-hidden': true },
    [0, 1, 2].map((index) =>
      h(
        'div',
        { key: index, className: 'sx-skeleton-card' },
        h('span', { className: 'sx-skeleton-cover' }),
        h(
          'span',
          { className: 'sx-skeleton-lines' },
          h('span', { className: 'sx-skeleton-line' }),
          h('span', { className: 'sx-skeleton-line sx-skeleton-line-short' }),
        ),
      ),
    ),
  )
}

/* -------------------------------------------------------------------------- */
/* Data views                                                                 */
/* -------------------------------------------------------------------------- */

function skinMeta(skin) {
  const count = Array.isArray(skin.palette) ? skin.palette.length : 0
  return count > 0 ? t('dialog.colorCount', { count }) : ''
}

/** A skin without a picture still gets a cover, derived from its palette. */
function coverStyle(skin) {
  const colors = Array.isArray(skin.palette) ? skin.palette.filter((c) => typeof c === 'string') : []
  if (colors.length === 0) return {}
  if (colors.length === 1) return { background: colors[0] }
  return { background: `linear-gradient(135deg, ${colors.slice(0, 3).join(', ')})` }
}

function SkinCoverMedia({ skin }) {
  const url = typeof skin.background?.url === 'string' ? skin.background.url : null
  if (url !== null) {
    return h('img', { className: 'sx-skin-cover-img', src: url, alt: '', draggable: false })
  }
  return h(
    'span',
    { className: 'sx-skin-cover-fallback', style: coverStyle(skin), 'aria-hidden': true },
    h(BrandIcon, { size: 22 }),
  )
}

function SavedSkins({ state }) {
  const React = getReact()
  const [editingId, setEditingId] = React.useState(null)
  const [draftName, setDraftName] = React.useState('')
  const editingRef = React.useRef(null)
  const draftNameRef = React.useRef('')
  const composingRef = React.useRef(false)

  // A stable callback ref: an inline one is re-created on every keystroke, and
  // React then detaches/re-attaches it, re-selecting the whole value each time
  // (which breaks IME composition). Select-all only when the input mounts.
  const focusNameInput = React.useCallback((node) => {
    if (node === null) return
    node.focus()
    node.setSelectionRange(0, node.value.length)
  }, [])

  const startRename = (skin) => {
    editingRef.current = skin.id
    draftNameRef.current = skin.name
    composingRef.current = false
    setEditingId(skin.id)
    setDraftName(skin.name)
  }

  // Resolve through a ref so the Enter/blur pair cannot commit the same edit
  // twice once the input is unmounted.
  const finishRename = (skin, cancelled) => {
    if (editingRef.current !== skin.id) return
    editingRef.current = null
    composingRef.current = false
    const name = cancelled ? '' : draftNameRef.current.trim().slice(0, 60)
    setEditingId(null)
    setDraftName('')
    if (name !== '' && name !== skin.name) runtime.renameSavedSkin(skin.id, name)
  }

  return h(
    Section,
    {
      title: t('dialog.saved'),
      extra: h('span', { className: 'sx-count' }, String(state.skins.length)),
      bodyClass: 'sx-section-body-list',
    },
    state.loading
      ? h(SkeletonRows)
      : state.skins.length === 0
        ? h(EmptyState)
        : h(
            'ul',
            { className: 'sx-skins' },
            state.skins.map((skin) => {
              const active = skin.id === state.activeId
              const editing = editingId === skin.id
              return h(
                'li',
                { key: skin.id, className: 'sx-skin-card' + (active ? ' is-active' : '') },
                h(
                  'div',
                  { className: 'sx-skin-cover' },
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sx-skin-apply',
                      disabled: active || state.busy,
                      title: active ? t('dialog.active') : t('dialog.applySkin'),
                      'aria-label': t('dialog.applySkin', { name: skin.name }),
                      onClick: () => {
                        if (!active && !state.busy) runtime.applySavedSkin(skin.id)
                      },
                    },
                    h(SkinCoverMedia, { skin }),
                    active
                      ? null
                      : h('span', { className: 'sx-skin-apply-hint', 'aria-hidden': true }, t('dialog.apply')),
                  ),
                  active ? h('span', { className: 'sx-skin-cover-badge' }, t('dialog.active')) : null,
                  h(
                    'button',
                    {
                      type: 'button',
                      className: 'sx-skin-delete',
                      title: t('dialog.delete'),
                      'aria-label': t('dialog.deleteSkin', { name: skin.name }),
                      onClick: () => {
                        if (window.confirm(t('dialog.deleteConfirm', { name: skin.name }))) {
                          runtime.deleteSavedSkin(skin.id)
                        }
                      },
                    },
                    h(TrashIcon, { size: 14 }),
                  ),
                ),
                h(
                  'div',
                  { className: 'sx-skin-info' },
                  editing
                    ? h('input', {
                        className: 'sx-input sx-skin-name-input',
                        type: 'text',
                        maxLength: 60,
                        value: draftName,
                        spellCheck: false,
                        'aria-label': t('dialog.name'),
                        'data-skinx-editing': 'true',
                        ref: focusNameInput,
                        onChange: (event) => {
                          draftNameRef.current = event.target.value
                          setDraftName(event.target.value)
                        },
                        onCompositionStart: () => {
                          composingRef.current = true
                        },
                        onCompositionEnd: () => {
                          composingRef.current = false
                        },
                        onKeyDown: (event) => {
                          // Never commit/cancel from the keys IMEs use to pick
                          // candidates or confirm the composition.
                          if (event.nativeEvent?.isComposing === true || composingRef.current) return
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            finishRename(skin, false)
                          } else if (event.key === 'Escape') {
                            event.preventDefault()
                            event.stopPropagation()
                            finishRename(skin, true)
                          }
                        },
                        onBlur: () => finishRename(skin, false),
                      })
                    : h(
                        'button',
                        {
                          type: 'button',
                          className: 'sx-skin-name',
                          title: t('dialog.renameSkin', { name: skin.name }),
                          'aria-label': t('dialog.renameSkin', { name: skin.name }),
                          onClick: () => startRename(skin),
                        },
                        h('span', { className: 'sx-skin-name-text' }, skin.name),
                        h(
                          'span',
                          { className: 'sx-skin-name-pencil', 'aria-hidden': true },
                          h(PencilIcon, { size: 12 }),
                        ),
                      ),
                  h('span', { className: 'sx-skin-meta' }, skinMeta(skin)),
                ),
              )
            }),
          ),
  )
}

function ActiveSkinControls({ state }) {
  const skin = state.skins.find((entry) => entry.id === state.activeId)
  if (skin === undefined || typeof skin.background?.url !== 'string') return null
  const background = skin.background
  const brandMark = skin.brandMark === true
  return h(
    Section,
    {
      title: t('dialog.activeSkin'),
      description: t('dialog.activeHint'),
      extra: h('span', { className: 'sx-badge' }, t('dialog.active')),
    },
    [
      h(
        'div',
        { key: 'wallpaper-fields', className: 'sx-wallpaper-fields' },
        [
          h(Slider, {
            key: 'strength',
            label: t('dialog.strength'),
            min: 0,
            max: 100,
            value: wallpaperStrength(background.opacity),
            onChange: (value) => runtime.updateActiveWallpaper({ opacity: opacityForStrength(value) }),
            format: (value) => `${value}%`,
          }),
          h(Slider, {
            key: 'blur',
            label: t('dialog.blur'),
            min: 0,
            max: 24,
            value: background.blur ?? 0,
            onChange: (value) => runtime.updateActiveWallpaper({ blur: value }),
            format: (value) => `${value}px`,
          }),
          h(ScopeSelect, {
            key: 'scope',
            value: background.scope ?? 'full',
            onChange: (scope) => runtime.updateActiveWallpaper({ scope }),
          }),
          h(FitSelect, {
            key: 'fit',
            value: background.fit ?? 'contain',
            onChange: (fit) => runtime.updateActiveWallpaper({ fit }),
          }),
        ],
      ),
      h('div', { key: 'divider', className: 'sx-divider' }),
      h(SwitchRow, {
        key: 'brand',
        label: t('dialog.brandMark'),
        description: t('dialog.brandMarkDesc'),
        checked: brandMark,
        preview: brandMark
          ? h(
              'span',
              { className: 'sx-switch-preview' },
              h('img', {
                className: 'sx-brand-preview sx-brand-preview-sm',
                src: background.url,
                alt: '',
                draggable: false,
              }),
            )
          : undefined,
        onChange: (value) => runtime.updateActiveBrandMark(value),
      }),
    ].filter((child) => child !== null),
  )
}

function IdlePanel({ state, dragging, setDragging, choose, onFiles, fileInput }) {
  return h('div', null, [
    h(
      'button',
      {
        key: 'drop',
        type: 'button',
        className: 'sx-drop' + (dragging ? ' is-dragging' : ''),
        'aria-busy': state.busy === true,
        onClick: choose,
        onDragEnter: (event) => {
          event.preventDefault()
          setDragging(true)
        },
        onDragOver: (event) => {
          event.preventDefault()
          setDragging(true)
        },
        onDragLeave: (event) => {
          event.preventDefault()
          setDragging(false)
        },
        onDrop: (event) => {
          event.preventDefault()
          event.stopPropagation()
          setDragging(false)
          onFiles(event.dataTransfer?.files)
        },
      },
      h(
        'span',
        { className: 'sx-drop-icon-wrap' },
        state.busy ? h('span', { className: 'sx-spinner sx-spinner-lg' }) : h(DropIcon, { size: 26 }),
      ),
      h('span', { className: 'sx-drop-title' }, state.busy ? t('dialog.loading') : t('dialog.dropTitle')),
      h('span', { className: 'sx-drop-hint' }, t('dialog.dropHint')),
    ),
    h('input', {
      key: 'file',
      ref: fileInput,
      className: 'sx-file',
      type: 'file',
      accept: 'image/*',
      onChange: (event) => {
        onFiles(event.target.files)
        event.target.value = ''
      },
    }),
    h(SavedSkins, { key: 'skins', state }),
    h(ActiveSkinControls, { key: 'active', state }),
  ])
}

function PreviewPanel({ draft }) {
  const wallpaper = draft.wallpaper
  return h('div', { className: 'sx-preview' }, [
    h(
      'div',
      { key: 'media', className: 'sx-preview-media-col' },
      [
        h(
          'div',
          { key: 'media', className: 'sx-preview-media' },
          h('img', { className: 'sx-preview-img', src: draft.previewUrl, alt: '' }),
          h('span', { className: 'sx-media-badge' }, t('dialog.preview')),
        ),
        h(
          'div',
          { key: 'palette', className: 'sx-media-palette' },
          h('span', { className: 'sx-label' }, t('dialog.palette')),
          h(Swatches, { colors: draft.palette }),
        ),
        h('p', { key: 'note', className: 'sx-muted' }, t('dialog.localHint')),
      ],
    ),
    h(
      'div',
      { key: 'side', className: 'sx-preview-side' },
      [
        h(
          Section,
          { key: 'appearance', title: t('dialog.appearance') },
          [
            h(
              Field,
              { key: 'name', label: t('dialog.name') },
              h('input', {
                className: 'sx-input',
                type: 'text',
                maxLength: 60,
                value: draft.name,
                onChange: (event) => runtime.updateDraft({ name: event.target.value }),
              }),
            ),
          ],
        ),
        h(
          Section,
          { key: 'wallpaper', title: t('dialog.wallpaperShort') },
          [
            h(Slider, {
              key: 'strength',
              label: t('dialog.strength'),
              min: 0,
              max: 100,
              value: wallpaperStrength(wallpaper.opacity),
              onChange: (value) => runtime.updateDraft({ wallpaper: { opacity: opacityForStrength(value) } }),
              format: (value) => `${value}%`,
            }),
            h(Slider, {
              key: 'blur',
              label: t('dialog.blur'),
              min: 0,
              max: 24,
              value: wallpaper.blur,
              onChange: (value) => runtime.updateDraft({ wallpaper: { blur: value } }),
              format: (value) => `${value}px`,
            }),
            h(ScopeSelect, {
              key: 'scope',
              value: wallpaper.scope ?? 'full',
              onChange: (scope) => runtime.updateDraft({ wallpaper: { scope } }),
            }),
            h(FitSelect, {
              key: 'fit',
              value: wallpaper.fit ?? 'contain',
              onChange: (fit) => runtime.updateDraft({ wallpaper: { fit } }),
            }),
          ],
        ),
        h(
          Section,
          {
            key: 'brand',
            title: t('dialog.brandMarkShort'),
            extra: h(Switch, {
              checked: draft.brandMark === true,
              label: t('dialog.brandMark'),
              onChange: (value) => runtime.updateDraft({ brandMark: value }),
            }),
          },
          h(
            'div',
            { className: 'sx-brand-row' },
            draft.brandMark === true
              ? h('img', {
                  className: 'sx-brand-preview',
                  src: draft.previewUrl,
                  alt: '',
                  draggable: false,
                })
              : h('span', { className: 'sx-brand-placeholder' }, h(BrandIcon, { size: 22 })),
            h('p', { className: 'sx-section-note' }, t('dialog.brandMarkDesc')),
          ),
        ),
      ],
    ),
  ])
}

/* -------------------------------------------------------------------------- */
/* Dialog                                                                     */
/* -------------------------------------------------------------------------- */

function Dialog() {
  const React = getReact()
  const state = useSkinxState()
  const [dragging, setDragging] = React.useState(false)
  const fileInput = React.useRef(null)
  const isDraft = state.draft !== null

  React.useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return
      // An inline rename owns Escape while its input has focus.
      const target = event.target
      if (typeof target?.closest === 'function' && target.closest('[data-skinx-editing]') !== null) return
      event.stopPropagation()
      runtime.closeDialog()
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [])

  React.useEffect(() => {
    const onPaste = (event) => {
      const files = event.clipboardData?.files
      if (!files || files.length === 0) return
      const file = [...files].find((entry) => entry.type.startsWith('image/'))
      if (file === undefined) return
      event.preventDefault()
      runtime.selectImage(file)
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [])

  React.useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const choose = () => {
    if (fileInput.current !== null) fileInput.current.click()
  }
  const onFiles = (files) => {
    const list = [...(files ?? [])]
    if (list.length > 0) runtime.selectImage(list[0])
  }

  const hasActive = state.activeId !== null
  const closeButton = h(
    'button',
    { key: 'close', type: 'button', className: 'sx-btn', onClick: runtime.closeDialog },
    t('dialog.close'),
  )
  const footerActions = isDraft
    ? [
        h(
          'button',
          { key: 'discard', type: 'button', className: 'sx-btn', disabled: state.busy, onClick: runtime.discardDraft },
          t('dialog.cancelPreview'),
        ),
        h(
          'button',
          {
            key: 'save',
            type: 'button',
            className: 'sx-btn sx-btn-primary',
            disabled: state.busy,
            onClick: runtime.saveDraft,
          },
          state.busy ? h('span', { className: 'sx-spinner', 'aria-hidden': true }) : null,
          state.busy ? t('dialog.saving') : t('dialog.save'),
        ),
      ]
    : [closeButton]

  return h(
    'div',
    {
      className: 'sx-overlay',
      onMouseDown: (event) => {
        if (event.target === event.currentTarget) runtime.closeDialog()
      },
    },
    h(
      'div',
      {
        className: 'sx-dialog',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'sx-dialog-title',
        'aria-describedby': 'sx-dialog-desc',
      },
      h(
        'header',
        { className: 'sx-header' },
        h(
          'div',
          { className: 'sx-header-brand' },
          h('span', { className: 'sx-header-icon' }, h(DockIcon, { size: 19 })),
          h(
            'div',
            { className: 'sx-header-main' },
            h('h2', { id: 'sx-dialog-title', className: 'sx-title' }, t('dialog.title')),
            h(
              'p',
              { id: 'sx-dialog-desc', className: 'sx-subtitle' },
              isDraft ? t('dialog.previewSubtitle') : t('dialog.subtitle'),
            ),
          ),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'sx-close',
            autoFocus: true,
            title: t('dialog.close'),
            'aria-label': t('dialog.close'),
            onClick: runtime.closeDialog,
          },
          h(CloseIcon, { size: 17 }),
        ),
      ),
      h(
        'div',
        { className: 'sx-body' },
        state.error !== null ? h(Alert, { message: state.error, onClose: runtime.dismissError }) : null,
        isDraft
          ? h(PreviewPanel, { draft: state.draft })
          : h(IdlePanel, {
              state,
              dragging,
              setDragging,
              choose,
              onFiles,
              fileInput,
            }),
      ),
      h(
        'footer',
        { className: 'sx-footer' },
        h(
          'div',
          { className: 'sx-footer-left' },
          h(
            'button',
            {
              type: 'button',
              className: 'sx-btn sx-btn-text',
              disabled: isDraft || !hasActive,
              onClick: runtime.restoreDefault,
            },
            h(RestoreIcon, { size: 14 }),
            t('dialog.restore'),
          ),
        ),
        h('div', { className: 'sx-footer-right' }, footerActions),
      ),
    ),
  )
}
