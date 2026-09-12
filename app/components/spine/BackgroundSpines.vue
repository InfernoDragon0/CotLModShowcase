<script setup lang="ts">
/**
 * A row of idling followers along the bottom of a section, echoing the
 * scattered cult members on the Cult of the Lamb site.
 *
 * Decorative only: it never captures pointer events and is hidden from
 * assistive technology.
 */
const props = withDefaults(
  defineProps<{
    /** How many followers to place. */
    count?: number
    /** Seed so a given section always renders the same line-up. */
    seed?: number
  }>(),
  { count: 6, seed: 7 },
)

const SKINS = [
  'Cat', 'Dog', 'Fox', 'Deer', 'Rabbit', 'Bear', 'Owl', 'Duck',
  'Frog', 'Pig', 'Cow', 'Horse', 'Otter', 'Squirrel', 'Crow', 'Lion',
]

const IDLE_ANIMATIONS = ['idle', 'dance', 'pray', 'cheer', 'wave', 'meditate', 'worship', 'prance']

/** Deterministic pseudo-random so server and client agree on the line-up. */
function makeRandom(seed: number) {
  let state = seed * 9301 + 49297
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

const actors = computed<StageActor[]>(() => {
  const random = makeRandom(props.seed)
  return Array.from({ length: props.count }, (_, index) => {
    const lane = (index + 0.5) / props.count
    return {
      skin: SKINS[Math.floor(random() * SKINS.length)]!,
      animation: IDLE_ANIMATIONS[Math.floor(random() * IDLE_ANIMATIONS.length)]!,
      x: lane + (random() - 0.5) * 0.06,
      y: 0.12 + random() * 0.16,
      scale: 0.6 + random() * 0.35,
      offset: random() * 4,
      flip: random() > 0.5,
    }
  })
})
</script>

<template>
  <SpineStage
    :actors="actors"
    :ratio="6"
    class="pointer-events-none absolute inset-x-0 bottom-0 select-none"
  />
</template>
