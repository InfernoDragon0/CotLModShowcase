<script setup lang="ts">
/**
 * Full-bleed layout for the player-facing pages.
 *
 * Docus renders the header and footer around every layout, so this only needs
 * to drop the documentation container width.
 *
 * The site used to pin its own progress rail to the right edge here, but beside
 * the browser's scrollbar it simply read as a second scrollbar. `ScrollProgressBar`
 * is still in the repo if it is ever wanted on a page with no scrollbar of its own.
 *
 * It also arms the page's entrances. These pages are server-rendered, so the
 * browser paints the finished article before any of our code runs: hiding
 * things from `onMounted` meant the reader saw the content, watched it blink
 * out, and then watched it fade back in. The rules below go into `<head>`,
 * ahead of the markup they act on, so nothing that is about to animate is ever
 * painted in its finished state.
 *
 * Three separate guards keep this from ever eating the page:
 *   - the class is added by script, so no JavaScript means no hiding at all;
 *   - it is only added when the visitor has not asked for reduced motion;
 *   - `cotl-live`, set once the app has hydrated, calls off a CSS failsafe
 *     that otherwise uncovers everything three seconds in.
 */
const HIDDEN = [
  '.hero-eyebrow', '.hero-sub', '.hero-mark', '.hero-actions > *',
  '.showcase-reveal', '.showcase-shot',
  '.feature-card', '.minimod-card', '.tarot-card',
]

const armed = HIDDEN.map(selector => `html.cotl-armed ${selector}`).join(',')
const failsafe = HIDDEN
  .map(selector => `html.cotl-armed:not(.cotl-live) ${selector}`)
  .concat('html.cotl-armed:not(.cotl-live) .hero-char')
  .join(',')

useHead({
  style: [{
    key: 'cotl-motion-armed',
    innerHTML: [
      `${armed}{opacity:0}`,
      'html.cotl-armed .hero-char{visibility:hidden}',
      `${failsafe}{animation:cotl-motion-failsafe 1ms linear 3s forwards}`,
      '@keyframes cotl-motion-failsafe{to{opacity:1;visibility:visible}}',
    ].join(''),
  }],
  script: [{
    key: 'cotl-motion-arm',
    innerHTML: 'try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)'
      + 'document.documentElement.classList.add("cotl-armed")}catch(e){}',
  }],
})

// Layouts mount after the components inside them, so by the time this runs
// every entrance has claimed its own starting state and the failsafe is no
// longer needed.
onMounted(() => document.documentElement.classList.add('cotl-live'))
</script>

<template>
  <UMain class="cotl-ground-dark">
    <slot />
  </UMain>
</template>
