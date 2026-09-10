<script setup lang="ts">
import type { Mod } from '~/data/mods'

defineProps<{ mod: Mod }>()
</script>

<template>
  <article
    class="mod-card group flex flex-col overflow-hidden border border-charcoal-700 bg-charcoal-900/80 transition-colors hover:border-crimson-600"
  >
    <NuxtLink
      :to="mod.page"
      class="relative block aspect-video overflow-hidden"
    >
      <NuxtImg
        :src="mod.hero"
        :alt="mod.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <span
        v-if="mod.badge"
        class="absolute left-0 top-4 bg-crimson-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black"
      >
        {{ mod.badge }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3 p-6">
      <h3 class="text-xl font-extrabold uppercase tracking-tight text-parchment-50">
        {{ mod.name }}
      </h3>
      <p class="text-sm font-semibold uppercase tracking-wide text-crimson-400">
        {{ mod.tagline }}
      </p>
      <p class="text-sm leading-relaxed text-parchment-300">
        {{ mod.description }}
      </p>

      <dl class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-parchment-400">
        <div class="flex gap-1">
          <dt class="font-semibold uppercase">
            Version
          </dt>
          <dd>{{ mod.version }}</dd>
        </div>
        <div class="flex gap-1">
          <dt class="font-semibold uppercase">
            Game
          </dt>
          <dd>{{ mod.gameVersion }}</dd>
        </div>
      </dl>

      <div class="mt-auto flex flex-wrap items-center gap-3 pt-4">
        <RibbonButton
          :to="mod.page"
          size="sm"
        >
          Explore
        </RibbonButton>
        <NuxtLink
          :to="mod.docs"
          class="text-xs font-semibold uppercase tracking-wide text-parchment-200 underline-offset-4 hover:text-crimson-400 hover:underline"
        >
          Documentation
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
