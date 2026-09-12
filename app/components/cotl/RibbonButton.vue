<script setup lang="ts">
/**
 * The red notched ribbon used for primary calls to action, matching the
 * "Watch Trailer" banner on cultofthelamb.com.
 *
 * Renders a NuxtLink for internal paths, an <a> for external URLs and a
 * <button> when no destination is given.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    icon?: string
    /** Square off the left end, for ribbons flush against a container edge. */
    flushStart?: boolean
    /** Cream outline instead of solid red. */
    ghost?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { size: 'md' },
)

const isExternal = computed(() => !!props.to && /^(https?:)?\/\//.test(props.to))

const component = computed(() => {
  if (!props.to) return 'button'
  return isExternal.value ? 'a' : resolveComponent('NuxtLink')
})

const attrs = computed(() => {
  if (!props.to) return { type: 'button' as const }
  return isExternal.value
    ? { href: props.to, target: '_blank', rel: 'noopener' }
    : { to: props.to }
})

const sizeClass = {
  sm: 'text-xs px-5 py-1.5',
  md: 'text-sm px-7 py-2.5',
  lg: 'text-base px-9 py-3',
}
</script>

<template>
  <component
    :is="component"
    v-bind="attrs"
    class="cotl-ribbon uppercase"
    :class="[
      sizeClass[size],
      { 'cotl-ribbon-start': flushStart, 'cotl-ribbon-ghost': ghost },
    ]"
  >
    <UIcon
      v-if="icon"
      :name="icon"
      class="size-4 shrink-0"
    />
    <slot />
  </component>
</template>
