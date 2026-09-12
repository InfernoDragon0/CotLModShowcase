<script setup lang="ts">
import { features, editorTools, hotkeys, screenshots } from '~/data/culttweaker'
import { findMod } from '~/data/mods'

definePageMeta({ layout: 'showcase' })

const mod = findMod('culttweaker')!

useSeoMeta({
  title: 'CultTweaker — build your own Cult of the Lamb',
  description: mod.description,
})

const featureGrid = ref<HTMLElement>()
const { popIn, onEnter } = useCotlMotion()

onMounted(() => onEnter(featureGrid, () => popIn('.feature-card')))

const activeShot = ref(0)
</script>

<template>
  <div>
    <HeroSection
      image="/images/culttweaker/1.png"
      eyebrow="CultTweaker 2.0 · pre-release 6"
      title="CultTweaker"
      subtitle="An in-game world editor, custom dungeons, custom spines, weapons, NPCs and quests. For Cult of the Lamb 1.5.26."
      :foreground="mod.logo"
    >
      <template #actions>
        <RibbonButton
          to="https://www.nexusmods.com/cultofthelamb/mods/49"
          icon="i-lucide-download"
          size="lg"
        >
          Download
        </RibbonButton>
        <RibbonButton
          to="/docs/culttweaker"
          ghost
          size="lg"
        >
          Documentation
        </RibbonButton>
      </template>
    </HeroSection>

    <SectionBlock
      title="Customize Everything"
      subtitle="CultTweaker started as a Spine loader. It is now a full modding toolkit for the game."
    >
      <div
        ref="featureGrid"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="feature in features"
          :key="feature.title"
          :to="feature.to"
          class="feature-card flex flex-col gap-3 border border-default bg-default/70 p-6 transition-colors hover:border-primary"
        >
          <UIcon
            :name="feature.icon"
            class="size-7 text-primary"
          />
          <h3 class="text-base font-bold uppercase tracking-wide text-highlighted">
            {{ feature.title }}
          </h3>
          <p class="text-sm leading-relaxed text-default">
            {{ feature.description }}
          </p>
        </NuxtLink>
      </div>
    </SectionBlock>

    <SectionBlock
      dark
      title="The Worldshaper"
      subtitle="Press F4 anywhere in the game and start building. Sixteen tools, a layers panel, groups and undo."
    >
      <div class="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <li
              v-for="tool in editorTools"
              :key="tool.name"
              class="flex items-start gap-3 border border-default bg-default/60 p-3"
            >
              <NuxtImg
                :src="`/images/culttweaker/editor-icons/${tool.icon}`"
                :alt="''"
                aria-hidden="true"
                class="size-8 shrink-0"
                loading="lazy"
              />
              <div>
                <p class="text-sm font-bold uppercase text-highlighted">
                  {{ tool.name }}
                </p>
                <p class="mt-1 text-xs leading-snug text-muted">
                  {{ tool.description }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-primary">
            Hotkeys
          </h3>
          <dl class="divide-y divide-default border border-default">
            <div
              v-for="key in hotkeys"
              :key="key.keys"
              class="flex items-center justify-between gap-4 px-4 py-2.5"
            >
              <dt>
                <kbd class="rounded bg-elevated px-2 py-1 font-mono text-xs text-highlighted">{{ key.keys }}</kbd>
              </dt>
              <dd class="text-right text-xs text-default">
                {{ key.action }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      title="Features"
      subtitle="Read more about the features in the documentations! These are just a few of the highlights."
      spines
      :spine-seed="23"
    >
      <div class="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ParchmentFrame :tilt="-0.8">
          <NuxtImg
            :src="screenshots[activeShot]!.src"
            :alt="screenshots[activeShot]!.alt"
            loading="lazy"
          />
        </ParchmentFrame>

        <ul class="flex flex-col gap-2">
          <li
            v-for="(shot, index) in screenshots"
            :key="shot.src"
          >
            <button
              type="button"
              class="w-full px-4 py-3 text-left text-sm transition-colors"
              :class="index === activeShot
                ? 'cotl-ribbon !justify-start !px-6'
                : 'border border-default text-highlighted hover:border-primary hover:text-highlighted'"
              @click="activeShot = index"
            >
              {{ shot.alt }}
            </button>
          </li>
        </ul>
      </div>
    </SectionBlock>

    <SectionBlock
      dark
      title="Get CultTweaker"
      subtitle="Nexus Mods stable releases, if you want to try out the pre-release, DM @InfernoDragon1 on Discord"
    >
      <div class="flex flex-wrap items-center gap-4">
        <RibbonButton
          v-for="link in mod.links"
          :key="link.to"
          :to="link.to"
          :icon="link.icon"
          size="lg"
        >
          {{ link.label }}
        </RibbonButton>
        <RibbonButton
          to="/docs/culttweaker/installation"
          ghost
          size="lg"
        >
          Installation guide
        </RibbonButton>
      </div>
    </SectionBlock>
  </div>
</template>
