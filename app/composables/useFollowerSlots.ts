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

export interface SlotOption {
  label: string
  value: string
  slotIndex: number
  group: string
}

/**
 * Part name to slot index.
 *
 * 35 attachment names live on two slots each — the eye names are on both
 * `EYE_LEFT` (102) and `EYE_RIGHT` (101), and two more are shared with
 * `SHAWL_TOP` (86). A picker keyed by name can only offer one of each, so the
 * lower index wins and the rest are unreachable. CultTweaker's own editor has
 * the same limitation from the other end: it lists both, labels them
 * identically, and drops both once either is used.
 */
export function toSlotMap(slots: FollowerSlot[]): Map<string, number> {
  const map = new Map<string, number>()
  for (const slot of slots) {
    const current = map.get(slot.PartName)
    if (current === undefined || slot.SlotIndex < current) map.set(slot.PartName, slot.SlotIndex)
  }
  return map
}

/** Options for a select menu, grouped and sorted. */
export function toSlotOptions(slots: FollowerSlot[]): SlotOption[] {
  return [...toSlotMap(slots).entries()]
    .map(([partName, slotIndex]) => ({
      label: partName,
      value: partName,
      slotIndex,
      group: groupOf(partName),
    }))
    .sort((a, b) => a.group.localeCompare(b.group) || a.label.localeCompare(b.label))
}

/**
 * The slot list of the base skin the preview last drew, published by
 * `useSkinPreview` straight off the loaded skeleton.
 *
 * Empty until the skeleton is in memory, and stays empty if the preview cannot
 * run at all, which is what lets the dumped JSON stand in.
 */
export function useBaseSkinSlots() {
  return useState<FollowerSlot[]>('follower-base-skin-slots', () => [])
}

export function useFollowerSlots() {
  const { data, status, error } = useFetch<FollowerSlot[]>('/data/followerSlots.json', {
    key: 'follower-slots',
    default: () => [],
    server: false,
  })

  const baseSkinSlots = useBaseSkinSlots()

  /**
   * The skeleton wins when it is loaded: its list is the attachments of the
   * base skin actually selected, which is what CultTweaker's in-game editor
   * lists and therefore what the game will accept. `followerSlots.json` is one
   * frozen dump of whichever follower was on screen when it was written, so it
   * serves only as the stand-in until the skeleton arrives.
   */
  const slots = computed<FollowerSlot[]>(() =>
    baseSkinSlots.value.length ? baseSkinSlots.value : (data.value ?? []),
  )

  /** Kept on the full dump: importing re-resolves names for any base skin. */
  const slotMap = computed(() => toSlotMap(data.value ?? []))

  const options = computed(() => toSlotOptions(slots.value))

  /** Whether the options above are the live, base-skin-specific list. */
  const fromSkeleton = computed(() => baseSkinSlots.value.length > 0)

  return { slots, slotMap, options, fromSkeleton, status, error }
}
