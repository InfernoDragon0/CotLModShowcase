<script setup lang="ts">
import type { PartConfig } from '~/utils/followerSkin'
import { readFileAsDataUrl, loadImage } from '~/utils/skinImages'

const props = defineProps<{
  imageName: string
  part: PartConfig
  slotOptions: { label: string, value: string, slotIndex: number, group: string, previewable: boolean }[]
}>()

const emit = defineEmits<{
  update: [part: PartConfig]
  rename: [name: string]
  remove: []
}>()

function patch(changes: Partial<PartConfig>) {
  emit('update', { ...props.part, ...changes })
}

function onSlotChange(partName: string) {
  const option = props.slotOptions.find(entry => entry.value === partName)
  patch({ partName, slotIndex: option?.slotIndex ?? -1 })
}

async function onImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  patch({ image: { dataUrl, width: image.width, height: image.height } })
}

function addColour() {
  patch({ colorChoices: [...props.part.colorChoices, '#FFFFFF'] })
}

function setColour(index: number, value: string) {
  const colours = [...props.part.colorChoices]
  colours[index] = value
  patch({ colorChoices: colours })
}

function removeColour(index: number) {
  patch({ colorChoices: props.part.colorChoices.filter((_, i) => i !== index) })
}

const unassigned = computed(() => props.part.slotIndex < 0)
</script>

<template>
  <div class="flex flex-col gap-4 border border-charcoal-700 bg-charcoal-950/60 p-4">
    <div class="flex items-start gap-4">
      <div class="flex size-16 shrink-0 items-center justify-center border border-charcoal-700 bg-charcoal-900">
        <img
          v-if="part.image"
          :src="part.image.dataUrl"
          alt=""
          class="max-h-full max-w-full object-contain"
        >
        <UIcon
          v-else
          name="i-lucide-image-off"
          class="size-5 text-parchment-600"
        />
      </div>

      <div class="min-w-0 flex-1">
        <UInput
          :model-value="imageName"
          size="sm"
          placeholder="Image file name"
          @update:model-value="emit('rename', String($event))"
        />
        <p class="mt-1 text-xs text-parchment-500">
          Exports as <code>{{ imageName }}.png</code>
        </p>
      </div>

      <UButton
        icon="i-lucide-trash-2"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Remove part"
        @click="emit('remove')"
      />
    </div>

    <UFormField label="Slot" size="sm">
      <USelectMenu
        :model-value="part.partName"
        :items="slotOptions"
        value-key="value"
        searchable
        size="sm"
        placeholder="Pick a follower slot"
        class="w-full"
        @update:model-value="onSlotChange(String($event))"
      />
      <template #help>
        <span v-if="unassigned" class="text-crimson-400">
          This part has no slot yet and will not export.
        </span>
        <span v-else>Slot index {{ part.slotIndex }}</span>
      </template>
    </UFormField>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <UFormField label="Scale X" size="sm">
        <UInput
          :model-value="part.scaleX"
          type="number"
          step="0.05"
          size="sm"
          @update:model-value="patch({ scaleX: Number($event) })"
        />
      </UFormField>
      <UFormField label="Scale Y" size="sm">
        <UInput
          :model-value="part.scaleY"
          type="number"
          step="0.05"
          size="sm"
          @update:model-value="patch({ scaleY: Number($event) })"
        />
      </UFormField>
      <UFormField label="Rotation" size="sm">
        <UInput
          :model-value="part.rotation"
          type="number"
          step="1"
          size="sm"
          @update:model-value="patch({ rotation: Number($event) })"
        />
      </UFormField>
      <UFormField label="Offset X" size="sm">
        <UInput
          :model-value="part.offsetX"
          type="number"
          step="0.5"
          size="sm"
          @update:model-value="patch({ offsetX: Number($event) })"
        />
      </UFormField>
      <UFormField label="Offset Y" size="sm">
        <UInput
          :model-value="part.offsetY"
          type="number"
          step="0.5"
          size="sm"
          @update:model-value="patch({ offsetY: Number($event) })"
        />
      </UFormField>
      <UFormField label="Hide slot" size="sm">
        <USwitch
          :model-value="part.hideSlot"
          @update:model-value="patch({ hideSlot: Boolean($event) })"
        />
      </UFormField>
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-parchment-300">
          Colour choices
        </span>
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="addColour"
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
            class="size-8 cursor-pointer border border-charcoal-700 bg-transparent"
            @input="setColour(index, ($event.target as HTMLInputElement).value.toUpperCase())"
          >
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="ghost"
            :disabled="part.colorChoices.length <= 1"
            :aria-label="`Remove colour ${index + 1}`"
            @click="removeColour(index)"
          />
        </div>
      </div>
    </div>

    <div>
      <label class="text-xs font-semibold uppercase tracking-wide text-parchment-300">
        Part image
      </label>
      <input
        type="file"
        accept="image/png"
        class="mt-2 block w-full text-xs text-parchment-300 file:mr-3 file:border-0 file:bg-crimson-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-black hover:file:bg-crimson-500"
        @change="onImage"
      >
    </div>
  </div>
</template>
