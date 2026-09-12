// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['docus'],

  compatibilityDate: '2025-07-22',

  docus: {
    /**
     * The documentation assistant.
     *
     * `enabled` is set rather than left to Docus, which otherwise switches the
     * assistant on only when it finds `AI_GATEWAY_API_KEY` or
     * `VERCEL_OIDC_TOKEN` — the latter being injected by Vercel, which is why
     * the live site had a working Ask AI button running on Gateway billing
     * while local development had none at all. Stating it here makes the
     * behaviour the same in both places.
     *
     * The model is served by `server/routes/__docus__/assistant.post.ts`
     * through Google's own API, so no Gateway credentials are used. Change the
     * model name below and that route follows it.
     */
    assistant: {
      enabled: true,
      model: 'gemini-2.5-flash',
    },
  },

  devtools: { enabled: true },

  /**
   * Core Web Vitals from real visits. The module registers its own client
   * plugin, which reports against the matched route (`/docs/[...slug]`) rather
   * than every distinct URL, and stays dormant anywhere but a Vercel
   * deployment with Speed Insights enabled.
   */
  modules: ['@vercel/speed-insights/nuxt'],

  vite: {
    /**
     * Both are imported only by `/builder`, which Vite reaches through the
     * virtual routes module, so its startup dependency scan misses them. The
     * first visit to the page discovers them, re-optimises, and forces a full
     * reload - and because the router has not committed `/builder` yet, that
     * reload lands back on whichever page you came from. Naming them here gets
     * them pre-bundled at boot instead.
     */
    optimizeDeps: {
      include: ['jszip', 'idb-keyval'],
    },
  },

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
   * build time through satori + resvg-wasm. All 32 pages at once exhausted the
   * V8 zone allocator ("Fatal process out of memory") and killed the build, so
   * it is switched off everywhere in `routeRules` below and switched back on
   * for the home page alone — one render, which is the card that actually gets
   * pasted into Discord and Twitter. Every other page keeps the static
   * `og:image` declared under `app.head`.
   */
  ogImage: { enabled: true },

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
    // Only the home page renders an OG image; see the `ogImage` note above.
    '/**': { ogImage: false },
    '/': { ogImage: true },

    // Legacy URLs from the Nuxt 3 site
    '/minimods': { redirect: { to: '/mods/minimods', statusCode: 301 } },
    '/supercharged/tarots': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
    '/supercharged/armory': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
    '/supercharged/relics': { redirect: { to: '/mods/supercharged', statusCode: 301 } },
  },
})
