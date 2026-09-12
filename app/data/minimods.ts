/**
 * CotL MiniMods content, ported from the old showcase menu data and enriched
 * from the mod README (v1.3.0, Trial of the Gods) and the standalone wiki.
 */

export interface MiniModEntry {
  title: string
  slug: string
  icon: string
  description: string
  /** Version the entry was introduced in, rendered as a badge. */
  since?: string
  /** Extra animation art shown alongside the entry. */
  art?: string[]
}

export interface MiniModGroup {
  key: string
  label: string
  icon: string
  blurb: string
  entries: MiniModEntry[]
}

export const minimodGroups: MiniModGroup[] = [
  {
    key: 'structures',
    label: 'Structures',
    icon: '/images/customstruct.png',
    blurb: 'Structures for automation, from AIO mines to remote follower management.',
    entries: [
      {
        title: 'Infernal Infuser',
        slug: 'infernal-infuser',
        icon: '/images/cauldron.png',
        since: '1.3.0',
        description:
          'Replaces the Relic Infuser. Select any number of Trials and Augments to raise the difficulty of your next run, at your own pace.',
      },
      {
        title: 'Wishing Well II',
        slug: 'wishing-well',
        icon: '/images/Icon_Pond.png',
        since: '1.3.0',
        description:
          'Powered by Strange Material. Pick any number of tarot cards from the vanilla and custom pools, plus a relic, to carry into your next run at no cost. Tarot effects no longer apply inside the base.',
      },
      {
        title: 'Fishing Hut II',
        slug: 'fishing-hut',
        icon: '/images/Icon_FishingHut.png',
        since: '1.3.0',
        description:
          'The replacement for the vanilla fishing hut, used by the Fisher role. Each hut stores up to 75 fish.',
        art: ['/images/Follower-fishing-fishing.gif'],
      },
      {
        title: 'AIO Quarry',
        slug: 'aio-quarry',
        icon: '/images/aio.png',
        description:
          'Choose from ten materials to collect. A follower mines it for you. Left click to collect, right click to change the material.',
        art: ['/images/Follower-mining.gif'],
      },
      {
        title: 'AIO Incubator',
        slug: 'aio-incubator',
        icon: '/images/aiofarm.png',
        description: 'Choose any seed type and a follower farms it for you.',
      },
      {
        title: 'Bone Mines',
        slug: 'bone-mines',
        icon: '/images/bonemines.png',
        description: 'Followers mine bones here, indefinitely.',
      },
      {
        title: 'Silk Mines',
        slug: 'silk-mines',
        icon: '/images/silkmines.png',
        description: 'Followers mine silk here, indefinitely.',
      },
      {
        title: 'Crystal Mines',
        slug: 'crystal-mines',
        icon: '/images/crystalmines.png',
        description: 'Followers mine crystals here, indefinitely.',
      },
      {
        title: 'Alchemy Cauldron',
        slug: 'alchemy-cauldron',
        icon: '/images/cauldron.png',
        description:
          'Pick a necklace to create, then play a minigame. Finish without a single failure and the necklace is yours.',
      },
      {
        title: 'Sous Chef Desk',
        slug: 'sous-chef-desk',
        icon: '/images/chefdesk.png',
        description:
          'Select one of ten dishes as the signature dish and the Sous Chef cooks it. No more queueing meals by hand.',
        art: ['/images/Follower-cook.gif'],
      },
      {
        title: 'Waiter Desk',
        slug: 'waiter-desk',
        icon: '/images/waiterdesk.png',
        description:
          'Followers serve food to each other and collect from the Follower Kitchen. Build one per waiter you want.',
        art: ['/images/Follower-food-food-run.gif'],
      },
      {
        title: 'Follower Management Device',
        slug: 'hr-device',
        icon: '/images/cotlpc.png',
        description: 'Spy on your followers and assign work commands remotely.',
      },
      {
        title: 'Endless Pit of Gluttony',
        slug: 'endless-pit',
        icon: '/images/endlesspit.png',
        description:
          'An infinite grave. Only the Reaper can bury bodies here, and it generates Strange Energy for every follower inside.',
      },
      {
        title: 'Strange Generator',
        slug: 'strange-generator',
        icon: '/images/generator.png',
        description: 'Converts Strange Material and gold into Strange Energy.',
      },
      {
        title: 'Energy Controller',
        slug: 'wireless-energy',
        icon: '/images/wireless.png',
        description:
          'Transfers energy from generators to the structures that need it, including the Endless Pit and Strange Generator.',
      },
      {
        title: 'Stasis Chamber',
        slug: 'stasis-chamber',
        icon: '/images/stasis.png',
        description:
          'Spends 50 Strange Energy to freeze time, then 10 Strange Energy per real minute while you stay in the base.',
      },
      {
        title: 'Study Table',
        slug: 'study-table',
        icon: '/images/study.png',
        description: 'Followers study Strange Material here for experience.',
        art: ['/images/Follower-studying.gif'],
      },
      {
        title: 'Telescope',
        slug: 'telescope',
        icon: '/images/telescope.png',
        description: 'Where the Astrologer reads the stars and drops Strange Material.',
        art: ['/images/Follower-astrologer.gif'],
      },
      {
        title: 'Lucky Narinder Statue',
        slug: 'lucky-narinder',
        icon: '/images/luckynarinder.png',
        description:
          'Followers devote to Narinder here. Narinder himself can devote to it to level up instantly.',
        art: ['/images/Follower-pray.gif'],
      },
      {
        title: 'Tree of Giving',
        slug: 'gift-tree',
        icon: '/images/GiftTree.png',
        description: 'Followers work here to generate small and medium gifts.',
      },
      {
        title: 'Boutique',
        slug: 'boutique',
        icon: '/images/GiftTree.png',
        since: '1.2.2',
        description:
          'A second source of gifts. Followers work here and produce small and medium gifts. Costs 5 Strange Material and 10 logs.',
      },
    ],
  },
  {
    key: 'roles',
    label: 'Roles',
    icon: '/images/customroles.png',
    blurb: 'New jobs your followers can take up, each paired with a structure.',
    entries: [
      {
        title: 'Sous Chef',
        slug: 'sous-chef',
        icon: '/images/Follower-cook.gif',
        since: '1.2.1',
        description:
          'Cooks automatically whenever followers are hungry. Requires a Sous Chef Desk.',
      },
      {
        title: 'Waiter',
        slug: 'waiter',
        icon: '/images/Follower-food-food-run.gif',
        description: 'Brings food to hungry followers. Requires a Waiter Desk.',
      },
      {
        title: 'Fisher',
        slug: 'fisher',
        icon: '/images/Follower-fishing-fishing.gif',
        since: '1.3.0',
        description:
          'Fishes from a loot pool of every seafood type. Now uses the Custom Fishing Hut II.',
      },
      {
        title: 'Narinder Devotee',
        slug: 'narinder',
        icon: '/images/Follower-pray.gif',
        description: 'Devotes to Narinder for levels. Requires the Lucky Narinder Statue.',
      },
      {
        title: 'Astrologer',
        slug: 'astrologer',
        icon: '/images/Follower-astrologer.gif',
        description: 'Reads the stars to drop Strange Material. Requires a Telescope.',
      },
      {
        title: 'Scholar',
        slug: 'study',
        icon: '/images/Follower-studying.gif',
        description: 'Studies Strange Material for experience. Requires a Study Table.',
      },
      {
        title: 'Reaper',
        slug: 'reaper',
        icon: '/images/Follower-undertaker-collect-corpse.gif',
        description:
          'Sweeps up corpses and drops them into the Endless Pit. Requires an Endless Pit.',
      },
      {
        title: 'Miner',
        slug: 'mining',
        icon: '/images/Follower-mining.gif',
        description:
          'Works the custom mines and the AIO Quarry. Requires the matching structure.',
      },
    ],
  },
  {
    key: 'rituals',
    label: 'Rituals',
    icon: '/images/customrituals.png',
    blurb: 'More custom temple ritual options.',
    entries: [
      {
        title: 'Mass Resurrection',
        slug: 'mass-revive',
        icon: '/images/ritual_massres.png',
        since: '1.2.1',
        description: 'Revives every dead follower at once.',
      },
      {
        title: 'Ritual of Exile',
        slug: 'ritual-of-exile',
        icon: '/images/ritual_exile.png',
        since: '1.2.1',
        description: 'Banishes one specific follower of your choosing.',
      },
      {
        title: 'Fusion Ritual',
        slug: 'fusion-ritual',
        icon: '/images/ritual_fusion.png',
        description:
          'The second follower gains the traits of the first. Mutually exclusive traits are overwritten.',
      },
      {
        title: 'Distribution Ritual',
        slug: 'distribution',
        icon: '/images/ritual_leveling.png',
        description: 'Hands coins to every follower, levelling them all up instantly.',
      },
      {
        title: 'Ritual Frenzy',
        slug: 'ritual-frenzy',
        icon: '/images/ritual_frenzy.png',
        description: 'Resets the cooldown on all of your other rituals.',
      },
      {
        title: 'Ritual of Youth',
        slug: 'ritual-of-youth',
        icon: '/images/ritual_youth.png',
        description:
          'Turns every old follower young again and doubles their life expectancy.',
      },
      {
        title: 'Ritual of Reversal',
        slug: 'ritual-of-reversal',
        icon: '/images/ritual_reversal.png',
        description: 'A follower trades one negative trait for a positive one.',
      },
      {
        title: 'Ritual of Love',
        slug: 'ritual-of-love',
        icon: '/images/ritual_fusion.png',
        since: '1.2.2',
        description:
          'Formerly the Mistletoe Ritual. Bind two followers with Strange Material and their friendship jumps to the maximum.',
      },
      {
        title: 'Ritual of Massacre',
        slug: 'ritual-of-massacre',
        icon: '/images/ritual_massres.png',
        since: '1.2.3',
        description:
          'Kills every follower in the cult. Costs 12 Strange Material and asks for confirmation first.',
      },
    ],
  },
  {
    key: 'commands',
    label: 'Commands',
    icon: '/images/customcomms.png',
    blurb: 'Extra options on the follower interaction wheel.',
    entries: [
      {
        title: 'Knucklebones',
        slug: 'knucklebones',
        icon: '/images/knucklebones.png',
        description: 'Play a game of Knucklebones with any follower.',
      },
      {
        title: 'Flip a Coin',
        slug: 'flip-coin',
        icon: '/images/flipcoin.png',
        description: 'Flip a coin with a follower.',
      },
      {
        title: 'Divorce',
        slug: 'divorce',
        icon: '/images/divorce.png',
        description: 'End a marriage between followers.',
      },
      {
        title: 'For I Have Sinned',
        slug: 'for-i-have-sinned',
        icon: '/images/flipcoin.png',
        since: '1.2.2',
        description:
          'Spend 20 Strange Material to delight a follower. They gain a large burst of pleasure and laugh it off.',
      },
    ],
  },
  {
    key: 'items',
    label: 'Items',
    icon: '/images/customitems.png',
    blurb: 'The resources that power the advanced structures.',
    entries: [
      {
        title: 'Strange Material',
        slug: 'strange-material',
        icon: '/images/strange.png',
        description: 'Dropped by the Astrologer. Used by advanced buildings and rituals.',
      },
      {
        title: 'Strange Energy',
        slug: 'strange-energy',
        icon: '/images/strange.png',
        description:
          'Produced by the Strange Generator and the Endless Pit. Powers the Stasis Chamber and other machines.',
      },
    ],
  },
]

export interface TrialEntry {
  title: string
  description: string
}

/** Trial of the Gods, introduced in MiniMods 1.3.0. */
export const trials: TrialEntry[] = [
  {
    title: 'Trial of Narinder',
    description:
      'Each active Augment increases your dodge cooldown by 25%. Each active Trial gives enemies a 10% chance to kill you instantly on hit, and raises your vulnerability by 1% for every enemy you have killed this run.',
  },
  {
    title: 'Trial of Leshy',
    description:
      'For each active Augment, a non-boss enemy taking non-lethal damage has a 5% chance to duplicate at half health. For each active Trial, a copy of every non-boss enemy spawns every 10 seconds at half health.',
  },
  {
    title: 'Trial of Heket',
    description:
      'For each active Trial, taking damage has a 10% chance to cost you a tarot card. For each active Augment, taking damage drains 10% of your curse charge.',
  },
  {
    title: 'Trial of Shamura',
    description:
      'For each active Trial, taking damage heals every enemy for 10% of their health. For each active Augment, enemies gain 0.5% damage resistance each time they are hit, up to 90%.',
  },
  {
    title: 'Trial of Kallamar',
    description:
      'For each active Trial, all enemies drop a pool of poison every 10 seconds, one second faster per Trial. For each active Augment, a pool of poison spawns under you every 15 seconds, one second faster per Augment.',
  },
]

export const augments: TrialEntry[] = [
  { title: 'Augment of Exhaustion', description: 'Every dodge costs 0.1 movement speed, down to a floor of 1.0.' },
  { title: 'Augment of Swarm', description: 'Enemies move 20% faster.' },
  { title: 'Augment of Explosion', description: 'Enemies explode on death.' },
  { title: 'Augment of Bloodpact', description: 'When an enemy dies, other enemies spawn a poison puddle beneath them.' },
  { title: 'Augment of Persistence', description: 'Enemies heal 5% of their health every 3 seconds. Bosses heal 3%.' },
  { title: 'Augment of Resistance', description: 'Enemies have a 25% chance to ignore a hit entirely.' },
  { title: 'Augment of Dissonance', description: 'Dodging costs 20% curse charge, and is impossible below 20%.' },
  { title: 'Augment of Curse', description: 'Every attack drains 5% of your curse charge.' },
  { title: 'Augment of Grace', description: 'When an enemy dies, every other enemy heals 25% of their maximum health.' },
  { title: 'Augment of Bombardment', description: 'Every hit you land spawns two bombs around you.' },
]
