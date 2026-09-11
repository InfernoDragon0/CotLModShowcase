<script setup lang="ts">
/**
 * Follower skin builder.
 *
 * Authors CultTweaker follower forms, converts legacy COTL JSONLoader skins
 * into that format, and previews the result on a live Spine skeleton.
 */
import { createPart, sanitiseFileName, validateVariant, type SkinVariant } from '~/utils/followerSkin'
import { SkinExportError, exportProject } from '~/utils/skinExport'
import { triggerDownload } from '~/utils/skinImages'

definePageMeta({ layout: 'showcase' })

useSeoMeta({
  title: 'Follower skin builder',
  description:
    'Build CultTweaker follower forms in the browser, convert old COTL JSONLoader skins, and preview them on a live Spine skeleton.',
})

const store = useSkinProjects()
const { options: slotOptions } = useFollowerSlots()
const toast = useToast()

const importOpen = ref(false)
const newSkinName = ref('')
const colourSet = ref(0)
const activeVariantName = ref('base')
const exporting = ref(false)

onMounted(() => store.load())

const project = computed(() => store.active.value)

const variant = computed<SkinVariant | null>(() => {
  const found = project.value?.variants.find(entry => entry.name === activeVariantName.value)
  return found ?? project.value?.variants[0] ?? null
})

const variantNames = computed(() => project.value?.variants.map(entry => entry.name) ?? [])

/**
 * The first variant is the skin's base form, and CultTweaker loads a form from
 * it, so it stays. Anything after it can go.
 */
const deletableVariant = computed(() =>
  !!variant.value
  && !!project.value
  && project.value.variants.length > 1
  && project.value.variants[0]?.name !== variant.value.name,
)

const partEntries = computed(() => Object.entries(variant.value?.parts ?? {}))

/**
 * Slots this variant has already used. A slot draws one attachment, so a second
 * part pointing at it only shadows the first: the pickers hide what is taken and
 * a variant that covers every slot cannot add another part.
 */
const takenSlots = computed(() => partEntries.value.map(([, part]) => part.partName).filter(Boolean))

const freeSlot = computed(() => {
  const taken = new Set(takenSlots.value)
  return slotOptions.value.find(option => !taken.has(option.value)) ?? null
})

const issues = computed(() => (variant.value ? validateVariant(variant.value) : []))
const blocking = computed(() => issues.value.filter(issue => issue.level === 'error'))

/** Highest colour-set count across parts, for the preview selector. */
const colourSetCount = computed(() =>
  Math.max(1, ...partEntries.value.map(([, part]) => part.colorChoices.length)),
)

async function save() {
  store.touch()
  try {
    await store.persist()
  }
  catch (error) {
    toast.add({
      title: 'Could not save',
      description: error instanceof Error ? error.message : String(error),
      color: 'error',
    })
  }
}

function createProject() {
  const name = newSkinName.value.trim()
  if (!name) return
  store.create(name)
  newSkinName.value = ''
  activeVariantName.value = 'base'
  save()
}

function addPart() {
  if (!variant.value || !freeSlot.value) return
  let name = 'part'
  let index = 1
  while (variant.value.parts[name]) name = `part${++index}`

  // A new part starts on the first slot still going spare and carries the
  // variant's colour count, so it is exportable the moment it is added.
  variant.value.parts[name] = createPart(freeSlot.value.value, freeSlot.value.slotIndex, {
    colorChoices: Array.from({ length: colourSetCount.value }, () => '#FFFFFF'),
  })
  save()
}

/**
 * Colours are a per-variant property that happens to be stored per part: the
 * game reads them as sets, and rejects a form whose parts disagree on how many
 * there are. Both editors therefore act on every part at once.
 */
function addColour() {
  if (!variant.value) return
  const next = colourSetCount.value + 1
  for (const part of Object.values(variant.value.parts)) {
    const colours = [...part.colorChoices]
    while (colours.length < next) colours.push('#FFFFFF')
    part.colorChoices = colours.slice(0, next)
  }
  save()
}

function removeColour(index: number) {
  if (!variant.value || colourSetCount.value <= 1) return
  const count = colourSetCount.value
  for (const part of Object.values(variant.value.parts)) {
    const colours = [...part.colorChoices]
    while (colours.length < count) colours.push('#FFFFFF')
    colours.splice(index, 1)
    part.colorChoices = colours
  }
  if (colourSet.value >= count - 1) colourSet.value = Math.max(0, count - 2)
  save()
}

function updatePart(imageName: string, next: typeof createPart extends never ? never : any) {
  if (!variant.value) return
  variant.value.parts[imageName] = next
  save()
}

function renamePart(oldName: string, rawName: string) {
  if (!variant.value) return
  const newName = sanitiseFileName(rawName)
  if (!newName || newName === oldName || variant.value.parts[newName]) return

  const entries = Object.entries(variant.value.parts)
    .map(([key, value]) => [key === oldName ? newName : key, value] as const)
  variant.value.parts = Object.fromEntries(entries)
  save()
}

function removePart(imageName: string) {
  if (!variant.value) return
  const { [imageName]: _removed, ...rest } = variant.value.parts
  variant.value.parts = rest
  save()
}

function addVariant() {
  if (!project.value) return
  let name = 'variant1'
  let index = 1
  while (project.value.variants.some(entry => entry.name === name)) name = `variant${++index}`
  project.value.variants.push({
    name,
    overrideBaseSkin: variant.value?.overrideBaseSkin ?? 'Cat',
    parts: {},
  })
  activeVariantName.value = name
  save()
}

function onImported(imported: SkinVariant, skinName: string) {
  const created = store.create(skinName)
  created.variants = [imported]
  activeVariantName.value = imported.name
  save()
  toast.add({
    title: 'Skin converted',
    description: `${Object.keys(imported.parts).length} parts imported from the JSONLoader skin.`,
    color: 'success',
  })
}

async function download() {
  if (!project.value) return
  exporting.value = true
  try {
    const result = await exportProject(project.value)
    triggerDownload(result.blob, result.filename)
    toast.add({ title: 'Exported', description: result.filename, color: 'success' })
  }
  catch (error) {
    if (error instanceof SkinExportError) {
      toast.add({
        title: 'Fix these before exporting',
        description: error.issues.filter(issue => issue.level === 'error').map(issue => issue.message).join(' '),
        color: 'error',
      })
    }
    else {
      toast.add({
        title: 'Export failed',
        description: error instanceof Error ? error.message : String(error),
        color: 'error',
      })
    }
  }
  finally {
    exporting.value = false
  }
}

/**
 * Pending destructive action, shown in the confirm dialog.
 *
 * Skins live in this browser and nowhere else, so a deletion cannot be undone
 * from a server copy: both of them ask first.
 */
const confirming = ref<{ title: string, description: string, run: () => Promise<void> } | null>(null)
const confirmOpen = computed({
  get: () => confirming.value !== null,
  set: (value: boolean) => {
    if (!value) confirming.value = null
  },
})
const deleting = ref(false)

function askDeleteProject() {
  if (!project.value) return
  const name = project.value.name
  const id = project.value.id
  confirming.value = {
    title: `Delete "${name}"?`,
    description: 'The skin, every variant in it and all of their images are removed from this browser. This cannot be undone.',
    run: () => store.remove(id),
  }
}

function askDeleteVariant() {
  if (!project.value || !variant.value || !deletableVariant.value) return
  const name = variant.value.name
  const id = project.value.id
  const parts = Object.keys(variant.value.parts).length
  confirming.value = {
    title: `Delete variant "${name}"?`,
    description: parts
      ? `Its ${parts} part${parts === 1 ? '' : 's'} and their images go with it. This cannot be undone.`
      : 'This cannot be undone.',
    run: async () => {
      await store.removeVariant(id, name)
      activeVariantName.value = project.value?.variants[0]?.name ?? 'base'
    },
  }
}

async function runConfirmed() {
  if (!confirming.value) return
  deleting.value = true
  try {
    await confirming.value.run()
    confirming.value = null
  }
  catch (error) {
    toast.add({
      title: 'Could not delete',
      description: error instanceof Error ? error.message : String(error),
      color: 'error',
    })
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <div>
    <ClientOnly>
      <div class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[22rem_1fr]">
          <!-- Projects and preview. Once there is room for two columns this
               column follows the reader down the page, so the preview stays in
               sight while the parts list on the right is scrolled. It scrolls
               within itself if it is ever taller than the window. -->
          <aside class="flex flex-col gap-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <div class="border border-default bg-default/60 p-4">
              <h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-highlighted">
                Guide
              </h2>
              <p class="text-sm text-muted">
                New to follower forms? Read the
                <NuxtLink
                  to="/docs/culttweaker/follower-forms"
                  target="_blank"
                  rel="noopener"
                  class="text-primary underline underline-offset-4"
                >
                  follower forms guide
                </NuxtLink>
                first.
              </p>
            </div>

            <div class="border border-default bg-default/60 p-4">
              <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-highlighted">
                Skins
              </h2>

              <USelectMenu
                v-if="store.projects.value.length"
                v-model="store.activeId.value"
                :items="store.projects.value.map(entry => ({ label: entry.name, value: entry.id }))"
                value-key="value"
                size="sm"
                class="w-full"
              />

              <div class="mt-4 flex gap-2">
                <UInput
                  v-model="newSkinName"
                  placeholder="New skin name"
                  size="sm"
                  class="flex-1"
                  @keydown.enter="createProject"
                />
                <UButton
                  icon="i-lucide-plus"
                  size="sm"
                  :disabled="!newSkinName.trim()"
                  aria-label="Create skin"
                  @click="createProject"
                />
              </div>

              <UButton
                icon="i-lucide-import"
                color="neutral"
                variant="subtle"
                size="sm"
                block
                class="mt-3"
                @click="importOpen = true"
              >
                Import a JSONLoader skin
              </UButton>
            </div>

            <!-- Everything that describes the skin as a whole: what it is
                 called, what it is built on, which variant is being edited, and
                 what to do with it when it is done. -->
            <div
              v-if="project"
              class="border border-default bg-default/60 p-4"
            >
              <h2 class="mb-3 text-sm font-bold uppercase tracking-wide text-highlighted">
                Skin details
              </h2>

              <div class="flex flex-col gap-4">
                <UFormField label="Name" size="sm">
                  <UInput
                    v-model="project.name"
                    size="sm"
                    class="w-full"
                    @blur="save"
                  />
                </UFormField>

                <UFormField
                  v-if="variant"
                  label="Base skin"
                  size="sm"
                >
                  <USelectMenu
                    v-model="variant.overrideBaseSkin"
                    :items="['Cat', 'Dog', 'Fox', 'Deer', 'Rabbit', 'Bear', 'Owl', 'Duck', 'Frog', 'Pig', 'Cow', 'Horse', 'Otter', 'Squirrel', 'Crow', 'Lion', 'Snake', 'Turtle', 'Chicken', 'Monkey']"
                    size="sm"
                    class="w-full"
                    @update:model-value="save"
                  />
                </UFormField>

                <!-- A skin can carry twenty-odd of these. As a row of pills they
                     wrapped over several lines and pushed the preview down the
                     page, so they are picked from a list instead. -->
                <UFormField label="Variant" size="sm">
                  <div class="flex gap-2">
                    <USelectMenu
                      v-model="activeVariantName"
                      :items="variantNames"
                      :virtualize="true"
                      size="sm"
                      class="min-w-0 flex-1"
                    />
                    <UButton
                      icon="i-lucide-plus"
                      size="sm"
                      color="neutral"
                      variant="subtle"
                      aria-label="Add a variant"
                      title="Add a variant"
                      @click="addVariant"
                    />
                    <UButton
                      icon="i-lucide-trash-2"
                      size="sm"
                      color="neutral"
                      variant="ghost"
                      aria-label="Delete this variant"
                      :title="deletableVariant ? 'Delete this variant' : 'A skin needs its base variant'"
                      :disabled="!deletableVariant"
                      @click="askDeleteVariant"
                    />
                  </div>
                </UFormField>

                <div class="flex gap-2">
                  <UButton
                    icon="i-lucide-download"
                    size="sm"
                    class="flex-1 justify-center"
                    :loading="exporting"
                    :disabled="blocking.length > 0"
                    @click="download"
                  >
                    Export zip
                  </UButton>
                  <UButton
                    icon="i-lucide-trash-2"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="askDeleteProject"
                  >
                    Delete
                  </UButton>
                </div>
              </div>
            </div>

            <div
              v-if="project"
              class="border border-default bg-default/60 p-4"
            >
              <BuilderSkinPreviewPanel
                :variant="variant"
                :colour-set="colourSet"
              />

              <UFormField
                v-if="colourSetCount > 1"
                label="Color set"
                size="sm"
                class="mt-4"
              >
                <USelectMenu
                  v-model="colourSet"
                  :items="Array.from({ length: colourSetCount }, (_, index) => ({ label: `Set ${index + 1}`, value: index }))"
                  value-key="value"
                  size="sm"
                  class="w-full"
                />
              </UFormField>
            </div>
          </aside>

          <!-- Editor -->
          <main class="flex flex-col gap-6">
            <div
              v-if="!project"
              class="border border-dashed border-default p-12 text-center"
            >
              <UIcon name="i-lucide-shirt" class="mx-auto size-10 text-dimmed" />
              <p class="mt-4 text-default">
                Create a skin to get started, or import one you already made.
              </p>
            </div>

            <template v-else>
              <UAlert
                v-for="(issue, index) in issues"
                :key="index"
                :color="issue.level === 'error' ? 'error' : 'warning'"
                variant="subtle"
                :icon="issue.level === 'error' ? 'i-lucide-circle-alert' : 'i-lucide-info'"
                :description="issue.message"
              />

              <div class="flex items-center justify-between">
                <h2 class="text-sm font-bold uppercase tracking-wide text-highlighted">
                  Parts
                </h2>
                <UButton
                  icon="i-lucide-plus"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  :disabled="!freeSlot"
                  :title="freeSlot ? 'Add a part' : 'Every follower slot is already used by a part'"
                  @click="addPart"
                >
                  Add part
                </UButton>
              </div>

              <div class="grid gap-4 xl:grid-cols-2">
                <!-- Keyed by variant as well as part name: two variants often
                     use the same part names, and reusing a row across a switch
                     means patching every field in it against unrelated data
                     instead of drawing a fresh one. -->
                <BuilderPartEditor
                  v-for="[imageName, part] in partEntries"
                  :key="`${variant?.name}:${imageName}`"
                  :image-name="imageName"
                  :part="part"
                  :slot-options="slotOptions"
                  :taken-slots="takenSlots"
                  @update="updatePart(imageName, $event)"
                  @rename="renamePart(imageName, $event)"
                  @remove="removePart(imageName)"
                  @add-colour="addColour"
                  @remove-colour="removeColour"
                />
              </div>

              <p
                v-if="!partEntries.length"
                class="border border-dashed border-default p-8 text-center text-sm text-muted"
              >
                No parts yet. Add one, then choose its PNG and its slot.
              </p>
            </template>
          </main>
        </div>
      </div>

      <BuilderImportJsonLoaderModal
        v-model:open="importOpen"
        @imported="onImported"
      />

      <BuilderConfirmModal
        v-model:open="confirmOpen"
        :title="confirming?.title ?? ''"
        :description="confirming?.description"
        :loading="deleting"
        @confirm="runConfirmed"
      />

      <template #fallback>
        <div class="mx-auto max-w-7xl px-6 py-20 text-center text-muted">
          Loading the builder…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
