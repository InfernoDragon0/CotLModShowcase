<script setup lang="ts">
import type { Mod } from '~/data/mods'

defineProps<{ mod: Mod }>()
</script>

<template>
  <article
    class="mod-card group flex flex-col overflow-hidden border border-default bg-default/80 transition-colors hover:border-primary"
  >
    <NuxtLink
      :to="mod.page"
      class="relative block aspect-video overflow-hidden"
    >
      <NuxtImg
        v-if="mod.hero"
        :src="mod.hero"
        :alt="mod.name"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- No key art yet: stand the logo on the paper ground instead. -->
      <div
        v-else
        class="cotl-ground-dark flex h-full w-full items-center justify-center"
      >
        <NuxtImg
          :src="mod.logo"
          :alt="mod.name"
          class="size-24 object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <span
        v-if="mod.badge"
        class="absolute left-0 top-4 bg-crimson-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-parchment-50"
      >
        {{ mod.badge }}
      </span>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-3 p-6">
      <h3 class="text-xl font-extrabold uppercase tracking-tight text-highlighted">
        {{ mod.name }}
      </h3>
      <p class="text-sm font-semibold uppercase tracking-wide text-primary">
        {{ mod.tagline }}
      </p>
      <p class="text-sm leading-relaxed text-default">
        {{ mod.description }}
      </p>

      <dl class="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
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
          class="text-xs font-semibold uppercase tracking-wide text-highlighted underline-offset-4 hover:text-primary hover:underline"
        >
          Documentation
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
