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

  nitro: {
    prerender: {
      routes: [
        '/',
        '/mods/culttweaker',
        '/mods/supercharged',
        '/mods/minimods',
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
