import { animate, stagger, utils } from 'animejs'

/**
 * Entrance, idle and scroll motion for the site, over anime.js v4.
 *
 * anime v4 renamed `easing` to `ease` and replaced `direction: 'alternate'`
 * with `alternate: true`; these helpers keep those details in one place. Every
 * helper is a no-op when the visitor prefers reduced motion, and everything a
 * component starts is torn down when that component goes away.
 *
 * Scroll *position* is read here rather than through anime's ScrollObserver:
 * its observers never fired against this site's scroller, which left sections
 * stuck at their start values. One shared rAF loop drives every parallax layer
 * on the page, and entrances are triggered by IntersectionObserver.
 */

interface ScrollLayer {
  section: HTMLElement
  apply: (progress: number, pointerX: number, pointerY: number) => void
}

/** Module scope: one loop and one listener for the whole page, not per layer. */
const layers = new Set<ScrollLayer>()
let frame = 0
let listening = false

/**
 * Cursor position as -1..1 from the middle of the window, and the eased value
 * the layers actually read. Easing towards the target is what stops the art
 * snapping about with the mouse.
 */
const pointerTarget = { x: 0, y: 0 }
const pointer = { x: 0, y: 0 }
let pointerListening = false

function runLayers() {
  frame = 0
  const viewport = window.innerHeight || 1

  // Ease a fraction of the remaining distance each frame.
  pointer.x += (pointerTarget.x - pointer.x) * 0.08
  pointer.y += (pointerTarget.y - pointer.y) * 0.08
  const settling = Math.abs(pointerTarget.x - pointer.x) > 0.001
    || Math.abs(pointerTarget.y - pointer.y) > 0.001

  for (const layer of layers) {
    const rect = layer.section.getBoundingClientRect()
    const span = rect.height + viewport
    // 0 as the section's top edge reaches the bottom of the screen, 1 once its
    // bottom edge has passed the top.
    const progress = Math.min(Math.max((viewport - rect.top) / span, 0), 1)
    layer.apply(progress, pointer.x, pointer.y)
  }

  // Keep running until the drift has caught up with the cursor.
  if (settling) schedule()
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(runLayers)
}

/**
 * Starts tracking the cursor. Only for real pointers: on a touch screen there
 * is nothing to follow, and the listener would just cost battery.
 */
function trackPointer() {
  if (pointerListening || !window.matchMedia('(pointer: fine)').matches) return
  pointerListening = true

  window.addEventListener('pointermove', (event) => {
    pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2
    pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2
    schedule()
  }, { passive: true })
}

function addLayer(layer: ScrollLayer) {
  layers.add(layer)

  if (!listening) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    listening = true
  }

  schedule()
  return () => {
    layers.delete(layer)
  }
}

export function useCotlMotion() {
  const reduced = () => prefersReducedMotion()
  const created: { revert?: () => void }[] = []
  const cleanups: (() => void)[] = []

  function track<T extends { revert?: () => void }>(animation: T): T {
    created.push(animation)
    return animation
  }

  if (getCurrentScope()) {
    onScopeDispose(() => {
      for (const animation of created) {
        try {
          animation.revert?.()
        }
        catch {
          // The element may already be gone; nothing to undo.
        }
      }
      created.length = 0
      for (const stop of cleanups) stop()
      cleanups.length = 0
    })
  }

  /** Fade and lift elements into place, one after another. */
  function fadeUp(targets: string | Element | Element[], options: { delay?: number } = {}) {
    if (reduced()) return
    track(animate(targets, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 620,
      delay: stagger(80, { start: options.delay ?? 0 }),
      ease: 'outQuad',
    }))
  }

  /** Endless gentle bob, used for floating icons and cards. */
  function float(targets: string | Element | Element[], distance = 10) {
    if (reduced()) return
    track(animate(targets, {
      translateY: [-distance / 2, distance / 2],
      duration: 2400,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      delay: stagger(220),
    }))
  }

  /** Pop items in with a slight scale, used for grids of cards. */
  function popIn(targets: string | Element | Element[], options: { delay?: number } = {}) {
    if (reduced()) return
    track(animate(targets, {
      opacity: [0, 1],
      scale: [0.94, 1],
      duration: 480,
      delay: stagger(55, { start: options.delay ?? 0 }),
      ease: 'outBack',
    }))
  }

  /**
   * Plays an entrance the first time `section` scrolls into view.
   *
   * The hidden starting state is set here rather than in CSS, so a page whose
   * JavaScript never runs still shows all of its content.
   */
  function reveal(
    targets: Element | Element[],
    section: HTMLElement,
    options: { delay?: number, y?: number } = {},
  ) {
    const list = (Array.isArray(targets) ? targets : [targets]).filter(Boolean)
    if (!list.length || reduced() || import.meta.server) return

    const lift = options.y ?? 28
    utils.set(list, { opacity: 0, translateY: lift })

    let played = false
    const play = () => {
      if (played) return
      played = true
      track(animate(list, {
        opacity: [0, 1],
        translateY: [lift, 0],
        duration: 700,
        delay: stagger(90, { start: options.delay ?? 0 }),
        ease: 'outQuad',
      }))
    }

    cleanups.push(onEnter(section, play))

    // Safety net. These elements are hidden until something tells them to
    // appear, so if the observer never reports - an unsupported browser, a tab
    // that was in the background the whole time - the content still arrives
    // rather than staying invisible forever.
    const failsafe = setTimeout(play, 4000)
    cleanups.push(() => clearTimeout(failsafe))
  }

  /**
   * Ties a layer's position to how far its section has travelled up the screen,
   * so backgrounds drift and swell more slowly than the copy over them.
   *
   * The transform is written directly: these run on every frame of a scroll, so
   * there is nothing to gain from routing them through the animation engine.
   */
  function parallax(
    target: HTMLElement,
    section: HTMLElement,
    options: { distance?: number, scale?: number, grow?: number, fade?: number, depth?: number } = {},
  ) {
    if (import.meta.server) return

    const distance = options.distance ?? 8
    const base = options.scale ?? 1.12
    const grow = options.grow ?? 0.06
    const fade = options.fade
    const depth = options.depth ?? 0

    // Movement is what `prefers-reduced-motion` is asking us to drop, but a
    // cross-fade is the accepted substitute for it - so a layer that only
    // brightens and dims still does so, and simply stops travelling.
    const still = reduced()
    if (still && fade === undefined) return
    if (!still && depth) trackPointer()

    cleanups.push(addLayer({
      section,
      apply: (progress, pointerX, pointerY) => {
        if (!still) {
          const shift = (progress - 0.5) * 2 * distance
          const drift = depth
            ? ` translate3d(${(pointerX * depth).toFixed(2)}px, ${(pointerY * depth).toFixed(2)}px, 0)`
            : ''
          target.style.transform = `translate3d(0, ${shift.toFixed(3)}%, 0)${drift} scale(${(base + grow * progress).toFixed(4)})`
        }

        if (fade === undefined) return

        // Dark at both ends of the pass, full strength while the section owns
        // the screen: the artwork arrives with its mod and leaves with it,
        // instead of sitting there through the sections either side.
        const centred = 1 - Math.abs(progress - 0.5) * 2
        const ramp = Math.min(Math.max(centred / 0.45, 0), 1)
        // Smoothstep, so it eases in rather than ramping linearly.
        target.style.opacity = (fade * ramp * ramp * (3 - 2 * ramp)).toFixed(3)
      },
    }))
  }

  /**
   * Brings a whole section up to full strength while it owns the screen and
   * lets it sit back when it does not.
   *
   * Unlike the travelling effects this is a plain cross-fade, so it runs even
   * for a visitor who has asked for reduced motion. It never reaches zero -
   * text that vanishes mid-scroll is worse than text that dims.
   */
  function fadeWithView(
    target: HTMLElement,
    section: HTMLElement,
    options: { min?: number, plateau?: number } = {},
  ) {
    if (import.meta.server) return

    const min = options.min ?? 0.1
    // How near the middle the section has to be before it reaches full
    // strength. Higher means a narrower plateau, so more of the pass is spent
    // arriving and the entrance reads harder.
    const plateau = options.plateau ?? 0.7

    cleanups.push(addLayer({
      section,
      apply: (progress) => {
        const centred = 1 - Math.abs(progress - 0.5) * 2
        const ramp = Math.min(Math.max(centred / plateau, 0), 1)
        const eased = ramp * ramp * (3 - 2 * ramp)
        target.style.opacity = (min + (1 - min) * eased).toFixed(3)
      },
    }))
  }

  /** Lifts and fades a layer out as its section scrolls up under the header. */
  function fadeOnScroll(target: HTMLElement, section: HTMLElement, options: { lift?: number } = {}) {
    if (reduced() || import.meta.server) return

    const lift = options.lift ?? 60

    cleanups.push(addLayer({
      section,
      apply: (progress) => {
        // Only the second half matters: the hero is fully in view until it
        // starts leaving, and fading it while it arrives would be backwards.
        const leaving = Math.min(Math.max((progress - 0.5) * 2, 0), 1)
        target.style.transform = `translate3d(0, ${(-lift * leaving).toFixed(2)}px, 0)`
        target.style.opacity = String(1 - leaving)
      },
    }))
  }

  /**
   * Scrolls to a section by id, allowing for the sticky header.
   *
   * The browser's own `scrollIntoView({ behavior: 'smooth' })` was abandoning
   * long journeys part-way - anchors far down the page either stopped short or
   * never started - so the scroll is tweened here instead, which lands exactly
   * on target no matter how far away it is.
   */
  function scrollToId(id: string, offset = 72) {
    if (import.meta.server) return

    const element = document.getElementById(id)
    if (!element) return

    const target = Math.max(0, Math.round(element.getBoundingClientRect().top + window.scrollY - offset))

    if (reduced()) {
      window.scrollTo(0, target)
      return
    }

    const state = { y: window.scrollY }
    track(animate(state, {
      y: target,
      // Long trips take a little longer, but never so long that the page feels
      // like it is dragging the reader around.
      duration: Math.min(1100, 320 + Math.abs(target - state.y) * 0.22),
      ease: 'inOutQuad',
      onUpdate: () => window.scrollTo(0, state.y),
    }))
  }

  /**
   * Runs `callback` the first time `element` scrolls into view.
   * Returns a cleanup function.
   */
  function onEnter(element: MaybeRefOrGetter<HTMLElement | undefined>, callback: () => void) {
    if (import.meta.server) return () => {}

    const target = toValue(element)
    if (!target) return () => {}

    // Entrances now start from a hidden state written in the page head, so a
    // browser with no observer has to be given its content some other way.
    if (typeof IntersectionObserver === 'undefined') {
      callback()
      return () => {}
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect()
          callback()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }

  return { fadeUp, float, popIn, reveal, parallax, fadeWithView, fadeOnScroll, scrollToId, onEnter }
}
