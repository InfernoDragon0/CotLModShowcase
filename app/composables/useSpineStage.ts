/**
 * Draws any number of Cult of the Lamb followers on a single WebGL canvas.
 *
 * A `SpinePlayer` per follower would mean a WebGL context and a full atlas
 * upload each, and browsers cap concurrent contexts at roughly sixteen. This
 * composable instead creates one context, uploads the atlas once, and renders
 * many `Skeleton` instances that share the same `SkeletonData`.
 */

export interface StageActor {
  /** Skin name from the follower skeleton, e.g. 'Cat', 'Fox', 'Deer'. */
  skin: string
  /** Animation name, e.g. 'idle', 'dance', 'pray'. */
  animation: string
  /** Horizontal position as a fraction of canvas width (0 = left, 1 = right). */
  x: number
  /** Vertical position as a fraction of canvas height (0 = bottom, 1 = top). */
  y: number
  /** Render scale. 1 renders the follower at roughly 260 CSS pixels tall. */
  scale?: number
  /** Seconds to offset the animation by, so a row does not move in lockstep. */
  offset?: number
  /** Set true to face left. */
  flip?: boolean
}

/** The follower skeleton renders about 260px tall at scale 1. */
const BASE_SCALE = 0.55

export function useSpineStage(
  canvas: Ref<HTMLCanvasElement | undefined>,
  actors: MaybeRefOrGetter<StageActor[]>,
) {
  const { loadRuntime, assets } = useSpineRuntime()

  const ready = ref(false)
  const failed = ref(false)

  let raf = 0
  let disposed = false
  let spineNs: any = null
  let renderer: any = null
  let context: any = null
  let assetManager: any = null
  let entries: { skeleton: any, state: any, actor: StageActor }[] = []
  let lastFrame = 0

  async function start() {
    if (disposed || ready.value || failed.value) return
    const el = canvas.value
    if (!el) return

    let spine: any
    try {
      spine = await loadRuntime()
    }
    catch {
      failed.value = true
      return
    }
    if (!spine || disposed) return
    spineNs = spine

    try {
      context = new spine.webgl.ManagedWebGLRenderingContext(el, {
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      })
      renderer = new spine.webgl.SceneRenderer(el, context)
      assetManager = new spine.webgl.AssetManager(context)

      assetManager.loadBinary(assets.skelUrl)
      assetManager.loadTextureAtlas(assets.atlasUrl)

      await waitForAssets(assetManager)
      if (disposed) return

      const atlas = assetManager.get(assets.atlasUrl)
      const binary = new spine.SkeletonBinary(new spine.AtlasAttachmentLoader(atlas))
      binary.scale = BASE_SCALE
      const skeletonData = binary.readSkeletonData(assetManager.get(assets.skelUrl))

      entries = toValue(actors).map((actor) => {
        const skeleton = new spine.Skeleton(skeletonData)
        applySkin(skeleton, actor.skin)

        const state = new spine.AnimationState(new spine.AnimationStateData(skeletonData))
        const animation = skeletonData.findAnimation(actor.animation)
          ? actor.animation
          : 'idle'
        state.setAnimation(0, animation, true)
        if (actor.offset) state.update(actor.offset)

        return { skeleton, state, actor }
      })

      ready.value = true
      lastFrame = performance.now()
      raf = requestAnimationFrame(frame)
    }
    catch (error) {
      console.error('[spine-stage] failed to initialise', error)
      failed.value = true
      dispose()
    }
  }

  function applySkin(skeleton: any, name: string) {
    const found = skeleton.data.findSkin(name) ? name : 'Cat'
    skeleton.setSkinByName(found)
    skeleton.setSlotsToSetupPose()
  }

  function waitForAssets(manager: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const poll = () => {
        if (disposed) return resolve()
        if (manager.hasErrors?.()) return reject(new Error('asset load error'))
        if (manager.isLoadingComplete()) return resolve()
        setTimeout(poll, 50)
      }
      poll()
    })
  }

  function frame(now: number) {
    if (disposed || !renderer) return
    const delta = Math.min((now - lastFrame) / 1000, 0.05)
    lastFrame = now

    const el = canvas.value
    if (!el) return

    renderer.resize(spineNs.webgl.ResizeMode.Expand)

    const gl = context.gl
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const width = el.width
    const height = el.height

    renderer.begin()
    for (const { skeleton, state, actor } of entries) {
      skeleton.x = actor.x * width - width / 2
      skeleton.y = actor.y * height - height / 2
      const scale = actor.scale ?? 1
      skeleton.scaleX = actor.flip ? -scale : scale
      skeleton.scaleY = scale

      state.update(delta)
      state.apply(skeleton)
      skeleton.updateWorldTransform()
      renderer.drawSkeleton(skeleton, false)
    }
    renderer.end()

    raf = requestAnimationFrame(frame)
  }

  function dispose() {
    disposed = true
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    entries = []
    try {
      assetManager?.dispose?.()
      renderer?.dispose?.()
    }
    catch {
      // The context may already be gone during teardown.
    }
    assetManager = null
    renderer = null
    context = null
  }

  onBeforeUnmount(dispose)

  return { start, dispose, ready, failed }
}
