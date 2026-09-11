<script setup lang="ts">
import { animate, createTimeline, stagger } from 'animejs'

/**
 * Full-bleed hero: key art on a parallax layer, headline set straight onto it.
 *
 * Legibility comes from the scrims below plus the `.cotl-hero-text` shadow, so
 * the copy can breathe across the whole frame. The art drifts and swells as the
 * page scrolls while the copy lifts and fades, which separates the two planes
 * without either of them moving far.
 */
const props = withDefaults(
  defineProps<{
    /** Key art. Without it the hero falls back to the paper ground. */
    image?: string
    eyebrow?: string
    title: string
    subtitle?: string
    /** Artwork standing in front of the key art. */
    foreground?: string
    /** No file at `foreground` yet: draw its footprint instead. */
    foregroundPending?: boolean
    /** Id of the section the scroll cue jumps to. Omitted, no cue is drawn. */
    scrollTo?: string
  }>(),
  { foregroundPending: false },
)

const section = ref<HTMLElement>()
const art = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const headline = ref<HTMLElement>()
const mark = ref<HTMLElement>()
const markLayer = ref<HTMLElement>()

const { parallax, fadeOnScroll, float, scrollToId } = useCotlMotion()

/**
 * The headline types a character at a time, so it is split twice: each word
 * keeps its own box, so lines break between words and never mid-word, and each
 * word holds one span per character.
 */
const words = computed(() =>
  props.title
    .split(/\s+/)
    .filter(Boolean)
    .map(word => [...word]),
)

function goToNext() {
  if (props.scrollTo) scrollToId(props.scrollTo)
}

onMounted(() => {
  if (!section.value) return

  if (art.value) parallax(art.value, section.value, { distance: 12, scale: 1.28, grow: 0.1, depth: 16 })

  // The mark drifts against the art rather than with it, which is what sells
  // the two as separate planes. It sits on the wrapper because the float
  // animation owns the transform of the element inside.
  if (markLayer.value) {
    parallax(markLayer.value, section.value, { distance: 0, scale: 1, grow: 0, depth: -28 })
  }
  if (copy.value) fadeOnScroll(copy.value, section.value, { lift: 90 })
  if (mark.value) float(mark.value, 14)

  if (prefersReducedMotion()) return

  const chars = headline.value
    ? [...headline.value.querySelectorAll<HTMLElement>('.hero-char')]
    : []

  // Characters are hidden rather than absent, so the headline holds its full
  // size from the first frame and nothing below it reflows as the line types.
  for (const char of chars) char.style.visibility = 'hidden'

  /** Driven by the tween below; only the whole number of it is ever read. */
  const typed = { count: 0 }

  function paint() {
    const revealed = Math.min(Math.round(typed.count), chars.length)
    chars.forEach((char, index) => {
      char.style.visibility = index < revealed ? 'visible' : 'hidden'
      char.classList.toggle('is-cursor', index === revealed - 1)
    })
  }

  // Roughly 45 ms a character, capped so a long title never drags.
  const typing = Math.min(chars.length * 45, 1500)
  /** Everything else waits for the line to finish, then follows it in. */
  const after = typing + 140

  // One timeline, in a deliberate order: the headline types itself out on an
  // otherwise empty frame, then the copy closes in on the words that have just
  // been written - what sits above the line rises from below it, what sits
  // under it settles down from above. Each piece is given its own start and its
  // own duration, so they overlap rather than moving as one block.
  const timeline = createTimeline({ defaults: { ease: 'outQuad' } })

  timeline
    .add(typed, {
      count: [0, chars.length],
      duration: typing,
      ease: 'linear',
      onUpdate: paint,
      onComplete: () => {
        paint()
        headline.value?.classList.remove('is-typing')
        // The caret sits and blinks for a beat, then leaves the line alone.
        setTimeout(() => {
          for (const char of chars) char.classList.remove('is-cursor')
        }, 1400)
      },
    })
    // Above the line: comes up from below.
    .add('.hero-eyebrow', { opacity: [0, 1], translateY: [18, 0], duration: 520 }, after)
    // Below it: comes down from above, a beat later and over a little longer.
    .add('.hero-sub', { opacity: [0, 1], translateY: [-20, 0], duration: 640 }, after + 170)
    // The buttons arrive one after the other rather than as a pair.
    .add('.hero-actions > *', {
      opacity: [0, 1],
      translateY: [-16, 0],
      duration: 520,
      delay: stagger(130),
    }, after + 380)

  if (mark.value) {
    timeline.add(mark.value, { opacity: [0, 1], scale: [0.88, 1], duration: 820 }, after + 60)
  }

  if (section.value.querySelector('.hero-cue')) {
    animate('.hero-cue', {
      translateY: [0, 10],
      duration: 1100,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    })
  }
})
</script>

<template>
  <section
    ref="section"
    class="relative isolate flex min-h-[60vh] items-end overflow-hidden"
  >
    <!-- The art is dissolved towards the foot of the hero rather than stopping
         at its edge: detail that is still legible where the section ends reads
         as a seam, however well the colours either side match. The mask sits on
         this wrapper because the layer inside it is scaled and driven by the
         parallax, and a mask travels with the transform it is applied to. -->
    <div
      class="cotl-art-fade-b absolute inset-0 -z-20 overflow-hidden"
      aria-hidden="true"
    >
      <div
        ref="art"
        class="size-full scale-125"
      >
        <NuxtImg
          v-if="props.image"
          :src="props.image"
          alt=""
          class="size-full object-cover"
          :width="1920"
          :height="806"
          format="webp"
          :quality="80"
          preload
        />
        <div
          v-else
          class="cotl-ground-dark size-full"
        />
      </div>
    </div>

    <div
      class="absolute inset-0 -z-10 bg-linear-to-t from-(--cotl-ground-dark) via-charcoal-950/55 to-charcoal-950/15"
      aria-hidden="true"
    />
    <!-- Side scrim: keeps the copy readable wherever the art is bright. -->
    <div
      class="absolute inset-0 -z-10 bg-linear-to-r from-charcoal-950/85 via-charcoal-950/35 to-transparent"
      aria-hidden="true"
    />
    <!-- Bottom edge: settles onto the colour of the page itself, so the key art
         hands over to the first mod section instead of stopping at a line. -->
    <div
      class="cotl-ground-dark cotl-seam-bottom absolute inset-x-0 bottom-0 -z-10 h-32"
      aria-hidden="true"
    />

    <!-- Mark in front of the art, opposite the copy. Held inside the same
         container as the headline so it lines up with the text rather than
         drifting off towards the window edge. -->
    <div
      v-if="props.foreground"
      ref="markLayer"
      class="pointer-events-none absolute inset-0 -z-10 mx-auto hidden w-full max-w-7xl px-6 sm:block lg:px-8"
      aria-hidden="true"
    >
      <div
        ref="mark"
        class="hero-mark absolute right-0 top-1/2 -translate-y-1/2 sm:right-8 lg:right-24"
      >
      <NuxtImg
        v-if="!props.foregroundPending"
        :src="props.foreground"
        alt=""
        class="w-36 sm:w-44 lg:w-56"
        :width="448"
        :height="448"
        format="webp"
      />
      <div
        v-else
        class="cotl-wireframe flex size-36 flex-col items-center justify-center gap-1.5 p-3 text-center sm:size-44 lg:size-56"
      >
        <UIcon
          name="i-lucide-image"
          class="size-6 text-dimmed"
        />
        <code class="max-w-full truncate text-[0.6rem] text-dimmed">{{ props.foreground }}</code>
        <span class="text-[0.6rem] uppercase tracking-wider text-dimmed">square mark</span>
        </div>
      </div>
    </div>

    <div
      ref="copy"
      class="cotl-hero-text relative mx-auto w-full max-w-7xl px-6 pb-16 pt-20 lg:px-8"
    >
      <p
        v-if="eyebrow"
        class="hero-eyebrow mb-3 text-xs font-bold uppercase tracking-[0.25em] text-crimson-400 sm:text-sm"
      >
        {{ eyebrow }}
      </p>

      <!-- Split into per-character spans for the typewriter; the label keeps
           the whole title available to screen readers as one string. -->
      <h1
        ref="headline"
        class="is-typing max-w-4xl text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-parchment-200 sm:text-7xl lg:text-8xl"
        :aria-label="props.title"
      >
        <span
          v-for="(word, wordIndex) in words"
          :key="`word-${wordIndex}`"
          class="mr-[0.25em] inline-block"
          aria-hidden="true"
        ><span
          v-for="(char, charIndex) in word"
          :key="`char-${wordIndex}-${charIndex}`"
          class="hero-char"
        >{{ char }}</span></span>
      </h1>

      <p
        v-if="subtitle"
        class="hero-sub mt-6 max-w-2xl text-base text-parchment-200 sm:text-lg"
      >
        {{ subtitle }}
      </p>

      <div class="hero-actions mt-8 flex flex-wrap items-center gap-4">
        <slot name="actions" />
      </div>
    </div>

    <button
      v-if="scrollTo"
      type="button"
      class="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-parchment-300 transition-colors hover:text-primary sm:flex"
      aria-label="Scroll to the mods"
      @click="goToNext"
    >
      <span class="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">Scroll</span>
      <UIcon
        name="i-lucide-chevron-down"
        class="hero-cue size-5"
      />
    </button>
  </section>
</template>

<style scoped>
.hero-char {
  /* Containing block for the caret, which is drawn out of flow so moving it
     along the line never nudges the characters waiting their turn. */
  position: relative;
}

.hero-char.is-cursor::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 0.12em;
  width: 0.055em;
  height: 0.78em;
  margin-left: 0.06em;
  background: var(--color-crimson-500);
  animation: hero-caret 900ms steps(1, end) infinite;
}

/* Solid while the line is still being typed; it only blinks once it stops. */
.is-typing .hero-char.is-cursor::after {
  animation: none;
}

@keyframes hero-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-char.is-cursor::after {
    display: none;
  }
}
</style>
