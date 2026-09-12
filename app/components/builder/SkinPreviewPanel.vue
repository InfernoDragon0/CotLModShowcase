<script setup lang="ts">
import type { SkinVariant } from '~/utils/followerSkin'

const props = defineProps<{
  variant: SkinVariant | null
  colourSet: number
}>()

const container = ref<HTMLElement>()
const preview = useSkinPreview()

const animation = ref('idle')
/** No WebGL at all: say so rather than leaving an empty black square. */
const unsupported = ref(false)

onMounted(async () => {
  if (!container.value) return
  if (!supportsSpine()) {
    unsupported.value = true
    return
  }
  await preview.mount(container.value)
})

/** Rebuild when the parts change, coalescing rapid edits. */
let timer: ReturnType<typeof setTimeout> | undefined
watch(
  () => [props.variant, props.colourSet] as const,
  () => {
    if (!props.variant) return
    clearTimeout(timer)
    timer = setTimeout(() => preview.apply(props.variant!, props.colourSet), 250)
  },
  { deep: true },
)

watch(() => preview.ready.value, (isReady) => {
  if (isReady && props.variant) preview.apply(props.variant, props.colourSet)
})

watch(animation, name => preview.setAnimation(name))

defineExpose({ baseSkins: preview.baseSkins })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wide text-highlighted">
        Live preview
      </h3>
      <!-- The follower skeleton ships over a thousand animations, and building a
           menu item for every one of them stalled the dropdown on open, so the
           list is virtualised. `searchable` is not a prop in Nuxt UI 4 - the
           search box is on by default - and only leaked into the DOM. -->
      <USelectMenu
        v-if="preview.animations.value.length"
        v-model="animation"
        :items="preview.animations.value"
        :virtualize="true"
        size="sm"
        class="w-44"
      />
    </div>

    <!-- The rest of the builder is usable immediately; only this square waits on
         the 43 MB skeleton, so it says so instead of sitting there black. -->
    <div class="relative aspect-square w-full border border-default bg-charcoal-950">
      <div ref="container" class="size-full" />

      <div
        v-if="!unsupported && !preview.failed.value && !preview.ready.value"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-charcoal-950 p-6 text-center"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="size-6 animate-spin text-primary"
        />
        <p class="text-sm font-semibold text-highlighted">
          Loading Preview
        </p>
        <p class="text-xs text-muted">
          First load may take awhile!
        </p>
        <p
          v-if="preview.progress.value.total"
          class="text-xs tabular-nums text-dimmed"
        >
          {{ preview.progress.value.loaded }} of {{ preview.progress.value.total }} files
        </p>
      </div>
    </div>

    <UAlert
      v-if="unsupported"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="This browser cannot run the preview"
      description="WebGL is unavailable, so the follower cannot be drawn. Everything else in the builder, including the export, still works."
    />

    <UAlert
      v-else-if="preview.failed.value"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="The preview could not start"
      description="The Spine runtime or the follower skeleton failed to load. Exporting still works."
      :actions="[{ label: 'Try again', color: 'neutral', variant: 'subtle', onClick: () => preview.retry() }]"
    />
  </div>
</template>
