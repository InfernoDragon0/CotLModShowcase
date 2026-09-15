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
/**
 * This part names a slot the selected base skin does not have.
 *
 * Switching base skin changes which attachments exist, and a part pointing at
 * one that is absent simply draws nothing — it does not break the form, so it
 * is flagged rather than removed. Switching back makes it live again, which is
 * exactly why deleting it would be the wrong move.
 */
const notInBaseSkin = computed(() =>
  !!props.part.partName
  && props.slotOptions.length > 0
  && !props.slotOptions.some(option => option.value === props.part.partName),
)

const availableSlots = computed(() => {
  const taken = new Set(props.takenSlots)
  taken.delete(props.part.partName)
  const open = props.slotOptions.filter(option => !taken.has(option.value))

  // A slot the current base skin does not carry is still this part's slot, so
  // it is kept in the list. Without it the menu would match nothing and render
  // as though no slot had been picked at all.
  if (!notInBaseSkin.value) return open
  return [
    {
      label: props.part.partName,
      value: props.part.partName,
      slotIndex: props.part.slotIndex,
      group: 'Not in this base skin',
    },
    ...open,
  ]
})

function onSlotChange(partName: string) {
  const option = props.slotOptions.find(entry => entry.value === partName)
  patch({ partName, slotIndex: option?.slotIndex ?? -1 })
}

const dropping = ref(false)
const rejected = ref('')

async function useFile(file: File) {
  rejected.value = ''

  // A drop can carry anything the desktop allows, and a non-image would read
  // as a data URL quite happily and then fail to decode with no explanation.
  if (!file.type.startsWith('image/')) {
    rejected.value = `"${file.name}" is not an image.`
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    const image = await loadImage(dataUrl)
    patch({ image: { dataUrl, width: image.width, height: image.height } })
  }
  catch {
    rejected.value = `"${file.name}" could not be read as an image.`
  }
}

async function onImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await useFile(file)

  // Lets the same file be picked again after a re-crop outside the browser.
  input.value = ''
}

/**
 * Drops the image, keeping the part.
 *
 * The key is removed rather than set to `undefined`: a part with no image is a
 * legitimate thing to export — it applies only its colours — and that is what
 * `validateVariant` and the exporter both test for.
 */
function clearImage() {
  rejected.value = ''
  const { image: _image, ...rest } = props.part
  emit('update', rest)
}

/**
 * Drag and drop anywhere on the card.
 *
 * Two things make this fiddly. `dragover` has to cancel the event or the
 * browser navigates to the dropped file instead of handing it over. And because
 * these handlers sit on the card root, every child raises `dragenter` and
 * `dragleave` as the pointer crosses it, so a plain boolean would strobe on the
 * way to the thumbnail — hence the depth counter.
 */
let dragDepth = 0

/**
 * Only a drag carrying files is ours.
 *
 * The card is full of inputs, and cancelling every drag that crosses it would
 * also block dropping text into the name field — a native behaviour worth
 * keeping. Text drags are left entirely alone.
 */
function hasFiles(event: DragEvent) {
  return event.dataTransfer?.types?.includes('Files') ?? false
}

function onDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth++
  dropping.value = true
}

function onDragOver(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  // Without this the cursor reads as "move" over some desktops.
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

function onDragLeave(event: DragEvent) {
  if (!hasFiles(event)) return
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) dropping.value = false
}

async function onDrop(event: DragEvent) {
  if (!hasFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  dropping.value = false

  const file = event.dataTransfer?.files?.[0]
  if (file) await useFile(file)
}

/**
 * The transform fields, laid out as one row. Abbreviated because five full
 * labels do not fit across a card, with the full name kept on the tooltip.
 */
const numberFields = [
  { key: 'scaleX', label: 'SX', title: 'Scale X', step: '0.05' },
  { key: 'scaleY', label: 'SY', title: 'Scale Y', step: '0.05' },
  { key: 'rotation', label: 'Rot', title: 'Rotation', step: '1' },
  // An offset is in the game's skeleton space, where the in-game editor's
  // sliders run -1 to 1 and one unit is 200px of artwork. Real values land
  // around a tenth, so a coarser step would skip straight past every one.
  { key: 'offsetX', label: 'OX', title: 'Offset X', step: '0.01' },
  { key: 'offsetY', label: 'OY', title: 'Offset Y', step: '0.01' },
] as const satisfies { key: keyof PartConfig, label: string, title: string, step: string }[]

/**
 * A part with no slot exports, and then draws nothing in game, so it is called
 * out on the card rather than only in the alert list at the top of the page.
 */
const unassigned = computed(() => !props.part.partName || props.part.slotIndex < 0)

/**
 * A part with no image still exports: it recolours whatever the base skin draws
 * in that slot. Worth saying on the card, because an empty thumbnail otherwise
 * reads as something half-finished. A hidden slot draws nothing at all, so the
 * badge does not apply there.
 */
const colourOnly = computed(() => !props.part.image && !props.part.hideSlot)

function setColour(index: number, value: string) {
  const colours = [...props.part.colorChoices]
  colours[index] = value
  patch({ colorChoices: colours })
}
</script>

<template>
  <!-- The whole card takes a dropped image, not just the thumbnail: at this
       size the thumbnail is a small target to hit with a file on the pointer. -->
  <div
    class="flex flex-col gap-3 border bg-default/60 p-4"
    :class="dropping
      ? 'border-primary ring-2 ring-primary/40'
      : unassigned ? 'border-error' : 'border-default'"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="flex items-start gap-3">
      <div class="relative size-16 shrink-0">
        <!-- The thumbnail is the file picker: a separate upload field below the
             part cost a whole row each, on a page that shows twenty of them.
             While a file is over the card this also says where it will land. -->
        <label
          class="group relative flex size-full cursor-pointer items-center justify-center overflow-hidden border bg-charcoal-900 pb-4"
          :class="dropping ? 'border-primary' : 'border-default'"
          :title="`Choose or drop the PNG for ${imageName}`"
        >
          <!-- Decoded off the main thread: switching variants swaps every one of
               these at once, and a synchronous decode per part is what turns
               that into a visible stutter. -->
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
            class="absolute inset-x-0 bottom-0 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-parchment-100 group-hover:bg-crimson-600 group-focus-within:bg-crimson-600"
            :class="dropping ? 'bg-crimson-600' : 'bg-charcoal-950/80'"
          >
            {{ dropping ? 'Drop' : 'Choose' }}
          </span>
          <input
            type="file"
            accept="image/png"
            class="sr-only"
            @change="onImage"
          >
        </label>

        <!-- Deliberately a sibling of the label rather than a child: a button
             inside a label is still liable to trip the file picker. -->
        <UButton
          v-if="part.image"
          icon="i-lucide-x"
          color="neutral"
          size="xs"
          class="absolute -right-2 -top-2 rounded-full"
          :aria-label="`Clear the image for ${imageName}`"
          title="Clear this image. The part keeps its slot and colours."
          @click="clearImage"
        />
      </div>

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

        <p
          v-if="rejected"
          class="text-xs text-error"
        >
          {{ rejected }}
        </p>
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

      <div class="flex items-end justify-between gap-3">
        <!-- Capped rather than growing without limit: a variant can carry a
             dozen colour sets, and at three rows this card was taller than the
             twenty others beside it. `scrollbar-gutter` keeps the swatches from
             shifting sideways as the bar appears. -->
        <div class="flex max-h-28 flex-1 flex-wrap gap-2 overflow-y-auto scrollbar-gutter-stable">
          <div
            v-for="(colour, index) in part.colorChoices"
            :key="index"
            class="flex h-8 items-center gap-1"
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

        <!-- Sit in the card's bottom corner, beside the colours they are
             talking about: with no image, the colours are the whole part. -->
        <div class="flex shrink-0 flex-col items-end gap-1">
          <UBadge
            v-if="notInBaseSkin"
            color="info"
            variant="solid"
            size="sm"
            icon="i-lucide-triangle-alert"
            :title="`This base skin has no &quot;${part.partName}&quot;, so this part draws nothing. It is kept as it is — pick the base skin that has it and it works again.`"
          >
            Not in base skin
          </UBadge>

          <UBadge
            v-if="colourOnly"
            color="secondary"
            variant="solid"
            size="sm"
            icon="i-lucide-palette"
            title="No image, so this part recolours the base skin's own artwork for this slot."
          >
            Color only
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
