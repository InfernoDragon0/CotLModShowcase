<script setup lang="ts">
import type { Mod } from '~/data/mods'

/**
 * A full section given over to one mod: its key art drifting behind, its
 * screenshots beside the copy, and the whole thing assembling itself as the
 * reader arrives.
 *
 * Sections alternate sides so a run of four does not read as one long column,
 * and each one anchors on the mod's slug for the rail on the right.
 */
const props = withDefaults(
  defineProps<{
    mod: Mod
    /** Position in the run, used for the counter and the alternating layout. */
    index: number
    total: number
  }>(),
  {},
)

const section = ref<HTMLElement>()
const backdrop = ref<HTMLElement>()

const { parallax, reveal, fadeWithView } = useCotlMotion()

/** Odd sections put the artwork on the left, so the page zig-zags. */
const flipped = computed(() => props.index % 2 === 1)
const shots = computed(() => props.mod.gallery ?? [])
const counter = computed(() => String(props.index + 1).padStart(2, '0'))

/** Downloads are meaningless for a mod that has not shipped. */
const actionLinks = computed(() => (props.mod.comingSoon ? [] : props.mod.links))

onMounted(() => {
  if (!section.value) return

  if (backdrop.value) {
    parallax(backdrop.value, section.value, { distance: 8, scale: 1.2, grow: 0.05, fade: 0.5, depth: 10 })
  }

  // Scoped to this section: a bare selector would also catch every other
  // showcase on the page and animate them all from this one's trigger.
  const copy = [...section.value.querySelectorAll<HTMLElement>('.showcase-reveal')]
  const shotEls = [...section.value.querySelectorAll<HTMLElement>('.showcase-shot')]
  // The section itself comes up as the reader reaches it. Only the mod
  // sections do this: the skin builder and support blocks are destinations
  // rather than a sequence, so they stay at full strength.
  fadeWithView(section.value, section.value, { min: 0.1, plateau: 0.7 })

  reveal(copy, section.value, { y: 32 })
  reveal(shotEls, section.value, { delay: 180, y: 24 })
})
</script>

<template>
  <section
    :id="mod.slug"
    ref="section"
    class="relative isolate scroll-mt-16 overflow-hidden py-24 sm:py-32"
  >
    <!-- Key art, drifting slower than the page. Oversized so the parallax
         travel never exposes an edge. -->
    <div
      v-if="mod.hero"
      class="cotl-art-fade-y absolute inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref="backdrop"
        class="size-full scale-125 opacity-50"
      >
        <NuxtImg
          :src="mod.hero"
          alt=""
          class="size-full object-cover"
          :width="1600"
          format="webp"
          :quality="65"
          loading="lazy"
        />
      </div>
    </div>
    <div
      v-else
      class="cotl-ground-dark absolute inset-0 -z-20"
      aria-hidden="true"
    />

    <!-- Scrims: one to seat the art in the page, one to hold the copy side. -->
    <div
      class="absolute inset-0 -z-10 bg-linear-to-b from-(--cotl-ground-dark) via-charcoal-950/65 to-(--cotl-ground-dark)"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 -z-10"
      :class="flipped
        ? 'bg-linear-to-l from-charcoal-950/95 via-charcoal-950/50 to-transparent'
        : 'bg-linear-to-r from-charcoal-950/95 via-charcoal-950/50 to-transparent'"
      aria-hidden="true"
    />

    <!-- Edge fades. Both ends of the section resolve to the colour of the page
         itself, so one section hands over to the next - and the hero hands over
         to the first - without a line where the artwork stops. The sections
         used to be separated by a border, which is precisely the seam these
         replace. -->
    <div
      class="cotl-ground-dark cotl-seam-top absolute inset-x-0 top-0 -z-10 h-32"
      aria-hidden="true"
    />
    <div
      class="cotl-ground-dark cotl-seam-bottom absolute inset-x-0 bottom-0 -z-10 h-32"
      aria-hidden="true"
    />

    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Copy -->
        <div
          class="flex flex-col items-start gap-5"
          :class="flipped ? 'lg:order-2' : ''"
        >
          <div class="showcase-reveal flex items-center gap-4">
            <NuxtImg
              :src="mod.logo"
              alt=""
              class="size-14 shrink-0 object-contain"
              :width="112"
              :height="112"
              format="webp"
              loading="lazy"
            />
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-crimson-400">
                {{ counter }} / {{ String(total).padStart(2, '0') }}
              </p>
              <h2 class="text-3xl font-extrabold uppercase tracking-tight text-parchment-100 sm:text-4xl">
                {{ mod.name }}
              </h2>
            </div>
          </div>

          <p class="showcase-reveal text-xl text-parchment-200">
            {{ mod.tagline }}
          </p>

          <p class="showcase-reveal max-w-xl text-default">
            {{ mod.description }}
          </p>

          <div class="showcase-reveal flex flex-wrap items-center gap-2">
            <span
              v-if="mod.badge"
              class="border border-crimson-500/60 bg-crimson-500/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-crimson-300"
            >{{ mod.badge }}</span>
            <span class="border border-default px-2.5 py-1 text-xs text-muted">v{{ mod.version }}</span>
            <span class="border border-default px-2.5 py-1 text-xs text-muted">Game {{ mod.gameVersion }}</span>
          </div>

          <div class="showcase-reveal flex flex-wrap items-center gap-4">
            <RibbonButton :to="mod.page">
              {{ mod.comingSoon ? 'What it is' : 'See the mod' }}
            </RibbonButton>
            <RibbonButton
              :to="mod.docs"
              ghost
            >
              Documentation
            </RibbonButton>
          </div>

          <div
            v-if="actionLinks.length"
            class="showcase-reveal flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <ULink
              v-for="link in actionLinks"
              :key="link.to"
              :to="link.to"
              target="_blank"
              class="flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-primary hover:underline"
            >
              <UIcon
                v-if="link.icon"
                :name="link.icon"
                class="size-4"
              />
              {{ link.label }}
            </ULink>
          </div>
        </div>

        <!-- Gallery -->
        <div
          v-if="shots.length"
          class="flex flex-col gap-4"
          :class="flipped ? 'lg:order-1' : ''"
        >
          <div class="showcase-shot">
            <ParchmentFrame :tilt="flipped ? 1.2 : -1.2">
              <MediaSlot
                :shot="shots[0]!"
                size="feature"
              />
            </ParchmentFrame>
          </div>

          <div
            v-if="shots.length > 1"
            class="grid gap-4"
            :class="shots.length > 2 ? 'grid-cols-2' : 'grid-cols-1'"
          >
            <MediaSlot
              v-for="shot in shots.slice(1, 3)"
              :key="shot.src"
              class="showcase-shot"
              :shot="shot"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
