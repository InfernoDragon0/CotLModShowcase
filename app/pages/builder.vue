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

const partEntries = computed(() => Object.entries(variant.value?.parts ?? {}))

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
  if (!variant.value) return
  let name = 'part'
  let index = 1
  while (variant.value.parts[name]) name = `part${++index}`
  variant.value.parts[name] = createPart('', -1)
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

async function deleteProject() {
  if (!project.value) return
  await store.remove(project.value.id)
}
</script>

<template>
  <div>
    <ClientOnly>
      <div class="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div class="grid gap-8 lg:grid-cols-[22rem_1fr]">
          <!-- Projects and preview -->
          <aside class="flex flex-col gap-6">
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
                label="Colour set"
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
              <div class="flex flex-wrap items-center justify-between gap-4 border border-default bg-default/60 p-4">
                <div class="flex items-center gap-3">
                  <UInput
                    v-model="project.name"
                    size="sm"
                    class="w-56"
                    @blur="save"
                  />
                  <UFormField label="" size="sm">
                    <USelectMenu
                      v-if="variant"
                      v-model="variant.overrideBaseSkin"
                      :items="['Cat', 'Dog', 'Fox', 'Deer', 'Rabbit', 'Bear', 'Owl', 'Duck', 'Frog', 'Pig', 'Cow', 'Horse', 'Otter', 'Squirrel', 'Crow', 'Lion', 'Snake', 'Turtle', 'Chicken', 'Monkey']"
                      size="sm"
                      searchable
                      class="w-40"
                      @update:model-value="save"
                    />
                  </UFormField>
                </div>

                <div class="flex flex-wrap gap-2">
                  <UButton
                    icon="i-lucide-download"
                    size="sm"
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
                    @click="deleteProject"
                  >
                    Delete
                  </UButton>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <UButton
                  v-for="entry in project.variants"
                  :key="entry.name"
                  size="sm"
                  :color="entry.name === variant?.name ? 'primary' : 'neutral'"
                  :variant="entry.name === variant?.name ? 'solid' : 'ghost'"
                  @click="activeVariantName = entry.name"
                >
                  {{ entry.name }}
                </UButton>
                <UButton
                  icon="i-lucide-plus"
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  @click="addVariant"
                >
                  Variant
                </UButton>
              </div>

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
                  @click="addPart"
                >
                  Add part
                </UButton>
              </div>

              <div class="grid gap-4 xl:grid-cols-2">
                <BuilderPartEditor
                  v-for="[imageName, part] in partEntries"
                  :key="imageName"
                  :image-name="imageName"
                  :part="part"
                  :slot-options="slotOptions"
                  @update="updatePart(imageName, $event)"
                  @rename="renamePart(imageName, $event)"
                  @remove="removePart(imageName)"
                />
              </div>

              <p
                v-if="!partEntries.length"
                class="border border-dashed border-default p-8 text-center text-sm text-muted"
              >
                No parts yet. Add one, pick a slot, and upload its PNG.
              </p>
            </template>
          </main>
        </div>
      </div>

      <BuilderImportJsonLoaderModal
        v-model:open="importOpen"
        @imported="onImported"
      />

      <template #fallback>
        <div class="mx-auto max-w-7xl px-6 py-20 text-center text-muted">
          Loading the builder…
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
