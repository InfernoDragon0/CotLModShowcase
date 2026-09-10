<script setup lang="ts">
/**
 * Replaces the Docus header centre (a search button) with the site navigation
 * plus a compact search trigger.
 */
const links = useSiteNavigation()
</script>

<template>
  <nav class="hidden w-full items-center justify-center gap-1 lg:flex">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-parchment-200 transition-colors hover:text-crimson-400"
      active-class="text-crimson-400"
    >
      {{ link.label }}
    </NuxtLink>

    <UContentSearchButton
      :collapsed="false"
      variant="soft"
      class="cotl-search ml-3 w-48"
      :ui="{ leadingIcon: 'size-4 mx-0.5' }"
    />
  </nav>
</template>
