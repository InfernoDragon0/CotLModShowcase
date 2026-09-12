<script setup lang="ts">
/** Ko-fi and Patreon calls to action, shown in the header, footer and pages. */
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { links } = useAppConfig()
</script>

<template>
  <div
    class="flex items-center"
    :class="compact ? 'gap-2' : 'gap-3'"
  >
    <RibbonButton
      :to="links.kofi"
      icon="i-simple-icons-kofi"
      :size="compact ? 'sm' : 'md'"
    >
      Donate
    </RibbonButton>

    <RibbonButton
      v-if="!compact"
      :to="links.patreon"
      icon="i-simple-icons-patreon"
      ghost
    >
      Patreon
    </RibbonButton>

    <UButton
      v-else
      :to="links.patreon"
      target="_blank"
      icon="i-simple-icons-patreon"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Patreon"
      class="hidden sm:inline-flex"
    />
  </div>
</template>
