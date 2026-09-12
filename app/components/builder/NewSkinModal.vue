<script setup lang="ts">
/** Asks for a name after "Add new skin" is chosen in the skin picker. */
const emit = defineEmits<{ create: [name: string] }>()

const open = defineModel<boolean>('open', { default: false })

const name = ref('')

watch(open, (value) => {
  if (value) name.value = ''
})

function submit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('create', trimmed)
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New skin"
  >
    <template #body>
      <div class="flex flex-col gap-3">
        <p class="text-sm text-default">
          This becomes the folder name in
          <code>FollowerSkins/</code>, and the name on the exported zip.
        </p>
        <UInput
          v-model="name"
          placeholder="Skin name"
          size="lg"
          class="w-full"
          autofocus
          @keydown.enter="submit"
        />
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
          :disabled="!name.trim()"
          @click="submit"
        >
          Create
        </UButton>
      </div>
    </template>
  </UModal>
</template>
