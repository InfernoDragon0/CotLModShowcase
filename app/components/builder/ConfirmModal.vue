<script setup lang="ts">
/**
 * Asks before something that cannot be undone.
 *
 * Skins and variants live only in this browser, so a mis-click is not
 * recoverable from anywhere - there is no copy on a server to restore from.
 */
const open = defineModel<boolean>('open', { default: false })

withDefaults(
  defineProps<{
    title: string
    /** What exactly is about to go, in the reader's own terms. */
    description?: string
    confirmLabel?: string
    loading?: boolean
  }>(),
  { confirmLabel: 'Delete' },
)

const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :description="description"
  >
    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
