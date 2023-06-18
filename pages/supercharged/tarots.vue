<template>
    <HeaderComponent />
    <!-- hero image about the mod -->
    <div class="hero min-h-screen bg-base-200" style="background-image: url(/images/tarots.png);">
        <div class="hero-overlay bg-black bg-opacity-80"></div>
        <div class="hero-content flex-col lg:flex-row">
            <img src="/images/tarotlogofull.png" class="max-w-sm rounded-lg shadow-2xl" />
            <div>
            <h1 class="text-5xl font-inter font-light text-white">Supercharged Tarots</h1>
            <p class="py-6 font-inter">Feel the true potential of the Lamb with several different powerful tarot cards.
                </p>
            <a href="https://www.nexusmods.com/cultofthelamb/mods/20" target="_blank">
                <button class="btn btn-primary font-inter rounded-full mr-4">Nexusmods</button>
            </a>
            <a href="https://cult-of-the-lamb.thunderstore.io/package/InfernoDragon0/Supercharged_Tarots/" target="_blank">
                <button class="btn btn-ghost font-inter rounded-full">Thunderstore</button>
            </a>
            </div>
        </div>
    </div>

    <div class="min-h-[200px] pl-12 pr-12 pt-12 pb-12">
        <p class="text-white font-inter text-6xl font-light mb-5">Set 1: Empowered Tarots</p>
        <p class="font-opensans font-light">The first set for Supercharged Tarots, to provide powerful buffs to the lamb. More will be added eventually. If you have suggestions, feel free to submit them in the discord server.</p>
    </div>
    <div class="flex w-full">
        <ul class="grid gap-2 grid-flow-col auto-cols-auto grid-rows-3 lg:grid-rows-1 m-4">
            <template v-for="card in cards" :key="card">
                <li 
                    :aria-current="currentCard === card.number"
                    @click="() => {currentCard = card.number}"
                    class="overflow-hidden h-[400px] w-[50px] card bg-base-100 image-full glass hover:w-[75px] transition-all duration-[300ms] ease-in-out [&[aria-current='true']]:w-[400px]">
                    <figure><img src="/images/comingsoon.gif" alt="tarot"/></figure>
                    <div v-if="currentCard === card.number" class="card-body">
                        <p class="card-title">{{card.name}}</p>
                        <p>{{ card.description }}</p>
                    </div>
                </li>
            </template> 
        </ul>
    </div>
    <FooterComponent />
</template>

<script setup lang="ts">
    const { $anime } = useNuxtApp();

    const cards: any = {
        "card1": {
            "name": "Shadow Quiver",
            "description": "Near Infinite Curse Casting",
            "image": "test",
            "number": 0
        },
        "card2": {
            "name": "Deadeye",
            "description": "Always Crit",
            "image": "test",
            "number": 1
        },
        "card3": {
            "name": "Supernova",
            "description": "300% more Curse Damage",
            "image": "test",
            "number": 2
        },
        "card4": {
            "name": "Ruinous Strike",
            "description": "100% more Damage",
            "image": "test",
            "number": 3
        },
        "card5": {
            "name": "Ace of Hearts",
            "description": "Grants you 10 Black Hearts",
            "image": "test",
            "number": 4
        },
        "card6": {
            "name": "Curse Perfected",
            "description": "Always Perfect Curse Casting (for curses that require charging, releases perfectly at any time.)",
            "image": "test",
            "number": 5
        },
        "card7": {
            "name": "Speedrunner",
            "description": "4x Movement Speed",
            "image": "test",
            "number": 6
        },
        "card8": {
            "name": "Sonic Surge",
            "description": "5x Attack Speed",
            "image": "test",
            "number": 7
        },
        "card9": {
            "name": "The Solunar Eclipse",
            "description": "200% more Damage during the day, 300% more Damage during the night",
            "image": "test",
            "number": 8
        },
        "card10": {
            "name": "Relic Overdrive",
            "description": "30x Relic Charge Speed",
            "image": "test",
            "number": 9
        },
    }

    const currentCard = useState<number>('current-card')


</script>