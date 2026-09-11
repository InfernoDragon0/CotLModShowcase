/**
 * The mod families shown on the home page and linked from the documentation.
 *
 * Data lives in typed modules rather than a Nuxt Content collection because it
 * is consumed by both Vue pages and MDC components, and needs no async query.
 */

export interface ModLink {
  label: string
  to: string
  icon?: string
}

export interface Mod {
  slug: string
  name: string
  tagline: string
  description: string
  logo: string
  /** Key art for the card and page hero. Omitted while a mod has no art yet. */
  hero?: string
  /** Version string as shown to players. */
  version: string
  /** Game version the mod targets. */
  gameVersion: string
  badge?: string
  docs: string
  page: string
  links: ModLink[]
  /** Not released yet: the card and page drop the download calls to action. */
  comingSoon?: boolean
}

export const mods: Mod[] = [
  {
    slug: 'culttweaker',
    name: 'CultTweaker',
    tagline: 'Build your own Cult of the Lamb.',
    description:
      'An in-game world editor, custom dungeons and hubs, custom player and follower spines, weapons, NPCs with quests, enemies, structures and a modding API for other mods to build on.',
    logo: '/images/culttweaker/icon.png',
    hero: '/images/culttweaker/1.png',
    version: '2.0 pre-release 6',
    gameVersion: '1.5.26',
    badge: 'Pre-release',
    docs: '/docs/culttweaker',
    page: '/mods/culttweaker',
    links: [
      {
        label: 'NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/49',
        icon: 'i-lucide-download',
      },
      {
        label: 'GitHub',
        to: 'https://github.com/InfernoDragon0/COTL-CustomSpineLoader',
        icon: 'i-simple-icons-github',
      },
    ],
  },
  {
    slug: 'supercharged',
    name: 'Supercharged Series',
    tagline: 'Unleash the true potential of the Lamb.',
    description:
      'Supercharged Tarots adds wildly powerful tarot cards to the run pool, across three sets including the Unholy Alliance co-op cards. Supercharged Followers lets you rally your flock into battle, equip them, and level them through ten prestige ranks.',
    logo: '/images/tarotlogo.png',
    hero: '/images/tarots.png',
    version: 'Tarots 1.0.4 · Unholy Alliance 1.0.1 · Followers 1.0.5',
    gameVersion: 'Woolhaven',
    docs: '/docs/supercharged',
    page: '/mods/supercharged',
    links: [
      {
        label: 'Tarots on NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/20',
        icon: 'i-lucide-download',
      },
      {
        label: 'Tarots on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/Supercharged_Tarots/',
        icon: 'i-lucide-package',
      },
      {
        label: 'Unholy Alliance on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/Supercharged_Tarots_UA/',
        icon: 'i-lucide-package',
      },
      {
        label: 'Followers on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/SuperchargedFollowers/',
        icon: 'i-lucide-package',
      },
    ],
  },
  {
    slug: 'minimods',
    name: 'CotL MiniMods',
    tagline: 'Custom stuff for base management and combat.',
    description:
      'Twenty custom structures, new follower roles, new rituals, follower commands and the Trial of the Gods difficulty system that turns every run into a challenge of your own design.',
    logo: '/images/customstruct.png',
    hero: '/images/cotlminimodsbanner.png',
    version: '1.3.3',
    gameVersion: 'Woolhaven',
    docs: '/docs/minimods',
    page: '/mods/minimods',
    links: [
      {
        label: 'NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/12',
        icon: 'i-lucide-download',
      },
      {
        label: 'Thunderstore',
        to: 'https://cult-of-the-lamb.thunderstore.io/package/InfernoDragon0/CotLMiniMods/',
        icon: 'i-lucide-package',
      },
    ],
  },
  {
    slug: 'mpsteam',
    name: 'COTL MP Steam',
    tagline: 'Two lambs, one cult.',
    description:
      'Online two-player co-op over Steam peer-to-peer. Host on your own save, invite a friend from the Steam overlay or Discord, and run dungeons, bosses and the whole base together with a camera and HUD each.',
    logo: '/images/mpsteam/icon.png',
    version: '0.1.0 test build',
    gameVersion: 'Woolhaven',
    badge: 'Coming soon',
    docs: '/docs/mpsteam',
    page: '/mods/mpsteam',
    comingSoon: true,
    links: [
      {
        label: 'Join the test on Discord',
        to: 'https://discord.gg/MUjww9ndx2',
        icon: 'i-simple-icons-discord',
      },
    ],
  },
]

export function findMod(slug: string): Mod | undefined {
  return mods.find(mod => mod.slug === slug)
}
