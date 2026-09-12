/**
 * Reads the files a visitor hands the skin importer.
 *
 * Three things turn up in practice: a CultTweaker export (a zip laid out as
 * `FollowerSkins/<skin>/<variant>/`), the loose contents of one such variant
 * folder, or a legacy COTL JSONLoader skin — a JSON file plus the spritesheet
 * its rects point into. Which one it is can be told from the files themselves,
 * so the page needs only one import button.
 */

import JSZip from 'jszip'
import {
  convertJsonLoader,
  parseConfigJson,
  type JsonLoaderSkin,
  type SkinVariant,
  type ValidationIssue,
} from './followerSkin'
import { cropToPart, loadImage, readFileAsDataUrl, readFileAsText } from './skinImages'

export type ImportKind = 'culttweaker-zip' | 'culttweaker-folder' | 'jsonloader'

export interface SkinImport {
  kind: ImportKind
  /** Name to give the imported project. */
  skinName: string
  variants: SkinVariant[]
  issues: ValidationIssue[]
}

const CONFIG_NAME = /(^|\/)config\.json$/i
const PNG = /\.png$/i
const JSON_FILE = /\.json$/i
const ZIP = /\.zip$/i

export async function readSkinFiles(files: File[], slots: Map<string, number>): Promise<SkinImport> {
  if (!files.length) throw new Error('Pick the files to import first.')

  const zip = files.find(file => ZIP.test(file.name))
  return zip ? readZip(zip, slots) : readLoose(files, slots)
}

/** A cheap guess from file names alone, for the hint shown before importing. */
export function guessImportKind(files: File[]): ImportKind | null {
  if (files.some(file => ZIP.test(file.name))) return 'culttweaker-zip'

  const json = files.find(file => JSON_FILE.test(file.name))
  if (!json) return null
  return CONFIG_NAME.test(json.name) ? 'culttweaker-folder' : 'jsonloader'
}

export const IMPORT_KIND_LABELS: Record<ImportKind, string> = {
  'culttweaker-zip': 'CultTweaker skin (zip)',
  'culttweaker-folder': 'CultTweaker follower form',
  'jsonloader': 'Legacy JSONLoader skin',
}

async function readZip(file: File, slots: Map<string, number>): Promise<SkinImport> {
  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(file)
  }
  catch {
    throw new Error(`"${file.name}" could not be opened as a zip.`)
  }

  // Every config.json in the archive is one variant, wherever it sits. These
  // get rezipped by hand often enough that the `FollowerSkins/<skin>/` prefix
  // cannot be relied on, so the folder names are read off each hit instead.
  const configs = Object.values(zip.files)
    .filter(entry => !entry.dir && CONFIG_NAME.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (!configs.length) {
    throw new Error('There is no config.json anywhere in that zip, so it holds no follower form.')
  }

  const issues: ValidationIssue[] = []
  const variants: SkinVariant[] = []
  const used = new Set<string>()
  const skinNames = new Set<string>()

  for (const config of configs) {
    const segments = config.name.split('/').filter(Boolean)
    segments.pop()
    const variantName = segments.pop() ?? 'base'
    const skinFolder = segments.pop()
    const folder = config.name.slice(0, config.name.length - 'config.json'.length)

    let parsed: { variant: SkinVariant, issues: ValidationIssue[] }
    try {
      parsed = parseConfigJson(JSON.parse(await config.async('string')), variantName, slots)
    }
    catch (error) {
      issues.push({
        level: 'warning',
        message: `"${config.name}" was skipped: ${error instanceof Error ? error.message : String(error)}`,
      })
      continue
    }

    parsed.variant.name = uniqueName(variantName, used)
    if (skinFolder && skinFolder.toLowerCase() !== 'followerskins') skinNames.add(skinFolder)

    issues.push(...parsed.issues)
    await attachZipImages(parsed.variant, zip, folder, issues)
    variants.push(parsed.variant)
  }

  if (!variants.length) throw new Error('Nothing in that zip could be read as a follower form.')

  return {
    kind: 'culttweaker-zip',
    skinName: [...skinNames][0] ?? file.name.replace(ZIP, ''),
    variants: baseFirst(variants),
    issues,
  }
}

/**
 * Fills in each part's PNG from the folder its config.json sits in.
 *
 * The lookup is case-insensitive: a part keyed `HEAD_SKIN_BTM` is regularly
 * paired with a `head_skin_btm.png` on disk, and an exact match alone drops
 * those images silently.
 */
async function attachZipImages(
  variant: SkinVariant,
  zip: JSZip,
  folder: string,
  issues: ValidationIssue[],
) {
  const siblings = Object.values(zip.files).filter(
    entry =>
      !entry.dir
      && PNG.test(entry.name)
      && entry.name.slice(0, entry.name.lastIndexOf('/') + 1) === folder,
  )

  const missing: string[] = []

  for (const [imageName, part] of Object.entries(variant.parts)) {
    const wanted = `${imageName}.png`.toLowerCase()
    const entry = siblings.find(file => file.name.slice(folder.length).toLowerCase() === wanted)

    if (!entry) {
      if (!part.hideSlot) missing.push(imageName)
      continue
    }

    const dataUrl = `data:image/png;base64,${await entry.async('base64')}`
    try {
      const image = await loadImage(dataUrl)
      part.image = { dataUrl, width: image.width, height: image.height }
    }
    catch {
      issues.push({ level: 'warning', message: `"${entry.name}" could not be decoded as a PNG.` })
    }
  }

  if (missing.length) {
    issues.push({
      level: 'warning',
      message: `No PNG in "${folder || 'the zip root'}" for ${quote(missing)}.`,
    })
  }
}

async function readLoose(files: File[], slots: Map<string, number>): Promise<SkinImport> {
  const jsonFile = files.find(file => JSON_FILE.test(file.name))
  if (!jsonFile) {
    throw new Error(
      'That selection has no .json file. Pick a config.json with its PNGs, or a JSONLoader skin with its spritesheet.',
    )
  }

  let raw: unknown
  try {
    raw = JSON.parse(await readFileAsText(jsonFile))
  }
  catch {
    throw new Error(`"${jsonFile.name}" is not valid JSON.`)
  }

  const images = files.filter(file => PNG.test(file.name))
  const stem = jsonFile.name.replace(JSON_FILE, '')

  // `PartConfigs` is CultTweaker's and `overrides` is JSONLoader's; the two
  // formats share no key, so whichever is present settles it.
  if (isRecord(raw) && Object.keys(raw).some(key => key.toLowerCase() === 'partconfigs')) {
    const { variant, issues } = parseConfigJson(raw, 'base', slots)
    await attachLooseImages(variant, images, issues)
    return {
      kind: 'culttweaker-folder',
      // A folder's config.json is always called that, so its name says nothing.
      skinName: /^config$/i.test(stem) ? 'Imported skin' : stem,
      variants: [variant],
      issues,
    }
  }

  return readJsonLoader(raw as JsonLoaderSkin, images[0], stem, slots)
}

async function attachLooseImages(variant: SkinVariant, images: File[], issues: ValidationIssue[]) {
  const missing: string[] = []

  for (const [imageName, part] of Object.entries(variant.parts)) {
    const wanted = `${imageName}.png`.toLowerCase()
    const file = images.find(entry => entry.name.toLowerCase() === wanted)

    if (!file) {
      if (!part.hideSlot) missing.push(imageName)
      continue
    }

    const dataUrl = await readFileAsDataUrl(file)
    try {
      const image = await loadImage(dataUrl)
      part.image = { dataUrl, width: image.width, height: image.height }
    }
    catch {
      issues.push({ level: 'warning', message: `"${file.name}" could not be decoded as a PNG.` })
    }
  }

  if (missing.length) {
    issues.push({
      level: 'warning',
      message: `No PNG picked for ${quote(missing)}. They will only have color configs.`,
    })
  }
}

async function readJsonLoader(
  skin: JsonLoaderSkin,
  sheetFile: File | undefined,
  fallbackName: string,
  slots: Map<string, number>,
): Promise<SkinImport> {
  if (!Array.isArray(skin.overrides) || !skin.overrides.length) {
    throw new Error('That JSON has neither "PartConfigs" nor "overrides", so it is in neither format.')
  }
  if (!sheetFile) {
    throw new Error('A JSONLoader skin needs its spritesheet too — pick the PNG alongside the .json.')
  }

  const sheet = await loadImage(await readFileAsDataUrl(sheetFile))
  const result = convertJsonLoader(skin, slots)

  // Cut each declared rect out of the spritesheet into its own image.
  for (const converted of result.parts) {
    const { rect } = converted
    if (rect.x + rect.width > sheet.width || rect.y + rect.height > sheet.height) {
      result.issues.push({
        level: 'warning',
        message: `Part "${converted.imageName}" reaches outside the spritesheet and was cropped short.`,
      })
    }
    converted.part.image = cropToPart(sheet, rect)
    result.variant.parts[converted.imageName] = converted.part
  }

  if (!result.parts.length) throw new Error('Nothing could be converted from that file.')

  return {
    kind: 'jsonloader',
    skinName: skin.name || fallbackName,
    variants: [result.variant],
    issues: result.issues,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function quote(names: string[]): string {
  return names.map(name => `"${name}"`).join(', ')
}

function uniqueName(name: string, used: Set<string>): string {
  let candidate = name
  let index = 2
  while (used.has(candidate)) candidate = `${name}_${index++}`
  used.add(candidate)
  return candidate
}

/**
 * CultTweaker loads a form from the first variant, and the builder refuses to
 * delete it, so the one actually called `base` has to lead.
 */
function baseFirst(variants: SkinVariant[]): SkinVariant[] {
  const index = variants.findIndex(variant => variant.name.toLowerCase() === 'base')
  if (index <= 0) return variants
  return [variants[index]!, ...variants.filter((_, position) => position !== index)]
}
