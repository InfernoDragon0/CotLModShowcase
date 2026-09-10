<script setup lang="ts">
import type { SkinVariant } from '~/utils/followerSkin'
import { PREVIEW_GAPS } from '~/composables/useFollowerSlots'

const props = defineProps<{
  variant: SkinVariant | null
  colourSet: number
}>()

const container = ref<HTMLElement>()
const preview = useSkinPreview()

const animation = ref('idle')

onMounted(async () => {
  if (!container.value) return
  if (!supportsSpine()) {
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

/** Parts the bundled skeleton is too old to show. */
const missingFromSkeleton = computed(() => {
  if (!props.variant) return []
  return Object.values(props.variant.parts)
    .map(part => part.partName)
    .filter(name => PREVIEW_GAPS.has(name))
})

defineExpose({ baseSkins: preview.baseSkins })
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-bold uppercase tracking-wide text-parchment-100">
        Live preview
      </h3>
      <USelectMenu
        v-if="preview.animations.value.length"
        v-model="animation"
        :items="preview.animations.value"
        size="sm"
        class="w-44"
        searchable
      />
    </div>

    <div
      ref="container"
      class="aspect-square w-full border border-charcoal-700 bg-charcoal-950"
    />

    <UAlert
      v-if="preview.failed.value"
      color="warning"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      title="The preview could not start"
      description="Your browser blocked WebGL, or the Spine runtime failed to load. Exporting still works."
    />

    <UAlert
      v-else-if="missingFromSkeleton.length"
      color="warning"
      variant="subtle"
      icon="i-lucide-info"
      title="Some parts cannot be previewed"
      :description="`The bundled follower skeleton predates ${missingFromSkeleton.join(', ')}. These parts still export correctly and will work in game.`"
    />
  </div>
</template>
