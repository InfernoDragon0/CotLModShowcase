<script setup lang="ts">
/**
 * Video for documentation pages, used from markdown as
 * `:video-player{src="/videos/name.mp4"}`.
 *
 * `preload="metadata"` matters here: these clips are several megabytes and a
 * docs page should not spend that before the reader asks for it. The browser
 * fetches just enough to know the dimensions and show the first frame.
 */
withDefaults(
  defineProps<{
    /** Path under `public/`, e.g. `/videos/customweaponsample.mp4`. */
    src: string
    /** Still shown before playback starts. */
    poster?: string
    /** Sits under the frame, in the same voice as the surrounding prose. */
    caption?: string
    /** For short silent loops that read better as moving images. */
    loop?: boolean
  }>(),
  { loop: false },
)
</script>

<template>
  <figure class="my-5">
    <video
      :src="src"
      :poster="poster"
      :loop="loop"
      class="h-auto w-full border border-muted"
      controls
      playsinline
      preload="metadata"
    />
    <figcaption
      v-if="caption"
      class="mt-2 text-sm text-muted"
    >
      {{ caption }}
    </figcaption>
  </figure>
</template>
