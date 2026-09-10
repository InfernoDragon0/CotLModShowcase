/**
 * Loads the vendored Spine 3.8 web player exactly once per page and hands out
 * the global `spine` namespace.
 *
 * The follower skeleton in `public/` is a Spine 3.8.99 export, so the 3.8
 * runtime in `public/spine-player.js` is the one that can read it. The npm
 * `@esotericsoftware/spine-*` 4.x packages cannot and are not installed.
 */

export interface SpinePlayerOptions {
  skelUrl?: string
  jsonUrl?: string
  atlasUrl?: string
  skin?: string
  skins?: string[]
  animation?: string
  animations?: string[]
  premultipliedAlpha?: boolean
  alpha?: boolean
  backgroundColor?: string
  showControls?: boolean
  showLoading?: boolean
  defaultMix?: number
  viewport?: Record<string, unknown>
  success?: (player: any) => void
  error?: (player: any, message: string) => void
  [key: string]: unknown
}

declare global {
  interface Window {
    spine?: any
  }
}

let loader: Promise<any> | null = null

/** True when the browser can actually render a WebGL Spine canvas. */
export function supportsSpine(): boolean {
  if (import.meta.server) return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  }
  catch {
    return false
  }
}

/** True when the visitor asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  if (import.meta.server) return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

export function useSpineRuntime() {
  const appConfig = useAppConfig()
  const assets = appConfig.spine as {
    scriptUrl: string
    styleUrl: string
    skelUrl: string
    atlasUrl: string
  }

  /** Resolves with the global `spine` namespace once the runtime is ready. */
  function loadRuntime(): Promise<any> {
    if (import.meta.server) return Promise.resolve(null)
    if (window.spine) return Promise.resolve(window.spine)
    if (loader) return loader

    loader = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${assets.styleUrl}"]`)) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = assets.styleUrl
        document.head.appendChild(link)
      }

      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${assets.scriptUrl}"]`,
      )
      const script = existing ?? document.createElement('script')

      script.addEventListener('load', () => {
        window.spine ? resolve(window.spine) : reject(new Error('spine global missing after load'))
      })
      script.addEventListener('error', () => reject(new Error('failed to load the Spine runtime')))

      if (!existing) {
        script.src = assets.scriptUrl
        script.async = true
        document.head.appendChild(script)
      }
    })

    // Let a later attempt retry after a network failure.
    loader.catch(() => {
      loader = null
    })

    return loader
  }

  /**
   * Creates a SpinePlayer bound to `element`, defaulting to the follower
   * skeleton. The returned player is registered for automatic disposal.
   */
  async function createPlayer(
    element: HTMLElement,
    options: SpinePlayerOptions = {},
  ): Promise<any> {
    const spine = await loadRuntime()
    if (!spine) return null

    return new spine.SpinePlayer(element, {
      skelUrl: assets.skelUrl,
      atlasUrl: assets.atlasUrl,
      premultipliedAlpha: false,
      alpha: true,
      backgroundColor: '#00000000',
      showControls: false,
      showLoading: false,
      ...options,
    })
  }

  return { loadRuntime, createPlayer, assets }
}
