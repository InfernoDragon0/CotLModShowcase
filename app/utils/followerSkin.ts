/**
 * Types and conversion logic for Cult of the Lamb follower skins.
 *
 * Two formats are involved:
 *
 * - The legacy COTL JSONLoader format: one spritesheet plus a JSON file whose
 *   `overrides` carry a `rect` into that sheet.
 * - The CultTweaker follower form format: a folder per variant holding one PNG
 *   per part and a `config.json` describing each part's slot and transform.
 *
 * This module is pure so it can be unit tested without a browser.
 */

// ---------------------------------------------------------------------------
// CultTweaker format
// ---------------------------------------------------------------------------

export interface PartImage {
  /** Data URL of the cropped part. */
  dataUrl: string
  width: number
  height: number
}

export interface PartConfig {
  slotIndex: number
  partName: string
  scaleX: number
  scaleY: number
  rotation: number
  offsetX: number
  offsetY: number
  hideSlot: boolean
  colorChoices: string[]
  image?: PartImage
}

export interface SkinVariant {
  /** Folder name, e.g. 'base' or 'variant1'. */
  name: string
  /** Vanilla follower form this variant is layered over. */
  overrideBaseSkin: string
  /** Keyed by the image file name without its extension. */
  parts: Record<string, PartConfig>
}

export interface SkinProject {
  id: string
  name: string
  variants: SkinVariant[]
  updatedAt: number
}

/** Defaults taken from FollowerSkinPartConfig in the mod source. */
export const PART_DEFAULTS = {
  scaleX: 1,
  scaleY: 1,
  rotation: -90,
  offsetX: 0,
  offsetY: 0,
  hideSlot: false,
} as const

export function createPart(partName: string, slotIndex: number, patch: Partial<PartConfig> = {}): PartConfig {
  return {
    partName,
    slotIndex,
    ...PART_DEFAULTS,
    colorChoices: ['#FFFFFF'],
    ...patch,
  }
}

/**
 * Builds the `config.json` payload for one variant.
 *
 * CultTweaker deserialises with Newtonsoft using PascalCase property names;
 * the template skins in the mod repository use exactly these keys.
 */
export function buildConfigJson(variant: SkinVariant): Record<string, unknown> {
  const partConfigs: Record<string, unknown> = {}

  for (const [imageName, part] of Object.entries(variant.parts)) {
    partConfigs[imageName] = {
      SlotIndex: part.slotIndex,
      PartName: part.partName,
      ScaleX: part.scaleX,
      ScaleY: part.scaleY,
      Rotation: part.rotation,
      OffsetX: part.offsetX,
      OffsetY: part.offsetY,
      HideSlot: part.hideSlot,
      ColorChoices: [...part.colorChoices],
    }
  }

  return {
    OverrideBaseSkin: variant.overrideBaseSkin,
    PartConfigs: partConfigs,
  }
}

export interface ValidationIssue {
  level: 'error' | 'warning'
  message: string
}

/**
 * Checks the rules the game enforces at load time.
 *
 * The strict one: every part must declare the same number of colour choices,
 * or the form is rejected outright and never appears in game.
 */
export function validateVariant(variant: SkinVariant): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const parts = Object.entries(variant.parts)

  if (parts.length === 0) {
    issues.push({ level: 'error', message: `Variant "${variant.name}" has no parts.` })
    return issues
  }

  const colourCounts = new Set(
    parts
      .filter(([, part]) => !part.hideSlot)
      .map(([, part]) => part.colorChoices.length),
  )

  if (colourCounts.size > 1) {
    issues.push({
      level: 'error',
      message:
        `Variant "${variant.name}" mixes colour-choice counts (${[...colourCounts].sort().join(', ')}). `
        + 'Every part must declare the same number, or the game will skip this form.',
    })
  }

  for (const [imageName, part] of parts) {
    if (!part.partName) {
      issues.push({ level: 'error', message: `Part "${imageName}" has no slot assigned.` })
    }
    if (!part.hideSlot && !part.image) {
      issues.push({
        level: 'warning',
        message: `Part "${imageName}" has no image, so it will only apply its colours.`,
      })
    }
    for (const hex of part.colorChoices) {
      if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) {
        issues.push({ level: 'error', message: `Part "${imageName}" has an invalid colour "${hex}".` })
      }
    }
  }

  return issues
}

// ---------------------------------------------------------------------------
// Legacy COTL JSONLoader format
// ---------------------------------------------------------------------------

export interface JsonLoaderOverride {
  name: string
  /** "x, y, width, height" into the spritesheet. */
  rect: string
  /** "scaleX, scaleY". */
  scale?: string
  /** "offsetX, offsetY". */
  offset?: string
}

export interface JsonLoaderColor {
  name: string
  hex: string
}

export interface JsonLoaderSkin {
  name?: string
  imagePath?: string
  overrides?: JsonLoaderOverride[]
  /** An array of colour sets, each a list of per-slot colours. */
  colors?: JsonLoaderColor[][]
}

export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Parses `"0, 0, 128, 128"`. Returns null when the string is malformed. */
export function parseRect(value: string | undefined): Rect | null {
  if (!value) return null
  const parts = value.split(',').map(part => Number(part.trim()))
  if (parts.length !== 4 || parts.some(part => !Number.isFinite(part))) return null
  return { x: parts[0]!, y: parts[1]!, width: parts[2]!, height: parts[3]! }
}

/** Parses `"1.5, 1.5"`, falling back to the given defaults. */
export function parsePair(value: string | undefined, fallback: [number, number]): [number, number] {
  if (!value) return fallback
  const parts = value.split(',').map(part => Number(part.trim()))
  if (parts.length !== 2 || parts.some(part => !Number.isFinite(part))) return fallback
  return [parts[0]!, parts[1]!]
}

/** Expands `#FFF` to `#FFFFFF`; the Spine runtime only parses the long form. */
export function normalizeHex(hex: string): string {
  const value = hex.trim()
  const short = /^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.exec(value)
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toUpperCase()
  return value.toUpperCase()
}

export interface ConvertedPart {
  /** Image file name without extension, used as the PartConfigs key. */
  imageName: string
  part: PartConfig
  /** Crop rectangle into the source spritesheet. */
  rect: Rect
}

export interface ConversionResult {
  variant: SkinVariant
  parts: ConvertedPart[]
  issues: ValidationIssue[]
  /** Override names with no matching slot in followerSlots.json. */
  unmatched: string[]
}

/**
 * Converts a legacy JSONLoader skin into a CultTweaker variant.
 *
 * `slots` maps a part name to its slot index and comes from the
 * `followerSlots.json` dump produced by the mod.
 *
 * Cropping the images is left to the caller because it needs a canvas; each
 * returned part carries the `rect` to crop.
 */
export function convertJsonLoader(
  skin: JsonLoaderSkin,
  slots: Map<string, number>,
  options: { variantName?: string, overrideBaseSkin?: string } = {},
): ConversionResult {
  const issues: ValidationIssue[] = []
  const unmatched: string[] = []
  const parts: ConvertedPart[] = []
  const usedNames = new Set<string>()

  const overrides = skin.overrides ?? []
  if (overrides.length === 0) {
    issues.push({ level: 'error', message: 'This file has no overrides to convert.' })
  }

  // The legacy format nests colour sets one level deep. Flatten them into a
  // per-part list so each part ends up with one entry per colour set.
  const colourSets = (skin.colors ?? []).filter(set => Array.isArray(set))
  const coloursForPart = (partName: string): string[] => {
    const found = colourSets
      .map(set => set.find(entry => entry?.name === partName)?.hex)
      .map(hex => (hex ? normalizeHex(hex) : null))

    // A part missing from a set still needs an entry, or the counts diverge.
    if (found.every(hex => hex === null)) return ['#FFFFFF']
    return found.map(hex => hex ?? '#FFFFFF')
  }

  for (const override of overrides) {
    const rect = parseRect(override.rect)
    if (!rect) {
      issues.push({
        level: 'error',
        message: `Override "${override.name}" has an unreadable rect: "${override.rect}".`,
      })
      continue
    }

    const slotIndex = slots.get(override.name)
    if (slotIndex === undefined) unmatched.push(override.name)

    const [scaleX, scaleY] = parsePair(override.scale, [1, 1])
    const [offsetX, offsetY] = parsePair(override.offset, [0, 0])

    // PartConfigs keys must be unique because they name the image file.
    let imageName = sanitiseFileName(override.name)
    let suffix = 2
    while (usedNames.has(imageName)) imageName = `${sanitiseFileName(override.name)}_${suffix++}`
    usedNames.add(imageName)

    parts.push({
      imageName,
      rect,
      part: createPart(override.name, slotIndex ?? -1, {
        scaleX,
        scaleY,
        offsetX,
        offsetY,
        colorChoices: coloursForPart(override.name),
      }),
    })
  }

  // Pad every part to the widest colour list so the game accepts the form.
  const widest = Math.max(1, ...parts.map(entry => entry.part.colorChoices.length))
  for (const entry of parts) {
    while (entry.part.colorChoices.length < widest) entry.part.colorChoices.push('#FFFFFF')
  }

  if (unmatched.length) {
    issues.push({
      level: 'warning',
      message:
        `${unmatched.length} part name(s) are not in the current follower slot list and need a slot picked by hand: `
        + unmatched.join(', '),
    })
  }

  const variant: SkinVariant = {
    name: options.variantName ?? 'base',
    overrideBaseSkin: options.overrideBaseSkin ?? 'Cat',
    parts: Object.fromEntries(parts.map(entry => [entry.imageName, entry.part])),
  }

  return { variant, parts, issues, unmatched }
}

/** Makes a string safe to use as a file name inside the exported zip. */
export function sanitiseFileName(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    || 'part'
}
