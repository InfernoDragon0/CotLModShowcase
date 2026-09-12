<script setup lang="ts">
/**
 * Brings an existing skin into the builder.
 *
 * One file picker takes all three shapes a skin arrives in — a CultTweaker
 * zip, one loose variant folder, or a legacy JSONLoader skin with its
 * spritesheet — because `readSkinFiles` works the format out from the files.
 */
import type { SkinVariant, ValidationIssue } from '~/utils/followerSkin'
import { IMPORT_KIND_LABELS, guessImportKind, readSkinFiles } from '~/utils/skinImport'

const emit = defineEmits<{ imported: [variants: SkinVariant[], skinName: string] }>()

const open = defineModel<boolean>('open', { default: false })

const { slotMap } = useFollowerSlots()

const files = ref<File[]>([])
const busy = ref(false)
const done = ref(false)
const issues = ref<ValidationIssue[]>([])
const errorMessage = ref('')

/** Named from the file extensions alone, so it can be shown before importing. */
const guess = computed(() => {
  const kind = guessImportKind(files.value)
  return kind ? IMPORT_KIND_LABELS[kind] : ''
})

function pick(event: Event) {
  const input = event.target as HTMLInputElement
  files.value = Array.from(input.files ?? [])
  errorMessage.value = ''
  issues.value = []
}

// Reopening after a failed attempt should start clean.
watch(open, (value) => {
  if (value) return
  files.value = []
  issues.value = []
  errorMessage.value = ''
  done.value = false
})

async function run() {
  busy.value = true
  errorMessage.value = ''
  issues.value = []

  try {
    const result = await readSkinFiles(files.value, slotMap.value)
    issues.value = result.issues
    emit('imported', result.variants, result.skinName)

    // Closing would take the warnings with it, and some of them — a part whose
    // PNG was missing from the zip — are worth reading before editing starts.
    if (result.issues.length) done.value = true
    else open.value = false
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
  <UModal
    v-model:open="open"
    title="Import a skin"
  >
    <template #body>
      <div class="flex flex-col gap-5">
        <p class="text-sm text-default">
          Upload either:
        </p>

        <ul class="flex flex-col gap-1.5 text-xs text-muted">
          <li>
            <span class="font-semibold text-default">A CultTweaker skin</span>:
            the exported <code>.zip</code>, or the <code>config.json</code> and
            PNGs from one variant folder.
          </li>
          <li>
            <span class="font-semibold text-default">A JSONLoader skin</span>:
            the old <code>.json</code> and spritesheet. Will be converted to the new format
          </li>
        </ul>

        <div>
          <label class="text-xs font-semibold uppercase tracking-wide text-default">
            Skin files
          </label>
          <input
            type="file"
            multiple
            accept=".zip,.json,.png,application/json,application/zip,image/png"
            class="mt-2 block w-full text-xs text-default file:mr-3 file:border-0 file:bg-elevated file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:text-highlighted"
            @change="pick"
          >
        </div>

        <div
          v-if="files.length"
          class="border border-default bg-default/60 p-3"
        >
          <div class="mb-2 flex items-center justify-between gap-3">
            <span class="text-xs font-semibold uppercase tracking-wide text-muted">
              {{ files.length }} file{{ files.length === 1 ? '' : 's' }}
            </span>
            <span
              v-if="guess"
              class="text-xs font-semibold text-primary"
            >
              {{ guess }}
            </span>
          </div>
          <ul class="flex max-h-28 flex-col gap-0.5 overflow-y-auto">
            <li
              v-for="file in files"
              :key="file.name"
              class="truncate text-xs text-dimmed"
            >
              {{ file.name }}
            </li>
          </ul>
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />

        <UAlert
          v-if="done"
          color="success"
          variant="subtle"
          icon="i-lucide-check"
          description="Imported. It came across with the notes below."
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
          {{ done ? 'Close' : 'Cancel' }}
        </UButton>
        <UButton
          v-if="!done"
          :loading="busy"
          :disabled="!files.length || busy"
          @click="run"
        >
          Import
        </UButton>
      </div>
    </template>
  </UModal>
</template>
