<template>
    <div class="card w-96 glass shadow-xl mr-7 mb-5">
            <figure><img :src="imgsrc" alt="banner" class="object-cover"/></figure>
            <div class="card-body">
                <h2 class="card-title font-inter">
                    {{title}}
                    <div v-if="badge == 'true'" class="badge badge-secondary">NEW</div>
                </h2>
                <p class="font-opensans font-light">{{ description }}</p>
                <div class="justify-start">
                    <NuxtLink :to="learnmore">
                        <button class="btn btn-xs rounded-full btn-ghost text-pink-500 font-inter">Learn More</button>
                    </NuxtLink>

                </div>

                <br>
                <div v-if="comingsoon == 'false'" class="card-actions justify-end">
                    <a :href="link1" target="_blank">
                        <button class="btn btn-sm rounded-full btn-ghost font-inter">Thunderstore</button>
                    </a>
                    <a :href="link2" target="_blank">
                        <button class="btn btn-sm rounded-full btn-primary font-inter">NexusMods</button>
                    </a>
                </div>
                <div v-else class="card-actions justify-end">
                    <button class="btn btn-sm rounded-full btn-disabled font-inter">Coming Soon</button>
                </div>
            </div>
        </div>
</template>

<script setup lang="ts">
    defineProps(['title', 'badge', 'description', 'link1', 'link2', 'comingsoon', 'learnmore', 'imgsrc'])
</script>