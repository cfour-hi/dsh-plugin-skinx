/**
 * SkinX client runtime: image → palette → tokens, theme override, wallpaper
 * CSS state, and the Host store round-trips.
 *
 * @module @cfour-hi/dsh-plugin-skinx/runtime
 */

import * as api from './api.js'
import { t } from './i18n.js'
import {
  blobToBase64,
  decodeBitmap,
  encodeWallpaper,
  sampleImageData,
} from './image.js'
import { buildCandidates, extractPalette } from './palette.js'
import { getState, setState } from './store.js'
import { TOKEN_VERSION, buildTokenPairs, withWallpaperAlpha } from './tokens.js'

const FALLBACK_BRAND = '#3b6ef5'
const DEFAULT_WALLPAPER = { opacity: 0.85, blur: 0, scope: 'full', fit: 'contain', aspect: null }
const WALLPAPER_SCOPES = ['full', 'sidebar', 'hero']
const WALLPAPER_FITS = ['contain', 'cover']

function normalizeScope(value) {
  return WALLPAPER_SCOPES.includes(value) ? value : 'full'
}

function normalizeFit(value) {
  return WALLPAPER_FITS.includes(value) ? value : 'contain'
}

function normalizeAspect(value) {
  const aspect = Number(value)
  return Number.isFinite(aspect) && aspect > 0.05 && aspect < 20 ? aspect : null
}

let theme
let themeDisposer
let previewUrl
let saveTimer

function message(prefix, error) {
  const detail = error instanceof Error ? error.message : String(error)
  return `${prefix} ${detail}`
}

function applyTokens(pairs) {
  if (themeDisposer !== undefined) {
    try {
      themeDisposer()
    } catch (error) {
      console.error('[skinx] could not dispose the previous token layer:', error)
    }
    themeDisposer = undefined
  }
  if (!pairs || theme === undefined || typeof theme.overrideTokens !== 'function') return
  themeDisposer = theme.overrideTokens('skinx', pairs)
}

function revokePreview() {
  if (previewUrl !== undefined) {
    try {
      URL.revokeObjectURL(previewUrl)
    } catch (error) {
      console.error('[skinx] could not revoke the preview URL:', error)
    }
    previewUrl = undefined
  }
}

/**
 * Tokens for a stored skin. Skins saved by an older generator are rebuilt from
 * their brand color so label/contrast fixes reach existing skins instead of
 * silently keeping the old values.
 */
export function tokensForSkin(skin) {
  const stored = skin?.tokens
  if (stored && Object.keys(stored).length > 0) {
    if (skin?.tokenVersion === TOKEN_VERSION) return stored
    const brand =
      stored['--dsw-alias-brand-primary']?.light ?? skin?.palette?.[0] ?? FALLBACK_BRAND
    return buildTokenPairs(brand)
  }
  const brand = skin?.palette?.[0] ?? FALLBACK_BRAND
  return buildTokenPairs(brand)
}

let aspectProbeUrl

/**
 * Older skins did not record the picture's aspect ratio, so they cannot place
 * the feather mask. Probe the stored image once and persist the ratio.
 */
function probeAspect(skin) {
  const url = skin?.background?.url
  if (typeof url !== 'string' || aspectProbeUrl === url) return
  if (typeof Image !== 'function') return
  aspectProbeUrl = url
  const image = new Image()
  image.onload = () => {
    const ratio = image.naturalWidth / image.naturalHeight
    if (!(ratio > 0.05 && ratio < 20)) return
    const { activeId, skins } = getState()
    if (!skins.some((entry) => entry.id === activeId && entry.background?.url === url)) return
    const updated = skins.map((entry) =>
      entry.id === activeId
        ? { ...entry, background: { ...entry.background, aspect: ratio } }
        : entry,
    )
    setState({ skins: updated })
    const active = updated.find((entry) => entry.id === activeId)
    if (active !== undefined) {
      applySkin(active)
      schedulePersist(active)
    }
  }
  image.src = url
}

function applySkin(skin) {
  const background = skin?.background ?? {}
  const url = typeof background.url === 'string' ? background.url : null
  const wallpaper = {
    url,
    opacity: Math.min(1, Math.max(0.55, background.opacity ?? 0.85)),
    blur: Math.min(24, Math.max(0, background.blur ?? 0)),
    scope: normalizeScope(background.scope),
    fit: normalizeFit(background.fit),
    aspect: normalizeAspect(background.aspect),
  }
  const pairs = tokensForSkin(skin)
  applyTokens(url === null ? pairs : withWallpaperAlpha(pairs, wallpaper.opacity))
  setState({ activeId: skin.id, wallpaper })
  if (url !== null && wallpaper.aspect === null) probeAspect(skin)
}

export function clearSkin() {
  applyTokens(undefined)
  setState({
    activeId: null,
    wallpaper: { url: null, opacity: 0.85, blur: 0, scope: 'full', fit: 'contain', aspect: null },
  })
}

async function refresh() {
  try {
    const response = await api.fetchState()
    const state = response.state
    setState({ loading: false, skins: state.skins, activeId: state.activeId, error: null })
    const active = state.skins.find((skin) => skin.id === state.activeId)
    if (active !== undefined) applySkin(active)
    else clearSkin()
  } catch (error) {
    setState({ loading: false, error: message(t('error.state'), error) })
  }
}

export function initRuntime(ctx) {
  theme = ctx.get('theme')
  refresh()
}

export function disposeRuntime() {
  if (saveTimer !== undefined) {
    clearTimeout(saveTimer)
    saveTimer = undefined
  }
  applyTokens(undefined)
  revokePreview()
}

export function openDialog() {
  setState({ open: true })
}

export function closeDialog() {
  if (getState().draft !== null) discardDraft()
  setState({ open: false })
}

export function toggleDialog() {
  if (getState().open) closeDialog()
  else openDialog()
}

export async function selectImage(file) {
  setState({ busy: true, error: null })
  let bitmap
  try {
    bitmap = await decodeBitmap(file)
  } catch {
    setState({ busy: false, error: t('error.image') })
    return
  }
  try {
    const imageData = sampleImageData(bitmap, 64)
    const { palette, brand, average } = extractPalette(
      imageData.data,
      imageData.width,
      imageData.height,
      { maxColors: 5 },
    )
    const candidates = buildCandidates(palette, average).map((candidate) => ({
      ...candidate,
      tokens: buildTokenPairs(candidate.brand, { tone: candidate.tone }),
    }))
    const chosen = candidates[0]
    const encoded = await encodeWallpaper(bitmap)
    if (typeof bitmap.close === 'function') bitmap.close()

    revokePreview()
    previewUrl = URL.createObjectURL(encoded.blob)
    const index = getState().skins.length + 1
    const draft = {
      id: `skin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: t('dialog.defaultName', { index }),
      palette: palette.map((entry) => entry.hex),
      brand: chosen?.brand ?? brand ?? FALLBACK_BRAND,
      tokens: chosen?.tokens ?? buildTokenPairs(brand ?? FALLBACK_BRAND),
      candidates,
      candidateId: chosen?.id ?? 'default',
      brandMark: true,
      blob: encoded.blob,
      mime: encoded.mime,
      previewUrl,
      wallpaper: {
        ...DEFAULT_WALLPAPER,
        url: previewUrl,
        aspect: encoded.height > 0 ? encoded.width / encoded.height : null,
      },
    }
    setState({ draft, busy: false, error: null, wallpaper: { ...draft.wallpaper } })
    applyTokens(withWallpaperAlpha(draft.tokens, draft.wallpaper.opacity))
  } catch (error) {
    setState({ busy: false, error: message(t('error.read'), error) })
  }
}

export function updateDraft(patch) {
  const { draft } = getState()
  if (draft === null) return
  const wallpaper = { ...draft.wallpaper, ...(patch.wallpaper ?? {}) }
  let next = { ...draft, ...patch, wallpaper }
  if (patch.candidateId !== undefined) {
    const candidate = draft.candidates.find((entry) => entry.id === patch.candidateId)
    if (candidate !== undefined) {
      next = {
        ...next,
        candidateId: candidate.id,
        brand: candidate.brand,
        tokens: candidate.tokens,
      }
    }
  }
  setState({ draft: next, wallpaper: { ...wallpaper } })
  applyTokens(withWallpaperAlpha(next.tokens, wallpaper.opacity))
}

export function discardDraft() {
  const { draft, skins, activeId } = getState()
  if (draft === null) return
  revokePreview()
  setState({ draft: null })
  const active = skins.find((skin) => skin.id === activeId)
  if (active !== undefined) applySkin(active)
  else clearSkin()
}

export async function saveDraft() {
  const { draft, busy } = getState()
  if (draft === null || busy) return
  setState({ busy: true, error: null })
  try {
    const backgroundBase64 = await blobToBase64(draft.blob)
    const response = await api.saveSkin({
      id: draft.id,
      name: draft.name || t('dialog.title'),
      palette: draft.palette,
      tokens: draft.tokens,
      brandMark: draft.brandMark === true,
      tokenVersion: TOKEN_VERSION,
      createdAt: Date.now(),
      background: {
        opacity: draft.wallpaper.opacity,
        blur: draft.wallpaper.blur,
        scope: normalizeScope(draft.wallpaper.scope),
        fit: normalizeFit(draft.wallpaper.fit),
        aspect: normalizeAspect(draft.wallpaper.aspect),
      },
      backgroundBase64,
      backgroundMime: draft.mime,
    })
    const state = response.state
    const saved = state.skins.find((skin) => skin.id === draft.id)
    revokePreview()
    setState({ skins: state.skins, activeId: state.activeId, draft: null, busy: false, error: null })
    if (saved !== undefined) applySkin(saved)
  } catch (error) {
    setState({ busy: false, error: message(t('error.save'), error) })
  }
}

export async function applySavedSkin(id) {
  setState({ busy: true, error: null })
  try {
    const response = await api.setActiveSkin(id)
    const state = response.state
    const skin = state.skins.find((entry) => entry.id === id)
    setState({ skins: state.skins, activeId: state.activeId, busy: false, error: null })
    if (skin !== undefined) applySkin(skin)
  } catch (error) {
    setState({ busy: false, error: message(t('error.save'), error) })
  }
}

export async function deleteSavedSkin(id) {
  try {
    const response = await api.deleteSkin(id)
    const state = response.state
    setState({ skins: state.skins, activeId: state.activeId, error: null })
    if (getState().activeId === null) clearSkin()
    else if (getState().activeId !== null) {
      const active = state.skins.find((skin) => skin.id === state.activeId)
      if (active !== undefined) applySkin(active)
    }
  } catch (error) {
    setState({ error: message(t('error.save'), error) })
  }
}

export async function restoreDefault() {
  try {
    const response = await api.setActiveSkin(null)
    setState({ skins: response.state.skins, activeId: null, error: null })
    clearSkin()
  } catch (error) {
    setState({ error: message(t('error.save'), error) })
  }
}

function schedulePersist(skin) {
  if (saveTimer !== undefined) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = undefined
    api
      .saveSkin({
        id: skin.id,
        name: skin.name,
        palette: skin.palette,
        tokens: tokensForSkin(skin),
        brandMark: skin.brandMark === true,
        tokenVersion: TOKEN_VERSION,
        createdAt: skin.createdAt,
        activate: false,
        background: {
          opacity: skin.background?.opacity ?? 0.85,
          blur: skin.background?.blur ?? 0,
          scope: normalizeScope(skin.background?.scope),
          fit: normalizeFit(skin.background?.fit),
          aspect: normalizeAspect(skin.background?.aspect),
        },
      })
      .then((response) => {
        // Only refresh the list: the active skin is owned by apply/switch. If a
        // switch raced this write, re-assert the user's choice.
        const wanted = getState().activeId
        setState({ skins: response.state.skins })
        if (wanted !== null && response.state.activeId !== wanted) {
          api
            .setActiveSkin(wanted)
            .then((fixed) => {
              setState({ skins: fixed.state.skins, activeId: fixed.state.activeId })
            })
            .catch(() => {})
        }
      })
      .catch((error) => {
        setState({ error: message(t('error.save'), error) })
      })
  }, 400)
}

/** Patch the active skin's wallpaper controls and persist once settled. */
export function updateActiveWallpaper(patch) {
  const { activeId, skins } = getState()
  const skin = skins.find((entry) => entry.id === activeId)
  if (skin === undefined) return
  const background = { ...skin.background, ...patch }
  const next = { ...skin, background }
  const updated = skins.map((entry) => (entry.id === activeId ? next : entry))
  setState({ skins: updated })
  applySkin(next)
  schedulePersist(next)
}

/** Toggle whether the active skin paints the picture into brand marks. */
export function updateActiveBrandMark(value) {
  const { activeId, skins } = getState()
  const skin = skins.find((entry) => entry.id === activeId)
  if (skin === undefined) return
  const next = { ...skin, brandMark: value === true }
  const updated = skins.map((entry) => (entry.id === activeId ? next : entry))
  setState({ skins: updated })
  schedulePersist(next)
}

/** The image URL currently shown in brand marks, if any. */
export function currentBrandImageUrl() {
  const { draft, skins, activeId } = getState()
  if (draft !== null && draft.brandMark === true && typeof draft.previewUrl === 'string') {
    return draft.previewUrl
  }
  const skin = skins.find((entry) => entry.id === activeId)
  if (skin !== undefined && skin.brandMark === true) {
    const url = skin.background?.url
    if (typeof url === 'string') return url
  }
  return null
}

/** Rename one saved skin (active or not) and persist once settled. */
export function renameSavedSkin(id, name) {
  const { skins } = getState()
  const skin = skins.find((entry) => entry.id === id)
  if (skin === undefined) return
  const next = typeof name === 'string' ? name.trim().slice(0, 60) : ''
  if (next === '' || next === skin.name) return
  const updated = skins.map((entry) => (entry.id === id ? { ...skin, name: next } : entry))
  setState({ skins: updated })
  schedulePersist({ ...skin, name: next })
}

/** Rename the active skin and persist once settled. */
export function renameActiveSkin(name) {
  const { activeId } = getState()
  if (activeId !== null) renameSavedSkin(activeId, name)
}

export function dismissError() {
  setState({ error: null })
}
