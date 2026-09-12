<script setup lang="ts">
/**
 * The link-preview card, built to read like the site's own hero.
 *
 * The `.takumi` suffix picks the renderer: nuxt-og-image v6 takes it from the
 * filename, and takumi is the one Docus actually installs (`@takumi-rs/core`),
 * so a `.satori.vue` here would fail the build for a missing dependency.
 *
 * Takumi lays out with flexbox only — every element holding more than one child
 * needs an explicit `display: flex`. Two further limits shape what is below:
 * the `background` shorthand is not parsed (gradients go through
 * `background-image`), and `text-transform` is not applied, so the capitals are
 * written out here instead. Colours are inline hex rather than theme classes
 * because the renderer resolves Tailwind separately from the app and would not
 * see `crimson`/`parchment`.
 */
withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    subtitle?: string
    /** Key art, the same file the hero uses. */
    image?: string
    /** The square badge on the right. */
    mark?: string
  }>(),
  {
    eyebrow: 'Mods for Cult of the Lamb',
    title: 'Reshape your Cult',
    subtitle: 'World editors, overpowered tarots, an army of followers and lots of custom content.',
    image: '/images/cotlminimodsbanner.png',
    mark: '/images/minimods/icon.png',
  },
)
</script>

<template>
  <div
    style="position: relative; display: flex; width: 1200px; height: 630px; background-color: #141212;"
  >
    <img
      :src="image"
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 630px; object-fit: cover;"
    >

    <!-- Holds the copy side readable over whatever the art is doing, and fades
         off to the right so the badge still sits on the nebula. -->
    <div
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 630px;
             background-image: linear-gradient(90deg, rgba(20,18,18,0.94) 0%, rgba(20,18,18,0.86) 45%, rgba(20,18,18,0.55) 100%);"
    />

    <div
      style="position: relative; display: flex; flex-direction: column; justify-content: center;
             width: 760px; height: 630px; padding: 0 0 0 72px;"
    >
      <div
        style="display: flex; font-size: 24px; font-weight: 700; letter-spacing: 6px; color: #ef4a52;"
      >
        {{ eyebrow.toUpperCase() }}
      </div>

      <div
        style="display: flex; margin-top: 18px; font-size: 88px; font-weight: 800; line-height: 1.02;
               letter-spacing: -2px; color: #f7f0e1;"
      >
        {{ title.toUpperCase() }}
      </div>

      <div
        style="display: flex; margin-top: 26px; width: 620px; font-size: 27px; line-height: 1.4; color: #e8dcc0;"
      >
        {{ subtitle }}
      </div>

      <!-- The ribbon from the hero's primary button, squared off: there is no
           clip-path here, so the notched ends cannot come across. -->
      <div style="display: flex; margin-top: 34px;">
        <div
          style="display: flex; padding: 14px 30px; background-color: #e5202a; color: #141212;
                 font-size: 22px; font-weight: 700; letter-spacing: 3px;"
        >
          COTLMOD.INFERNODRAGON.NET
        </div>
      </div>
    </div>

    <div
      style="position: relative; display: flex; align-items: center; justify-content: center;
             width: 440px; height: 630px;"
    >
      <img
        :src="mark"
        style="width: 300px; height: 300px; border: 8px solid #e5202a;"
      >
    </div>
  </div>
</template>
