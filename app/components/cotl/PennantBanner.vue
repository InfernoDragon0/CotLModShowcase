<script setup lang="ts">
/**
 * Black callout band with a red keyline and a pointed tail, as seen overlapping
 * the hero art on cultofthelamb.com.
 */
withDefaults(defineProps<{ point?: string }>(), { point: '2.5rem' })
</script>

<template>
  <div
    class="cotl-pennant"
    :style="{ '--pennant-point': point }"
  >
    <div class="px-6 py-5 pr-14 sm:px-10 sm:py-7 sm:pr-20">
      <slot />
    </div>
  </div>
</template>
