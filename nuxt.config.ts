// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image','@hypernym/nuxt-anime'],
  plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
})
