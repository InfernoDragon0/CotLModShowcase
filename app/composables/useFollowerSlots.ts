/**
 * The follower slot table dumped from the game by CultTweaker's
 * `DumpFollowerSpineAtlas` config option.
 *
 * A part is addressed by a slot index plus an attachment name, and both come
 * from this list.
 */

export interface FollowerSlot {
  SlotIndex: number
  PartName: string
}

/**
 * Parts present in the current game but missing from the follower skeleton
 * bundled with this site, so they cannot be shown in the live preview. They
 * still export correctly and work in game.
 */
export const PREVIEW_GAPS = new Set([
  'EYE_CURSED',
  'Face/MOUTH_CURSED',
  'LESHY_FACE',
  'LESHY_FACE_BRAINWASHED',
  'LESHY_FACE_DISSENTER',
  'LESHY_FACE_HAPPY',
  'LESHY_FACE_POSSESSED',
  'LESHY_FACE_SAD',
  'LESHY_FACE_SCARED',
  'LESHY_FACE_SICK',
  'LESHY_FACE_SIN',
  'MOUTH_CHATTERING1',
  'MOUTH_CHATTERING2',
])

/** Groups parts by their leading word so the picker stays navigable. */
function groupOf(partName: string): string {
  if (partName.includes('/')) return partName.split('/')[0]!
  const [head] = partName.split('_')
  switch (head) {
    case 'HEAD': return 'Head'
    case 'BODY': case 'Body': return 'Body'
    case 'ARM': return 'Arms'
    case 'LEG': return 'Legs'
    case 'EYE': return 'Eyes'
    case 'MOUTH': return 'Mouth'
    case 'EXTRA': return 'Extras'
    default: return 'Other'
  }
}

export function useFollowerSlots() {
  const { data, status, error } = useFetch<FollowerSlot[]>('/data/followerSlots.json', {
    key: 'follower-slots',
    default: () => [],
    server: false,
  })

  /** Part name to slot index. Duplicate names keep their first index. */
  const slotMap = computed(() => {
    const map = new Map<string, number>()
    for (const slot of data.value ?? []) {
      if (!map.has(slot.PartName)) map.set(slot.PartName, slot.SlotIndex)
    }
    return map
  })

  /** Options for a select menu, grouped and sorted. */
  const options = computed(() =>
    [...slotMap.value.entries()]
      .map(([partName, slotIndex]) => ({
        label: partName,
        value: partName,
        slotIndex,
        group: groupOf(partName),
        previewable: !PREVIEW_GAPS.has(partName),
      }))
      .sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label)),
  )

  return { slots: data, slotMap, options, status, error }
}
