<script setup lang="ts">
import { tarotSets, followerBoosts, followerStructures } from '~/data/supercharged'
import { findMod } from '~/data/mods'

definePageMeta({ layout: 'showcase' })

const mod = findMod('supercharged')!

useSeoMeta({
  title: 'Supercharged Series — tarots and followers',
  description: mod.description,
})

const cardGrid = ref<HTMLElement>()
const { popIn, onEnter } = useCotlMotion()

onMounted(() => onEnter(cardGrid, () => popIn('.tarot-card')))
</script>

<template>
  <div>
    <HeroSection
      image="/images/tarots.png"
      eyebrow="Supercharged Series"
      title="Unleash the Lamb"
      subtitle="Absurdly powerful tarot cards, and a flock that fights beside you."
      skin="Lion"
      animation="cheer"
    >
      <template #actions>
        <RibbonButton to="#tarots" size="lg">
          Tarots
        </RibbonButton>
        <RibbonButton to="#followers" ghost size="lg">
          Followers
        </RibbonButton>
      </template>
    </HeroSection>

    <SectionBlock
      id="tarots"
      title="Supercharged Tarots"
      subtitle="Fourteen cards across two sets, dropped into the normal run pool. Collect them from the Wishing Well if you also run MiniMods."
    >
      <div
        ref="cardGrid"
        class="flex flex-col gap-12"
      >
        <div
          v-for="set in tarotSets"
          :key="set.key"
        >
          <h3 class="text-lg font-bold uppercase tracking-wide text-parchment-50">
            {{ set.label }}
          </h3>
          <p class="mt-2 max-w-2xl text-sm text-parchment-300">
            {{ set.blurb }}
          </p>

          <ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <li
              v-for="card in set.cards"
              :key="card.name"
              class="tarot-card group flex flex-col items-center gap-3 border border-charcoal-700 bg-charcoal-900/70 p-5 text-center transition-colors hover:border-gold-500"
            >
              <NuxtImg
                :src="card.image"
                alt=""
                aria-hidden="true"
                class="size-16 transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <h4 class="text-sm font-bold uppercase tracking-wide text-gold-400">
                {{ card.name }}
              </h4>
              <p class="text-xs leading-relaxed text-parchment-300">
                {{ card.description }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <RibbonButton
          to="https://www.nexusmods.com/cultofthelamb/mods/20"
          icon="i-lucide-download"
        >
          Tarots on NexusMods
        </RibbonButton>
        <RibbonButton
          to="/docs/supercharged/tarots"
          ghost
        >
          Tarot documentation
        </RibbonButton>
      </div>
    </SectionBlock>

    <SectionBlock
      id="followers"
      dark
      title="Supercharged Followers"
      subtitle="Rally your flock into the dungeon. Equip them, class them, and push them through ten prestige ranks."
      spines
      :spine-seed="31"
    >
      <div class="grid gap-6 md:grid-cols-3">
        <div
          v-for="structure in followerStructures"
          :key="structure.title"
          class="border border-charcoal-700 bg-charcoal-950/70 p-6"
        >
          <h3 class="text-base font-bold uppercase tracking-wide text-crimson-400">
            {{ structure.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-parchment-300">
            {{ structure.description }}
          </p>
        </div>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <div
          v-for="group in followerBoosts"
          :key="group.key"
          class="border border-charcoal-700 bg-charcoal-950/70 p-6"
        >
          <h3 class="text-base font-bold uppercase tracking-wide text-parchment-50">
            {{ group.label }}
          </h3>
          <p class="mt-2 text-xs text-parchment-400">
            {{ group.blurb }}
          </p>
          <dl class="mt-4 divide-y divide-charcoal-800">
            <div
              v-for="entry in group.entries"
              :key="entry.title"
              class="flex items-baseline justify-between gap-4 py-2"
            >
              <dt class="text-sm font-semibold text-parchment-100">
                {{ entry.title }}
              </dt>
              <dd class="text-right text-xs text-parchment-300">
                {{ entry.description }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap gap-4">
        <RibbonButton
          to="https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/SuperchargedFollowers/"
          icon="i-lucide-package"
        >
          Followers on Thunderstore
        </RibbonButton>
        <RibbonButton
          to="/docs/supercharged/followers"
          ghost
        >
          Follower documentation
        </RibbonButton>
      </div>
    </SectionBlock>
  </div>
</template>
