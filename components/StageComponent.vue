<template>
    <div class="bg-no-repeat bg-cover bg-[url('/images/cotlminimodsbanner.png')] min-h-screen">
        <div class="hero min-h-screen">
            <div class="hero-overlay bg-black bg-opacity-70"></div>
            <SoonComponent />
        </div>
    </div>
</template>

<script setup lang="ts">
    const { $anime } = useNuxtApp()

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