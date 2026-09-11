// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'],

  compatibilityDate: '2025-07-22',

  devtools: { enabled: true },

  components: [
    // Themed primitives are used everywhere; keep their names short.
    { path: '~/components/cotl', pathPrefix: false },
    { path: '~/components/spine', pathPrefix: false },
    { path: '~/components/content', pathPrefix: false, global: true },
    '~/components',
  ],

  site: {
    name: 'CotL Mods by InfernoDragon0',
    url: 'https://cotlmod.infernodragon.net',
  },

  // Docus generates /llms.txt, which needs an absolute domain for its links.
  llms: {
    domain: 'https://cotlmod.infernodragon.net',
  },

  /**
   * Docus turns on nuxt-og-image, which rasterises a 1200x630 PNG per page at
   * build time through satori + resvg-wasm. On this site that was 32 renders
   * and it exhausted the V8 zone allocator ("Fatal process out of memory"),
   * which is what made `npm run build` crawl and then die. The static og:image
   * below gives link previews for a fraction of a second of build time.
   *
   * To get per-page cards back, delete this block and expect a slower build.
   */
  ogImage: { enabled: false },

  // The site's own look is the dark one; light mode is there for anyone who
  // wants it, and the header toggle remembers the choice.
  colorMode: { preference: 'dark', fallback: 'dark' },

  app: {
    head: {
      meta: [
        { property: 'og:image', content: 'https://cotlmod.infernodragon.net/images/cotlminimodsbanner.png' },
        { name: 'twitter:image', content: 'https://cotlmod.infernodragon.net/images/cotlminimodsbanner.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: [
        '/',
        '/mods/culttweaker',
        '/mods/supercharged',
        '/mods/minimods',
        '/mods/mpsteam',
        '/builder',
        '/docs',
      ],
    },
  },

  routeRules: {
    // Legacy URLs from the Nuxt 3 site
    '/minimods': { redirect: { to: '/mods/minimods', statusCode: 301 } },
    '/supercharged/tarots': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
    '/supercharged/armory': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
    '/supercharged/relics': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
  },
})
