/**
 * Persists skin projects in the browser.
 *
 * Metadata lives in localStorage so a project list is available synchronously,
 * while part images go to IndexedDB — a handful of PNGs blows past the 5 MB
 * localStorage quota immediately.
 */

import { del, get, set } from 'idb-keyval'
import type { SkinProject, SkinVariant } from '~/utils/followerSkin'

const STORAGE_KEY = 'cotl.skinProjects.v2'
const LEGACY_KEY = 'skinProps'
const IMAGE_PREFIX = 'cotl.skinImage.'

/** A project with image data swapped for IndexedDB keys. */
interface StoredProject extends Omit<SkinProject, 'variants'> {
  variants: (Omit<SkinVariant, 'parts'> & {
    parts: Record<string, Omit<SkinProject['variants'][number]['parts'][string], 'image'> & {
      imageKey?: string
      imageWidth?: number
      imageHeight?: number
    }>
  })[]
}

export function useSkinProjects() {
  const projects = useState<SkinProject[]>('skin-projects', () => [])
  const activeId = useState<string | null>('skin-project-active', () => null)
  const loaded = useState('skin-projects-loaded', () => false)

  const active = computed(() => projects.value.find(project => project.id === activeId.value) ?? null)

  function imageKey(projectId: string, variant: string, part: string) {
    return `${IMAGE_PREFIX}${projectId}.${variant}.${part}`
  }

  async function load() {
    if (loaded.value || import.meta.server) return

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const stored = JSON.parse(raw) as StoredProject[]
        projects.value = await Promise.all(stored.map(hydrate))
      }
      catch (error) {
        console.error('[skin-builder] could not read saved projects', error)
        projects.value = []
      }
    }

    if (!projects.value.length) migrateLegacy()

    activeId.value = projects.value[0]?.id ?? null
    loaded.value = true
  }

  async function hydrate(stored: StoredProject): Promise<SkinProject> {
    const variants = await Promise.all(
      stored.variants.map(async variant => ({
        name: variant.name,
        overrideBaseSkin: variant.overrideBaseSkin,
        parts: Object.fromEntries(
          await Promise.all(
            Object.entries(variant.parts).map(async ([name, part]) => {
              const { imageKey: key, imageWidth, imageHeight, ...rest } = part
              const dataUrl = key ? await get<string>(key) : undefined
              return [
                name,
                dataUrl
                  ? { ...rest, image: { dataUrl, width: imageWidth ?? 0, height: imageHeight ?? 0 } }
                  : rest,
              ]
            }),
          ),
        ),
      })),
    )

    return { id: stored.id, name: stored.name, updatedAt: stored.updatedAt, variants } as SkinProject
  }

  /**
   * Brings across projects saved by the previous builder, which stored a flat
   * `skinProps` array of JSONLoader-shaped overrides without images.
   */
  function migrateLegacy() {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return

    try {
      const legacy = JSON.parse(raw) as any[]
      const migrated = legacy
        .filter(entry => entry?.name && entry?.overrides)
        .map<SkinProject>(entry => ({
          id: crypto.randomUUID(),
          name: String(entry.name),
          updatedAt: Date.now(),
          variants: [{
            name: 'base',
            overrideBaseSkin: 'Cat',
            parts: Object.fromEntries(
              Object.values(entry.overrides as Record<string, any>).map((override: any) => [
                sanitiseFileName(String(override.name)),
                createPart(String(override.name), -1, {
                  scaleX: Number(override.scaleX) || 1,
                  scaleY: Number(override.scaleY) || 1,
                }),
              ]),
            ),
          }],
        }))

      if (migrated.length) projects.value = migrated
    }
    catch (error) {
      console.error('[skin-builder] could not migrate legacy projects', error)
    }
  }

  async function persist() {
    if (import.meta.server) return

    const stored: StoredProject[] = []

    for (const project of projects.value) {
      const variants = []
      for (const variant of project.variants) {
        const parts: StoredProject['variants'][number]['parts'] = {}
        for (const [name, part] of Object.entries(variant.parts)) {
          const { image, ...rest } = part
          if (image) {
            const key = imageKey(project.id, variant.name, name)
            await set(key, image.dataUrl)
            parts[name] = { ...rest, imageKey: key, imageWidth: image.width, imageHeight: image.height }
          }
          else {
            parts[name] = rest
          }
        }
        variants.push({ name: variant.name, overrideBaseSkin: variant.overrideBaseSkin, parts })
      }
      stored.push({ id: project.id, name: project.name, updatedAt: project.updatedAt, variants })
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    }
    catch (error) {
      console.error('[skin-builder] could not save projects', error)
      throw new Error('The browser refused to save. Try removing an unused skin.')
    }
  }

  function create(name: string, baseSkin = 'Cat'): SkinProject {
    const project: SkinProject = {
      id: crypto.randomUUID(),
      name,
      updatedAt: Date.now(),
      variants: [{ name: 'base', overrideBaseSkin: baseSkin, parts: {} }],
    }
    projects.value = [...projects.value, project]
    activeId.value = project.id
    return project
  }

  async function remove(id: string) {
    const project = projects.value.find(entry => entry.id === id)
    if (project) {
      for (const variant of project.variants) {
        for (const name of Object.keys(variant.parts)) {
          await del(imageKey(id, variant.name, name)).catch(() => {})
        }
      }
    }
    projects.value = projects.value.filter(entry => entry.id !== id)
    if (activeId.value === id) activeId.value = projects.value[0]?.id ?? null
    await persist()
  }

  function touch() {
    if (active.value) active.value.updatedAt = Date.now()
  }

  return { projects, active, activeId, loaded, load, persist, create, remove, touch }
}
