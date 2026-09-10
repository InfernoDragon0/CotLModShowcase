<script setup lang="ts">
/**
 * Full-bleed hero: key art, a live Spine follower, and a black pennant band
 * carrying the headline and calls to action.
 */
const props = withDefaults(
  defineProps<{
    image: string
    eyebrow?: string
    title: string
    subtitle?: string
    /** Follower skin rendered in front of the art. */
    skin?: string
    animation?: string
    /** Hide the Spine render, for pages where the art already fills the frame. */
    noSpine?: boolean
  }>(),
  { skin: 'Cat', animation: 'idle', noSpine: false },
)

const root = ref<HTMLElement>()
const { fadeUp } = useCotlMotion()

onMounted(() => fadeUp('.hero-item'))
</script>

<template>
  <section
    ref="root"
    class="relative isolate flex min-h-[80vh] items-end overflow-hidden"
  >
    <NuxtImg
      :src="props.image"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 -z-20 h-full w-full object-cover"
      preload
    />
    <div
      class="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal-950 via-charcoal-950/50 to-charcoal-950/20"
      aria-hidden="true"
    />

    <SpineHero
      v-if="!noSpine"
      :skin="props.skin"
      :animation="props.animation"
      class="pointer-events-none absolute bottom-0 right-4 -z-10 w-64 sm:right-16 sm:w-80 lg:w-[26rem]"
    />

    <div class="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-32 lg:px-8">
      <PennantBanner class="hero-item max-w-2xl">
        <p
          v-if="eyebrow"
          class="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-crimson-400"
        >
          {{ eyebrow }}
        </p>
        <h1 class="text-4xl font-extrabold uppercase leading-none tracking-tight text-parchment-50 sm:text-6xl">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="mt-4 max-w-xl text-base text-parchment-200 sm:text-lg"
        >
          {{ subtitle }}
        </p>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <slot name="actions" />
        </div>
      </PennantBanner>
    </div>
  </section>
</template>
