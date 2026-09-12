/**
 * Supercharged Tarots and Supercharged Followers.
 *
 * Card data comes from the old showcase page; the Guns Blazing set and the
 * follower boost tables come from each mod's README.
 */

export interface TarotCard {
  name: string
  description: string
  image: string
  /** Solo or Co-op, for sets whose cards only work with a second player. */
  tag?: string
}

export interface TarotSet {
  key: string
  label: string
  blurb: string
  /** 'icon' shows the small in-game sprite, 'card' the full card art. */
  art?: 'icon' | 'card'
  cards: TarotCard[]
}

export const tarotSets: TarotSet[] = [
  {
    key: 'set-1',
    label: 'Set 1: Powerful Tarot Cards',
    blurb: 'The original set. Empowered cards for your taking.',
    cards: [
      { name: 'Shadow Quiver', description: 'Near infinite curse casting.', image: '/images/tarot_arrow.png' },
      { name: 'Deadeye', description: 'Every hit is a critical hit.', image: '/images/tarot_true.png' },
      { name: 'Supernova', description: '300% more curse damage.', image: '/images/tarot_death.png' },
      { name: 'Ruinous Strike', description: '100% more weapon damage.', image: '/images/tarot_solunar.png' },
      { name: 'Ace of Hearts', description: 'Grants ten black hearts.', image: '/images/tarot_hearts.png' },
      {
        name: 'Curse Perfected',
        description:
          'Always a perfect curse cast. Curses that need charging release perfectly at any moment.',
        image: '/images/tarot_arrow.png',
      },
      { name: 'Speedrunner', description: '4x movement speed.', image: '/images/tarot_shoes.png' },
      { name: 'Sonic Surge', description: '5x attack speed.', image: '/images/tarot_attack.png' },
      {
        name: 'The Solunar Eclipse',
        description: '200% more damage during the day, 300% more at night.',
        image: '/images/tarot_eyes.png',
      },
      { name: 'Relic Overdrive', description: '30x relic charge speed.', image: '/images/tarot_relic.png' },
    ],
  },
  {
    key: 'set-2',
    label: 'Set 2: Guns Blazing',
    blurb: 'Blunderbuss based cards. The Gunslinger can be removed from the pool in the mod config.',
    cards: [
      { name: 'The Gunslinger', description: 'Every weapon choice becomes a blunderbuss.', image: '/images/tarot_attack.png' },
      { name: 'Multishot', description: 'Blunderbuss attacks fire in all four directions.', image: '/images/tarot_arrow.png' },
      { name: 'Resilient Gunner', description: 'No recoil when firing the blunderbuss.', image: '/images/tarot_shoes.png' },
      { name: 'Blunder Buster', description: 'Infinite blunderbuss ammo.', image: '/images/tarot_relic.png' },
    ],
  },
  {
    key: 'set-3',
    label: 'Set 3: Unholy Alliance',
    blurb:
      'Empowered cards for the co-op update. Card art by LiteLikesArt.',
    art: 'card',
    cards: [
      {
        name: 'Blood for Blood',
        tag: 'Solo',
        description: 'Killing an enemy grants you half a spirit heart.',
        image: '/images/tarots-ua/tarot_bloodforblood.png',
      },
      {
        name: 'Reinforcement',
        tag: 'Solo',
        description:
          'You are immune to traps, and every time you take damage a combat follower is summoned to fight for you.',
        image: '/images/tarots-ua/tarot_reinforcement.png',
      },
      {
        name: 'Second Wind',
        tag: 'Solo',
        description: 'Gain two blue hearts for every heart you currently have.',
        image: '/images/tarots-ua/tarot_secondwind.png',
      },
      {
        name: 'Final Stand',
        tag: 'Solo',
        description: 'For every dead follower you own, weapon damage goes up by 10%.',
        image: '/images/tarots-ua/tarot_finalstand.png',
      },
      {
        name: 'Static Electricity',
        tag: 'Co-op',
        description: 'While the two of you are close together, pressing Attack calls down lightning strikes.',
        image: '/images/tarots-ua/tarot_staticelectricity.png',
      },
      {
        name: 'Duality',
        tag: 'Co-op',
        description: 'Attacking an enemy heals the other player for half a heart.',
        image: '/images/tarots-ua/tarot_duality.png',
      },
      {
        name: 'Ignite',
        tag: 'Co-op',
        description: 'Both players explode when you press Attack at the same time.',
        image: '/images/tarots-ua/tarot_ignite.png',
      },
      {
        name: 'Transference',
        tag: 'Co-op',
        description: 'Taking damage makes the other player explode in a large radius.',
        image: '/images/tarots-ua/tarot_transference.png',
      },
      {
        name: 'Warding Bond',
        tag: 'Co-op',
        description: 'While the two of you are close together, damage is negated 70% of the time.',
        image: '/images/tarots-ua/tarot_wardingbond.png',
      },
      {
        name: 'Death Contract',
        tag: 'Co-op',
        description:
          'Damage taken to red hearts is transferred to the other player as blue-hearts.',
        image: '/images/tarots-ua/tarot_deathcontract.png',
      },
    ],
  },
]

export interface BoostGroup {
  key: string
  label: string
  blurb: string
  entries: { title: string, description: string }[]
}

export const followerStructures = [
  {
    title: 'Rally Flag',
    description:
      'Left click to rally your followers to battle. Right click to appoint a commander. Click a flag again after every run to let followers join the next fight.',
  },
  {
    title: 'Super Rally Flag',
    description: 'Rally or un-rally every follower at once.',
  },
  {
    title: 'Barracks',
    description:
      'Left click to change a follower class for a different set of bonuses. Right click to spend prestige on levels.',
  },
]

export const followerBoosts: BoostGroup[] = [
  {
    key: 'commander',
    label: 'Commander',
    blurb: 'Only one commander at a time, appointed from the Rally Flag.',
    entries: [
      { title: 'Attack', description: '+3' },
      { title: 'Health', description: '+10' },
      { title: 'Attack speed', description: '+1' },
      { title: 'Movement speed', description: '+9' },
      { title: 'Regeneration per room', description: '+1.5' },
      { title: 'Size', description: 'Double the normal follower size' },
    ],
  },
  {
    key: 'necklaces',
    label: 'Necklaces',
    blurb: 'Equip a necklace to change what a follower brings to the fight.',
    entries: [
      { title: 'Feather', description: 'Movement speed +2' },
      { title: 'Flower', description: 'Attack speed +1' },
      { title: 'Moon', description: 'Damage +1' },
      { title: 'Nature', description: 'Regenerates 0.25 health per room cleared' },
      { title: 'Skull', description: 'Health +3' },
      { title: 'Golden Skull', description: 'Revives on room clear, except in boss rooms' },
    ],
  },
  {
    key: 'classes',
    label: 'Classes',
    blurb: 'Set from the Barracks.',
    entries: [
      { title: 'Missionary', description: 'Movement speed +2, health +1' },
      { title: 'Holiday', description: 'Health +4' },
      { title: 'Warrior', description: 'Damage +2, health +2' },
      { title: 'Prayer', description: 'Damage +4' },
      { title: 'Undertaker', description: 'Regenerates half a heart on finishing a room' },
    ],
  },
  {
    key: 'prestige',
    label: 'Prestige levels',
    blurb:
      'Earn one prestige for each follower still alive when a run ends, up to twelve per run. Levels cost 3/6/9/12/15/20/40/60/80/100.',
    entries: [
      { title: 'Level 1', description: 'Base attack +0.5, base health +0.5 hearts' },
      { title: 'Level 2', description: 'Attack delay -0.25s, base health +0.5 hearts' },
      { title: 'Level 3', description: 'Movement speed +25%, base health +1 heart' },
      { title: 'Level 4', description: 'Base attack +0.5 again, base health +0.5 hearts' },
      { title: 'Level 5', description: 'Attack delay -0.5s more, base health +0.5 hearts' },
      { title: 'Level 6', description: 'Regenerates 0.5 hearts on killing an enemy' },
      { title: 'Level 7', description: '20% chance to drop blue half hearts on a kill' },
      { title: 'Level 8', description: 'Regenerates curse and relic charge when hitting an enemy' },
      { title: 'Level 9', description: '10% chance to drop prestige on a kill' },
      { title: 'Level 10', description: '10% chance to deal a 5x critical hit' },
    ],
  },
]
