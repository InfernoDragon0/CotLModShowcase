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
    title: 'Steam peer-to-peer',
    icon: 'i-simple-icons-steam',
    description:
      'No dedicated server and nothing to port forward. The host opens the lobby from the pause menu and invites a Steam friend, or a friend joins straight from the friends list.',
  },
  {
    title: 'One save, no risk',
    icon: 'i-lucide-save',
    description:
      'The session runs on the host\'s save, streamed to the guest in memory. The guest\'s own saves are never written to.',
  },
  {
    title: 'A camera each',
    icon: 'i-lucide-users',
    description:
      'Both players get their own camera and HUD, with health, hearts and curses tracked separately. The guest plays as the vanilla goat.',
  },
  {
    title: 'Dungeons together',
    icon: 'i-lucide-swords',
    description:
      'Room seeds, enemies, damage, knock-outs and revives are replicated. Rewards are instanced, so weapons, curses, relics and tarot cards can be taken by both of you.',
  },
  {
    title: 'Boss fights',
    icon: 'i-lucide-skull',
    description:
      'The statue door cutscene, boss intro, summoned enemies, the boss health bar and the victory screen all reach the guest.',
  },
  {
    title: 'Run the cult together',
    icon: 'i-lucide-home',
    description:
      'Structures, hammering progress, follower commands, indoctrination, work orders and altar rituals replicate — including the follower picked for a sacrifice or a wedding.',
  },
  {
    title: 'Shared inventory',
    icon: 'i-lucide-package-open',
    description:
      'The cult\'s stock is streamed from the host and shown to both players. Buildings the guest places are paid from it, and a placement the host cannot afford is taken back.',
  },
  {
    title: 'Chat and pings',
    icon: 'i-lucide-message-circle',
    description:
      'Press Enter to chat with Steam avatars and lobby events, and middle-click to drop a world ping that both players see.',
  },
  {
    title: 'Mod parity checks',
    icon: 'i-lucide-shield-check',
    description:
      'The handshake compares the protocol, the mod build and every installed plugin by file hash, and refuses to start on a mismatched game version with a message saying why.',
  },
  {
    title: 'CultTweaker aware',
    icon: 'i-lucide-wand',
    description:
      'Custom skins follow all session long, COTL_API content ids are remapped between machines, and the host\'s CultTweaker content can be downloaded on join after a consent prompt.',
  },
  {
    title: 'Co-op world editing',
    icon: 'i-lucide-pencil-ruler',
    description:
      'CultTweaker\'s F4 room editor works over the link: the world freezes for both of you, edits appear live, the peer\'s selection is drawn in amber, and the host saves and ships the file.',
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
      'Load the save you want to play.',
      'Open the pause menu and pick Host Multiplayer.',
      'Invite a friend from the Steam overlay, the friends list or Discord.',
      'Everything is authoritative on your machine, and your save is the one that keeps the progress.',
    ],
  },
  {
    role: 'Guest',
    icon: 'i-lucide-user-plus',
    steps: [
      'Accept the invite, or join from the Steam friends list.',
      'The host\'s world is streamed to you; your own saves stay untouched.',
      'Play with your own camera and HUD, take your own rewards, and build from the shared stock.',
      'Enter opens chat, middle mouse drops a ping.',
    ],
  },
]

export const requirements: string[] = [
  'Cult of the Lamb on Steam, same game version on both machines.',
  'BepInEx 5.4.21 and COTL_API.',
  'The same mods on both sides — the handshake checks every plugin by file hash.',
  'Discord running, if you want Invite to Play and Ask to Join.',
]
