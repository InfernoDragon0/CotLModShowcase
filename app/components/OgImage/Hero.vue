<script setup lang="ts">
/**
 * The link-preview card, built to read like the site's own hero.
 *
 * Rendered by satori, which supports only a subset of CSS: flexbox and nothing
 * else for layout, every element with more than one child needs an explicit
 * `display: flex`, and there is no `gap` shorthand inheritance to rely on.
 * Styles are inline hex rather than theme classes because satori resolves
 * Tailwind separately from the app and would not see `crimson`/`parchment`.
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
             background: linear-gradient(90deg, rgba(20,18,18,0.94) 0%, rgba(20,18,18,0.86) 45%, rgba(20,18,18,0.55) 100%);"
    />

    <div
      style="position: relative; display: flex; flex-direction: column; justify-content: center;
             width: 760px; height: 630px; padding: 0 0 0 72px;"
    >
      <div
        style="display: flex; font-size: 24px; font-weight: 700; letter-spacing: 6px;
               text-transform: uppercase; color: #ef4a52;"
      >
        {{ eyebrow }}
      </div>

      <div
        style="display: flex; margin-top: 18px; font-size: 88px; font-weight: 800; line-height: 1.02;
               letter-spacing: -2px; text-transform: uppercase; color: #f7f0e1;"
      >
        {{ title }}
      </div>

      <div
        style="display: flex; margin-top: 26px; width: 620px; font-size: 27px; line-height: 1.4; color: #e8dcc0;"
      >
        {{ subtitle }}
      </div>

      <!-- The ribbon from the hero's primary button, squared off: satori has no
           clip-path, so the notched ends cannot come across. -->
      <div style="display: flex; margin-top: 34px;">
        <div
          style="display: flex; padding: 14px 30px; background-color: #e5202a; color: #141212;
                 font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;"
        >
          cotlmod.infernodragon.net
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
