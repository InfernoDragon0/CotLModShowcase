<script setup lang="ts">
import { minimodGroups, trials, augments } from '~/data/minimods'
import { findMod } from '~/data/mods'

definePageMeta({
  layout: 'showcase',
  // The showcase is designed in the dark; only the documentation switches.
  colorMode: 'dark',
})

const mod = findMod('minimods')!

useSeoMeta({
  title: 'CotL MiniMods — custom structures, roles and rituals',
  description: mod.description,
})

const tabs = computed(() =>
  minimodGroups.map(group => ({
    label: group.label,
    value: group.key,
  })),
)

const active = ref(minimodGroups[0]!.key)
const current = computed(() => minimodGroups.find(group => group.key === active.value)!)

const { popIn } = useCotlMotion()

watch(active, async () => {
  await nextTick()
  popIn('.minimod-card')
})

onMounted(() => popIn('.minimod-card'))
</script>

<template>
  <div>
    <HeroSection
      image="/images/cotlminimodsbanner.png"
      eyebrow="CotL MiniMods 1.3.3"
      title="Trial of the Gods"
      subtitle="Lots of custom things including structures, rituals, follower commands, and trial of the gods."
      :foreground="mod.logo"
    >
      <template #actions>
        <RibbonButton
          to="https://www.nexusmods.com/cultofthelamb/mods/12"
          icon="i-lucide-download"
          size="lg"
        >
          Download
        </RibbonButton>
        <RibbonButton to="/docs/minimods" ghost size="lg">
          Documentation
        </RibbonButton>
      </template>
    </HeroSection>

    <SectionBlock
      title="Features"
      subtitle="Pick a category to browse everything MiniMods brings to your cult."
    >
      <UTabs
        v-model="active"
        :items="tabs"
        color="primary"
        variant="link"
        class="mb-8"
      />

      <p class="mb-8 max-w-2xl text-sm text-default">
        {{ current.blurb }}
      </p>

      <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="entry in current.entries"
          :key="entry.slug"
          class="minimod-card flex gap-4 border border-default bg-default/70 p-5 transition-colors hover:border-primary"
        >
          <NuxtImg
            :src="entry.icon"
            alt=""
            aria-hidden="true"
            class="size-12 shrink-0 object-contain"
            loading="lazy"
          />
          <div>
            <h3 class="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wide text-highlighted">
              {{ entry.title }}
              <UBadge
                v-if="entry.since"
                color="primary"
                variant="solid"
                size="sm"
              >
                {{ entry.since }}
              </UBadge>
            </h3>
            <p class="mt-2 text-xs leading-relaxed text-default">
              {{ entry.description }}
            </p>
          </div>
        </li>
      </ul>
    </SectionBlock>

    <SectionBlock
      dark
      title="Trial of the Gods"
      subtitle="Build a Infernal Infuser, then stack any number of Trials and Augments. They can all be active at once."
      spines
      :spine-seed="43"
    >
      <div class="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-primary">
            Trials
          </h3>
          <ul class="flex flex-col gap-4">
            <li
              v-for="trial in trials"
              :key="trial.title"
              class="border-l-2 border-crimson-600 bg-default/60 py-3 pl-4 pr-4"
            >
              <h4 class="text-sm font-bold uppercase text-highlighted">
                {{ trial.title }}
              </h4>
              <p class="mt-1.5 text-xs leading-relaxed text-default">
                {{ trial.description }}
              </p>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wide text-secondary">
            Augments
          </h3>
          <dl class="divide-y divide-default border border-default">
            <div
              v-for="augment in augments"
              :key="augment.title"
              class="px-4 py-3"
            >
              <dt class="text-xs font-bold uppercase text-secondary">
                {{ augment.title }}
              </dt>
              <dd class="mt-1 text-xs text-default">
                {{ augment.description }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock title="Get MiniMods">
      <div class="flex flex-wrap gap-4">
        <RibbonButton
          v-for="link in mod.links"
          :key="link.to"
          :to="link.to"
          :icon="link.icon"
          size="lg"
        >
          {{ link.label }}
        </RibbonButton>
      </div>
    </SectionBlock>
  </div>
</template>
