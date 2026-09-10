<script setup lang="ts">
/**
 * The thin red rail pinned to the right edge of the viewport whose height
 * tracks scroll progress, mirroring the game site's scroll indicator.
 */
const progress = ref(0)

function update() {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div
    class="pointer-events-none fixed inset-y-0 right-0 z-50 hidden w-1.5 bg-charcoal-900/60 lg:block"
    aria-hidden="true"
  >
    <div
      class="w-full bg-crimson-500 transition-[height] duration-150 ease-out"
      :style="{ height: `${progress * 100}%` }"
    />
  </div>
</template>
