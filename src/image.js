/**
 * Browser image helpers: decode the picked file, sample a small pixel grid for
 * palette extraction, and re-encode a bounded wallpaper.
 *
 * @module @cfour-hi/dsh-plugin-skinx/image
 */

const MAX_WALLPAPER_BYTES = 1_200_000
const MAX_WALLPAPER_EDGE = 1600

export async function decodeBitmap(file) {
  if (file === undefined || file === null || typeof file.type !== 'string') {
    throw new Error('not-an-image')
  }
  if (!file.type.startsWith('image/')) throw new Error('not-an-image')
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    bitmap = undefined
  }
  if (bitmap === undefined) throw new Error('decode-failed')
  return bitmap
}

/** Draw the bitmap onto a small canvas and return ImageData for sampling. */
export function sampleImageData(bitmap, budget = 64) {
  const scale = Math.min(1, budget / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (context === null) throw new Error('canvas-unavailable')
  context.drawImage(bitmap, 0, 0, width, height)
  return context.getImageData(0, 0, width, height)
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

/**
 * Re-encode the picture into a bounded wallpaper blob (webp preferred, jpeg
 * fallback), shrinking until it fits the byte ceiling.
 *
 * @returns {Promise<{ blob: Blob, mime: string, width: number, height: number }>}
 */
export async function encodeWallpaper(bitmap) {
  let scale = Math.min(1, MAX_WALLPAPER_EDGE / Math.max(bitmap.width, bitmap.height))
  let last
  for (let attempt = 0; attempt < 7; attempt += 1) {
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (context === null) throw new Error('canvas-unavailable')
    context.drawImage(bitmap, 0, 0, width, height)

    let blob = await toBlob(canvas, 'image/webp', 0.82)
    let mime = 'image/webp'
    if (blob === null) {
      blob = await toBlob(canvas, 'image/jpeg', 0.85)
      mime = 'image/jpeg'
    }
    if (blob === null) throw new Error('encode-failed')
    last = { blob, mime, width, height }
    if (blob.size <= MAX_WALLPAPER_BYTES || attempt === 6) return last
    scale *= 0.75
  }
  return last
}

/** Base64 (no data-url prefix) for a blob. */
export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result ?? '')
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = () => reject(reader.error ?? new Error('read-failed'))
    reader.readAsDataURL(blob)
  })
}
