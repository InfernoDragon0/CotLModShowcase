// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@hypernym/nuxt-anime', "@nuxt/ui"],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
})