<script setup lang="ts">
/**
 * Converts a legacy COTL JSONLoader follower skin — a JSON file plus its
 * spritesheet — into a CultTweaker variant, cropping each part out of the sheet.
 */
import {
  convertJsonLoader,
  type JsonLoaderSkin,
  type SkinVariant,
  type ValidationIssue,
} from '~/utils/followerSkin'
import { cropToPart, loadImage, readFileAsDataUrl, readFileAsText } from '~/utils/skinImages'

const emit = defineEmits<{ imported: [variant: SkinVariant, skinName: string] }>()

const open = defineModel<boolean>('open', { default: false })

const { slotMap } = useFollowerSlots()

const jsonFile = ref<File | null>(null)
const sheetFile = ref<File | null>(null)
const busy = ref(false)
const issues = ref<ValidationIssue[]>([])
const errorMessage = ref('')

const canConvert = computed(() => !!jsonFile.value && !!sheetFile.value && !busy.value)

function pick(target: 'json' | 'sheet', event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  if (target === 'json') jsonFile.value = file
  else sheetFile.value = file
  errorMessage.value = ''
  issues.value = []
}

async function convert() {
  if (!jsonFile.value || !sheetFile.value) return

  busy.value = true
  errorMessage.value = ''
  issues.value = []

  try {
    const text = await readFileAsText(jsonFile.value)
    let skin: JsonLoaderSkin
    try {
      skin = JSON.parse(text)
    }
    catch {
      throw new Error('That file is not valid JSON.')
    }

    if (!Array.isArray(skin.overrides) || skin.overrides.length === 0) {
      throw new Error('No "overrides" array found. This does not look like a JSONLoader skin.')
    }

    const sheet = await loadImage(await readFileAsDataUrl(sheetFile.value))
    const result = convertJsonLoader(skin, slotMap.value)

    // Cut each declared rect out of the spritesheet into its own image.
    for (const converted of result.parts) {
      const { rect } = converted
      if (rect.x + rect.width > sheet.width || rect.y + rect.height > sheet.height) {
        result.issues.push({
          level: 'warning',
          message: `Part "${converted.imageName}" reaches outside the spritesheet and was cropped short.`,
        })
      }
      converted.part.image = cropToPart(sheet, rect)
      result.variant.parts[converted.imageName] = converted.part
    }

    issues.value = result.issues

    if (result.parts.length === 0) {
      throw new Error('Nothing could be converted from that file.')
    }

    emit('imported', result.variant, skin.name || jsonFile.value.name.replace(/\.json$/i, ''))
    open.value = false
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error)
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Import a JSONLoader skin">
    <template #body>
      <div class="flex flex-col gap-5">
        <p class="text-sm text-default">
          Pick the old skin's <code>.json</code> file and the spritesheet it
          points at. Each override is cut out of the sheet into its own image,
          and the colour sets become colour choices.
        </p>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wide text-default">
            Skin JSON
          </label>
          <input
            type="file"
            accept="application/json,.json"
            class="mt-2 block w-full text-xs text-default file:mr-3 file:border-0 file:bg-elevated file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-highlighted"
            @change="pick('json', $event)"
          >
        </div>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wide text-default">
            Spritesheet PNG
          </label>
          <input
            type="file"
            accept="image/png"
            class="mt-2 block w-full text-xs text-default file:mr-3 file:border-0 file:bg-elevated file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-highlighted"
            @change="pick('sheet', $event)"
          >
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />

        <ul
          v-if="issues.length"
          class="flex flex-col gap-2"
        >
          <li
            v-for="(issue, index) in issues"
            :key="index"
            class="text-xs"
            :class="issue.level === 'error' ? 'text-primary' : 'text-secondary'"
          >
            {{ issue.message }}
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          Cancel
        </UButton>
        <UButton
          :loading="busy"
          :disabled="!canConvert"
          @click="convert"
        >
          Convert
        </UButton>
      </div>
    </template>
  </UModal>
</template>
