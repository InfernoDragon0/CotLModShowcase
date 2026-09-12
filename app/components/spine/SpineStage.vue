<script setup lang="ts">
/**
 * A transparent canvas that renders one or more followers.
 *
 * Rendering starts only when the canvas scrolls into view, and is skipped
 * entirely when the visitor prefers reduced motion or WebGL is unavailable —
 * the default slot content is shown instead.
 */
const props = withDefaults(
  defineProps<{
    actors: StageActor[]
    /** Aspect ratio of the canvas box, width / height. */
    ratio?: number
    class?: string
  }>(),
  { ratio: 16 / 9 },
)

const canvas = ref<HTMLCanvasElement>()
const root = ref<HTMLElement>()
const enabled = ref(false)

const { start, ready, failed } = useSpineStage(canvas, () => props.actors)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!supportsSpine() || prefersReducedMotion()) return
  enabled.value = true

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer?.disconnect()
        observer = null
        start()
      }
    },
    { rootMargin: '200px' },
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => observer?.disconnect())

const showFallback = computed(() => !enabled.value || failed.value)
</script>

<template>
  <div
    ref="root"
    :class="props.class"
    :style="{ aspectRatio: String(ratio) }"
  >
    <canvas
      v-show="enabled && !failed"
      ref="canvas"
      class="h-full w-full"
      :class="{ 'opacity-0': !ready }"
      aria-hidden="true"
    />
    <slot v-if="showFallback" name="fallback" />
  </div>
</template>
