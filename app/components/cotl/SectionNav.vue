<script setup lang="ts">
/**
 * Fixed rail of anchors down the right edge, tracking whichever section is
 * currently on screen.
 *
 * It is decoration for pointer users on wide screens - every destination is
 * also reachable by scrolling - so it is hidden below `lg` rather than
 * competing with the content on a phone.
 */
const props = defineProps<{
  sections: { id: string, label: string }[]
}>()

const { scrollToId } = useCotlMotion()
const active = ref(props.sections[0]?.id ?? '')
let observer: IntersectionObserver | undefined

onMounted(() => {
  // The band across the middle of the viewport decides what counts as current,
  // so a section is "active" while a reader is actually looking at it rather
  // than the moment its top edge appears.
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) active.value = visible.target.id
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
  )

  for (const { id } of props.sections) {
    const element = document.getElementById(id)
    if (element) observer.observe(element)
  }
})

onBeforeUnmount(() => observer?.disconnect())

function goTo(id: string) {
  scrollToId(id)
}
</script>

<template>
  <nav
    class="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    aria-label="Page sections"
  >
    <ul class="pointer-events-auto flex flex-col items-end gap-3">
      <li
        v-for="item in sections"
        :key="item.id"
      >
        <button
          type="button"
          class="group flex items-center gap-2.5 outline-none"
          :aria-current="active === item.id ? 'true' : undefined"
          @click="goTo(item.id)"
        >
          <span
            class="whitespace-nowrap text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            :class="active === item.id
              ? 'text-primary opacity-100'
              : 'text-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'"
          >{{ item.label }}</span>
          <span
            class="size-2.5 shrink-0 rotate-45 border transition-all duration-200"
            :class="active === item.id
              ? 'scale-125 border-crimson-400 bg-crimson-500'
              : 'border-parchment-500/60 bg-transparent group-hover:border-parchment-300'"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>
