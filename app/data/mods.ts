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

/** One image in a mod's showcase gallery. */
export interface ModShot {
  /** Where the file lives, or where it should be dropped. */
  src: string
  alt: string
  /**
   * Nothing at that path yet, so the page draws a labelled wireframe of the
   * right shape instead of a broken image. Delete the flag once the file is in.
   */
  pending?: boolean
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
  /** Screenshots for the mod's showcase section: one feature, two details. */
  gallery?: ModShot[]
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
    gallery: [
      {
        src: '/images/culttweaker/showcase-1.png',
        alt: 'The Worldshaper editor open over a custom dungeon',
      },
      {
        src: '/images/culttweaker/image.png',
        alt: 'The in-game follower form editor, with a custom head override selected on slot 89',
      },
      {
        src: '/images/culttweaker/structure-override.png',
        alt: 'A vanilla structure replaced with custom artwork',
      },
    ],
  },
  {
    slug: 'supercharged',
    name: 'Supercharged Series',
    tagline: 'Unleash the true potential of the Lamb.',
    description:
      'Supercharged Tarots adds powerful tarot cards to the game, with 3 sets including co-op cards. Supercharged Followers lets you rally your followers into battle, equip them, and level them through prestige ranks.',
    logo: '/images/tarotlogo.png',
    hero: '/images/tarots.png',
    version: 'Tarots 1.0.4 · Unholy Alliance 1.0.1 · Followers 1.0.5',
    gameVersion: 'Woolhaven',
    docs: '/docs/supercharged',
    page: '/mods/supercharged',
    links: [
      {
        label: 'SC Tarots on NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/20',
        icon: 'i-lucide-download',
      },
      {
        label: 'SC Tarots on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/Supercharged_Tarots/',
        icon: 'i-lucide-package',
      },
      {
        label: 'SC Tarots: UA on NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/29',
        icon: 'i-lucide-package',
      },
      {
        label: 'SC Tarots: UA on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/Supercharged_Tarots_UA/',
        icon: 'i-lucide-package',
      },
      {
        label: 'SC Followers on NexusMods',
        to: 'https://www.nexusmods.com/cultofthelamb/mods/21',
        icon: 'i-lucide-package',
      },
      {
        label: 'SC Followers on Thunderstore',
        to: 'https://thunderstore.io/c/cult-of-the-lamb/p/InfernoDragon0/SuperchargedFollowers/',
        icon: 'i-lucide-package',
      },
    ],
    gallery: [
      {
        src: '/images/supercharged/showcase-1.png',
        alt: 'The flock rallied in a ring around the Lamb at the shrine',
      },
      {
        src: '/images/supercharged/showcase-2.png',
        alt: 'Supercharged tarot cards laid out with their effects',
      },
      {
        src: '/images/tarots.png',
        alt: 'A spread of Supercharged tarot cards',
      },
    ],
  },
  {
    slug: 'minimods',
    name: 'CotL MiniMods',
    tagline: 'Custom stuff for base management and combat.',
    description:
      'Lots of custom structures, follower roles, rituals, follower commands and the Trial of the Gods that turns every run into a challenge of your choice.',
    logo: '/images/minimods/icon.png',
    hero: '/images/minimods/showcase-3.jpeg',
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
    gallery: [
      {
        src: '/images/minimods/showcase-1.png',
        alt: 'The Trial of the Gods screen, with the trial and augment cards laid out',
      },
      {
        src: '/images/minimods/showcase-2.png',
        alt: 'A MiniMods item menu open over the cult base',
      },
      {
        src: '/images/minimods/showcase-3.jpeg',
        alt: 'A base built out with custom MiniMods structures and decorated followers',
      },
    ],
  },
  {
    slug: 'mpsteam',
    name: 'COTL MP Steam',
    tagline: 'Two lambs, one cult.',
    description:
      'Online 2 player co-op over Steam p2p. Invite a friend through Steam overlay or Discord, and run dungeons, bosses and build a base together with your friends.',
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
    // One shot for now. `showcase-2.png` is currently a byte-for-byte copy of
    // this one, and the showcase renders its detail row only when there is more
    // than one entry, so a second slot here would just repeat the picture. Add
    // it back once there is a genuinely different screenshot to put in it.
    gallery: [
      {
        src: '/images/mpsteam/showcase-1.png',
        alt: 'Two players crossing a bridge together in a dark forest, their names above them and the host\'s connection shown in the corner',
      },
    ],
  },
]

export function findMod(slug: string): Mod | undefined {
  return mods.find(mod => mod.slug === slug)
}
