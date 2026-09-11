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
      subtitle="Twenty-four cards across three sets, dropped into the normal run pool. Collect them from the Wishing Well if you also run MiniMods."
    >
      <div
        ref="cardGrid"
        class="flex flex-col gap-12"
      >
        <div
          v-for="set in tarotSets"
          :key="set.key"
        >
          <h3 class="text-lg font-bold uppercase tracking-wide text-highlighted">
            {{ set.label }}
          </h3>
          <p class="mt-2 max-w-2xl text-sm text-default">
            {{ set.blurb }}
          </p>

          <ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <li
              v-for="card in set.cards"
              :key="card.name"
              class="tarot-card group flex flex-col items-center gap-3 border border-default bg-default/70 p-5 text-center transition-colors hover:border-secondary"
            >
              <!-- Sets 1 and 2 only have the small in-game sprite; the Unholy
                   Alliance set ships full card art, so it gets the room. -->
              <NuxtImg
                :src="card.image"
                alt=""
                aria-hidden="true"
                class="transition-transform duration-300 group-hover:scale-110"
                :class="set.art === 'card' ? 'w-full max-w-[11rem] rounded-sm' : 'size-16'"
                loading="lazy"
              />
              <h4 class="text-sm font-bold uppercase tracking-wide text-secondary">
                {{ card.name }}
              </h4>
              <span
                v-if="card.tag"
                class="-mt-1 border border-accented px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted"
              >
                {{ card.tag }}
              </span>
              <p class="text-xs leading-relaxed text-default">
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
          to="https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/Supercharged_Tarots_UA/"
          icon="i-lucide-package"
        >
          Unholy Alliance on Thunderstore
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
          class="border border-default bg-default/70 p-6"
        >
          <h3 class="text-base font-bold uppercase tracking-wide text-primary">
            {{ structure.title }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-default">
            {{ structure.description }}
          </p>
        </div>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <div
          v-for="group in followerBoosts"
          :key="group.key"
          class="border border-default bg-default/70 p-6"
        >
          <h3 class="text-base font-bold uppercase tracking-wide text-highlighted">
            {{ group.label }}
          </h3>
          <p class="mt-2 text-xs text-muted">
            {{ group.blurb }}
          </p>
          <dl class="mt-4 divide-y divide-default">
            <div
              v-for="entry in group.entries"
              :key="entry.title"
              class="flex items-baseline justify-between gap-4 py-2"
            >
              <dt class="text-sm font-semibold text-highlighted">
                {{ entry.title }}
              </dt>
              <dd class="text-right text-xs text-default">
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
