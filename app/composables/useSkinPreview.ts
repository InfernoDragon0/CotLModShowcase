/**
 * Live preview of a CultTweaker follower form.
 *
 * The skin is rebuilt at runtime the same way the mod does it in game, so what
 * the browser shows is what the game will draw. The reference is
 * `SpineLoaderHelper/FollowerSpineLoader.cs` in the CultTweaker source, method
 * `BuildSkin` (the mesh bounding-box path and the region path) plus
 * `ApplyColours`.
 */

import { normalizeHex, type SkinVariant } from '~/utils/followerSkin'
import { loadImage } from '~/utils/skinImages'
import type { FollowerSlot } from './useFollowerSlots'

/**
 * Base skins read off the loaded skeleton, shared with the rest of the page.
 *
 * Empty until the preview has the skeleton in memory, which is what lets the
 * builder fall back to a short hand-written list in the meantime.
 */
export function useBaseSkinList() {
  return useState<string[]>('follower-base-skins', () => [])
}

export interface PreviewHandle {
  mount: (element: HTMLElement) => Promise<void>
  retry: () => Promise<void>
  apply: (variant: SkinVariant, colourSet: number) => Promise<void>
  setAnimation: (name: string) => void
  dispose: () => void
  ready: Ref<boolean>
  failed: Ref<boolean>
  /** Assets the player has finished, and how many it wants in total. */
  progress: Ref<{ loaded: number, total: number }>
  animations: Ref<string[]>
  baseSkins: Ref<string[]>
}

export function useSkinPreview(): PreviewHandle {
  const { createPlayer } = useSpineRuntime()
  const baseSkinSlots = useBaseSkinSlots()
  const sharedBaseSkins = useBaseSkinList()

  const ready = ref(false)
  const failed = ref(false)
  const progress = ref({ loaded: 0, total: 0 })
  const animations = ref<string[]>([])
  const baseSkins = ref<string[]>([])

  let player: any = null
  let spine: any = null
  /** GL textures created for the current preview, disposed on each rebuild. */
  let textures: any[] = []
  /**
   * Decoded part images, keyed by the data URL they came from.
   *
   * `apply` runs on every edit and on every skin switch, and decoding a
   * skin's worth of base64 PNGs from scratch each time is what made both of
   * those stall. A data URL always decodes to the same bitmap, so the decode
   * is paid for once and a rebuild after changing a rotation costs nothing.
   */
  const decoded = new Map<string, HTMLImageElement>()
  /** Kept so the panel can rebuild the player after a failure. */
  let host: HTMLElement | null = null
  /** What `apply` last drew, so tints can be restored after a pose reset. */
  let applied: { variant: SkinVariant, colourSet: number } | null = null
  let watchdog: ReturnType<typeof setInterval> | undefined

  function stopWatchdog() {
    clearInterval(watchdog)
    watchdog = undefined
  }

  /**
   * Reports download progress, and gives up only once it has stopped moving.
   *
   * The skeleton and its atlas are tens of megabytes, so a slow connection can
   * spend a minute or more here quite legitimately. A fixed timer reported that
   * as "the preview could not start", and the assets then finished downloading
   * in the background - which is why coming back to the page a second time
   * appeared to fix it. Only a long stall counts as a failure now, and the
   * panel shows the count in the meantime so the wait looks like a wait.
   */
  const POLL_MS = 500
  const STALL_LIMIT_MS = 150_000

  function startWatchdog() {
    stopWatchdog()
    let lastLoaded = -1
    let stalledMs = 0

    watchdog = setInterval(() => {
      if (ready.value) return stopWatchdog()

      const manager = player?.assetManager
      const loaded = manager?.getLoaded?.() ?? 0
      const remaining = manager?.getToLoad?.() ?? 0
      progress.value = { loaded, total: loaded + remaining }

      if (loaded !== lastLoaded) {
        lastLoaded = loaded
        stalledMs = 0
        return
      }

      stalledMs += POLL_MS
      if (stalledMs >= STALL_LIMIT_MS) {
        failed.value = true
        stopWatchdog()
      }
    }, POLL_MS)
  }

  async function mount(element: HTMLElement) {
    if (player) return

    host = element
    failed.value = false
    progress.value = { loaded: 0, total: 0 }
    startWatchdog()

    try {
      player = await createPlayer(element, {
        skin: 'Cat',
        animation: 'idle',
        showControls: true,
        success: (instance: any) => {
          spine = window.spine
          const data = instance.skeleton.data
          animations.value = data.animations.map((animation: any) => animation.name).sort()
          baseSkins.value = baseSkinsOf(data)
          sharedBaseSkins.value = baseSkins.value
          stopWatchdog()
          ready.value = true
        },
        error: (_instance: any, message: string) => {
          console.error('[skin-preview]', message)
          stopWatchdog()
          failed.value = true
        },
      })
    }
    catch (error) {
      console.error('[skin-preview] could not start the Spine player', error)
      stopWatchdog()
      failed.value = true
    }
  }

  /** Tears the player down and builds it again, for the retry button. */
  async function retry() {
    const element = host
    dispose()
    if (element) {
      element.innerHTML = ''
      await mount(element)
    }
  }

  /**
   * Wraps a loaded image in a single-region atlas page so a RegionAttachment
   * can point at it, mirroring the `GenerateAtlasText` helper in the mod.
   */
  function makeRegion(image: HTMLImageElement, name: string) {
    const texture = new spine.webgl.GLTexture(player.context, image)
    textures.push(texture)

    const region = new spine.TextureAtlasRegion()
    region.name = name
    region.page = { name, width: image.width, height: image.height }
    region.texture = texture
    region.u = 0
    region.v = 0
    region.u2 = 1
    region.v2 = 1
    region.width = image.width
    region.height = image.height
    region.originalWidth = image.width
    region.originalHeight = image.height
    region.offsetX = 0
    region.offsetY = 0
    region.rotate = false
    region.degrees = 0
    region.renderObject = region
    return region
  }

  /**
   * Skins worth offering as a base form, in the order they should be listed.
   *
   * The skeleton carries 623 skins and most are not follower forms at all:
   * `Drinks/Beer` has six attachments, `Meals/*` thirty-nine, `Hats/*`
   * nineteen. A base skin has to dress a whole follower, so the cut is at a
   * hundred attachments — which keeps all 442 animal forms, every `Boss *`,
   * the cult leaders and the `Mutation/*` set, and drops the props.
   *
   * Ordered followers first, then bosses, then the prefixed sets, because the
   * common case is picking an animal and the rest are a long tail.
   */
  function baseSkinsOf(data: any): string[] {
    const rank = (name: string) => (name.startsWith('Boss ') ? 1 : name.includes('/') ? 2 : 0)

    return data.skins
      .filter((skin: any) => {
        // `_custom` is the skeleton's own scratch skin, and it would otherwise
        // sort above everything else.
        if (!skin?.name || skin.name === 'default' || skin.name.startsWith('_')) return false
        let count = 0
        skin.attachments?.forEach((slotMap: object | undefined) => {
          if (slotMap) count += Object.keys(slotMap).length
        })
        return count >= 100
      })
      .map((skin: any) => skin.name as string)
      .sort((a: string, b: string) => rank(a) - rank(b) || a.localeCompare(b))
  }

  /**
   * Every `(slot index, attachment name)` a skin carries.
   *
   * spine-ts keys `Skin.attachments` by slot index, each entry an object of
   * attachment name to attachment — the same walk `FollowerSlotDumper` does in
   * the mod, which is what `followerSlots.json` is a snapshot of.
   */
  function attachmentsOf(skin: any): FollowerSlot[] {
    const out: FollowerSlot[] = []
    skin.attachments?.forEach((slotMap: Record<string, unknown> | undefined, slotIndex: number) => {
      if (!slotMap) return
      for (const name of Object.keys(slotMap)) out.push({ SlotIndex: slotIndex, PartName: name })
    })
    return out
  }

  /** Decodes a part image, reusing the bitmap when it has been seen before. */
  async function decode(dataUrl: string): Promise<HTMLImageElement> {
    const cached = decoded.get(dataUrl)
    if (cached) return cached

    const image = await loadImage(dataUrl)
    // A session spent editing several skins would otherwise hold every bitmap
    // it ever drew. Dropping the lot is fine: the next rebuild decodes again.
    if (decoded.size > 200) decoded.clear()
    decoded.set(dataUrl, image)
    return image
  }

  async function apply(variant: SkinVariant, colourSet: number) {
    if (!player || !ready.value || !spine) return

    const skeleton = player.skeleton
    const baseSkin
      = skeleton.data.findSkin(variant.overrideBaseSkin) ?? skeleton.data.findSkin('Cat')
    if (!baseSkin) return

    // The slot picker follows whichever base skin is selected, the way the
    // in-game editor does, so publish this skin's attachments as they resolve.
    baseSkinSlots.value = attachmentsOf(baseSkin)

    // Decoding happens up front and all at once. Awaiting each image inside the
    // loop below serialised a skin's worth of decodes behind one another, and
    // with twenty parts that is what the eye reads as the stall on switching.
    const images = new Map<string, HTMLImageElement>()
    await Promise.all(
      Object.entries(variant.parts)
        .filter(([, part]) => !part.hideSlot && part.image && part.slotIndex >= 0)
        .map(async ([imageName, part]) => {
          try {
            images.set(imageName, await decode(part.image!.dataUrl))
          }
          catch (error) {
            console.error(`[skin-preview] could not decode part "${imageName}"`, error)
          }
        }),
    )

    // Textures from the previous build are no longer referenced once the new
    // skin replaces it, so release them before uploading more.
    disposeTextures()

    const skin = new spine.Skin(`preview_${variant.name}`)
    // `addSkin` shares attachment references while `copySkin` deep-copies. The
    // mod copies, but nothing here mutates a base attachment — overridden slots
    // get a freshly built attachment instead — so sharing is safe and avoids
    // cloning roughly 1500 attachments on every edit.
    skin.addSkin(baseSkin)

    for (const [imageName, part] of Object.entries(variant.parts)) {
      if (part.hideSlot) {
        skin.removeAttachment(part.slotIndex, part.partName)
        continue
      }
      if (!part.image || part.slotIndex < 0) continue

      // Slot indices come from CultTweaker's in-game dump, so the skeleton in
      // `public/` has to be an export of the same follower. When the two drift
      // apart the lookup finds nothing and the part silently keeps its base
      // artwork, which is worth saying out loud.
      const baseAttachment = baseSkin.getAttachment(part.slotIndex, part.partName)
      if (!baseAttachment) {
        console.warn(
          `[skin-preview] slot ${part.slotIndex} of this skeleton has no "${part.partName}".`,
          'The bundled skeleton and the slot table are out of step.',
        )
        continue
      }

      const image = images.get(imageName)
      if (!image) continue

      try {
        const region = makeRegion(image, `${variant.name}_${imageName}`)

        if (baseAttachment instanceof spine.MeshAttachment) {
          // The mod walks the vertex buffer with a stride of three and reads
          // index % 3 === 0 as Y and === 1 as X. That looks unusual but it is
          // what produces the in-game placement, so it is mirrored exactly.
          const vertices = baseAttachment.vertices
          let minX = Number.POSITIVE_INFINITY
          let maxX = Number.NEGATIVE_INFINITY
          let minY = Number.POSITIVE_INFINITY
          let maxY = Number.NEGATIVE_INFINITY

          for (let index = 0; index < vertices.length; index++) {
            const value = vertices[index]!
            if (index % 3 === 0) {
              minY = Math.min(minY, value)
              maxY = Math.max(maxY, value)
            }
            else if (index % 3 === 1) {
              minX = Math.min(minX, value)
              maxX = Math.max(maxX, value)
            }
          }

          const diffX = maxX - minX
          const diffY = maxY - minY
          const centerX = minX + diffX / 2
          const centerY = minY + diffY / 2

          const attachment = new spine.RegionAttachment(part.partName)
          attachment.setRegion(region)
          attachment.x = centerY - part.offsetY
          attachment.y = centerX - part.offsetX
          attachment.rotation = part.rotation
          attachment.scaleX = part.scaleX
          attachment.scaleY = part.scaleY
          attachment.width = diffX
          attachment.height = diffY
          attachment.updateOffset()
          skin.setAttachment(part.slotIndex, part.partName, attachment)
        }
        else if (baseAttachment instanceof spine.RegionAttachment) {
          const attachment = baseAttachment.copy()
          attachment.name = `${variant.name}_${part.partName}`
          attachment.setRegion(region)
          attachment.x += part.offsetX
          attachment.y += part.offsetY
          attachment.scaleX = part.scaleX
          attachment.scaleY = part.scaleY
          attachment.rotation = part.rotation
          attachment.updateOffset()
          skin.setAttachment(part.slotIndex, part.partName, attachment)
        }
      }
      catch (error) {
        console.error(`[skin-preview] could not apply part "${imageName}"`, error)
      }
    }

    skeleton.setSkin(skin)
    skeleton.setSlotsToSetupPose()
    applied = { variant, colourSet }
    applyColours(variant, colourSet)
  }

  /** Tints each overridden slot with its choice from the selected colour set. */
  function applyColours(variant: SkinVariant, colourSet: number) {
    const skeleton = player?.skeleton
    if (!skeleton) return

    for (const part of Object.values(variant.parts)) {
      if (!part.colorChoices.length || !part.partName) continue
      const index = Math.min(Math.max(colourSet, 0), part.colorChoices.length - 1)
      const slot = skeleton.findSlot(part.partName)
      if (!slot) continue
      // The 3.8 runtime strips a leading '#' but only parses six- and
      // eight-digit hex, so the short form has to be expanded first.
      slot.color.setFromString(normalizeHex(part.colorChoices[index]!))
    }
  }

  function setAnimation(name: string) {
    if (!player || !ready.value) return
    try {
      player.setAnimation(name, true)

      // SpinePlayer measures the new animation's bounds before playing it, and
      // measures from the setup pose — which puts every slot tint back to
      // white. Attachments live in the skin and survive that, so the images
      // stay; the colours are on the slots and have to be set again.
      if (applied) applyColours(applied.variant, applied.colourSet)
    }
    catch (error) {
      console.error('[skin-preview] unknown animation', name, error)
    }
  }

  function disposeTextures() {
    for (const texture of textures) {
      try {
        texture.dispose()
      }
      catch {
        // The context may already be gone.
      }
    }
    textures = []
  }

  function dispose() {
    stopWatchdog()
    disposeTextures()
    decoded.clear()
    applied = null
    try {
      // SpinePlayer has no dispose; stopping the render loop releases it.
      player?.stopRendering?.()
    }
    catch {
      // Ignore teardown races.
    }
    player = null
    ready.value = false
  }

  onBeforeUnmount(dispose)

  return { mount, retry, apply, setAnimation, dispose, ready, failed, progress, animations, baseSkins }
}
