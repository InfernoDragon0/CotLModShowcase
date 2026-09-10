/**
 * CultTweaker 2.0 feature set and Worldshaper tooling, from the pre-release 6
 * README, CHANGES and the mod source.
 */

export interface Feature {
  title: string
  description: string
  icon: string
  /** Optional screenshot shown with the feature. */
  image?: string
  /** Documentation page for the feature. */
  to?: string
}

export const features: Feature[] = [
  {
    title: 'The Worldshaper',
    description:
      'An in-game editor on F4 with sixteen tools, a layers panel, multi-select, groups, undo and a whiteboard. Build rooms, dungeons and hubs while the game runs.',
    icon: 'i-lucide-hammer',
    to: '/docs/culttweaker/worldshaper',
  },
  {
    title: 'Custom dungeons',
    description:
      'Turn node blueprints into level blueprints into fully playable dungeons, complete with their own dungeon maps and doors.',
    icon: 'i-lucide-door-open',
    to: '/docs/culttweaker/worldshaper',
  },
  {
    title: 'Base, hubs and world maps',
    description:
      'Edit the real town, build new hubs with the build totem, and draw whole overworlds with nodes, links, unlocks and per-save progress.',
    icon: 'i-lucide-map',
    to: '/docs/culttweaker/worldshaper',
  },
  {
    title: 'Custom player spines',
    description:
      'Load your own Spine skeleton as the Lamb, pick between multiple skins, give each player their own spine in co-op, and transmog fleeces over any of them.',
    icon: 'i-lucide-user',
    image: '/images/culttweaker/fleececycler.png',
    to: '/docs/culttweaker/player-spines',
  },
  {
    title: 'Follower forms and skins',
    description:
      'Build custom follower forms from separate sprites with per-part scale, rotation, offset and colour sets. The F8 editor hot-reloads changes as you work.',
    icon: 'i-lucide-users',
    image: '/images/culttweaker/customfollowerform.png',
    to: '/docs/culttweaker/follower-forms',
  },
  {
    title: 'Custom weapons',
    description:
      'Declare weapons in a player spine config: base type, combo animations, damage, hitboxes, lunges and chain-weapon hook patterns.',
    icon: 'i-lucide-sword',
    to: '/docs/culttweaker/custom-weapons',
  },
  {
    title: 'NPCs with dialogue and quests',
    description:
      'Custom NPCs with branching dialogue, nine goal types, rewards and quest state that lives outside the game save.',
    icon: 'i-lucide-message-square',
    to: '/docs/culttweaker/custom-npc-quests',
  },
  {
    title: 'Custom enemies',
    description:
      'Mimic any vanilla enemy AI, then tune health, scale, speed, attack ranges and boss health bars by name.',
    icon: 'i-lucide-skull',
    to: '/docs/culttweaker/custom-enemies',
  },
  {
    title: 'Structures, items, meals and tarots',
    description:
      'Add sprite or Spine structures, override vanilla building art, and register custom inventory items, meals with recipes, and tarot cards.',
    icon: 'i-lucide-package',
    image: '/images/culttweaker/structure-override.png',
    to: '/docs/culttweaker/custom-structures',
  },
  {
    title: 'Editing together',
    description:
      'Co-edit a map over COTL MP Steam with shared pause, object locking, live drags, per-player selection colours and a resync button.',
    icon: 'i-lucide-users-round',
    to: '/docs/culttweaker/changelog',
  },
  {
    title: 'Menu editor',
    description:
      'Customise the title screen from the main menu itself and save presets under CustomMainMenus.',
    icon: 'i-lucide-layout-dashboard',
    to: '/docs/culttweaker/worldshaper',
  },
  {
    title: 'A modding API',
    description:
      'Ship content from your own mod folder with no code, or reference CultTweakerApi for queries, actions, quest state and content paths.',
    icon: 'i-lucide-plug',
    to: '/docs/culttweaker/modding-api',
  },
]

export interface EditorTool {
  name: string
  icon: string
  description: string
}

/** Worldshaper tools, matching the in-game icon set. */
export const editorTools: EditorTool[] = [
  { name: 'Select', icon: 'Select.png', description: 'Pick, move and group objects. Shift-click to multi-select, Ctrl+G to group.' },
  { name: 'Shape', icon: 'Shape.png', description: 'Draw the ground itself using shape profiles such as dirt and grass.' },
  { name: 'Structure', icon: 'Structures.png', description: 'Place vanilla and custom structures.' },
  { name: 'Enemy', icon: 'Enemies.png', description: 'Place vanilla enemies and anything under Custom (mods).' },
  { name: 'NPC', icon: 'NPCs.png', description: 'Place custom NPCs and wire up their dialogue.' },
  { name: 'Podium', icon: 'Podiums.png', description: 'Place reward podiums, including a dropdown for custom weapons.' },
  { name: 'Trigger', icon: 'Triggers.png', description: 'Camera moves, screen text, cutscenes, lighting and music changes.' },
  { name: 'Door', icon: 'Doors.png', description: 'Connect rooms and set where each exit leads.' },
  { name: 'Whiteboard', icon: 'Whiteboard.png', description: 'Sketch notes and plans directly onto the map.' },
  { name: 'Lighting', icon: 'Lighting.png', description: 'Apply lighting profiles and weather.' },
  { name: 'Music', icon: 'Music.png', description: 'Change the FMOD music event for the room.' },
  { name: 'Level', icon: 'Level.png', description: 'Assemble rooms into level blueprints.' },
  { name: 'Dungeon Builder', icon: 'Dungeon Builder.png', description: 'Turn level blueprints into playable dungeons.' },
  { name: 'Load Map', icon: 'Load Map.png', description: 'Open a saved room or map.' },
  { name: 'Clear', icon: 'Clear.png', description: 'Wipe the current room back to empty.' },
  { name: 'Preview', icon: 'Preview.png', description: 'Hide the editor UI and look at the room as a player would.' },
]

export const hotkeys = [
  { keys: 'F4', action: 'Open or close the Worldshaper' },
  { keys: 'F5', action: 'Test the dungeon, or reset the room' },
  { keys: 'F6', action: 'Hide the editor UI, or flip a world map between play and edit' },
  { keys: 'F7', action: 'Open the CultTweaker panel' },
  { keys: 'F8', action: 'Open the follower skin editor' },
  { keys: 'Ctrl + S', action: 'Quick save' },
  { keys: 'Ctrl + Z', action: 'Undo' },
  { keys: 'Ctrl + G', action: 'Group the selection' },
  { keys: 'WASD or arrows', action: 'Pan the camera' },
  { keys: 'Z / X', action: 'Zoom out and in' },
  { keys: 'Mouse wheel', action: 'Switch tool' },
  { keys: 'Delete', action: 'Delete the selection' },
]

export const screenshots = [
  { src: '/images/culttweaker/1.png', alt: 'A custom player spine standing in a berry field' },
  { src: '/images/culttweaker/customizer.png', alt: 'The follower customiser interface' },
  { src: '/images/culttweaker/fleececycler.png', alt: 'Six lamb skins wearing different fleeces' },
  { src: '/images/culttweaker/structure-override.png', alt: 'A fishing hut before and after a structure override' },
  { src: '/images/culttweaker/customfollowerform.png', alt: 'A hand-drawn custom follower form' },
]
