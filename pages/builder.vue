<template>
    <HeaderComponent />
    <div class="flex justify-center h-screen w-full items-center">
        <div class=" w-screen h-screen bg-white flex">
                <!-- Side Panel -->
                <!-- <div class="w-1/3 bg-zinc-800 relative max-w-[600px]">
                    
                    <div class="p-6 bg-slate-900">
                        <h3 class="text-xl font-bold font-inter">Skins</h3>
                        <p class="text-gray-500 font-inter">Stores a list of your previously built skins here</p>
                        <p onclick="installTutorialModal.showModal()" class="text-blue-500 font-inter"><a href="#">How to Add Skin into Game</a></p> 
                    </div>
                    <div class="tooltip tooltip-left absolute top-4 right-4" onclick="createSkinModal.showModal()" data-tip="Create a new Skin">
                        <button class="btn btn-primary btn-circle w-12 h-12">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                    </div>
                    
                    

                    <div class="bg-slate-700">
                        <ul>
                            <template v-for="skin in skinProps" :key="skin">
                                <li @click="()=> selectSkin(skin)" class="text-gray-100 hover:bg-gray-500 w-full  bg-slate-600 flex items-center px-6 py-2">
                                    <div>
                                        <h3 class="text-md font-inter">{{skin.name}}</h3>
                                        <p class="text-gray-400 text-sm font-inter">{{skin.type}}</p>
                                    </div>
                                </li>
                            </template>
                            
                        </ul>
                    </div>
                </div> -->
                <template v-if="skinSelectedProps != ''">
                    <div class="h-full w-full flex-1 bg-zinc-200">
                        <!-- Content -->
                        <div class="w-full h-full flex flex-1">
                            
                            <div class="w-1/3 h-full bg-zinc-300 p-4 flex flex-col overflow-auto">
                                <div class="flex space-x-2 pb-2">
                                    <h2 class="text-lg text-gray-500 font-bold">Skin Select</h2>
                                    <UButton onclick="installTutorialModal.showModal()" class="" variant="ghost" color="blue">How to Install Skin</UButton>
                                </div>
                                <div class="flex w-full space-x-2">
                                    <USelectMenu class="flex-1" v-model="skinSelectedProps" :options="skinProps" option-attribute="name" searchable>
                                        <template #label>
                                            <span v-if="skinSelectedProps != ''" class=" line-clamp-1">{{ skinSelectedProps.name }} <span class="text-xs font-normal text-gray-500">- {{ skinSelectedProps.type }}</span></span>
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
                                <div class="flex space-x-2 my-2 overflow-auto">
                                    <div class="flex place-items-center space-x-2 p-2 bg-slate-200 rounded-lg min-w-[180px]">
                                        <NuxtImg :src="skinSelectedProps.type == 'Follower Skin' ? '/images/Follower-avatars-avatar-normal.png' : '/images/Lamb-idle-still.png'" class="w-[32px] h-[32px]"/> 
                                        
                                        <span class="text-xs font-normal text-gray-500 line-clamp-1">Custom {{ skinSelectedProps.type }}</span>
                                    </div>
                                    <UButton @click="openFileSelect" icon="i-heroicons-photo-16-solid" class="" color="gray" variant="ghost" >Upload Spritesheet</UButton>
                                </div>  
                                <div class="flex flex-row place-items-center space-x-2">
                                    
                                    
                                </div>
                                <p class="text-gray-500 text-sm mb-4">Upload your skin spritesheet and add override slots for each part you want your skin to apply to.</p>

                                <template v-if="'imgsrc' in skinSelectedProps">
                                    <!-- <div class="w-full">
                                        <details class="dropdown w-[500px]" id="overrideselectbox">
                                            <summary class="btn w-full">Add an override slot</summary>
                                            <ul class="my-2 p-2 menu dropdown-content z-[1] bg-gray-100 shadow-lg rounded-box w-[800px] max-h-[400px] overflow-auto">
                                                <template v-if="skinSelectedProps.type === 'Follower Skin'">
                                                    <template v-for="slot in defaultSkinSlotsProps" :key="slot">
                                                        <li @click="()=> addOverride(slot)" class="hover:bg-zinc-200 text-gray-800"><a>{{slot}}</a></li>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <template v-for="slot in defaultLambSkinSlotsProps" :key="slot">
                                                        <li @click="()=> addOverride(slot)" class="hover:bg-zinc-200 text-gray-800"><a>{{slot}}</a></li>
                                                    </template>
                                                </template>
                                            </ul>
                                        </details>
                                    </div> -->
                                    <h2 class="text-lg text-gray-500 font-bold py-2">Overrides
                                        <span 
                                        class="tooltip text-sm font-normal tooltip-right inline-block ml-2 text-blue-600 cursor-pointer" 
                                        @click="openModal"
                                        data-tip="Once you have added override slots, select the slot you want to edit, and then in the image preview, drag to select parts of the image to apply to that override slot.">
                                        How to use
                                    </span>
                                    </h2>
                                    
                                    <div class="flex space-x-2 pb-4">
                                        <template v-if="skinSelectedProps.type === 'Follower Skin'">
                                            <UInputMenu class="flex-1" v-model="vmodelOverrideSelected" :options="defaultSkinSlotsProps" placeholder="Add an Override Slot"/>
                                        </template>
                                        <template v-else>
                                            <UInputMenu v-model="vmodelOverrideLambSelected" :options="defaultLambSkinSlotsProps" placeholder="Add an Override Slot"/>
                                        </template>
                                        <UButton onclick="overridePresetsModal.showModal()" icon="i-heroicons-plus-circle-16-solid" class="" color="gray" variant="ghost">Override Presets</UButton>
                                    </div>
                                    <p class="text-gray-500 text-sm mb-4 font-inter">
                                        Note: Mini-previews are fixed aspect ratio (1:1) and may not accurately depict the actual selected region.
                                        <span class="text-blue-600"><a href="https://cotl-api.vercel.app/reference/skins/" target="_blank">Slot Reference</a></span>
                                    </p>
                                    <div class="max-h-[400px] overflow-auto">
                                        <ul>
                                            <template v-for="overrideData in skinSelectedProps.overrides" :key="overrideData">
                                                <li @click="()=> selectOverride(overrideData.name)" :class="currentSelectedOverrideProps == overrideData.name ? 'bg-slate-100' : ''" class="text-gray-800 hover:bg-zinc-200 w-full flex items-center py-2 justify-between">
                                                    <div class="flex items-center">
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

                                                        <div>
                                                            <h3 class="text-md">{{overrideData.name}}</h3>
                                                            <p class="text-gray-400 text-sm">X: {{overrideData.x}}, Y: {{overrideData.y}}, W: {{overrideData.w}}, H:{{overrideData.h}}, ScaleX:{{overrideData.scaleX}}, ScaleY:{{overrideData.scaleY}}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="p-4">
                                                        <button @click="() => removeOverride(overrideData.name)" class="btn btn-ghost text-red-500">Delete</button>
                                                    </div>
                                                </li>
                                            </template>
                                        </ul>
                                    </div>

                                    <h2 class="text-lg text-gray-500 font-bold py-4">Color</h2>
                                    <p class="text-gray-500 text-sm mb-4 font-inter">You can add color to the override slots, this will apply a color overlay to the selected area of the skin. Currently, only supports one color and applies to all overrides.</p>
                                    <input v-model="colorInitial" type="color" class="h-12" />

                                    <div class="flex space-x-4 justify-end">
                                        <button onclick="deleteSkinModal.showModal()" class="btn btn-ghost text-red-500 w-32 h-12">Delete Skin</button>
                                        <button @click="downloadSkin" class="btn btn-success w-64 h-12">Download Skin</button>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="w-full h-full flex items-center justify-center">
                                        <p class="text-gray-500 text-2xl">Upload a skin on the right to start overriding</p>
                                    </div>
                                </template>
                                
                                
                            </div>
                            <div class="flex flex-col w-2/3 flex-1 bg-zinc-200 pr-12">
                                <h2 class="text-lg text-gray-500 p-4">
                                    <span class="text-lg font-bold">Image Preview: </span>
                                    <span class="text-gray-400">Scroll to Zoom. Select the area to use as overrides.</span>
                                    <span 
                                        class="tooltip tooltip-bottom inline-block ml-2 text-gray-800 cursor-pointer" 
                                        @click="openModal"
                                        data-tip="PNG format, any size. Ensure that it has true transparency (some image editors such as CSP may produce white instead). WARNING: Skin data is stored locally! If you clear the cache of this site, you will need to redo everything.">
                                        ?
                                    </span>
                                </h2>
                                <template v-if="currentSelectedOverrideProps.length > 0">
                                    <p class="px-4 text-sm text-gray-500 pb-2">Updating Override for <span class="font-bold">{{ currentSelectedOverrideProps }}</span></p>
                                </template>
                                <template v-else>
                                    <p class="px-4 text-sm text-red-500 pb-2">Select an override slot on the left to start editing</p>
                                </template>
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
                                    
                                    <div class="flex">
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">X:</p>
                                            <input v-model="dataProps.x" type="text" class="input w-24 h-8 bg-white text-black" placeholder="X Start" />
                                        </div>
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">W:</p>
                                            <input v-model="dataProps.w" type="text" class="input w-24 h-8 bg-white text-black" placeholder="Width" />
                                        </div>
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">sX:</p>
                                            <input v-model="scaleProps.scaleX" type="text" class="input w-24 h-8 bg-white text-black" placeholder="ScaleX" />
                                        </div>
                                    </div>
                                    <div class="flex">
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">Y:</p>
                                            <input v-model="dataProps.y" type="text" class="input w-24 h-8 bg-white text-black" placeholder="Y Start" />
                                        </div>
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">H:</p>
                                            <input v-model="dataProps.h" type="text" class="input w-24 h-8 bg-white text-black" placeholder="Height" />
                                        </div>
                                        <div class="flex p-4 items-center">
                                            <p class="text-gray-800 p-2">sY:</p>
                                            <input v-model="scaleProps.scaleY" type="text" class="input w-24 h-8 bg-white text-black" placeholder="ScaleY" />
                                        </div>
                                    </div>
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
"WEAPON_HAND_SKIN",
"LEFT_LEG_SKIN",
"RIGHT_LEG_SKIN",
"BODY_SKIN",
"BODY_SKIN_BOWED",
"BODY_SKIN_UP",
"Body_Lvl3",
"BowlBtm",
"BowlFood",
"BowlFront",
"RIGHT_ARM_SKIN",
"RIGHT_SLEEVE",
"HEAD_SKIN_BTM",
"HEAD_SKIN_BTM_BACK",
"HEAD_SKIN_TOP",
"HEAD_SKIN_TOP_BACK",
"MARKINGS",
"Angry_Colouring",
"Embarrassed_Colouring",
"Possessed_Colouring",
"Sick_Colouring",
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
]);

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
"Halo",
"ARM_LEFT",
"PonchoShoulder",
"FishingRod_Front",
"Tools/FishingRod",
"Tools/FishingRod2",
"Tools/Mop",
"Tools/PITCHFORK",
"Tools/SEED_BAG",
"Tools/SPADE",
"Tools/WATERING_CAN",
"LEG_LEFT",
"LEG_RIGHT",
"Body",
"PonchoLeft",
"PonchoLeft2",
"DaggerFlipped",
"Weapons/Axe",
"Weapons/Blunderbuss",
"Weapons/Dagger",
"Weapons/Hammer",
"Weapons/Sword",
"ARM_RIGHT",
"ArmSpikes",
"PonchoRight",
"PonchoRight2",
"PonchoExtra",
"images/Rope",
"images/RopeTopRight",
"images/RopeTopLeft",
"Bell",
"Antler",
"Antler_Horn",
"Antler_RITUAL",
"Antler_SERMON",
"EAR_LEFT",
"EAR_RITUAL",
"EAR_SERMON",
"CrownGlow",
"images/CrownSpikes",
"BigCrown",
"CROWN",
"CROWN_RITUAL",
"CROWN_SERMON",
"CROWN_WHITE",
"CROWN_EYE",
"images/CrownEyeBig",
"images/CrownEyeShut",
"images/CrownEyeShut2",
"images/CrownEyeShut3",
"images/CrownEye_RITUAL",
"images/CrownEye_SERMON",
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
"MOUTH_GRIMACE",
"MOUTH_NORMAL",
"MOUTH_SNARL",
"MOUTH_TALK",
"MOUTH_TALK1",
"MOUTH_TALK2",
"MOUTH_TALK3",
"MOUTH_TALK4",
"MOUTH_TALK5",
"MOUTH_TALK_HAPPY",
"MOUTH_UNCONVERTED_SPEAK",
"EYE",
"EYE_ANGRY_LEFT",
"EYE_ANGRY_LEFT_UP",
"EYE_BACK",
"EYE_DETERMINED_DOWN_LEFT",
"EYE_DETERMINED_LEFT",
"EYE_DOWN",
"EYE_GRIMACE",
"EYE_HALF_CLOSED",
"EYE_HAPPY",
"EYE_HAPPY2",
"EYE_UP",
"EYE_WEARY_LEFT",
"EYE_WEARY_LEFT_DOWN",
"EYE_WHITE",
"EYE_WHITE_ANGRY",
"EYE_WORRIED_LEFT",
"Face/EYE_CLOSED",
"Face/EYE_DEAD",
"Face/EYE_RED",
"Face/EYE_RED_ANGRY",
"Face/EYE_SHOCKED",
"Face/EYE_SLEEPING",
"Face/EYE_SQUINT",
"Face/EYE_UNCONVERTED",
"Face/EYE_UNCONVERTED_WORRIED",
"EYE_ANGRY_RIGHT",
"EYE_ANGRY_RIGHT_UP",
"EYE_DETERMINED_DOWN_RIGHT",
"EYE_DETERMINED_RIGHT",
"EYE_WEARY_RIGHT",
"EYE_WEARY_RIGHT_DOWN",
"EYE_WORRIED_RIGHT",
"HairTuft",
"Tools/BookFlipping_1",
"Tools/BookFlipping_2",
"Tools/BookFlipping_3",
"Tools/BookFlipping_4",
"Tools/Book_closed",
"Tools/Book_open",
"PonchoRightCorner",
"images/CrownMouth",
"images/CrownMouthOpen",
"Tools/Chalice",
"Tools/Chalice_Skull",
"Tools/Chalice_Skull_Drink",
"effects/slam_effect0001",
"effects/slam_effect0002",
"effects/slam_effect0003",
"effects/slam_effect0004",
"effects/slam_effect0005",
"effects/slam_effect0006",
"images/CrownSpikes2",
"images/AttackHand1",
"images/AttackHand2",
"Weapons/Sling",
"Weapons/SlingRope",
"SlingHand",
"Arm_frontbit",
"whiteball",
"effects/whiteball",
"effects/portal_btm",
"effects/portal_top",
"portal_splash",
"GrappleHook",
"Weapons/Lute",
"Weapons/SlingHand",
"images/Crown_half_left",
"images/Crown_half_right",
"Sparks1",
"Sparks2",
"Weapons/SpecialSword_1",
"Weapons/SpecialSword_2",
"Weapons/SpecialSword_3",
"Weapons/SpecialSword_4",
"KnowledgeParchment",
"Knowledge_Curse",
"Knowledge_Decoration",
"Knowledge_Trinket",
"Knowledge_Weapon",
"MonsterHeart_glow",
"Net",
"Tools/Hammer",
"Tools/Pickaxe",
"Tools/Pickaxe2",
"Tools/Woodaxe",
"Tools/Woodaxe2",
"GiftMedium",
"GiftSmall",
"effects/MonsterBlood1",
"MonsterBlood2",
"Tools/CardBack",
"Tools/CardFront",
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
"ChainBit3",
"SwordHeavy",
"Weapons/SwordHeavy_Charm",
"Weapons/SwordHeavy_Ice",
"Weapons/SwordHeavy_Necromancy",
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
"Curses/Icon_Curse_Tentacle"
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