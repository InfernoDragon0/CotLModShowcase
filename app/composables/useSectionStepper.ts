/**
 * Turns one scroll gesture into one section.
 *
 * CSS scroll snapping cannot do this on its own: `mandatory` snaps to the
 * *nearest* snap point when a gesture ends, so a single wheel notch of ~120px
 * is still closest to the section you started on and the page springs back.
 * This intercepts the gesture instead and tweens to the next section along.
 *
 * Deliberately narrow in scope:
 * - only while a fine pointer and a tall enough window are present, so touch
 *   devices and short screens keep ordinary scrolling;
 * - only between the listed sections, so the page below them (the skin builder
 *   and support blocks) scrolls normally;
 * - only when the current section actually fits on screen, so a section taller
 *   than the window can still be read to its end.
 */
export function useSectionStepper(ids: MaybeRefOrGetter<string[]>) {
  if (import.meta.server) return

  const { scrollToId } = useCotlMotion()
  const HEADER = 72
  /** Long enough to cover the tween, so one flick cannot fire twice. */
  const LOCK_MS = 700

  let locked = false
  let unlock: ReturnType<typeof setTimeout> | undefined

  function sections() {
    return toValue(ids)
      .map(id => ({ id, element: document.getElementById(id) }))
      .filter((entry): entry is { id: string, element: HTMLElement } => !!entry.element)
  }

  function eligible() {
    return window.matchMedia('(pointer: fine)').matches && window.innerHeight >= 700
  }

  /** The section whose top edge is at or above the header line. */
  function currentIndex(list: ReturnType<typeof sections>) {
    let index = 0
    list.forEach((entry, i) => {
      if (entry.element.getBoundingClientRect().top - HEADER <= 2) index = i
    })
    return index
  }

  function step(direction: 1 | -1) {
    const list = sections()
    if (!list.length) return false

    const index = currentIndex(list)
    const current = list[index]!
    const next = list[index + direction]

    // Past either end of the run: hand the gesture back to the browser.
    if (!next) return false

    // A section taller than the window has content below the fold; let the
    // reader reach it before moving on.
    const rect = current.element.getBoundingClientRect()
    if (rect.height > window.innerHeight) {
      const atEnd = direction === 1
        ? rect.bottom <= window.innerHeight + 4
        : rect.top >= HEADER - 4
      if (!atEnd) return false
    }

    locked = true
    clearTimeout(unlock)
    unlock = setTimeout(() => { locked = false }, LOCK_MS)

    scrollToId(next.id, HEADER)
    return true
  }

  function onWheel(event: WheelEvent) {
    if (!eligible() || event.ctrlKey) return

    if (locked) {
      event.preventDefault()
      return
    }

    // Ignore the tail of a trackpad flick and sideways scrolling.
    if (Math.abs(event.deltaY) < 4 || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return

    if (step(event.deltaY > 0 ? 1 : -1)) event.preventDefault()
  }

  function onKey(event: KeyboardEvent) {
    if (!eligible()) return
    if (event.key !== 'PageDown' && event.key !== 'PageUp') return

    const target = event.target as HTMLElement | null
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return

    if (step(event.key === 'PageDown' ? 1 : -1)) event.preventDefault()
  }

  onMounted(() => {
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
  })

  onBeforeUnmount(() => {
    clearTimeout(unlock)
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('keydown', onKey)
  })
}
