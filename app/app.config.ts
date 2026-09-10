export default defineAppConfig({
  // ---------------------------------------------------------------------------
  // Site-wide links. Read by DonateButtons, the header and the footer.
  // ---------------------------------------------------------------------------
  links: {
    kofi: 'https://ko-fi.com/infernodragon0',
    patreon: 'https://www.patreon.com/InfernoDragon0',
    discord: 'https://discord.gg/MUjww9ndx2',
    github: 'https://github.com/InfernoDragon0',
  },

  // Spine runtime assets. Swap here if a lighter follower export is produced.
  spine: {
    scriptUrl: '/spine-player.js',
    styleUrl: '/spine-player.css',
    skelUrl: '/Follower.skel.bytes',
    atlasUrl: '/Follower.atlas',
  },

  // ---------------------------------------------------------------------------
  // Docus
  // ---------------------------------------------------------------------------
  docus: {
    colorMode: 'dark',
  },

  header: {
    title: 'CotL Mods',
    logo: {
      light: '/images/culttweaker/icon.png',
      dark: '/images/culttweaker/icon.png',
      alt: 'CotL Mods by InfernoDragon0',
    },
  },

  socials: {
    discord: 'https://discord.gg/MUjww9ndx2',
  },

  github: {
    url: 'https://github.com/InfernoDragon0/COTL-CustomSpineLoader',
    branch: 'master',
  },

  seo: {
    title: 'CotL Mods by InfernoDragon0',
    description:
      'CultTweaker, the Supercharged series and CotL MiniMods — mods for Cult of the Lamb, with full documentation and a follower skin builder.',
  },

  toc: {
    title: 'On this page',
    bottom: {
      title: 'Support the mods',
      links: [
        {
          icon: 'i-simple-icons-kofi',
          label: 'Ko-fi',
          to: 'https://ko-fi.com/infernodragon0',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-patreon',
          label: 'Patreon',
          to: 'https://www.patreon.com/InfernoDragon0',
          target: '_blank',
        },
        {
          icon: 'i-simple-icons-discord',
          label: 'Modding Discord',
          to: 'https://discord.gg/MUjww9ndx2',
          target: '_blank',
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Nuxt UI palette. Scales are defined in app/app.css.
  // ---------------------------------------------------------------------------
  ui: {
    colors: {
      primary: 'crimson',
      secondary: 'gold',
      neutral: 'charcoal',
    },
  },
})
