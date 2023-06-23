<template>
    <div class="bg-no-repeat bg-cover bg-[url('/images/cotlminimodsbanner.png')] min-h-screen">
        <div class="hero min-h-screen">
            <div class="hero-overlay bg-black bg-opacity-70">
            </div>
            <div v-if="Object.keys(dataselected).length > 0" class="grid lg:grid-flow-col lg:grid-cols-2 gap-8">
                <div class="h-[300px] w-[300px] grid grid-flow-col grid-cols-3 place-content-center place-items-center items-end">
                    <NuxtImg v-if="dataselected.img1 != ''" :src="dataselected.img1" class="w-[100px] h-[auto] animate-fadein1" />
                    <div v-else class="w-[100px] h-[auto]"></div>
                    <NuxtImg v-if="dataselected.img2 != ''" :src="dataselected.img2" class="w-[80px] h-[auto] animate-fadein1" />
                    <div v-else class="w-[80px] h-[auto]"></div>
                    <NuxtImg v-if="dataselected.img3 != ''" :src="dataselected.img3" class="w-[100px] h-[auto] animate-fadein1" />
                    <div v-else class="w-[100px] h-[auto]"></div>
                </div>
                <div class="min-h-[300px] min-w-[300px] grid grid-flow-row place-content-center place-items-center">
                    <NuxtImg :src="dataselected.imgsrc" class="w-[64px] h-[64px] animate-fadein1" />
                    <h1 class="font-inter text-3xl">{{ dataselected.title }}</h1>
                    <p class="max-w-[300px]">{{ dataselected.description }}</p>
                </div>
            </div>
            <div v-else>
                <p>Select an item from the dropdown lists to view!</p>
            </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
    const { $anime } = useNuxtApp()
    defineProps(['dataselected'])

    onMounted(() => {
        //animejs fade in on load class hero-overlay
        $anime.set(".hero-overlay", {
            opacity: 0,
        });

        $anime({
            targets: ".hero-overlay",
            opacity: 1,
            duration: 500,
            easing: "easeInOutSine",
        });

    })

</script>