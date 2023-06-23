<template>
    <li>
        <details>
            <summary>
                <div class="lg:btn lg:btn-ghost lg:btn-disabled h-[40px] w-[20px] lg:h-[100px] lg:w-[100px]">
                    <NuxtImg :src="imgsrc" alt="banner" class="hidden lg:block"/>
                    <h2 class="card-title font-inter font-light text-[8px] lg:text-sm">
                        {{title}}
                    </h2>
                </div>
            </summary>

                    <ul class="max-h-[360px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent ">
                        <li :key="menu" v-for="menu in menudata" class="animate-fadein" @click="changeState(menu)">
                            <!-- button with icon -->
                            
                            <button class="btn btn-ghost font-inter font-light h-[55px] w-[260px] grid grid-flow-col justify-start">
                                <NuxtImg :src="menu.imgsrc" alt="banner" class="object-contain h-[42px] w-[42px]"/>
                                {{ menu.title }}
                                <p v-if="menu.new" class="badge badge-info badge-sm text-[12px]">{{ menu.new }}</p>
                            </button>
                        
                        </li>
                    </ul>

        </details>
    </li>
    
</template>

<script setup lang="ts">
    defineProps(['title', 'imgsrc', 'menudata'])
    const emit = defineEmits(['changeState'])

    const changeState = (state: any) => {
        //emit
        emit('changeState', state)
        const details = document.querySelectorAll("details");

    // Add the onclick listeners.
        details.forEach((targetDetail) => {
            targetDetail.addEventListener("click", () => {
                // Close all the details that are not targetDetail.
                details.forEach((detail) => {
                detail.removeAttribute("open");
                });
            });
        });
    }
</script>