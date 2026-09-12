/**
 * COTL MP Steam — feature data for the showcase page.
 *
 * Taken from the mod's README, TESTING.md and the 0.1.0 changelog in
 * `F:\GitProjects\COTL_Steam_OSS`. The build is a closed test, so nothing here
 * links to a download.
 */

export interface MpFeature {
  title: string
  icon: string
  description: string
}

export const features: MpFeature[] = [
  {
    title: 'Steam p2p',
    icon: 'i-simple-icons-steam',
    description:
      'Only available via Steam! The host opens the lobby after entering the base. Join via Steam overlay or Discord invites.',
  },
  {
    title: 'Host Based Save Data',
    icon: 'i-lucide-save',
    description:
      'Session runs on Host Data, streamed to the guest.',
  },
  {
    title: 'Separate Cameras',
    icon: 'i-lucide-users',
    description:
      'Both players get their own camera and can move around freely.',
  },
  {
    title: 'Dungeons together',
    icon: 'i-lucide-swords',
    description:
      'Room seeds, enemies, damage, knock-outs and revives are replicated. Rewards are instanced, so weapons, curses, relics and tarot cards can be taken by both players.',
  },
  {
    title: 'Boss fights',
    icon: 'i-lucide-skull',
    description:
      'Mostly synced, boss health bars, boss cutscene intros, rewards.',
  },
  {
    title: 'Base Building Together',
    icon: 'i-lucide-home',
    description:
      'Structures, progress, follower commands, indoctrination, work orders and rituals replicate.',
  },
  {
    title: 'Shared inventory',
    icon: 'i-lucide-package-open',
    description:
      'Base Building Inventory items are shared between players, from the Host.',
  },
  {
    title: 'Chat and pings',
    icon: 'i-lucide-message-circle',
    description:
      'Press Enter to chat, and middle-click to ping in the world.',
  },
  {
    title: 'Mod parity checks',
    icon: 'i-lucide-shield-check',
    description:
      'Mod build and installed plugins must match on both machines.',
  },
  {
    title: 'CultTweaker & COTL_API Compatible',
    icon: 'i-lucide-wand',
    description:
      'Custom content from CultTweaker and COTL_API content ids are remapped between machines, and the host\'s CultTweaker content can be downloaded on join after a consent prompt.',
  },
  {
    title: 'Co-op world editing',
    icon: 'i-lucide-pencil-ruler',
    description:
      'CultTweaker\'s F4 room editor works online: live edits shared between players. Saving will update both host and guest map files.',
  },
  {
    title: 'Discord presence',
    icon: 'i-simple-icons-discord',
    description:
      'Rich presence with Invite to Play and Ask to Join while Discord is running, showing whether you are at the base, in a dungeon or in a modded hub.',
  },
]

export interface MpStep {
  role: string
  icon: string
  steps: string[]
}

export const howItRuns: MpStep[] = [
  {
    role: 'Host',
    icon: 'i-lucide-crown',
    steps: [
      'Load the save. Open the pause menu and pick Host Multiplayer.',
      'Invite a friend from the Steam overlay, the friends list or Discord.',
    ],
  },
  {
    role: 'Guest',
    icon: 'i-lucide-user-plus',
    steps: [
      'Accept the invite, or join from the Steam friends list.',
      'Alternatively, join via Discord Invites.',
    ],
  },
]

export const requirements: string[] = [
  'Cult of the Lamb on Steam, > 1.5.26, same game version on both machines.',
  'BepInEx 5.4.21 and COTL_API.',
  'The same mods on both sides.',
  '(Optional) Discord running, if you want Invite to Play and Ask to Join.',
]
