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
    /**
     * Empty means "let the visitor choose": Docus only forces a mode when this
     * is exactly 'light' or 'dark', and it renders the toggle in the header
     * when it is not. Both palettes are defined in `app/app.css`.
     */
    colorMode: '',
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
      'CultTweaker, the Supercharged series, CotL MiniMods and the upcoming MP Steam co-op mod — mods for Cult of the Lamb, with full documentation and a follower skin builder.',
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
      /* Nuxt UI defaults warnings to Tailwind yellow, which is a pure, fully
         saturated light source next to this warm palette - the caution callouts
         in the docs glared. The brand gold is the same warning signal at a
         temperature that belongs on the page. */
      warning: 'gold',
      /* Note callouts and info toasts: a desaturated blue-grey instead of
         Tailwind's cold blue. */
      info: 'mist',
      /* Tips and success toasts, as a muted sage rather than a vivid green. */
      success: 'sage',
      /* Errors and caution callouts already have a brand red to use. */
      error: 'crimson',
    },

    /*
     * The documentation chrome is held to roughly 7:1 against its ground.
     * Measured on the dark theme, the cream tokens landed between 10:1 and
     * 18:1 - technically "accessible", but a wall of near-white on warm grey is
     * what makes a long page tiring. These drop the surrounding furniture onto
     * the same two greys the body copy uses.
     */
    breadcrumb: {
      slots: { link: 'dark:text-docsbody' },
    },

    contentToc: {
      slots: {
        title: 'dark:text-docshead',
        trigger: 'dark:text-docshead',
        link: 'dark:text-docsbody',
      },
    },

    contentNavigation: {
      slots: {
        link: 'dark:text-docsbody',
        linkTitle: 'dark:text-docshead',
      },
    },

    /* The documentation page title and its standfirst are rendered by the page
       header rather than by prose, so they need the same two colours. */
    pageHeader: {
      slots: {
        title: 'dark:text-docshead',
        description: 'dark:text-docsbody',
      },
    },

    prose: {
      /**
       * Running text in the documentation sits at a neutral grey in dark mode
       * rather than the warm cream the rest of the site uses: a full page of
       * prose in cream reads as glare. Scoped to the prose components, so it
       * only ever touches rendered markdown - headings, links, code and the
       * navigation all keep their own colours. Light mode is untouched, where
       * grey on parchment would be far too faint.
       */
      p: { base: 'dark:text-docsbody' },
      li: { base: 'dark:text-docsbody' },
      td: { base: 'dark:text-docsbody' },

      /* Code carried the brightest text on the page: inline spans at 14:1 and
         block text at 12:1. Highlighted blocks still colour their own tokens. */
      code: { base: 'dark:text-docshead' },
      pre: { base: 'dark:text-docsbody' },

      h1: { slots: { base: 'dark:text-docshead' } },
      h2: { slots: { base: 'dark:text-docshead' } },
      h3: { slots: { base: 'dark:text-docshead' } },
      h4: { slots: { base: 'dark:text-docshead' } },

      /* Cards carry their own title and body text rather than prose elements,
         so they need the same two colours applied directly. */
      card: {
        slots: {
          title: 'dark:text-docshead',
          description: 'dark:text-docsbody',
        },
      },

      img: {
        variants: {
          /**
           * Nuxt UI stretches a markdown image to `w-full` unless it declares a
           * width. Most images in these docs are 96-256px game icons, so that
           * blew them up to the width of the prose column as a blur. Natural
           * size, capped at the column, centred.
           */
          width: {
            false: 'w-auto max-w-full mx-auto',
          },
        },
      },
    },
  },
})
