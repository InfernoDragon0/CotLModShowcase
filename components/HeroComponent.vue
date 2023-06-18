<template>
    <div
        class="bg-[url('/images/cotlminimodsbanner.png')] bg-no-repeat bg-cover min-h-[700px] w-full flex justify-center grid auto-rows-max">
        <div class="w-full grid grid-cols-5 lg:gap-24 place-content-center relative">
            <NuxtLink to="/minimods/commands" class="float1 w-32 h-32 lg:absolute bottom-[-300px]">
                <NuxtImg src="/images/customcomms.png"></NuxtImg>
            </NuxtLink>

            <NuxtLink to="/minimods/structures"
                class="float2 w-32 h-32 lg:absolute bottom-[-200px] left-[200px]">
                <NuxtImg src="/images/customstruct.png" />
            </NuxtLink>

            <NuxtLink to="/minimods/items" class="z-10 float3 w-32 h-32 lg:absolute bottom-[-110px] left-[450px]">
                <NuxtImg src="/images/customitems.png" />
            </NuxtLink>

            <NuxtLink to="/minimods/rituals" class="float1 w-32 h-32 lg:absolute bottom-[-200px] left-[700px]">
                <NuxtImg src="/images/customrituals.png" />
            </NuxtLink>

            <NuxtLink to="/minimods/roles" class="float2 w-32 h-32 lg:absolute bottom-[-300px] left-[950px]">
                <NuxtImg src="/images/customroles.png" />
            </NuxtLink>

            <NuxtImg src="/images/customroles.png" class="float2 w-32 h-32 opacity-0" />
        </div>
        <div class="w-full flex justify-center">
            <NuxtImg  src="/images/lambritual.gif" class="float4 w-96 h-96"/>
        </div>
        <div class="w-full justify-left bg-gradient-to-r from-gray-900 pl-5 pr-5 pt-5 pb-5">
            <h1 class="text-white font-inter text-6xl font-bold">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-200">
                    COTL MINI MODS
                </span>
            </h1>
            <h1 class="text-white font-inter text-3xl font-light ">BY INFERNODRAGON0</h1>
            <p class="mb-10 font-opensans">Custom Stuff for base management and combat. <br>Click the buttons above to learn more!</p>

            <a href="https://www.nexusmods.com/cultofthelamb/mods/12" target="_blank">
                <button class="btn rounded-full btn-primary mr-3 font-inter">
                    Get On NexusMods
                </button>
            </a>
            <a href="https://cult-of-the-lamb.thunderstore.io/package/InfernoDragon0/CotLMiniMods/" target="_blank">
                <button class="btn btn-ghost rounded-full font-inter font-light">Thunderstore</button>
            </a>
        </div>

    </div>
</template>

<script setup lang="ts">
const { $anime } = useNuxtApp();

onMounted(() => {
    //animejs fade in on load class float4

    $anime.set(".float4", {
        opacity: 0,
    });

    $anime({
        targets: ".float4",
        opacity: 1,
        duration: 1000,
        easing: "easeInOutSine",
    });


    var float1 = $anime.timeline({
        targets: ".float1",
        loop: true,
        direction: "alternate",
        delay: $anime.stagger(100)
        
    });

    float1.add(
        {
            translateY: 20,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
        },
    );

    var float2 = $anime.timeline({
        targets: ".float2",
        loop: true,
        direction: "alternate",
        delay: $anime.stagger(100)
    });

    float2.add(
        {
            translateY: -40,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
        },
    );

    var float3 = $anime.timeline({
        targets: ".float3",
        loop: true,
        direction: "alternate",
        delay: 44
    });

    float3.add(
        {
            translateY: 10,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
        },
    );

    var float4 = $anime.timeline({
        targets: ".float4",
        loop: true,
        direction: "alternate",
        delay: 666
    });

    float4.add(
        {
            translateY: 30,
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
        },
    );
});
</script>