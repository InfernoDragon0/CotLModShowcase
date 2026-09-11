<script setup lang="ts">
import type { PartConfig } from '~/utils/followerSkin'
import { readFileAsDataUrl, loadImage } from '~/utils/skinImages'

const props = defineProps<{
  imageName: string
  part: PartConfig
  slotOptions: { label: string, value: string, slotIndex: number, group: string }[]
  /** Slots already spoken for by the other parts in this variant. */
  takenSlots: string[]
}>()

const emit = defineEmits<{
  update: [part: PartConfig]
  rename: [name: string]
  remove: []
  addColour: []
  removeColour: [index: number]
}>()

function patch(changes: Partial<PartConfig>) {
  emit('update', { ...props.part, ...changes })
}

/**
 * A slot can only carry one part, so anything another part already uses is
 * dropped from the list - picking it would silently shadow that part.
 */
const availableSlots = computed(() => {
  const taken = new Set(props.takenSlots)
  taken.delete(props.part.partName)
  return props.slotOptions.filter(option => !taken.has(option.value))
})

function onSlotChange(partName: string) {
  const option = props.slotOptions.find(entry => entry.value === partName)
  patch({ partName, slotIndex: option?.slotIndex ?? -1 })
}

async function onImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  patch({ image: { dataUrl, width: image.width, height: image.height } })

  // Lets the same file be picked again after a re-crop outside the browser.
  input.value = ''
}

/**
 * The transform fields, laid out as one row. Abbreviated because five full
 * labels do not fit across a card, with the full name kept on the tooltip.
 */
const numberFields = [
  { key: 'scaleX', label: 'SX', title: 'Scale X', step: '0.05' },
  { key: 'scaleY', label: 'SY', title: 'Scale Y', step: '0.05' },
  { key: 'rotation', label: 'Rot', title: 'Rotation', step: '1' },
  { key: 'offsetX', label: 'OX', title: 'Offset X', step: '0.5' },
  { key: 'offsetY', label: 'OY', title: 'Offset Y', step: '0.5' },
] as const satisfies { key: keyof PartConfig, label: string, title: string, step: string }[]

/**
 * A part with no slot exports, and then draws nothing in game, so it is called
 * out on the card rather than only in the alert list at the top of the page.
 */
const unassigned = computed(() => !props.part.partName || props.part.slotIndex < 0)

function setColour(index: number, value: string) {
  const colours = [...props.part.colorChoices]
  colours[index] = value
  patch({ colorChoices: colours })
}
</script>

<template>
  <div
    class="flex flex-col gap-3 border bg-default/60 p-4"
    :class="unassigned ? 'border-error' : 'border-default'"
  >
    <div class="flex items-start gap-3">
      <!-- The thumbnail is the file picker: a separate upload field below the
           part cost a whole row each, on a page that shows twenty of them. -->
      <label
        class="group relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-default bg-charcoal-900 pb-4"
        :title="`Choose the PNG for ${imageName}`"
      >
        <!-- Decoded off the main thread: switching variants swaps every one of
             these at once, and a synchronous decode per part is what turns that
             into a visible stutter. -->
        <img
          v-if="part.image"
          :src="part.image.dataUrl"
          alt=""
          decoding="async"
          class="max-h-full max-w-full object-contain"
        >
        <UIcon
          v-else
          name="i-lucide-image"
          class="size-5 text-dimmed"
        />
        <!-- A strip along the bottom rather than a full cover, so the part's
             own artwork - or the placeholder - stays readable behind it. -->
        <span
          class="absolute inset-x-0 bottom-0 bg-charcoal-950/80 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-parchment-100 group-hover:bg-crimson-600 group-focus-within:bg-crimson-600"
        >
          Choose
        </span>
        <input
          type="file"
          accept="image/png"
          class="sr-only"
          @change="onImage"
        >
      </label>

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <UInput
          :model-value="imageName"
          size="sm"
          placeholder="Image file name"
          class="w-full"
          @update:model-value="emit('rename', String($event))"
        />

        <div class="flex items-center gap-2">
          <span
            class="shrink-0 text-xs font-semibold uppercase tracking-wide"
            :class="unassigned ? 'text-error' : 'text-muted'"
          >
            Slot
          </span>
          <!-- 175 slots, and one of these menus per part on the page: built as
               plain DOM they stalled the dropdown every time it opened, the same
               way the animation list did. `searchable` is not a Nuxt UI 4 prop -
               the search box is on by default - and only leaked into the DOM. -->
          <USelectMenu
            :model-value="part.partName"
            :items="availableSlots"
            value-key="value"
            :virtualize="true"
            size="sm"
            placeholder="Pick a follower slot"
            class="min-w-0 flex-1"
            :color="unassigned ? 'error' : 'primary'"
            :highlight="unassigned"
            :ui="unassigned ? { placeholder: 'text-error' } : undefined"
            @update:model-value="onSlotChange(String($event))"
          />
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-1">
        <UButton
          :icon="part.hideSlot ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :color="part.hideSlot ? 'primary' : 'neutral'"
          variant="ghost"
          size="sm"
          class="rounded-full"
          :aria-pressed="part.hideSlot"
          :aria-label="part.hideSlot ? 'Show this slot' : 'Hide this slot'"
          :title="part.hideSlot ? 'Slot hidden: the form draws nothing here' : 'Hide this slot'"
          @click="patch({ hideSlot: !part.hideSlot })"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Remove part"
          @click="emit('remove')"
        />
      </div>
    </div>

    <!-- One row of five. The labels are abbreviated to fit; the full name is on
         each field's tooltip. Native spinners are hidden because at this width
         they eat most of the input. -->
    <div class="grid grid-cols-5 gap-2">
      <UFormField
        v-for="field in numberFields"
        :key="field.key"
        :label="field.label"
        :title="field.title"
        size="sm"
        :ui="{ label: 'text-xs' }"
      >
        <UInput
          :model-value="part[field.key]"
          type="number"
          :step="field.step"
          size="sm"
          class="w-full"
          :aria-label="field.title"
          :ui="{ base: 'px-1.5 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]' }"
          @update:model-value="patch({ [field.key]: Number($event) })"
        />
      </UFormField>
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-default">
          Colors
        </span>
        <!-- Adding and removing happen across the whole variant: the game
             rejects a form whose parts disagree on how many colours they have. -->
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          title="Adds a colour to every part in this variant"
          @click="emit('addColour')"
        >
          Add
        </UButton>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="(colour, index) in part.colorChoices"
          :key="index"
          class="flex items-center gap-1"
        >
          <input
            type="color"
            :value="colour"
            class="size-8 cursor-pointer border border-default bg-transparent"
            @input="setColour(index, ($event.target as HTMLInputElement).value.toUpperCase())"
          >
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="part.colorChoices.length <= 1"
            :aria-label="`Remove color ${index + 1}`"
            title="Removes this colour from every part in this variant"
            @click="emit('removeColour', index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
