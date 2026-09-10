<script setup lang="ts">
const { links } = useAppConfig()
</script>

<template>
  <div class="flex flex-col gap-1 text-sm text-muted">
    <p>
      Mods and site by
      <a
        :href="links.github"
        target="_blank"
        rel="noopener"
        class="font-semibold text-parchment-100 hover:text-crimson-400"
      >InfernoDragon0</a>
    </p>
    <p class="text-xs text-dimmed">
      Cult of the Lamb is a trademark of Massive Monster and Devolver Digital.
      This is an unofficial fan project.
    </p>
  </div>
</template>
