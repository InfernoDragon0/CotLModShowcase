import { describe, expect, it } from 'vitest'
import {
  buildConfigJson,
  convertJsonLoader,
  normalizeHex,
  parsePair,
  parseRect,
  sanitiseFileName,
  validateVariant,
  type JsonLoaderSkin,
  type SkinVariant,
} from '../app/utils/followerSkin'

const slots = new Map<string, number>([
  ['HEAD_SKIN_BTM', 89],
  ['HEAD_SKIN_TOP', 91],
  ['ARM_LEFT_SKIN', 36],
  ['LEG_LEFT_SKIN', 48],
])

describe('parseRect', () => {
  it('reads a well formed rect', () => {
    expect(parseRect('0, 16, 128, 64')).toEqual({ x: 0, y: 16, width: 128, height: 64 })
  })

  it('tolerates missing whitespace', () => {
    expect(parseRect('1,2,3,4')).toEqual({ x: 1, y: 2, width: 3, height: 4 })
  })

  it('rejects the wrong number of components', () => {
    expect(parseRect('1, 2, 3')).toBeNull()
    expect(parseRect('')).toBeNull()
    expect(parseRect(undefined)).toBeNull()
  })

  it('rejects non-numeric components', () => {
    expect(parseRect('0, 0, wide, 64')).toBeNull()
  })
})

describe('parsePair', () => {
  it('reads a pair', () => {
    expect(parsePair('1.5, 2', [1, 1])).toEqual([1.5, 2])
  })

  it('falls back when absent or malformed', () => {
    expect(parsePair(undefined, [1, 1])).toEqual([1, 1])
    expect(parsePair('1', [0, 0])).toEqual([0, 0])
  })
})

describe('normalizeHex', () => {
  it('expands the short form the Spine runtime cannot parse', () => {
    expect(normalizeHex('#FFF')).toBe('#FFFFFF')
    expect(normalizeHex('#a1b')).toBe('#AA11BB')
  })

  it('leaves the long form alone apart from casing', () => {
    expect(normalizeHex('#502530')).toBe('#502530')
  })
})

describe('sanitiseFileName', () => {
  it('replaces path separators and spaces', () => {
    expect(sanitiseFileName('Face/MOUTH_CURSED')).toBe('Face_MOUTH_CURSED')
    expect(sanitiseFileName('my part')).toBe('my_part')
  })
})

describe('convertJsonLoader', () => {
  const skin: JsonLoaderSkin = {
    name: 'Example Skin',
    imagePath: 'ExampleSkin.png',
    overrides: [
      { name: 'HEAD_SKIN_BTM', rect: '0, 0, 128, 128', scale: '1.5, 1.5', offset: '0.5, -0.5' },
      { name: 'ARM_LEFT_SKIN', rect: '128, 0, 64, 64' },
    ],
    colors: [
      [{ name: 'HEAD_SKIN_BTM', hex: '#FFF' }],
      [{ name: 'HEAD_SKIN_BTM', hex: '#502530' }],
    ],
  }

  it('maps overrides onto slot indices', () => {
    const { variant } = convertJsonLoader(skin, slots)
    expect(variant.parts.HEAD_SKIN_BTM!.slotIndex).toBe(89)
    expect(variant.parts.ARM_LEFT_SKIN!.slotIndex).toBe(36)
  })

  it('carries scale and offset across, and defaults rotation to -90', () => {
    const { variant } = convertJsonLoader(skin, slots)
    const head = variant.parts.HEAD_SKIN_BTM!
    expect(head.scaleX).toBe(1.5)
    expect(head.scaleY).toBe(1.5)
    expect(head.offsetX).toBe(0.5)
    expect(head.offsetY).toBe(-0.5)
    expect(head.rotation).toBe(-90)
  })

  it('turns colour sets into per-part colour choices', () => {
    const { variant } = convertJsonLoader(skin, slots)
    expect(variant.parts.HEAD_SKIN_BTM!.colorChoices).toEqual(['#FFFFFF', '#502530'])
  })

  it('pads every part to the same colour count so the game accepts the form', () => {
    const { variant } = convertJsonLoader(skin, slots)
    const counts = Object.values(variant.parts).map(part => part.colorChoices.length)
    expect(new Set(counts).size).toBe(1)
    expect(variant.parts.ARM_LEFT_SKIN!.colorChoices).toEqual(['#FFFFFF', '#FFFFFF'])
  })

  it('returns the crop rectangle for each part', () => {
    const { parts } = convertJsonLoader(skin, slots)
    expect(parts[0]!.rect).toEqual({ x: 0, y: 0, width: 128, height: 128 })
  })

  it('reports names with no matching slot instead of guessing', () => {
    const result = convertJsonLoader(
      { overrides: [{ name: 'LEFT_ARM_SKIN', rect: '0, 0, 8, 8' }] },
      slots,
    )
    expect(result.unmatched).toEqual(['LEFT_ARM_SKIN'])
    expect(result.variant.parts.LEFT_ARM_SKIN!.slotIndex).toBe(-1)
    expect(result.issues.some(issue => issue.level === 'warning')).toBe(true)
  })

  it('flags an unreadable rect and skips that override', () => {
    const result = convertJsonLoader(
      { overrides: [{ name: 'HEAD_SKIN_BTM', rect: 'nonsense' }] },
      slots,
    )
    expect(result.parts).toHaveLength(0)
    expect(result.issues.some(issue => issue.level === 'error')).toBe(true)
  })

  it('gives duplicate override names distinct image file names', () => {
    const result = convertJsonLoader(
      {
        overrides: [
          { name: 'HEAD_SKIN_BTM', rect: '0, 0, 8, 8' },
          { name: 'HEAD_SKIN_BTM', rect: '8, 0, 8, 8' },
        ],
      },
      slots,
    )
    expect(Object.keys(result.variant.parts)).toEqual(['HEAD_SKIN_BTM', 'HEAD_SKIN_BTM_2'])
  })
})

describe('buildConfigJson', () => {
  const variant: SkinVariant = {
    name: 'base',
    overrideBaseSkin: 'Cat',
    parts: {
      part2: {
        slotIndex: 89,
        partName: 'HEAD_SKIN_BTM',
        scaleX: 1.3,
        scaleY: 1.3,
        rotation: -90,
        offsetX: 0,
        offsetY: 0,
        hideSlot: false,
        colorChoices: ['#FFFFFF'],
      },
    },
  }

  it('emits the PascalCase shape CultTweaker reads', () => {
    expect(buildConfigJson(variant)).toEqual({
      OverrideBaseSkin: 'Cat',
      PartConfigs: {
        part2: {
          SlotIndex: 89,
          PartName: 'HEAD_SKIN_BTM',
          ScaleX: 1.3,
          ScaleY: 1.3,
          Rotation: -90,
          OffsetX: 0,
          OffsetY: 0,
          HideSlot: false,
          ColorChoices: ['#FFFFFF'],
        },
      },
    })
  })

  it('copies colour arrays so later edits cannot mutate the output', () => {
    const output = buildConfigJson(variant) as any
    output.PartConfigs.part2.ColorChoices.push('#000000')
    expect(variant.parts.part2!.colorChoices).toEqual(['#FFFFFF'])
  })
})

describe('validateVariant', () => {
  function variantWith(parts: SkinVariant['parts']): SkinVariant {
    return { name: 'base', overrideBaseSkin: 'Cat', parts }
  }

  const base = {
    slotIndex: 89,
    partName: 'HEAD_SKIN_BTM',
    scaleX: 1,
    scaleY: 1,
    rotation: -90,
    offsetX: 0,
    offsetY: 0,
    hideSlot: false,
    colorChoices: ['#FFFFFF'],
    image: { dataUrl: 'data:,', width: 8, height: 8 },
  }

  it('accepts a consistent variant', () => {
    const issues = validateVariant(variantWith({ a: { ...base } }))
    expect(issues.filter(issue => issue.level === 'error')).toHaveLength(0)
  })

  it('rejects mismatched colour-choice counts', () => {
    const issues = validateVariant(variantWith({
      a: { ...base },
      b: { ...base, partName: 'HEAD_SKIN_TOP', colorChoices: ['#FFFFFF', '#000000'] },
    }))
    expect(issues.some(issue => issue.level === 'error' && issue.message.includes('colour-choice'))).toBe(true)
  })

  it('ignores hidden slots when comparing colour counts', () => {
    const issues = validateVariant(variantWith({
      a: { ...base },
      b: { ...base, partName: 'HEAD_SKIN_TOP', hideSlot: true, colorChoices: [] },
    }))
    expect(issues.filter(issue => issue.level === 'error')).toHaveLength(0)
  })

  it('rejects an invalid colour', () => {
    const issues = validateVariant(variantWith({ a: { ...base, colorChoices: ['red'] } }))
    expect(issues.some(issue => issue.message.includes('invalid colour'))).toBe(true)
  })

  it('warns when a visible part has no image', () => {
    const { image, ...noImage } = base
    const issues = validateVariant(variantWith({ a: noImage }))
    expect(issues.some(issue => issue.level === 'warning')).toBe(true)
  })

  it('rejects an empty variant', () => {
    const issues = validateVariant(variantWith({}))
    expect(issues[0]!.level).toBe('error')
  })
})
