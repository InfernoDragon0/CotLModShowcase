<script setup lang="ts">
/** A single large follower for hero sections, with a GIF fallback. */
const props = withDefaults(
  defineProps<{
    skin?: string
    animation?: string
    scale?: number
    fallback?: string
    class?: string
  }>(),
  {
    skin: 'Cat',
    animation: 'idle',
    scale: 1.6,
    fallback: '/images/Follower-idle.gif',
  },
)

const actors = computed<StageActor[]>(() => [
  {
    skin: props.skin,
    animation: props.animation,
    x: 0.5,
    y: 0.14,
    scale: props.scale,
  },
])
</script>

<template>
  <SpineStage
    :actors="actors"
    :ratio="1"
    :class="props.class"
  >
    <template #fallback>
      <img
        :src="fallback"
        alt=""
        aria-hidden="true"
        class="h-full w-full object-contain"
      >
    </template>
  </SpineStage>
</template>
