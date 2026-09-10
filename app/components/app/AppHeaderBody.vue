<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

/**
 * Mobile menu body. Shows the site navigation first, then the documentation
 * tree that Docus renders here by default.
 */
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const links = useSiteNavigation()
</script>

<template>
  <div class="flex flex-col gap-6">
    <nav class="flex flex-col">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="py-2 text-sm font-semibold uppercase tracking-wide text-parchment-200 hover:text-crimson-400"
        active-class="text-crimson-400"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <USeparator />

    <UContentNavigation
      v-if="navigation?.length"
      :collapsible="false"
      :navigation="navigation"
      variant="link"
    />

    <DonateButtons />
  </div>
</template>
