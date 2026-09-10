/** Canvas helpers for cropping spritesheets and loading part images. */

import type { PartImage, Rect } from './followerSkin'

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('could not decode the image'))
    image.src = src
  })
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(`could not read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error(`could not read ${file.name}`))
    reader.readAsText(file)
  })
}

/**
 * Cuts `rect` out of a spritesheet and returns it as a standalone PNG.
 *
 * CultTweaker wants one image per part rather than a shared sheet, so this is
 * how a converted legacy skin gets its files.
 */
export function cropToPart(sheet: HTMLImageElement, rect: Rect): PartImage {
  const width = Math.max(1, Math.round(rect.width))
  const height = Math.max(1, Math.round(rect.height))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('could not get a 2D canvas context')

  context.imageSmoothingEnabled = false
  context.drawImage(sheet, rect.x, rect.y, width, height, 0, 0, width, height)

  return { dataUrl: canvas.toDataURL('image/png'), width, height }
}

/** Turns a data URL into the raw bytes JSZip needs. */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',')
  const binary = atob(dataUrl.slice(comma + 1))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

/** Rough byte size of a data URL, for storage-quota warnings. */
export function dataUrlSize(dataUrl: string): number {
  const comma = dataUrl.indexOf(',')
  return Math.round(((dataUrl.length - comma - 1) * 3) / 4)
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
