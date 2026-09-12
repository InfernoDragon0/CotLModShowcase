/** Packs a skin project into the folder layout CultTweaker loads. */

import JSZip from 'jszip'
import {
  buildConfigJson,
  sanitiseFileName,
  validateVariant,
  type SkinProject,
  type ValidationIssue,
} from './followerSkin'
import { dataUrlToBytes } from './skinImages'

export interface ExportResult {
  blob: Blob
  filename: string
  issues: ValidationIssue[]
}

/**
 * Builds a zip laid out as:
 *
 * ```text
 * <skin>/base/config.json
 * <skin>/base/<part>.png
 * <skin>/<variant>/…
 * ```
 *
 * The skin folder is the root of the archive rather than sitting under a
 * `FollowerSkins/` of its own: people unzip these straight into the
 * `FollowerSkins` folder they already have, and a wrapper of the same name just
 * produced a nested `FollowerSkins/FollowerSkins/` that the mod never reads.
 *
 * Unzip it into `BepInEx/plugins/CultTweaker/FollowerSkins/` and the form
 * appears in game. Throws when a variant breaks a rule the game enforces at
 * load time.
 */
export async function exportProject(project: SkinProject): Promise<ExportResult> {
  const issues = project.variants.flatMap(validateVariant)
  const errors = issues.filter(issue => issue.level === 'error')
  if (errors.length) {
    throw new SkinExportError('This skin cannot be exported yet.', issues)
  }

  const zip = new JSZip()
  const skinName = sanitiseFileName(project.name)
  const root = zip.folder(skinName)!

  for (const variant of project.variants) {
    const folder = root.folder(sanitiseFileName(variant.name))!
    folder.file('config.json', JSON.stringify(buildConfigJson(variant), null, 2))

    for (const [imageName, part] of Object.entries(variant.parts)) {
      if (!part.image) continue
      folder.file(`${imageName}.png`, dataUrlToBytes(part.image.dataUrl))
    }
  }

  zip.file(
    'README.txt',
    [
      `${project.name}: CultTweaker follower form.`,
      '',
      'Unzip this so the folders looks like:',
      `  BepInEx/plugins/CultTweaker/FollowerSkins/${skinName}`,
      '',
      'Then start the game. The form appears when indoctrinating a follower.',
      '',
      'Made with Skin Builder at https://cotlmod.infernodragon.net/builder',
    ].join('\n'),
  )

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  return { blob, filename: `${skinName}.zip`, issues }
}

export class SkinExportError extends Error {
  issues: ValidationIssue[]

  constructor(message: string, issues: ValidationIssue[]) {
    super(message)
    this.name = 'SkinExportError'
    this.issues = issues
  }
}
