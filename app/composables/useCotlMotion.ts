import { animate, stagger } from 'animejs'

/**
 * Thin wrapper over anime.js v4 for the site's entrance and idle motion.
 *
 * anime v4 renamed `easing` to `ease` and replaced `direction: 'alternate'`
 * with `alternate: true`; these helpers keep those details in one place.
 * Every helper is a no-op when the visitor prefers reduced motion.
 */
export function useCotlMotion() {
  const reduced = () => prefersReducedMotion()

  /** Fade and lift elements into place, one after another. */
  function fadeUp(targets: string | Element | Element[], options: { delay?: number } = {}) {
    if (reduced()) return
    animate(targets, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 620,
      delay: stagger(80, { start: options.delay ?? 0 }),
      ease: 'outQuad',
    })
  }

  /** Endless gentle bob, used for floating icons and cards. */
  function float(targets: string | Element | Element[], distance = 10) {
    if (reduced()) return
    animate(targets, {
      translateY: [-distance / 2, distance / 2],
      duration: 2400,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
      delay: stagger(220),
    })
  }

  /** Pop items in with a slight scale, used for grids of cards. */
  function popIn(targets: string | Element | Element[], options: { delay?: number } = {}) {
    if (reduced()) return
    animate(targets, {
      opacity: [0, 1],
      scale: [0.94, 1],
      duration: 480,
      delay: stagger(55, { start: options.delay ?? 0 }),
      ease: 'outBack',
    })
  }

  /**
   * Runs `callback` the first time `element` scrolls into view.
   * Returns a cleanup function.
   */
  function onEnter(element: MaybeRefOrGetter<HTMLElement | undefined>, callback: () => void) {
    if (import.meta.server) return () => {}

    const target = toValue(element)
    if (!target) return () => {}

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

  return { fadeUp, float, popIn, onEnter }
}
