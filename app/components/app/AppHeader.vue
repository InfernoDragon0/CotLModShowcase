<script setup lang="ts">
/**
 * Copied from `docus/app/components/app/AppHeader.vue` to change one thing: the
 * colour-mode toggle is hidden wherever the mode is locked.
 *
 * Docus only knows about `docus.colorMode` in app config, which is all-or-
 * nothing across the site. The showcase pages pin themselves to dark with
 * `definePageMeta({ colorMode: 'dark' })`, and on a pinned route the toggle
 * still rendered while doing nothing at all: `@nuxtjs/color-mode` keeps writing
 * the preference but refuses to apply it. Reading `colorMode.forced` covers
 * both that and the app-config setting, so the button is only offered where it
 * works — the documentation.
 *
 * Being a copy, this shadows whatever Docus ships. Worth re-diffing against the
 * original when the layer is upgraded.
 */
const appConfig = useAppConfig()
const colorMode = useColorMode()
const { isEnabled: isAssistantEnabled } = useAssistant()
const { isEnabled, locales } = useDocusI18n()
const { subNavigationMode } = useSubNavigation()

const links = computed(() => appConfig.github && appConfig.github.url
  ? [
      {
        'icon': 'i-simple-icons-github',
        'to': appConfig.github.url,
        'target': '_blank',
        'aria-label': 'GitHub',
      },
    ]
  : [])
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :class="{ 'flex flex-col': subNavigationMode === 'header' }"
  >
    <AppHeaderCenter />

    <template #left>
      <AppHeaderLeft />
    </template>

    <template #right>
      <AppHeaderCTA />

      <template v-if="isAssistantEnabled">
        <AssistantChat />
      </template>

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

        <USeparator
          orientation="vertical"
          class="h-8"
        />
      </template>

      <UContentSearchButton class="lg:hidden" />

      <!-- Rendered client-side only: `colorMode.forced` is resolved by the
           route, and the server has no preference to compare it against. -->
      <ClientOnly>
        <UColorModeButton v-if="!colorMode.forced" />
      </ClientOnly>

      <template v-if="links?.length">
        <UButton
          v-for="(link, index) of links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #toggle="{ open, toggle }">
      <IconMenuToggle
        :open="open"
        class="lg:hidden"
        @click="toggle"
      />
    </template>

    <template #body>
      <AppHeaderBody />
    </template>

    <template
      v-if="subNavigationMode === 'header'"
      #bottom
    >
      <AppHeaderBottom />
    </template>
  </UHeader>
</template>
