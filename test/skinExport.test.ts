import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { exportProject, SkinExportError } from '../app/utils/skinExport'
import { createPart, type SkinProject } from '../app/utils/followerSkin'

/** A 1x1 transparent PNG. */
const PIXEL
  = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

function project(overrides: Partial<SkinProject> = {}): SkinProject {
  return {
    id: 'test',
    name: 'My Skin',
    updatedAt: 0,
    variants: [
      {
        name: 'base',
        overrideBaseSkin: 'Cat',
        parts: {
          part2: createPart('HEAD_SKIN_BTM', 89, {
            image: { dataUrl: PIXEL, width: 1, height: 1 },
          }),
        },
      },
    ],
    ...overrides,
  }
}

describe('exportProject', () => {
  it('lays the zip out the way CultTweaker loads it', async () => {
    const { blob, filename } = await exportProject(project())
    expect(filename).toBe('My_Skin.zip')

    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const names = Object.keys(zip.files).filter(name => !zip.files[name]!.dir)

    expect(names).toContain('FollowerSkins/My_Skin/base/config.json')
    expect(names).toContain('FollowerSkins/My_Skin/base/part2.png')
  })

  it('writes the PascalCase config the mod deserialises', async () => {
    const { blob } = await exportProject(project())
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const config = JSON.parse(await zip.file('FollowerSkins/My_Skin/base/config.json')!.async('string'))

    expect(config.OverrideBaseSkin).toBe('Cat')
    expect(config.PartConfigs.part2).toMatchObject({
      SlotIndex: 89,
      PartName: 'HEAD_SKIN_BTM',
      Rotation: -90,
      HideSlot: false,
    })
  })

  it('writes one folder per variant', async () => {
    const withVariant = project()
    withVariant.variants.push({
      name: 'variant1',
      overrideBaseSkin: 'Cat',
      parts: {
        part2: createPart('HEAD_SKIN_BTM', 89, { image: { dataUrl: PIXEL, width: 1, height: 1 } }),
      },
    })

    const { blob } = await exportProject(withVariant)
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())

    expect(zip.file('FollowerSkins/My_Skin/variant1/config.json')).toBeTruthy()
    expect(zip.file('FollowerSkins/My_Skin/variant1/part2.png')).toBeTruthy()
  })

  it('refuses to export a variant the game would reject', async () => {
    const broken = project()
    broken.variants[0]!.parts.other = createPart('HEAD_SKIN_TOP', 91, {
      colorChoices: ['#FFFFFF', '#000000'],
      image: { dataUrl: PIXEL, width: 1, height: 1 },
    })

    await expect(exportProject(broken)).rejects.toThrow(SkinExportError)
  })

  it('decodes part images back to real PNG bytes', async () => {
    const { blob } = await exportProject(project())
    const zip = await JSZip.loadAsync(await blob.arrayBuffer())
    const bytes = await zip.file('FollowerSkins/My_Skin/base/part2.png')!.async('uint8array')

    // PNG magic number.
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4E, 0x47])
  })
})
