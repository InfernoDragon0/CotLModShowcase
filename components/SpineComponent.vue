<template>
    <div id="spine-container" class="w-full h-[200px]"></div>
</template>

<script setup lang="ts">

onMounted(() => {
    loadBaseSpine();
});

const loadBaseSpine = () => {
    new spine.SpinePlayer("spine-container", {
		skelUrl: "./Follower.skel.bytes",
		atlasUrl: "./Follower.atlas",
        skin: "Cat",
        animation: "build",
        premultipliedAlpha: false,
        backgroundColor: "#00000000",
		alpha:true,
		showControls: true,
        
	});
}

</script>