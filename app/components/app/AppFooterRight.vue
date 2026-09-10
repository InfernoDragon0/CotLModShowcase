<script setup lang="ts">
const { links } = useAppConfig()

const socials = [
  { icon: 'i-simple-icons-discord', to: links.discord, label: 'Modding Discord' },
  { icon: 'i-simple-icons-github', to: links.github, label: 'GitHub' },
]
</script>

<template>
  <div class="flex items-center gap-3">
    <UButton
      v-for="social in socials"
      :key="social.to"
      :to="social.to"
      :icon="social.icon"
      :aria-label="social.label"
      target="_blank"
      color="neutral"
      variant="ghost"
      size="sm"
    />
    <DonateButtons />
  </div>
</template>
