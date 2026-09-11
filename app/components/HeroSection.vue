<script setup lang="ts">
/**
 * Full-bleed hero: key art, a live Spine follower, and the headline set
 * straight onto the art. Legibility comes from the scrims below plus the
 * `.cotl-hero-text` shadow, so the copy can breathe across the whole frame.
 */
const props = withDefaults(
  defineProps<{
    /** Key art. Without it the hero falls back to the paper ground. */
    image?: string
    eyebrow?: string
    title: string
    subtitle?: string
    /** Follower skin rendered in front of the art. */
    skin?: string
    animation?: string
    /** Artwork to stand in front of the key art instead of the follower. */
    foreground?: string
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
    class="relative isolate flex min-h-[70vh] items-end overflow-hidden"
  >
    <NuxtImg
      v-if="props.image"
      :src="props.image"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 -z-20 h-full w-full object-cover"
      preload
    />
    <div
      v-else
      class="cotl-ground-dark absolute inset-0 -z-20"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 -z-10 bg-linear-to-t from-charcoal-950 via-charcoal-950/55 to-charcoal-950/15"
      aria-hidden="true"
    />
    <!-- Side scrim: keeps the copy readable wherever the art is bright. -->
    <div
      class="absolute inset-0 -z-10 bg-linear-to-r from-charcoal-950/85 via-charcoal-950/35 to-transparent"
      aria-hidden="true"
    />

    <!-- A page can put its own mark where the follower usually stands. Centred
         on the frame rather than sitting on the bottom edge, so it reads as
         placed artwork instead of something the crop cut off, and held near its
         native 226px so it stays crisp. -->
    <NuxtImg
      v-if="props.foreground"
      :src="props.foreground"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute right-6 top-1/2 -z-10 w-36 -translate-y-1/2 sm:right-12 sm:w-44 lg:right-20 lg:w-56"
    />
    <SpineHero
      v-else-if="!noSpine"
      :skin="props.skin"
      :animation="props.animation"
      class="pointer-events-none absolute bottom-0 right-4 -z-10 w-64 sm:right-16 sm:w-80 lg:w-[26rem]"
    />

    <div class="cotl-hero-text relative mx-auto w-full max-w-7xl px-6 pb-20 pt-32 lg:px-8">
      <p
        v-if="eyebrow"
        class="hero-item mb-3 text-xs font-bold uppercase tracking-[0.25em] text-crimson-400 sm:text-sm"
      >
        {{ eyebrow }}
      </p>
      <h1 class="hero-item max-w-4xl text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-parchment-200 sm:text-7xl lg:text-8xl">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="hero-item mt-6 max-w-2xl text-base text-parchment-200 sm:text-lg"
      >
        {{ subtitle }}
      </p>

      <div class="hero-item mt-8 flex flex-wrap items-center gap-4">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
