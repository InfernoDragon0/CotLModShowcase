<script setup lang="ts">
import type { ModShot } from '~/data/mods'

/**
 * A screenshot in a showcase, or a wireframe of the screenshot that belongs
 * there.
 *
 * The site is being laid out before its artwork exists, so a slot marked
 * `pending` draws its own shape, its intended path and the size to shoot at.
 * That keeps the layout honest - a missing image occupies exactly the room the
 * real one will - and tells whoever is making the art where to put the file.
 */
const props = withDefaults(
  defineProps<{
    shot: ModShot
    /** Feature slots carry the eye; details sit smaller and quieter. */
    size?: 'feature' | 'detail'
    /** Above the fold, so skip lazy loading. */
    eager?: boolean
  }>(),
  { size: 'detail', eager: false },
)

const isFeature = computed(() => props.size === 'feature')

/**
 * What these slots actually occupy: one column of a two-column grid on large
 * screens, full width stacked below that, and half of the column again for the
 * detail pair. Without this Nuxt Image has no width to work from and serves the
 * original file - several megabytes of PNG to fill a 560px box.
 */
const sizes = computed(() => (isFeature.value ? '100vw lg:600px' : '50vw lg:300px'))
</script>

<template>
  <figure class="relative aspect-video w-full overflow-hidden border border-default bg-charcoal-950">
    <NuxtImg
      v-if="!shot.pending"
      :src="shot.src"
      :alt="shot.alt"
      class="size-full object-cover"
      :sizes="sizes"
      format="webp"
      :quality="82"
      :loading="eager ? 'eager' : 'lazy'"
    />

    <!-- Wireframe: the shape of the shot that is still to come. -->
    <div
      v-else
      class="cotl-wireframe absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center"
    >
      <UIcon
        name="i-lucide-image"
        class="text-dimmed"
        :class="isFeature ? 'size-8' : 'size-6'"
      />
      <p
        class="text-balance font-semibold text-muted"
        :class="isFeature ? 'text-sm' : 'text-xs'"
      >
        {{ shot.alt }}
      </p>
      <code class="max-w-full truncate text-[0.65rem] text-dimmed">{{ shot.src }}</code>
      <span
        v-if="isFeature"
        class="text-[0.65rem] uppercase tracking-wider text-dimmed"
      >2560 × 1440</span>
    </div>
  </figure>
</template>
