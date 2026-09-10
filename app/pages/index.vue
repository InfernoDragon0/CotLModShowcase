<script setup lang="ts">
import { mods } from '~/data/mods'

definePageMeta({ layout: 'showcase' })

useSeoMeta({
  title: 'CotL Mods by InfernoDragon0',
  description:
    'CultTweaker, the Supercharged series and CotL MiniMods — mods for Cult of the Lamb, with full documentation and a follower skin builder.',
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
      skin="Cat"
      animation="dance"
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
      title="Three families of mods"
      subtitle="Every mod is free, open source and built for the current version of Cult of the Lamb."
      spines
      :spine-seed="11"
    >
      <div
        ref="grid"
        class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
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
      title="Make a follower your own"
      subtitle="The skin builder converts old COTL JSONLoader skins into the CultTweaker follower form format, and previews the result on a live Spine skeleton before you ever launch the game."
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
          <ul class="flex flex-col gap-3 text-parchment-200">
            <li class="flex gap-3">
              <UIcon name="i-lucide-import" class="mt-1 size-5 shrink-0 text-crimson-400" />
              <span>Import a JSONLoader skin and its spritesheet, and have every part cropped for you.</span>
            </li>
            <li class="flex gap-3">
              <UIcon name="i-lucide-sliders-horizontal" class="mt-1 size-5 shrink-0 text-crimson-400" />
              <span>Set slot, scale, rotation, offset and colour choices per part.</span>
            </li>
            <li class="flex gap-3">
              <UIcon name="i-lucide-eye" class="mt-1 size-5 shrink-0 text-crimson-400" />
              <span>Watch the follower animate with your art applied, then export a ready-to-drop zip.</span>
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
      subtitle="Every mod here is free. If they made your cult better, a donation keeps them coming."
    >
      <DonateButtons />
    </SectionBlock>
  </div>
</template>
