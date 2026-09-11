<script setup lang="ts">
import { mods } from '~/data/mods'

definePageMeta({ layout: 'showcase' })

useSeoMeta({
  title: 'CotL Mods by InfernoDragon0',
  description:
    'CultTweaker, the Supercharged series, CotL MiniMods and the upcoming MP Steam co-op mod — mods for Cult of the Lamb, with full documentation and a follower skin builder.',
})

const grid = ref<HTMLElement>()
const { popIn, onEnter } = useCotlMotion()

onMounted(() => onEnter(grid, () => popIn('.mod-card')))
</script>

<template>
  <div>
    <HeroSection
      image="/images/cotlminimodsbanner.png"
      eyebrow="Mods for Cult of the Lamb"
      title="Reshape the Cult"
      subtitle="World editors, overpowered tarots, an army of followers and a hundred small conveniences. Built by InfernoDragon0."
      foreground="/images/minimods/icon.png"
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

    <SectionBlock
      title="Four families of mods"
      subtitle="Three are out now, free and built for the current version of Cult of the Lamb. The fourth is in closed testing."
      spines
      :spine-seed="11"
    >
      <div
        ref="grid"
        class="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
      >
        <ModFamilyCard
          v-for="mod in mods"
          :key="mod.slug"
          :mod="mod"
        />
      </div>
    </SectionBlock>

    <SectionBlock
      dark
      title="Skin Builder"
      subtitle="The skin builder builds in the new CultTweaker follower format. You can also convert old COTL JSONLoader skins into the CultTweaker follower form format, and previews the result on a live Spine skeleton directly in the page."
    >
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <ParchmentFrame :tilt="-1.5">
          <NuxtImg
            src="/images/culttweaker/customfollowerform.png"
            alt="A hand-drawn custom follower form"
            loading="lazy"
          />
        </ParchmentFrame>

        <div class="flex flex-col items-start gap-6">
          <ul class="flex flex-col gap-3 text-highlighted">
            <li class="flex gap-3">
              <UIcon name="i-lucide-import" class="mt-1 size-5 shrink-0 text-primary" />
              <span>Import a JSONLoader skin and its spritesheet, and have every part cropped for you.</span>
            </li>
            <li class="flex gap-3">
              <UIcon name="i-lucide-sliders-horizontal" class="mt-1 size-5 shrink-0 text-primary" />
              <span>Set slot, scale, rotation, offset and color choices per part.</span>
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
      title="Support the mods"
      subtitle="Every mod here is free. If you enjoyed them, consider donating! Thank you :3"
    >
      <DonateButtons />
    </SectionBlock>
  </div>
</template>
