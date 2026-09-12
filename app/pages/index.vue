<script setup lang="ts">
import { mods } from '~/data/mods'

definePageMeta({
  layout: 'showcase',
  // The showcase is designed in the dark; only the documentation switches.
  colorMode: 'dark',
})

// One wheel gesture moves one section, across the hero and the four mods. The
// skin builder and support blocks below are left to scroll normally.
useSectionStepper(() => ['top', ...mods.map(mod => mod.slug)])

useSeoMeta({
  title: 'CotL Mods by InfernoDragon0',
  description:
    'CultTweaker, the Supercharged series, CotL MiniMods and the upcoming MP Steam co-op mod — mods for Cult of the Lamb, with full documentation and a follower skin builder.',
})

/**
 * The card Discord and Twitter unfurl, drawn to look like the hero above it.
 *
 * Only this route renders one — see the `ogImage` note in `nuxt.config.ts` for
 * why the rest of the site keeps a static image instead.
 */
defineOgImage('Hero', {
  eyebrow: 'Mods for Cult of the Lamb',
  title: 'Reshape your Cult',
  subtitle: 'World editors, overpowered tarots, an army of followers and lots of custom content.',
}, {
  // The module declares 1200x600 by default; the card is drawn at the 1.91:1
  // Discord and Twitter ask for, so the declared size has to follow it or the
  // unfurl reserves the wrong box.
  height: 630,
  alt: 'Reshape your Cult - mods for Cult of the Lamb by InfernoDragon0',
})

/** Destinations for the rail on the right, in the order they appear. */
const navSections = computed(() => [
  { id: 'top', label: 'Top' },
  ...mods.map(mod => ({ id: mod.slug, label: mod.name })),
  { id: 'builder', label: 'Skin builder' },
  { id: 'support', label: 'Support' },
])
</script>

<template>
  <div>
    <HeroSection
      id="top"
      image="/images/cotlminimodsbanner.png"
      eyebrow="Mods for Cult of the Lamb"
      title="Reshape your Cult"
      subtitle="World editors, overpowered tarots, an army of followers and lots of custom content. Built by InfernoDragon0."
      foreground="/images/minimods/icon.png"
      :scroll-to="mods[0]?.slug"
    >
      <template #actions>
        <RibbonButton to="/mods/culttweaker" size="lg">
          Explore the mods
        </RibbonButton>
        <RibbonButton to="/docs" ghost size="lg">
          Read the docs
        </RibbonButton>
      </template>
    </HeroSection>

    <!-- One section per mod, each anchored on its slug. -->
    <ModShowcase
      v-for="(mod, index) in mods"
      :key="mod.slug"
      :mod="mod"
      :index="index"
      :total="mods.length"
    />

    <SectionBlock
      id="builder"
      dark
      title="Skin Builder Online"
      subtitle="CultTweaker's Skin builder but in the browser! The skin builder builds in the new CultTweaker follower format."
    >
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <!-- Same framing and 16:9 crop as the gallery shots in the mod
             sections above, so the page keeps one shape for screenshots. -->
        <ParchmentFrame :tilt="-1.5">
          <MediaSlot
            size="feature"
            :shot="{
              src: '/images/culttweaker/image.png',
              alt: 'A follower form being edited slot by slot, the same format the browser builder exports',
            }"
          />
        </ParchmentFrame>

        <div class="flex flex-col items-start gap-6">
          <ul class="flex flex-col gap-3 text-highlighted">
            <li class="flex gap-3">
              <UIcon name="i-lucide-import" class="mt-1 size-5 shrink-0 text-primary" />
              <span>Create new skins from scratch!</span>
            </li>
            <li class="flex gap-3">
              <UIcon name="i-lucide-sliders-horizontal" class="mt-1 size-5 shrink-0 text-primary" />
              <span>Convert old COTL JSONLoader skins into the new CultTweaker format.</span>
            </li>
            <li class="flex gap-3">
              <UIcon name="i-lucide-eye" class="mt-1 size-5 shrink-0 text-primary" />
              <span>Live Preview available, and export a usable skin to game.</span>
            </li>
          </ul>

          <RibbonButton to="/builder" size="lg">
            Open the skin builder
          </RibbonButton>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      id="support"
      title="Support the mods"
      subtitle="Every mod here is free. If you enjoyed them, consider donating! Thank you :3"
    >
      <DonateButtons />
    </SectionBlock>

    <SectionNav :sections="navSections" />
  </div>
</template>
