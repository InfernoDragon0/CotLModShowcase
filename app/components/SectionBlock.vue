<script setup lang="ts">
/**
 * A page section on the charcoal paper ground, with an optional red heading
 * sitting on an ink splat.
 */
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    /** Use the darker ground, for alternating bands. */
    dark?: boolean
    /** Render followers along the bottom edge. */
    spines?: boolean
    spineSeed?: number
    id?: string
  }>(),
  { dark: false, spines: false, spineSeed: 7 },
)
</script>

<template>
  <section
    :id="id"
    class="relative overflow-hidden py-20 sm:py-28"
    :class="dark ? 'cotl-ground-dark' : 'cotl-ground'"
  >
    <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
      <header
        v-if="title"
        class="mb-12 max-w-3xl"
      >
        <h2 class="cotl-splat text-3xl font-extrabold uppercase tracking-tight text-primary sm:text-4xl">
          {{ title }}
        </h2>
        <p
          v-if="subtitle"
          class="mt-4 text-lg text-highlighted"
        >
          {{ subtitle }}
        </p>
      </header>

      <slot />
    </div>

    <BackgroundSpines
      v-if="spines"
      :seed="spineSeed"
      class="z-0 opacity-80"
    />
  </section>
</template>
