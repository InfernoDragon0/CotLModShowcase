<script setup lang="ts">
/** Torn cream paper border around screenshots and videos. */
withDefaults(defineProps<{ tilt?: number }>(), { tilt: -1 })
</script>

<template>
  <div
    class="cotl-frame"
    :style="{ '--frame-tilt': `${tilt}deg` }"
  >
    <slot />
  </div>
</template>
