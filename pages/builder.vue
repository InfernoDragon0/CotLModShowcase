<template>
    <HeaderComponent />
    <div class="flex justify-center h-screen w-full items-center">
        <div class=" w-screen h-screen bg-white flex">
            <template v-if="skinSelectedProps != ''">
                <div class="h-full w-full flex-1 bg-zinc-200">
                    <!-- Content -->
                    <div class="w-full h-full flex flex-1">
                        
                        <div class="w-1/3 h-full bg-zinc-300 p-4 flex flex-col overflow-auto">
                            <!-- Intro Section -->
                            <div class="flex space-x-2 pb-2 justify-between place-items-center">
                                <div class="flex flex-col">
                                    <h2 class="text-2xl text-gray-800 font-bold">Skin Builder</h2>
                                    <h2 class="text-sm text-gray-800">By InfernoDragon0</h2>
                                </div>
                                <div class="flex h-fit space-x-2">
                                    <UButton @click="openFileSelect" icon="i-heroicons-photo-16-solid" class="" color="black" >Upload Spritesheet</UButton>
                                    <UButton onclick="installTutorialModal.showModal()" class="" variant="soft" color="blue">How-to Guide</UButton>
                                </div>
                                
                            </div>
                            <!-- End Intro Section-->

                            <!-- Skin Selection Section -->
                            <div class="flex w-full pt-2 space-x-2">
                                <USelectMenu class="flex-1" size="md" v-model="skinSelectedProps" :options="skinProps" option-attribute="name" searchable>
                                    <template #label>
                                        <div v-if="skinSelectedProps != ''">
                                            <div class="flex place-items-center space-x-2">
                                                <NuxtImg :src="skinSelectedProps.type == 'Follower Skin' ? '/images/Follower-avatars-avatar-normal.png' : '/images/Lamb-idle-still.png'" class="w-auto h-[32px]"/> 
                                            <span class="line-clamp-1">{{ skinSelectedProps.name }}</span> 
                                                <span class="text-sm place-items-center font-normal text-gray-500 line-clamp-1">- {{ skinSelectedProps.type }}</span>
                                            </div>
                                        </div>
                                        <span v-else>Select a Skin</span>
                                    </template>
                                    <template #option="{ option: skin }">
                                        <div class="flex place-items-center space-x-2">
                                            <NuxtImg :src="skin.type == 'Follower Skin' ? '/images/Follower-avatars-avatar-normal.png' : '/images/Lamb-idle-still.png'" class="w-auto h-[32px]"/> 
                                        <span class="line-clamp-1">{{ skin.name }}</span> 
                                            <span class="text-sm place-items-center font-normal text-gray-500 line-clamp-1">--- {{ skin.type }}</span>
                                        </div>
                                    </template>
                                </USelectMenu>
                                <UButton onclick="createSkinModal.showModal()" class="bg-slate-700 hover:bg-slate-500">New Skin</UButton>
                            </div>
                            <!-- End Skin Selection Section-->
                            <UDivider class="mt-4" size="sm" 
                            :ui="{border: { base: 'flex border-gray-500 dark:border-gray-800'}}"
                            />

                            <!-- Spine Preview Section -->
                             <div class="flex py-4 justify-between">
                                <div class="flex flex-col w-[60%] space-y-2">
                                    <h2 class="text-2xl text-gray-800 font-bold">Skin Preview</h2>
                                    <p class="text-sm text-gray-800">Animation Preview</p>
                                    <USelectMenu v-model="skinSelectedProps" :options="skinProps" option-attribute="name" searchable></USelectMenu>
                                    <UCheckbox color="black" v-model="showOverrideSlotOnly" name="showOverrideSlotOnly" label="Show Override Slot Only" />
                                    <UCheckbox color="black" v-model="showOriginalSprite" name="showOriginalSprite" label="Show Original Sprite" />
                                </div>
                                <div class="flex">
                                    <NuxtImg src="/images/Follower-idle.gif" class="w-auto h-[200px]"/>
                                </div>
                            
                            </div>
                            <!-- End Spine Preview Section -->

                            <UDivider class="mt-4" size="sm" 
                                :ui="{border: { base: 'flex border-gray-500 dark:border-gray-800'}}"
                             />
                            
                            <!-- Skin Overrides Section -->
                            <template v-if="'imgsrc' in skinSelectedProps">
                                <h2 class="text-2xl text-gray-800 font-bold py-2">Skin Overrides</h2>
                                <p class="text-lg text-gray-800 py-2">Override Slots</p>
                                
                                <div class="flex space-x-2 pb-4">
                                    <template v-if="skinSelectedProps.type === 'Follower Skin'">
                                        <UInputMenu class="flex-1" v-model="vmodelOverrideSelected" :options="defaultSkinSlotsProps" placeholder="Add an Override Slot"/>
                                    </template>
                                    <template v-else>
                                        <UInputMenu v-model="vmodelOverrideLambSelected" :options="defaultLambSkinSlotsProps" placeholder="Add an Override Slot"/>
                                    </template>
                                    <UButton onclick="overridePresetsModal.showModal()" icon="i-heroicons-plus-circle-16-solid" class="" color="gray" variant="ghost">Override Presets</UButton>
                                </div>
                                
                                <!-- Override Slots Section -->
                                <div class="min-h-[100px] mb-4 overflow-auto flex flex-1">
                                    <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-2 overflow-ellipsis">
                                        <template v-for="overrideData in skinSelectedProps.overrides" :key="overrideData">
                                            <li @click="()=> selectOverride(overrideData.name)" :class="currentSelectedOverrideProps == overrideData.name ? 'bg-info' : 'bg-gray-400'" class="text-gray-800 hover:bg-zinc-200 h-[100px] min-w-[100px] grid items-center p-2 justify-between rounded-md overflow-hidden">
                                                <div class="flex flex-col items-center col-start-1 row-start-1">
                                                    <template v-if="overrideData.coordinates"> 
                                                        <div class="w-16 h-16 mx-2">
                                                            <preview
                                                                :width="64"
                                                                :height="64"
                                                                :image="skinSelectedProps.previewData"
                                                                :coordinates="overrideData.coordinates"
                                                            />
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <img src="https://placehold.co/150x150" class="w-16 h-16 mx-2" alt="Head Eye Left"/>
                                                    </template>
                                                    
                                                    <h3 class="text-sm font-bold line-clamp-1 w-[95px]">{{overrideData.name}}</h3>
                                                    
                                                </div>
                                                
                                                <div class="h-full w-full relative top-0 col-start-1 row-start-1 z-10" :class="currentSelectedOverrideProps == overrideData.name ? '': 'hidden'">
                                                    <UButton icon="i-heroicons-trash-16-solid" color="red" variant="soft" @click="() => removeOverride(overrideData.name)"></UButton>
                                                </div>
                                            </li>
                                        </template>
                                    </ul>
                                </div>

                                <!-- End Override Slots Section -->

                                
                                <!-- Output Section -->
                                <div class="flex space-x-4 justify-end">
                                    <button onclick="deleteSkinModal.showModal()" class="btn btn-ghost text-red-500 w-32 h-12">Delete Skin</button>
                                    <button @click="downloadSkin" class="btn btn-success w-64 h-12">Download Skin</button>
                                </div>
                                <!-- End Output Section -->

                            </template>

                            <template v-else>
                                <div class="w-full h-full flex items-center justify-center">
                                    <p class="text-gray-500 text-2xl">Upload a skin on the right to start overriding</p>
                                </div>
                            </template>
                            
                            
                        </div>
                        <div class="flex flex-col w-2/3 flex-1 bg-zinc-200">
                            <div class="w-full flex px-4 flex-col overflow-auto">
                                <div class="flex-1 bg-black max-h-[75%]">
                                <cropper 
                                    ref="cropperElement"
                                    id="skinImage"
                                    :canvas="{fillcolor: '#ffffff00'}" 
                                    class="" 
                                    background-class="cropper__background"
                                    :src="skinSelectedProps.imgsrc"
                                    :stencil-props="{
                                    }"
                                    @change="change"
                                    :debounce="true"
                                    />
                                </div>
                            
                                <div class="flex justify-end px-4 py-2">
                                    <input type="file" class="hidden" id="file" accept="image/png" @change="fileSelected" />
                                    <!-- <button class="btn btn-ghost text-blue-600  mx-4" @click="openFileSelect">Upload Skin Image</button> -->
                                </div>

                                <!-- Override Slot Editor Section -->

                                <h2 class="text-2xl text-gray-800 py-4 font-bold">Override Slot Editor</h2>
                                <template v-if="currentSelectedOverrideProps.length > 0">
                                    <p class="text-gray-500 pb-2">Updating Override for <span class="font-bold text-info">{{ currentSelectedOverrideProps }}</span></p>
                                </template>
                                <template v-else>
                                    <p class="text-sm text-red-500 pb-2">Select an override slot above to start editing</p>
                                </template>
                                <div class="flex py-2">
                                <UCard class="w-fit">
                                    <template #header>
                                        <p class="text-gray-800 font-bold">Override Position & Scale</p>
                                    </template>
                                    <div class="flex">
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="dataProps.x" type="number" class="w-24 h-8  text-black" placeholder="X Start">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">X</span>
                                                </template>
                                            </UInput>
                                        </div>
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="dataProps.w" type="number" class="w-24 h-8  text-black" placeholder="Width">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">W</span>
                                                </template>
                                            </UInput>
                                        </div>
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="scaleProps.scaleX" type="number" class="w-24 h-8  text-black" placeholder="ScaleX">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">sX</span>
                                                </template>
                                            </UInput>
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="dataProps.y" type="number" class="w-24 h-8  text-black" placeholder="Y Start">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">Y</span>
                                                </template>
                                            </UInput>
                                        </div>
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="dataProps.h" type="number" class="w-24 h-8  text-black" placeholder="Height">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">H</span>
                                                </template>
                                            </UInput>
                                        </div>
                                        <div class="flex p-2 items-center">
                                            <UInput v-model="scaleProps.scaleY" type="number" class="w-24 h-8  text-black" placeholder="ScaleY">
                                                <template #leading>
                                                    <span class="text-gray-500 dark:text-gray-400 text-xs">sY</span>
                                                </template>
                                            </UInput>
                                        </div>
                                    </div>
                                </UCard>
                                <UCard class="w-fit mx-4">
                                    <template #header>
                                        <p class="text-gray-800 font-bold">Override Color</p>
                                    </template>
                                    <input v-model="colorInitial" type="color" class="w-full" />
                                </UCard>
                            </div>


                                <!-- End Override Slot Editor Section -->

                                
                                
                            </div>

                            

                            
                        </div>
                    </div>

                    
                </div>
            </template>
            <template v-else>
                <div class="w-full h-full bg-zinc-200">
                    <div class="w-full h-full flex flex-col items-center justify-center space-y-4">
                        <NuxtImg src="/images/Follower-fishing-fishing.gif" class="w-auto h-32"/>
                        <p class="text-gray-400">CotL Skin Builder by InfernoDragon0</p>
                        <p class="text-gray-500 text-2xl">Select or create a skin to start editing</p>
                        <div class="flex space-x-2 w-[400px]">
                            <USelectMenu class="flex-1" v-model="skinSelectedProps" :options="skinProps" option-attribute="name" searchable>
                                <template #label>
                                    <span v-if="skinSelectedProps != ''" class="">{{ skinSelectedProps.name }} <span class="text-xs font-normal text-gray-500">- {{ skinSelectedProps.type }}</span></span>
                                    <span v-else>Select a Skin</span>
                                </template>
                                <template #option="{ option: skin }">
                                    <div class="flex place-items-center space-x-2">
                                        <NuxtImg :src="skin.type == 'Follower Skin' ? '/images/Follower-avatars-avatar-normal.png' : '/images/Lamb-idle-still.png'" class="w-auto h-[32px]"/> 
                                        <span class="line-clamp-1 text-ellipsis">{{ skin.name }}</span> 
                                        <span class="text-sm place-items-center font-normal text-gray-500 line-clamp-1">--- {{ skin.type }}</span>
                                        
                                    </div>
                                </template>
                            </USelectMenu>
                            <UButton onclick="createSkinModal.showModal()" class="bg-slate-700 hover:bg-slate-500">New Skin</UButton>
                        </div>
                    </div>
                </div>
            </template>
            
        </div>
    </div>

    <dialog id="createSkinModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Create a new Skin</h3>
            <p class="py-4">Name your skin, try not to use any special symbols. Spaces will be converted to underscores when downloading the output.</p>
            <input v-model="skinName" type="text" class="input w-full" placeholder="Skin Name" />
            <p class="py-4">Select the type of skin you are creating</p>
            <div>
                <label class="label cursor-pointer rounded-lg bg-slate-600 m-2 p-4">
                    <div class="flex flex-row place-items-center space-x-2">
                        <NuxtImg class="w-auto h-[32px]" src="/images/Follower-idle.gif"/>
                        <span class="label-text">Follower Skin</span>
                    </div>
                    
                    <input v-model="skinType" type="radio" class="radio" id="follower" name="skinType" value="Follower Skin"/>
                </label>
                <label class="label cursor-pointer rounded-lg bg-slate-600 m-2 p-4">
                    <div class="flex flex-row place-items-center space-x-2">
                        <NuxtImg class="w-auto h-[32px]" src="/images/Lamb-idle.gif"/>
                        <span class="label-text">Lamb Skin</span>
                    </div>
                    <input v-model="skinType" type="radio" class="radio" id="lamb" name="skinType" value="Lamb Skin" />
                </label>
            </div>
            
            <div class="flex space-x-4 justify-end">
                <div class="modal-action">
                    <form class="flex space-x-4" method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                        <button class="btn btn-primary w-32 h-12" @click="createSkin">Create</button>
                    </form>
                    
                </div>
                
            </div>
        </div>
    </dialog>

    <dialog id="deleteSkinModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Delete Skin</h3>
            <p class="py-4">Are you sure you want to delete this skin {{ skinSelectedProps.name }}?</p>
            <div class="flex space-x-4 justify-end">
                <div class="modal-action">
                    <form class="flex space-x-4" method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Cancel</button>
                        <button class="btn btn-primary w-32 h-12" @click="deleteSkin">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>

    <dialog id="installTutorialModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Installation Instructions</h3>
            <p class="py-4">"PNG format, any size. Ensure that it has true transparency (some image editors such as CSP may produce white instead). WARNING: Skin data is stored locally! If you clear the cache of this site, you will need to redo everything."</p>
            <p class="py-4">"Once you have added override slots, select the slot you want to edit, and then in the image preview, drag to select parts of the image to apply to that override slot."</p>
            <p class="py-4">To add the skin to game, follow these instructions, after pressing the green "Download Skin" button.</p>

            <p class="py-2">Ensure that you have COTL JSONLoader installed. You can get it from Thunderstore or Nexusmods.</p>
            <p class="py-2">Place the downloaded JSON file and your .png skin image in the Bepinex Plugins folder.</p>
            <p class="py-2">Note that images are not saved in this app, only the skin configurations. You will need to reupload the skin image whenever you reopen the browser.</p>
            <div class="flex space-x-4 justify-end">
                <div class="modal-action">
                    <form class="flex space-x-4" method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>

    <dialog id="overridePresetsModal" class="modal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Add Override Presets</h3>
            <p class="py-4">Quickly add a set of slots that point to a specific region of the skin to override. Invisible means that it will hide the feature on the skin.</p>
            <label class="label w-fit">
                <input v-model="shouldInvisible" type="checkbox" class="checkbox" id="shouldinvisible" name="invisible" value="invisible" />
                <span class="label-text px-4">Invisible</span>
            </label>
            
            <div class="overflow-auto max-h-[200px]">
                <template v-if="skinSelectedProps.type == 'Follower Skin'">
                    <template v-for="preset in presetsSkinSlotsProps" :key="preset">
                        <button @click="() => addPresetSkinSlot(preset)" class="btn-block btn cursor-pointer rounded-lg bg-slate-600 my-1 p-4">
                            {{ preset.name }}
                        </button>
                    </template>
                </template>
                <template v-else>
                    <p>Presets not available for Lamb skins yet!</p>
                </template>
                
            </div>

            <div class="flex space-x-4 justify-end">
                <div class="modal-action">
                    <form class="flex space-x-4" method="dialog">
                        <!-- if there is a button in form, it will close the modal -->
                        <button class="btn">Close</button>
                    </form>
                </div>
            </div>
        </div>
    </dialog>

    <FooterComponent />
</template>

<script setup>
import { Cropper, Preview } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
//prop refs to be linked to the X, Y, W, H, sX, sY inputs
const dataProps = ref({
    x: 0,
    y: 0,
    w: 150,
    h: 150,
});

const scaleProps = ref({
    scaleX: 1.0,
    scaleY: 1.0
});

const showOverrideSlotOnly = ref(false);
const showOriginalSprite = ref(false);

const skinName = ref('');
const skinType = ref('Follower Skin');
const cropperElement = ref(null);

//listview for skins
const skinProps = ref([]);

const selectedPresets = ref([]);
const shouldInvisible = ref(false);

//presets for defaultSkinSlotsProps
const presetsSkinSlotsProps = ref([
    {
        name: "Mouth", 
        slots: [
            "MOUTH_BEDREST",
            "MOUTH_CHEEKY",
            "MOUTH_DEAD",
            "MOUTH_DERP",
            "MOUTH_ENLIGHTENED",
            "MOUTH_GRIN",
            "MOUTH_HAPPY",
            "MOUTH_HAPPY_2",
            "MOUTH_HUNGRY_1",
            "MOUTH_HUNGRY_2",
            "MOUTH_INDIFFERENT",
            "MOUTH_INDIFFERENT_HUNGRY",
            "MOUTH_INSANE",
            "MOUTH_KISS",
            "MOUTH_KISS_BIG",
            "MOUTH_MUMBLE",
            "MOUTH_MUMBLE_HUNGRY",
            "MOUTH_RED",
            "MOUTH_SACRIFICE",
            "MOUTH_SAD",
            "MOUTH_SADDER",
            "MOUTH_SCARED",
            "MOUTH_SICK",
            "MOUTH_SLEEP_0",
            "MOUTH_SLEEP_1",
            "MOUTH_TALK_HAPPY",
            "MOUTH_TALK_INDIFFERENT",
            "MOUTH_TONGUE_1",
            "MOUTH_TONGUE_2",
            "MOUTH_TONGUE_3",
            "MOUTH_TONGUE_4",
            "MOUTH_WORRIED",
            "MOUTH_ENLIGHTENED_2",
        ]
    },
    {
        name: "Left Eye",
        slots: [
            "LEFT_EYE",
            "LEFT_EYE_ANGRY",
            "LEFT_EYE_ANGRY_UP",
            "LEFT_EYE_BLACK",
            "LEFT_EYE_BRAINWASHED",
            "LEFT_EYE_CLOSED",
            "LEFT_EYE_CRAZY",
            "LEFT_EYE_DEAD",
            "LEFT_EYE_DISSENTER",
            "LEFT_EYE_DISSENTER_ANGRY",
            "LEFT_EYE_ENLIGHTENED",
            "LEFT_EYE_HALF_CLOSED",
            "LEFT_EYE_HALF_CLOSED_ANGRY",
            "LEFT_EYE_INSANE",
            "LEFT_EYE_SACRIFICE_1",
            "LEFT_EYE_SACRIFICE_2",
            "LEFT_EYE_SHOCKED",
            "LEFT_EYE_SICK_2",
            "LEFT_EYE_SICK",
            "LEFT_EYE_SLEEPING",
            "LEFT_EYE_SLEEPING_SICK",
            "LEFT_EYE_SLEEPING_TIRED",
            "LEFT_EYE_SLEEPY",
            "LEFT_EYE_SMILE",
            "LEFT_EYE_SMILE_DOWN",
            "LEFT_EYE_SMILE_UP",
            "LEFT_EYE_SQUINT",
            "LEFT_EYE_STARS",
            "LEFT_EYE_UNCONVERTED",
            "LEFT_EYE_UP",
            "LEFT_EYE_VERY_ANGRY",
            "LEFT_EYE_WHITE",
            "LEFT_EYE_WORRIED",
            "LEFT_EYE_FIRE_1",
            "LEFT_EYE_FIRE_2",
            "LEFT_EYE_FIRE_3",
            "LEFT_EYE_FIRE_4",
            "LEFT_EYE_FIRE_5",
            "LEFT_EYE_FIRE_6",
            "LEFT_EYE_FIRE_7"
        ]
    },
    {
        name: "Right Eye",
        slots: [
            "RIGHT_EYE",
            "RIGHT_EYE_ANGRY",
            "RIGHT_EYE_ANGRY_UP",
            "RIGHT_EYE_BLACK",
            "RIGHT_EYE_BRAINWASHED",
            "RIGHT_EYE_CLOSED",
            "RIGHT_EYE_CRAZY",
            "RIGHT_EYE_DEAD",
            "RIGHT_EYE_DISSENTER",
            "RIGHT_EYE_DISSENTER_ANGRY",
            "RIGHT_EYE_ENLIGHTENED",
            "RIGHT_EYE_HALF_CLOSED",
            "RIGHT_EYE_HALF_CLOSED_ANGRY",
            "RIGHT_EYE_INSANE",
            "RIGHT_EYE_SACRIFICE_1",
            "RIGHT_EYE_SACRIFICE_2",
            "RIGHT_EYE_SHOCKED",
            "RIGHT_EYE_SICK_2",
            "RIGHT_EYE_SICK",
            "RIGHT_EYE_SLEEPING",
            "RIGHT_EYE_SLEEPING_SICK",
            "RIGHT_EYE_SLEEPING_TIRED",
            "RIGHT_EYE_SLEEPY",
            "RIGHT_EYE_SMILE",
            "RIGHT_EYE_SMILE_DOWN",
            "RIGHT_EYE_SMILE_UP",
            "RIGHT_EYE_SQUINT",
            "RIGHT_EYE_STARS",
            "RIGHT_EYE_UNCONVERTED",
            "RIGHT_EYE_UP",
            "RIGHT_EYE_VERY_ANGRY",
            "RIGHT_EYE_WHITE",
            "RIGHT_EYE_WORRIED",
            "RIGHT_EYE_FIRE_1",
            "RIGHT_EYE_FIRE_2",
            "RIGHT_EYE_FIRE_3",
            "RIGHT_EYE_FIRE_4",
            "RIGHT_EYE_FIRE_5",
            "RIGHT_EYE_FIRE_6",
            "RIGHT_EYE_FIRE_7",
        ]
    },
    {
        name: "Head",
        slots: [
            "HEAD_SKIN_BTM",
            "HEAD_SKIN_BTM_BACK",
            "HEAD_SKIN_TOP",
            "HEAD_SKIN_TOP_BACK",
        ]
    },
    {
        name: "Arms",
        slots: [
            "LEFT_ARM_SKIN",
            "LEFT_SLEEVE",
            "WEAPON_HAND_SKIN",
            "RIGHT_ARM_SKIN",
            "RIGHT_SLEEVE",
        ]
    },
    {
        name: "Legs",
        slots: [
            "LEFT_LEG_SKIN",
            "RIGHT_LEG_SKIN",
        ]
    }
]);


//Hardcoded for now
const defaultSkinSlotsProps = ref([
"LEFT_ARM_SKIN",
"LEFT_SLEEVE",
"LEFT_SLEEVE_TOP",
"WEAPON_HAND_SKIN",
"LEFT_LEG_SKIN",
"RIGHT_LEG_SKIN",
"BODY_SKIN",
"BODY_SKIN_BOWED",
"BODY_BTM",
"BODY_BTM_UP",
"BODY_SKIN_UP", 
"Body_Lvl3",
"BODY_EXTRA_UP", 
"BODY_EXTRA", 
"BowlBtm",
"BowlFood", 
"BowlFront",
"RIGHT_ARM_SKIN", 
"RIGHT_SLEEVE",
"RIGHT_SLEEVE_TOP", 
"LEFT_SHAWL", 
"LEFT_SHAWL_UP", 
"RIGHT_SHAWL", 
"RIGHT_SHAWL_UP", 
"HEAD_SKIN_BTM",
"HEAD_SKIN_BTM_BACK",
"MARKINGS",
"HEAD_SKIN_TOP",
"HEAD_SKIN_TOP_BACK", 
"Angry_Colouring",
"Embarrassed_Colouring", 
"Possessed_Colouring", 
"Freezing_Colouring", 
"Hot_Colouring", 
"Sick_Colouring",
"EXTRA_TOP", 
"EXTRA_TOP_BACK", 
"MOUTH_BEDREST",
"MOUTH_CHEEKY",
"MOUTH_DEAD",
"MOUTH_DERP",
"MOUTH_ENLIGHTENED",
"MOUTH_GRIN",
"MOUTH_HAPPY",
"MOUTH_HAPPY_2",
"MOUTH_HUNGRY_1",
"MOUTH_HUNGRY_2", 
"MOUTH_INDIFFERENT", 
"MOUTH_INDIFFERENT_HUNGRY",
"MOUTH_INSANE",
"MOUTH_KISS",
"MOUTH_KISS_BIG", 
"MOUTH_MUMBLE",
"MOUTH_MUMBLE_HUNGRY",
"MOUTH_RED",
"MOUTH_SACRIFICE",
"MOUTH_SAD",
"MOUTH_SADDER",
"MOUTH_SCARED",
"MOUTH_SICK",
"MOUTH_SLEEP_0",
"MOUTH_SLEEP_1",
"MOUTH_TALK_HAPPY",
"MOUTH_TALK_INDIFFERENT",
"MOUTH_TONGUE_1",
"MOUTH_TONGUE_2",
"MOUTH_TONGUE_3",
"MOUTH_TONGUE_4",
"MOUTH_WORRIED",
"MOUTH_FREEZING_1",
"MOUTH_FREEZING_2",
"MOUTH_DEAD_FREEZING",
"MOUTH_HOT",
"MOUTH_CURSED",
"MOUTH_ENLIGHTENED_2",
"RIGHT_EYE",
"RIGHT_EYE_ANGRY",
"RIGHT_EYE_ANGRY_UP",
"RIGHT_EYE_BLACK",
"RIGHT_EYE_BRAINWASHED",
"RIGHT_EYE_CLOSED",
"RIGHT_EYE_CRAZY",
"RIGHT_EYE_DEAD",
"RIGHT_EYE_DISSENTER",
"RIGHT_EYE_DISSENTER_ANGRY",
"RIGHT_EYE_ENLIGHTENED",
"RIGHT_EYE_HALF_CLOSED",
"RIGHT_EYE_HALF_CLOSED_ANGRY",
"RIGHT_EYE_INSANE",
"RIGHT_EYE_SACRIFICE_1",
"RIGHT_EYE_SACRIFICE_2",
"RIGHT_EYE_SHOCKED",
"RIGHT_EYE_SICK_2",
"RIGHT_EYE_SICK",
"RIGHT_EYE_SLEEPING",
"RIGHT_EYE_SLEEPING_SICK",
"RIGHT_EYE_SLEEPING_TIRED",
"RIGHT_EYE_SLEEPY",
"RIGHT_EYE_SMILE",
"RIGHT_EYE_SMILE_DOWN",
"RIGHT_EYE_SMILE_UP",
"RIGHT_EYE_SQUINT",
"RIGHT_EYE_STARS",
"RIGHT_EYE_UNCONVERTED",
"RIGHT_EYE_UP",
"RIGHT_EYE_VERY_ANGRY",
"RIGHT_EYE_WHITE",
"RIGHT_EYE_WORRIED",
"RIGHT_EYE_FIRE_1",
"RIGHT_EYE_FIRE_2",
"RIGHT_EYE_FIRE_3",
"RIGHT_EYE_FIRE_4",
"RIGHT_EYE_FIRE_5",
"RIGHT_EYE_FIRE_6",
"RIGHT_EYE_FIRE_7",
"RIGHT_EYE_WORRIED_FREEZING",
"RIGHT_EYE_DEAD_FREEZING",
"RIGHT_EYE_HOT",
"RIGHT_EYE_CURSED",
"LEFT_EYE",
"LEFT_EYE_ANGRY", 
"LEFT_EYE_ANGRY_UP",
"LEFT_EYE_BLACK",
"LEFT_EYE_BRAINWASHED",
"LEFT_EYE_CLOSED",
"LEFT_EYE_CRAZY",
"LEFT_EYE_DEAD",
"LEFT_EYE_DISSENTER",
"LEFT_EYE_DISSENTER_ANGRY",
"LEFT_EYE_ENLIGHTENED",
"LEFT_EYE_HALF_CLOSED",
"LEFT_EYE_HALF_CLOSED_ANGRY",
"LEFT_EYE_INSANE",
"LEFT_EYE_SACRIFICE_1",
"LEFT_EYE_SACRIFICE_2", 
"LEFT_EYE_SHOCKED",
"LEFT_EYE_SICK_2",
"LEFT_EYE_SICK",
"LEFT_EYE_SLEEPING",
"LEFT_EYE_SLEEPING_SICK", 
"LEFT_EYE_SLEEPING_TIRED",
"LEFT_EYE_SLEEPY",
"LEFT_EYE_SMILE",
"LEFT_EYE_SMILE_DOWN",
"LEFT_EYE_SMILE_UP",
"LEFT_EYE_SQUINT",
"LEFT_EYE_STARS",
"LEFT_EYE_UNCONVERTED",
"LEFT_EYE_UP",
"LEFT_EYE_VERY_ANGRY",
"LEFT_EYE_WHITE",
"LEFT_EYE_WORRIED",
"LEFT_EYE_FIRE_1",
"LEFT_EYE_FIRE_2",
"LEFT_EYE_FIRE_3",
"LEFT_EYE_FIRE_4",
"LEFT_EYE_FIRE_5",
"LEFT_EYE_FIRE_6",
"LEFT_EYE_FIRE_7",
"LEFT_EYE_WORRIED_FREEZING",
"LEFT_EYE_DEAD_FREEZING",
"LEFT_EYE_HOT",
"EYE_CURSED",
"LESHY_FACE",
"LESHY_FACE_HAPPY",
"LESHY_FACE_SAD",
"LESHY_FACE_DISSENTER",
"LESHY_FACE_POSSESSED",
"LESHY_FACE_SCARED",
"LESHY_FACE_SIN",
"LESHY_FACE_BRAINWASHED",
"LESHY_FACE_SICK",
]);

//REGEX: Tuple\.Create\(\d+, "([^"]+)"\) \}, to remove the Tuple.Create(0, "MOUTH_BEDREST") },
const defaultLambSkinSlotsProps = ref([
    "Crown_Particle1",
    "Crown_Particle2",
    "Crown_Particle6", 
    "effects/Crown_Particle3",
    "effects/Crown_Particle4",
    "effects/Crown_Particle5",
    "sunburst",
    "sunburst2",
    "Corpse",
    "Corpse2",
    "Halo",
    "ARM_LEFT",
    "PonchoShoulder",
    "Tools/PITCHFORK",
    "Tools/SEED_BAG",
    "Tools/SPADE",
    "Tools/WATERING_CAN",
    "Tools/FishingRod", 
    "Tools/FishingRod2", 
    "Tools/Mop", 
    "FishingRod_Front", 
    "GauntletHeavya", 
    "GauntletHeavy2a", 
    "images/AttackHand1", 
    "images/AttackHand2", 
    "LEG_LEFT", 
    "LEG_RIGHT", 
    "Body", 
    "PonchoLeft", 
    "PonchoLeft2", 
    "Weapons/Axe", 
    "Weapons/Blunderbuss", 
    "Weapons/Dagger", 
    "Weapons/Hammer", 
    "Weapons/Sword", 
    "DaggerFlipped", 
    "Shield", 
    "Blunderbuss/Flipped", 
    "ARM_RIGHT", 
    "PonchoShoulder_Right", 
    "ArmSpikes", 
    "PonchoRight", 
    "PonchoRight2", 
    "PonchoExtra", 
    "images/Rope", 
    "images/RopeTopRight", 
    "images/RopeTopLeft", 
    "Bell", 
    "Antler", 
    "Antler_RITUAL", 
    "Antler_SERMON", 
    "Antler_Horn", 
    "Antler2", 
    "Antler_SERMON2", 
    "Antler_RITUAL2", 
    "Antler_Horn2", 
    "EAR_LEFT", 
    "EAR_RITUAL", 
    "EAR_SERMON", 
    "CrownGlow", 
    "images/CrownSpikesc", 
    "CROWN", 
    "CROWN_RITUAL", 
    "CROWN_SERMON", 
    "BigCrown", 
    "CROWN_WHITE", 
    "images/CrownEyeShut3a", 
    "images/CrownEyeShut2a", 
    "images/CrownEyeShuta", 
    "CROWN_EYEa", 
    "images/CrownEye_RITUALa", 
    "images/CrownEye_SERMONa", 
    "images/CrownEyeBiga", 
    "images/CrownEyeBig2a", 
    "CrownEyeSina", 
    "CROWN_EYEb", 
    "images/CrownEyeBigb", 
    "images/CrownEyeBig2b", 
    "images/CrownEyeShutb", 
    "images/CrownEyeShut2b", 
    "images/CrownEyeShut3b", 
    "images/CrownEye_RITUALb", 
    "images/CrownEye_SERMONb", 
    "CrownEyeSinb", 
    "HeadBack", 
    "HeadBackDown", 
    "HeadBackDown_RITUAL", 
    "HeadBackDown_SERMON", 
    "HeadFront", 
    "HeadFrontDown", 
    "EAR_RIGHT", 
    "EAR_RIGHT_RITUAL", 
    "EAR_RIGHT_SERMON", 
    "effects/eye_blood", 
    "effects/eye_tears", 
    "effects/eye_blood2", 
    "effects/eye_tears2", 
    "MOUTH_NORMAL", 
    "Face/MOUTH_CHEEKY", 
    "Face/MOUTH_CHUBBY", 
    "Face/MOUTH_DEAD", 
    "Face/MOUTH_GRUMPY", 
    "Face/MOUTH_HAPPY", 
    "Face/MOUTH_INDIFFERENT", 
    "Face/MOUTH_KAWAII", 
    "Face/MOUTH_OO", 
    "Face/MOUTH_OPEN", 
    "Face/MOUTH_SAD", 
    "Face/MOUTH_SCARED", 
    "Face/MOUTH_SLEEP_0", 
    "Face/MOUTH_SLEEP_1", 
    "Face/MOUTH_TONGUE", 
    "Face/MOUTH_UNCONVERTED", 
    "MOUTH_TALK", 
    "MOUTH_TALK_HAPPY", 
    "MOUTH_UNCONVERTED_SPEAK", 
    "MOUTH_GRIMACE", 
    "MOUTH_SNARL", 
    "MOUTH_TALK1", 
    "MOUTH_TALK2", 
    "MOUTH_TALK3", 
    "MOUTH_TALK4", 
    "MOUTH_TALK5", 
    "Face/MOUTH_HUNGRY1", 
    "Face/MOUTH_HUNGRY2", 
    "EYE_LEFT", 
    "EYE_ANGRY_LEFT", 
    "EYE_BACK_LEFT", 
    "EYE_DETERMINED_DOWN_LEFT", 
    "EYE_DETERMINED_LEFT", 
    "EYE_DOWN_LEFT", 
    "EYE_HALF_CLOSED_LEFT", 
    "EYE_HAPPY_LEFT", 
    "EYE_UP_LEFT", 
    "EYE_WORRIED_LEFT", 
    "Face/EYE_CLOSED_LEFT", 
    "Face/EYE_DEAD_LEFT", 
    "Face/EYE_RED_LEFT", 
    "Face/EYE_SHOCKED_LEFT", 
    "Face/EYE_SLEEPING_LEFT", 
    "Face/EYE_SQUINT_LEFT", 
    "Face/EYE_UNCONVERTED_LEFT", 
    "Face/EYE_UNCONVERTED_WORRIED_LEFT", 
    "EYE_ANGRY_LEFT_UP", 
    "EYE_WHITE_LEFT", 
    "EYE_WEARY_LEFT", 
    "EYE_GRIMACE_LEFT", 
    "EYE_WEARY_LEFT_DOWN", 
    "EYE_HAPPY2_LEFT", 
    "Face/EYE_RED_ANGRY_LEFT", 
    "EYE_WHITE_ANGRY_LEFT", 
    "Face/EYE_HAPPY_UP_LEFT", 
    "EYE_RIGHT", 
    "EYE_ANGRY_RIGHT", 
    "EYE_BACK_RIGHT", 
    "EYE_DETERMINED_DOWN_RIGHT", 
    "EYE_DETERMINED_RIGHT", 
    "EYE_DOWN_RIGHT", 
    "EYE_HALF_CLOSED_RIGHT", 
    "EYE_HAPPY_RIGHT", 
    "EYE_UP_RIGHT", 
    "EYE_WORRIED_RIGHT", 
    "Face/EYE_CLOSED_RIGHT", 
    "Face/EYE_DEAD_RIGHT", 
    "Face/EYE_RED_RIGHT", 
    "Face/EYE_SHOCKED_RIGHT", 
    "Face/EYE_SLEEPING_RIGHT", 
    "Face/EYE_SQUINT_RIGHT", 
    "Face/EYE_UNCONVERTED_RIGHT", 
    "Face/EYE_UNCONVERTED_WORRIED_RIGHT", 
    "EYE_ANGRY_RIGHT_UP", 
    "EYE_WHITE_RIGHT", 
    "EYE_WEARY_RIGHT", 
    "EYE_GRIMACE_RIGHT", 
    "EYE_WEARY_RIGHT_DOWN", 
    "EYE_HAPPY2_RIGHT", 
    "Face/EYE_RED_ANGRY_RIGHT", 
    "EYE_WHITE_ANGRY_RIGHT", 
    "Face/EYE_HAPPY_UP_RIGHT", 
    "HairTuft", 
    "Tools/Book_open", 
    "Tools/Book_closed", 
    "Tools/BookFlipping_3", 
    "Tools/BookFlipping_2", 
    "Tools/BookFlipping_1", 
    "Tools/BookFlipping_4", 
    "PonchoRightCorner", 
    "PonchoRightCorner2", 
    "images/CrownMouth", 
    "images/CrownMouthOpen", 
    "DRINK", 
    "Tools/Chalice", 
    "Tools/Chalice_Skull", 
    "Tools/Chalice_Skull_Drink", 
    "effects/slam_effect0006", 
    "effects/slam_effect0005", 
    "effects/slam_effect0004", 
    "effects/slam_effect0003", 
    "effects/slam_effect0002", 
    "effects/slam_effect0001", 
    "images/CrownSpikesa", 
    "images/CrownSpikes2a", 
    "images/CrownSpikesb", 
    "images/CrownSpikes2b", 
    "AttackHand1", 
    "AttackHand2", 
    "GauntletHeavyb", 
    "GauntletHeavy2b", 
    "Weapons/Sling", 
    "Weapons/SlingRope", 
    "GunHand", 
    "SlingHand", 
    "Arm_frontbit", 
    "Arm_frontbit2", 
    "whiteball", 
    "effects/whiteball", 
    "Weapons/SlingHand", 
    "effects/portal_btm", 
    "effects/portal_top", 
    "portal_splash", 
    "GrappleHook", 
    "Weapons/Lute", 
    "Weapons/SlingHand2", 
    "images/Crown_half_left", 
    "images/Crown_half_right", 
    "Sparks1a", 
    "Sparks1b", 
    "Sparks2a", 
    "Sparks2b", 
    "Weapons/SpecialSword_1", 
    "Weapons/SpecialSword_2", 
    "Weapons/SpecialSword_3", 
    "Weapons/SpecialSword_4", 
    "MonsterHeart_glow", 
    "KnowledgeParchment", 
    "Knowledge_Trinket", 
    "Knowledge_Curse", 
    "Knowledge_Decoration", 
    "Knowledge_Weapon", 
    "Tools/Woodaxe", 
    "Tools/Woodaxe2", 
    "Tools/Pickaxe", 
    "Tools/Pickaxe2", 
    "Tools/Hammer", 
    "Net", 
    "Items/WebberSkull", 
    "Tools/Book_open2", 
    "Tools/Book_closed2", 
    "MonsterHeart_glow2", 
    "GiftSmall", 
    "GiftMedium", 
    "RedHeartPickUp", 
    "effects/MonsterBlood1a", 
    "effects/MonsterBlood1b", 
    "MonsterBlood2", 
    "Tools/CardBack", 
    "Tools/CardFront", 
    "Tools/CardBack2", 
    "Tools/CardFront2", 
    "Tools/CardBack3", 
    "Tools/CardFront3", 
    "Tools/CardBack4", 
    "Tools/CardFront4", 
    "Tools/CardBack5", 
    "Tools/CardFront5", 
    "Tools/CardBack6", 
    "Tools/CardFront6", 
    "RitualSymbolHalo", 
    "RitualSymbol_1", 
    "RitualSymbol_2", 
    "effects/RitualRing2", 
    "effects/SermonRing2", 
    "AttackSlash1", 
    "AttackSlash2", 
    "effects/RitualRing", 
    "effects/SermonRing", 
    "CollarPiece1", 
    "CollarPiece2", 
    "ChainBit1", 
    "ChainBit2", 
    "ChainBit1b", 
    "ChainBit3", 
    "SwordHeavy", 
    "Weapons/SwordHeavy_Necromancy", 
    "Weapons/SwordHeavy_Ice", 
    "Weapons/SwordHeavy_Charm", 
    "AxeHeavy", 
    "HammerHeavy", 
    "Blunderbuss_Heavy", 
    "effects/SpawnHeavy_1", 
    "effects/SpawnHeavy_2", 
    "effects/SpawnHeavy_3", 
    "effects/SpawnHeavy_4", 
    "SpawnHeavy_glow", 
    "FireSmall_0001", 
    "FireSmall_0002", 
    "FireSmall_0003", 
    "FireSmall_0004", 
    "FireSmall_0005", 
    "FireSmall_0006", 
    "FireSmall_0007", 
    "FireWild_0001", 
    "FireWild_0002", 
    "FireWild_0003", 
    "FireWild_0004", 
    "FireWild_0005", 
    "FireWild_0006", 
    "FireWild_0007", 
    "FireWild_0008", 
    "FireWild_0009", 
    "effects/chunder_1", 
    "effects/chunder_2", 
    "effects/chunder_3", 
    "Curses/Icon_Curse_Blast", 
    "Curses/Icon_Curse_Fireball", 
    "Curses/Icon_Curse_Slash", 
    "Curses/Icon_Curse_Splatter", 
    "Curses/Icon_Curse_Tentacle",
])

///////////////////////////
const vmodelOverrideSelected = ref('');
const vmodelOverrideLambSelected = ref('');
const skinSelectedProps = ref('');
const currentSelectedOverrideProps = ref('');
const colorInitial = ref('#ffffff');
///////////////////////////

//FINAL OUTPUT
const baseOutputData = ref({
    "$schema": "https://raw.githubusercontent.com/KBMackenzie/COTL_JSONLoader/master/schema/lamb-skin.json",
    "name": "Example Skin",
    "imagePath": "ExampleSkin.png",
    "overrides": [
        {
            "name": "LEFT_ARM_SKIN",
            "rect": "0, 0, 128, 128",
            "scale": "1.5, 1.5",
            "offset": "0.5, -0.5"
        }
    ]
})

const finalOutput = ref({});

onMounted(() => {
    //load from storage
    const skinPropsStorage = localStorage.getItem('skinProps');
    if (skinPropsStorage) {
        skinProps.value = JSON.parse(skinPropsStorage);
    }

    
});

//watchers
watch(()=> scaleProps.value.scaleX, (newVal, oldVal) => {
    if (newVal.length == 0) {
        return;
    }

    //if currentSelectedOverrideProps is not empty, update the override in skinSelectedProps
    if (!currentSelectedOverrideProps.value.length == 0 && currentSelectedOverrideProps.value in skinSelectedProps.value.overrides) {
        skinSelectedProps.value.overrides[currentSelectedOverrideProps.value] = {
            ...skinSelectedProps.value.overrides[currentSelectedOverrideProps.value],
            scaleX: newVal
        }
    }
    //update the skinprops
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinSelectedProps.value.name) {
            skinProps.value[i] = skinSelectedProps.value;
        }
    }

    saveToStorage();
})

watch(()=> scaleProps.value.scaleY, (newVal, oldVal) => {

    //ignore if scale is empty
    if (newVal.length == 0) {
        return;
    }
    //if currentSelectedOverrideProps is not empty, update the override in skinSelectedProps
    if (!currentSelectedOverrideProps.value.length == 0 && currentSelectedOverrideProps.value in skinSelectedProps.value.overrides) {
        skinSelectedProps.value.overrides[currentSelectedOverrideProps.value] = {
            ...skinSelectedProps.value.overrides[currentSelectedOverrideProps.value],
            scaleY: newVal
        }
        //update the skinprops
        for (let i = 0; i < skinProps.value.length; i++) {
            if (skinProps.value[i].name === skinSelectedProps.value.name) {
                skinProps.value[i] = skinSelectedProps.value;
            }
        }

        saveToStorage();
    }
})

watch(() => vmodelOverrideSelected.value, (newVal, oldVal) => {
    console.log(newVal);
    if (newVal === '') {
        return;
    }
    addOverride(newVal);
})
watch(() => vmodelOverrideLambSelected.value, (newVal, oldVal) => {
    console.log(newVal);
    if (newVal === '') {
        return;
    }
    addOverride(newVal);
})

//END WATCHERS

const addPresetSkinSlot = (preset) => {
    console.log(preset);
    //add the preset to the selectedPresets
    const invisValue = shouldInvisible.value;
    selectedPresets.value.push(preset);
    //add the slots to the skinSelectedProps.overrides
    for (let i = 0; i < preset.slots.length; i++) {
        if (preset.slots[i] in skinSelectedProps.value.overrides) {
            // alert('Override slot already exists');
            return;
        }
        skinSelectedProps.value.overrides[preset.slots[i]] = {
            name: preset.slots[i],
            x: dataProps.value.x,
            y: dataProps.value.y,
            w: dataProps.value.w,
            h: dataProps.value.h,
            scaleX: invisValue ? 0 : scaleProps.value.scaleX,
            scaleY: invisValue ? 0 : scaleProps.value.scaleY
        }
    }
    //update the skinprops
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinSelectedProps.value.name) {
            skinProps.value[i] = skinSelectedProps.value;
        }
    }
    //save to storage
    saveToStorage();

}

const change = (data) => {
    dataProps.value = {
        x: data.coordinates.left,
        y: data.coordinates.top,
        w: data.coordinates.width,
        h: data.coordinates.height
    }

    //update current selected override in skinSelectedProps
    if (!currentSelectedOverrideProps.value.length == 0 && currentSelectedOverrideProps.value in skinSelectedProps.value.overrides) {
        skinSelectedProps.value.overrides[currentSelectedOverrideProps.value] = {
            ...skinSelectedProps.value.overrides[currentSelectedOverrideProps.value],
            x: data.coordinates.left,
            y: data.coordinates.top,
            w: data.coordinates.width,
            h: data.coordinates.height,
            coordinates: data.coordinates,
        }
    }
}

const createSkin = (e) => {
    console.log('Creating Skin');
    //get value of skin name
    //get value of skin type
    if (skinName.value === '') {
        alert('Please enter a skin name');
        e.preventDefault()
        return;
    }

    //check if exists in skinprops.name
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinName.value) {
            alert('Skin name already exists');
            return;
        }
    }

    //add to skinProps

    skinProps.value.push({
        name: skinName.value,
        type: skinType.value,
        imgsrc: 'https://placehold.co/500x500',
        overrides: {},
        previewData:{
            src: 'https://placehold.co/500x500',
            width: 500,
            height: 500,
            transforms: {
                rotate: 0,
                flip: {
                    horizonal: false,
                    vertical: false
                }
            }
        }
    });

    //clear values
    skinName.value = '';

    //select the new skin
    skinSelectedProps.value = skinProps.value[skinProps.value.length - 1];

    //save to localstorag
    saveToStorage();
}

const saveToStorage = () => {
    //save skinProps to localstorage
    localStorage.setItem('skinProps', JSON.stringify(skinProps.value));
}

const selectSkin = (e) => {
    console.log(e);
    skinSelectedProps.value = e;

    //clear current selection
    currentSelectedOverrideProps.value = '';
}

const openFileSelect = () => {
    //open a file dialog, only png files
    document.getElementById('file').click();
}

const fileSelected = (e) => {
    console.log(e);
    //get the file
    const file = e.target.files[0];
    //check if file is png
    if (file.type !== 'image/png') {
        alert('Please select a PNG file');
        return;
    }
    //get file name
    const filename = file.name;

    //create the url
    const url = URL.createObjectURL(file);
    //set the file to the cropper
    const reader = new FileReader();
    //TODO: this does not save the skin image to storage, because its just a cache
    reader.onload = (e) => {
        //update selectskinprops with the new data
        console.log(e.width, e.height)
        skinSelectedProps.value = {
            ...skinSelectedProps.value,
            imgsrc: e.target.result,
            filename: filename,
            previewData:{
            src: e.target.result,
            width: e.width,
            height: e.height,
            transforms: {
                rotate: 0,
                flip: {
                    horizonal: false,
                    vertical: false
                }
            }
        }
        }
        // update skinprops with the new data
        for (let i = 0; i < skinProps.value.length; i++) {
            if (skinProps.value[i].name === skinSelectedProps.value.name) {
                skinProps.value[i] = skinSelectedProps.value;
            }
        }
        //save to storage
        saveToStorage();

    }
    reader.readAsDataURL(file);
}

const addOverride = (slotname) => {
    //add an override slot to the skin
    //get the name of the override
    //check if exists in skinSelectedProps.overrides
    //add to skinSelectedProps.overrides
    //save to storage
    //close details panel
    // document.getElementById('overrideselectbox').open = false;


    console.log(slotname)

    if (slotname in skinSelectedProps.value.overrides) {
        alert('Override slot already exists');
        vmodelOverrideLambSelected.value = '';
        vmodelOverrideSelected.value = '';
        return;
    }
   
    skinSelectedProps.value.overrides[slotname] = {
        name: slotname,
        x: dataProps.value.x,
        y: dataProps.value.y,
        w: dataProps.value.w,
        h: dataProps.value.h,
        coordinates: {
            left: dataProps.value.x,
            top: dataProps.value.y,
            width: dataProps.value.w,
            height: dataProps.value.h
        },
        scaleX: scaleProps.value.scaleX,
        scaleY: scaleProps.value.scaleY
    }
    console.log(skinSelectedProps.value)

    //update the skinprops
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinSelectedProps.value.name) {
            skinProps.value[i] = skinSelectedProps.value;
        }
    }

    currentSelectedOverrideProps.value = slotname;
    vmodelOverrideLambSelected.value = '';
    vmodelOverrideSelected.value = '';
    //save to storage
    saveToStorage();
}

const selectOverride = (slotname) => {
    if (!(slotname in skinSelectedProps.value.overrides)) {
        return;
    }
    currentSelectedOverrideProps.value = slotname;
    //set coordinates of cropper
    cropperElement.value.setCoordinates({
        left: skinSelectedProps.value.overrides[slotname].x,
        top: skinSelectedProps.value.overrides[slotname].y,
        width: skinSelectedProps.value.overrides[slotname].w,
        height: skinSelectedProps.value.overrides[slotname].h
    });

    scaleProps.value = {
        scaleX: skinSelectedProps.value.overrides[slotname].scaleX,
        scaleY: skinSelectedProps.value.overrides[slotname].scaleY
    }
}

const removeOverride = (slotname) => {
    console.log(slotname)

    if (!(slotname in skinSelectedProps.value.overrides)) {
        alert('Override slot does not exist');
        return;
    }
   
    delete skinSelectedProps.value.overrides[slotname];
    console.log(skinSelectedProps.value)

    //update the skinprops
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinSelectedProps.value.name) {
            skinProps.value[i] = skinSelectedProps.value;
        }
    }

    currentSelectedOverrideProps.value = '';
    //save to storage
    saveToStorage();
}

const deleteSkin = () => {
    console.log('Deleting Skin');
    //remove from skinProps
    for (let i = 0; i < skinProps.value.length; i++) {
        if (skinProps.value[i].name === skinSelectedProps.value.name) {
            skinProps.value.splice(i, 1);
        }
    }
    //clear skinSelectedProps
    skinSelectedProps.value = '';
    //save to storage
    saveToStorage();
}

const downloadSkin = () => {
    console.log('Downloading Skin');
    //get the skinSelectedProps

    //first we convert the overrides to be in the correct format
    const overrides = [];
    const colors = []
    for (const [key, value] of Object.entries(skinSelectedProps.value.overrides)) {
        overrides.push({
            name: value.name,
            rect: `${value.x}, ${value.y}, ${value.w}, ${value.h}`,
            scale: `${value.scaleX}, ${value.scaleY}`,
            offset: `0, 0`
        });
        colors.push({
            name: value.name,
            hex: colorInitial.value
        })
    }

    const skintype = skinSelectedProps.value.type.toLowerCase().replace(' skin', '')

    // we setup finalOutput
    finalOutput.value = {
        "$schema": "https://raw.githubusercontent.com/KBMackenzie/COTL_JSONLoader/master/schema/" + skintype + "-skin.json",
        "name": skinSelectedProps.value.name,
        "imagePath": skinSelectedProps.value.filename,
        "overrides": overrides,
        "colors": [colors]
    }

    //create the name format such as name_follower.json or name_lamb.json
    const filename = skinSelectedProps.value.name + '_' + skintype + '.json';
    //download as JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(finalOutput.value, null, 4));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

}

</script>

<style>
.cropper__background {
    background: rgb(228 228 231 / 1);
  } 


</style>