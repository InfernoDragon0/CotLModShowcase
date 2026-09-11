<script setup lang="ts">
import { features, howItRuns, requirements } from '~/data/mpsteam'
import { findMod } from '~/data/mods'

definePageMeta({ layout: 'showcase' })

const mod = findMod('mpsteam')!

useSeoMeta({
  title: 'COTL MP Steam — online co-op for Cult of the Lamb',
  description: mod.description,
})

const featureGrid = ref<HTMLElement>()
const { popIn, onEnter } = useCotlMotion()

onMounted(() => onEnter(featureGrid, () => popIn('.feature-card')))
</script>

<template>
  <div>
    <HeroSection
      eyebrow="Coming soon · closed test build 0.1.0"
      title="Two lambs, one cult"
      subtitle="COTL MP Steam brings online two-player co-op to Cult of the Lamb over Steam peer-to-peer. Host on your own save, invite a friend, and run the whole game together."
      skin="Dog"
      animation="wave"
    >
      <template #actions>
        <RibbonButton
          to="https://discord.gg/MUjww9ndx2"
          icon="i-simple-icons-discord"
          size="lg"
        >
          Join the test
        </RibbonButton>
        <RibbonButton
          to="/docs/mpsteam"
          ghost
          size="lg"
        >
          Read the notes
        </RibbonButton>
      </template>
    </HeroSection>

    <SectionBlock
      title="Not out yet"
      subtitle="MP Steam is an experimental build handed out to testers, not a public release. There is no download link here on purpose."
    >
      <div class="flex flex-col gap-4 border-l-4 border-crimson-600 bg-default/70 p-6 text-highlighted">
        <p>
          Plenty already works end to end — you can clear a dungeon, fight a boss
          and run the base together — but plenty is still unsynced, and the mod
          files are not shared publicly while that is true.
        </p>
        <p class="text-sm text-muted">
          Back up your saves before any test session. Only the host's save is
          written to, and both players need the same game version and the same
          mods to connect.
        </p>
      </div>
    </SectionBlock>

    <SectionBlock
      dark
      title="What already works"
      subtitle="Everything below is in the 0.1.0 test build."
    >
      <div
        ref="featureGrid"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="feature in features"
          :key="feature.title"
          class="feature-card flex flex-col gap-3 border border-default bg-default/70 p-6"
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
        </article>
      </div>
    </SectionBlock>

    <SectionBlock
      title="How a session runs"
      spines
      :spine-seed="31"
    >
      <div class="grid gap-8 md:grid-cols-2">
        <div
          v-for="side in howItRuns"
          :key="side.role"
          class="border border-default bg-default/70 p-6"
        >
          <div class="mb-4 flex items-center gap-3">
            <UIcon
              :name="side.icon"
              class="size-6 text-primary"
            />
            <h3 class="text-lg font-extrabold uppercase tracking-wide text-highlighted">
              {{ side.role }}
            </h3>
          </div>
          <ol class="flex flex-col gap-3">
            <li
              v-for="(step, index) in side.steps"
              :key="step"
              class="flex gap-3 text-sm leading-relaxed text-highlighted"
            >
              <span class="mt-0.5 size-6 shrink-0 bg-crimson-600 text-center text-xs font-bold leading-6 text-parchment-50">
                {{ index + 1 }}
              </span>
              <span>{{ step }}</span>
            </li>
          </ol>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      dark
      title="What you need"
      subtitle="Both machines have to match before the lobby will let you in."
    >
      <div class="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <ul class="flex flex-col gap-3">
          <li
            v-for="item in requirements"
            :key="item"
            class="flex gap-3 text-highlighted"
          >
            <UIcon
              name="i-lucide-check"
              class="mt-1 size-5 shrink-0 text-primary"
            />
            <span>{{ item }}</span>
          </li>
        </ul>

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
        </div>
      </div>
    </SectionBlock>
  </div>
</template>
