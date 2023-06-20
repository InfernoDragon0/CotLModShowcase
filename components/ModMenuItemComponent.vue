<template>
    <li>
        <details>
            <summary>
                <div class="btn btn-ghost btn-disabled h-[100px] w-[100px]">
                    <NuxtImg :src="imgsrc" alt="banner" class="object-center"/>
                    <h2 class="card-title font-inter font-light text-sm">
                        {{title}}
                    </h2>
                </div>
            </summary>

                    <ul class="max-h-[360px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-transparent ">
                        <li :key="menu" v-for="menu in menudata" class="animate-fadein">
                            <!-- button with icon -->
                            <a :href="menu.link" class="p-0">
                                <button class="btn btn-ghost btn-disabled font-inter font-light h-[55px] w-[260px] grid grid-flow-col justify-start">
                                    <NuxtImg :src="menu.imgsrc" alt="banner" class="object-contain h-[42px] w-[42px]"/>
                                    {{ menu.title }}
                                    <p v-if="menu.new" class="badge badge-info badge-sm text-[12px]">{{ menu.new }}</p>
                                </button>
                            </a>
                        
                        </li>
                    </ul>

        </details>
    </li>
    
</template>

<script setup lang="ts">
    defineProps(['title', 'imgsrc', 'menudata'])
</script>