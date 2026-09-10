<script setup lang="ts">
/**
 * Full-bleed layout for the player-facing pages.
 *
 * Docus renders the header and footer around every layout, so this only needs
 * to drop the documentation container width and add the scroll rail.
 */
</script>

<template>
  <UMain class="cotl-ground-dark">
    <ScrollProgressBar />
    <slot />
  </UMain>
</template>
