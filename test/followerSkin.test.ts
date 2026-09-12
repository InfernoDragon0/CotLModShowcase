import { describe, expect, it } from 'vitest'
import {
  buildConfigJson,
  convertJsonLoader,
  normalizeHex,
  parseConfigJson,
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

describe('parseConfigJson', () => {
  const config = {
    OverrideBaseSkin: 'Fox',
    PartConfigs: {
      head: {
        SlotIndex: 89,
        PartName: 'HEAD_SKIN_BTM',
        ScaleX: 1.3,
        ScaleY: 1.3,
        Rotation: -90,
        OffsetX: 2,
        OffsetY: -4,
        HideSlot: false,
        ColorChoices: ['#fff', '#123456'],
      },
    },
  }

  it('reads a config back into a variant', () => {
    const { variant } = parseConfigJson(config, 'base', slots)
    expect(variant.name).toBe('base')
    expect(variant.overrideBaseSkin).toBe('Fox')
    expect(variant.parts.head).toMatchObject({
      slotIndex: 89,
      partName: 'HEAD_SKIN_BTM',
      scaleX: 1.3,
      offsetY: -4,
      hideSlot: false,
    })
  })

  it('expands short hex so the Spine runtime can parse it', () => {
    const { variant } = parseConfigJson(config, 'base', slots)
    expect(variant.parts.head!.colorChoices).toEqual(['#FFFFFF', '#123456'])
  })

  it('round-trips through buildConfigJson', () => {
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
    expect(parseConfigJson(buildConfigJson(variant), 'base', slots).variant).toEqual(variant)
  })

  it('matches keys case-insensitively, the way Newtonsoft does', () => {
    const { variant } = parseConfigJson(
      { overridebaseskin: 'Deer', partconfigs: { head: { partname: 'HEAD_SKIN_TOP', slotindex: 91 } } },
      'base',
      slots,
    )
    expect(variant.overrideBaseSkin).toBe('Deer')
    expect(variant.parts.head!.partName).toBe('HEAD_SKIN_TOP')
  })

  it('falls back to the part defaults for missing transform fields', () => {
    const { variant } = parseConfigJson(
      { PartConfigs: { head: { PartName: 'HEAD_SKIN_BTM' } } },
      'base',
      slots,
    )
    expect(variant.parts.head).toMatchObject({ scaleX: 1, scaleY: 1, rotation: -90, offsetX: 0 })
  })

  it('re-resolves a stale slot index from the part name', () => {
    const { variant, issues } = parseConfigJson(
      { PartConfigs: { head: { PartName: 'HEAD_SKIN_BTM', SlotIndex: 12 } } },
      'base',
      slots,
    )
    expect(variant.parts.head!.slotIndex).toBe(89)
    expect(issues.some(issue => issue.message.includes('different slot'))).toBe(true)
  })

  it('keeps the declared index when the name is not in the slot table', () => {
    const { variant } = parseConfigJson(
      { PartConfigs: { head: { PartName: 'GONE_FROM_GAME', SlotIndex: 12 } } },
      'base',
      slots,
    )
    expect(variant.parts.head!.slotIndex).toBe(12)
  })

  it('pads parts that declare fewer colours than the rest', () => {
    const { variant, issues } = parseConfigJson(
      {
        PartConfigs: {
          head: { PartName: 'HEAD_SKIN_BTM', ColorChoices: ['#000000', '#111111'] },
          arm: { PartName: 'ARM_LEFT_SKIN', ColorChoices: ['#222222'] },
        },
      },
      'base',
      slots,
    )
    expect(variant.parts.arm!.colorChoices).toEqual(['#222222', '#FFFFFF'])
    expect(issues.some(issue => issue.message.includes('padded'))).toBe(true)
  })

  it('rejects a file that is not a CultTweaker config', () => {
    expect(() => parseConfigJson({ overrides: [] }, 'base', slots)).toThrow(/PartConfigs/)
    expect(() => parseConfigJson('nope', 'base', slots)).toThrow()
    expect(() => parseConfigJson({ PartConfigs: {} }, 'base', slots)).toThrow(/no parts/)
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

  /**
   * A part with no image recolours the base skin's own artwork, which is a
   * legitimate thing to export. The part's card carries a "Color only" badge
   * instead, where it points at the part rather than naming it up top.
   */
  it('says nothing about a part with no image', () => {
    const { image: _image, ...noImage } = base
    expect(validateVariant(variantWith({ a: noImage }))).toEqual([])
  })

  it('rejects an empty variant', () => {
    const issues = validateVariant(variantWith({}))
    expect(issues[0]!.level).toBe('error')
  })
})
