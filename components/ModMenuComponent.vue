<template>
    <div class="fixed w-full flex justify-center min-h-[100px] bg-gray-950/50">
        <ul class="justify-center p-4 gap-2 menu menu-horizontal rounded-box">
            <ModMenuItemComponent @change-state="changeStage" class="animate-rolldown" title="Commands" imgsrc="/images/knucklebones.png" :menudata="menuData.commands"/>
            <ModMenuItemComponent @change-state="changeStage" class="animate-rolldown" title="Structures" imgsrc="/images/luckynarinder.png" :menudata="menuData.structures"/>
            <ModMenuItemComponent @change-state="changeStage" class="animate-rolldown" title="Items" imgsrc="/images/strange.png" :menudata="menuData.items"/>
            <ModMenuItemComponent @change-state="changeStage" class="animate-rolldown" title="Rituals" imgsrc="/images/ritual_fusion.png" :menudata="menuData.rituals" />
            <ModMenuItemComponent @change-state="changeStage" class="animate-rolldown" title="Roles" imgsrc="/images/comingsoon2.gif" :menudata="menuData.roles" />
        </ul>
    </div>
    <StageComponent :dataselected="stage"/>
</template>

<script setup lang="ts">
    const { $anime } = useNuxtApp()
    //stage state
    const stage = ref({})
    
    
    const menuData: any = {
        "commands": [
            {
                "title": "Knucklebones",
                "link": "#knucklebones",
                "imgsrc": "/images/knucklebones.png",
                "description": "Play Knucklesbones with your followers.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "/images/knucklebones.png",
                "img3": "/images/Follower-idle.gif",
            },
            {
                "title": "Flip Coin",
                "link": "#flipcoin",
                "imgsrc": "/images/flipcoin.png",
                "description": "Flip a coin with your followers.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "/images/flipcoin.png",
                "img3": "/images/Follower-idle.gif",
            },
            {
                "title": "Divorce",
                "link": "#divorce",
                "imgsrc": "/images/divorce.png",
                "description": "Divorce your followers.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "/images/divorce.png",
                "img3": "/images/Follower-sad.gif",
            }
        ],
        "structures": [
            {
                "title": "Relic Infuser",
                "link": "#relicinfuser",
                "imgsrc": "/images/cauldron.png",
                "new": "1.2.1",
                "description": "Allows you to create and hold relics in the base, and keeps them between runs.",
                "img1": "",
                "img2": "/images/cauldron.png",
                "img3": "",
            },
            {
                "title": "Lucky Narinder",
                "link": "#luckynarinder",
                "imgsrc": "/images/luckynarinder.png",
                "description": "For followers to devote to Narinder.",
                "img1": "",
                "img2": "/images/cauldron.png",
                "img3": "",
            },
            {
                "title": "AIO Miner",
                "link": "#aiominer",
                "imgsrc": "/images/aio.png",
                "description": "An AIO mine for a variety of items.",
                "img1": "",
                "img2": "/images/aio.png",
                "img3": "",
            },
            {
                "title": "AIO Incubator",
                "link": "#luckynarinder",
                "imgsrc": "/images/aiofarm.png",
                "description": "An AIO mine for all types of seeds.",
                "img1": "",
                "img2": "/images/aiofarm.png",
                "img3": "",
            },
            {
                "title": "Bone Mines",
                "link": "#bonemines",
                "imgsrc": "/images/bonemines.png",
                "description": "A Mine for Bones.",
                "img1": "",
                "img2": "/images/bonemines.png",
                "img3": "",
            },
            {
                "title": "Alchemy",
                "link": "#alchemycauldron",
                "imgsrc": "/images/cauldron.png",
                "description": "Creates Necklaces based on your choice.",
                "img1": "",
                "img2": "/images/cauldron.png",
                "img3": "",
            },
            {
                "title": "Sous Chef Desk",
                "link": "#souschefdesk",
                "imgsrc": "/images/chefdesk.png",
                "description": "For the Sous Chef to cook. You can select the Signature dish to cook.",
                "img1": "",
                "img2": "/images/chefdesk.png",
                "img3": "",
            },
            {
                "title": "HR Device",
                "link": "#followermanagement",
                "imgsrc": "/images/cotlpc.png",
                "description": "Manage your followers remotely.",
                "img1": "",
                "img2": "/images/cotlpc.png",
                "img3": "",
            },
            {
                "title": "Crystal Mines",
                "link": "#crystalmines",
                "imgsrc": "/images/crystalmines.png",
                "description": "A Mine for Crystals.",
                "img1": "",
                "img2": "/images/crystalmines.png",
                "img3": "",
            },
            {
                "title": "Endless Pit",
                "link": "#endlesspit",
                "imgsrc": "/images/endlesspit.png",
                "description": "Infinite Grave, and also generates Strange Energy per follower inside.",
                "img1": "",
                "img2": "/images/endlesspit.png",
                "img3": "",
            },
            {
                "title": "Generator",
                "link": "#strangegenerator",
                "imgsrc": "/images/generator.png",
                "description": "Generates Strange Energy at the cost of gold.",
                "img1": "",
                "img2": "/images/generator.png",
                "img3": "",
            },
            {
                "title": "Gift Tree",
                "link": "#gifttree",
                "imgsrc": "/images/GiftTree.png",
                "description": "Followers can generate gifts here.",
                "img1": "",
                "img2": "/images/GiftTree.png",
                "img3": "",
            },
            {
                "title": "Fishing Hut",
                "link": "#fishinghut",
                "imgsrc": "/images/Icon_FishingHut.png",
                "description": "Allows your followers to Fish.",
                "img1": "",
                "img2": "/images/Icon_FishingHut.png",
                "img3": "",
            },
            {
                "title": "Wishing Well",
                "link": "#wishingwell",
                "imgsrc": "/images/Icon_Pond.png",
                "description": "Allows you to collect Tarot Cards in the base in exchange for gold.",
                "img1": "",
                "img2": "/images/Icon_Pond.png",
                "img3": "",
            },
            {
                "title": "Silk Mines",
                "link": "#silkmines",
                "imgsrc": "/images/silkmines.png",
                "description": "A Mine for Silk.",
                "img1": "",
                "img2": "/images/silkmines.png",
                "img3": "",
            },
            {
                "title": "Stasis Chamber",
                "link": "#stasis",
                "imgsrc": "/images/stasis.png",
                "description": "Pause the simulation timer using Strange Energy.",
                "img1": "",
                "img2": "/images/stasis.png",
                "img3": "",
            },
            {
                "title": "Study Table",
                "link": "#studytable",
                "imgsrc": "/images/study.png",
                "description": "For followers to study for Experience.",
                "img1": "",
                "img2": "/images/study.png",
                "img3": "",
            },
            {
                "title": "Telescope",
                "link": "#telescope",
                "imgsrc": "/images/telescope.png",
                "description": "For Astrologer Role.",
                "img1": "",
                "img2": "/images/telescope.png",
                "img3": "",
            },
            {
                "title": "Waiter Desk",
                "link": "#waiterdesk",
                "imgsrc": "/images/waiterdesk.png",
                "description": "For followers to serve food.",
                "img1": "",
                "img2": "/images/waiterdesk.png",
                "img3": "",
            },
            {
                "title": "Wireless Energy",
                "link": "#wireless",
                "imgsrc": "/images/wireless.png",
                "description": "Transfers wireless energy for structures that require it.",
                "img1": "",
                "img2": "/images/wireless.png",
                "img3": "",
            },
        ],
        "items": [
            {
                "title": "Strange Item",
                "link": "#strangematerial",
                "imgsrc": "/images/strange.png",
                "description": "A Strange Material, used in various buildings and rituals.",
                "img1": "",
                "img2": "/images/strange.png",
                "img3": "",
                
            },
            {
                "title": "Strange Energy",
                "link": "#strangeenergy",
                "imgsrc": "/images/strange.png",
                "description": "Strange energy, used for several advanced machines.",
                "img1": "",
                "img2": "/images/strange.png",
                "img3": "",
            },
        ],
        "rituals": [
            {
                "title": "Mass Revive",
                "link": "#massressurection",
                "imgsrc": "/images/ritual_massres.png",
                "new": "1.2.1",
                "description": "Revive all followers.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "",
                "img3": "/images/Follower-idle.gif",
            },
            {
                "title": "Ritual of Exile",
                "link": "#ritualofexile",
                "imgsrc": "/images/ritual_exile.png",
                "new": "1.2.1",
                "description": "Exile a specific follower.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "",
                "img3": "/images/Follower-sad.gif",
            },
            {
                "title": "Fusion Ritual",
                "link": "#fusionritual",
                "imgsrc": "/images/ritual_fusion.png",
                "description": "The second follower gains the traits of the first follower. Mutually exclusive traits are overwritten.",
                "img1": "/images/Follower-idle.gif",
                "img2": "/images/ritual_fusion.png",
                "img3": "/images/Follower-idle.gif",
            },
            {
                "title": "Distribution",
                "link": "#distribution",
                "imgsrc": "/images/ritual_leveling.png",
                "description": "Give coins to all followers, instantly leveling them up.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "/images/flipcoin.png",
                "img3": "/images/Follower-idle.gif",
                
            },
            {
                "title": "Ritual Frenzy",
                "link": "#ritualfrenzy",
                "imgsrc": "/images/ritual_frenzy.png",
                "description": "Resets the cooldown of all your rituals.",
                "img1": "/images/ritual_frenzy.png",
                "img2": "/images/Lamb-idle.gif",
                "img3": "/images/ritual_frenzy.png",
            },
            {
                "title": "Ritual of Youth",
                "link": "#ritualofyouth",
                "imgsrc": "/images/ritual_youth.png",
                "description": "Converts all old followers to young followers. Their life expectancy doubles.",
                "img1": "",
                "img2": "/images/Lamb-idle.gif",
                "img3": "",
            },
            {
                "title": "Reversal",
                "link": "#ritualofreversal",
                "imgsrc": "/images/ritual_reversal.png",
                "description": "Follower will exchange a negative trait for a positive one.",
                "img1": "/images/Lamb-idle.gif",
                "img2": "",
                "img3": "/images/follower-happy.gif",
            },
            {
                "title": "Mistletoe Ritual",
                "link": "#mistletoeritual",
                "imgsrc": "/images/ritual_fusion.png",
                "description": "Two followers increase their friendship to the max level.",
                "img1": "/images/follower-happy.gif",
                "img2": "/images/ritual_fusion.png",
                "img3": "/images/follower-happy.gif",
            },
            
            
        ],
        "roles": [
            {
                "title": "Sous Chef",
                "link": "#souschef",
                "imgsrc": "/images/comingsoon2.gif",
                "new": "1.2.1",
                "description": "Cooks food automatically when there are hungry followers. Must have Sous Chef Desk.",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Waiter",
                "link": "#waiter",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Brings food to followers. Must have Waiter Desk",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Narinder",
                "link": "#narinder",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Devotes to narinder for levels. Must have Lucky Narinder Statue.",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Astrologer",
                "link": "#astrologer",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "See the stars to drop Strange Material. Must have Telescope",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Study",
                "link": "#study",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Studies the Strange Material for Experience. Must have Study Table.",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Reaper",
                "link": "#reaper",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Automatically sweeps up corpse and drops into Endless Pit. Must have Endless Pit",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Mining",
                "link": "#mining",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Mines for custom structures such as AIO Miner. Must have the corresponding structure.",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            {
                "title": "Fishing",
                "link": "#fishing",
                "imgsrc": "/images/comingsoon2.gif",
                "description": "Fishes from a different loot pool with all the seafood types. Must have Fishing Hut.",
                "img1": "/images/comingsoon2.gif",
                "img2": "",
                "img3": "",
            },
            
            
        ]
    }

    const changeStage = (stage2: any) => {
        console.log("changeStage called", stage)
        //set the ref stage to stage
        stage.value = stage2
        
    }

    onMounted(() => {
        console.log("ModMenuComponent mounted")
        // close details
        const details = document.querySelectorAll("details");

    // Add the onclick listeners.
        details.forEach((targetDetail) => {
            targetDetail.addEventListener("click", () => {
                // Close all the details that are not targetDetail.
                details.forEach((detail) => {
                if (detail !== targetDetail) {
                    detail.removeAttribute("open");
                }
                else {
                    //animate animate-fadein with fade in staggered
                    $anime({
                        targets: '.animate-fadein',
                        opacity: [0, 1],
                        delay: 30,
                        easing: 'easeInOutQuad'
                    })
                }
                });
            });
        });

        //animate animate-rolldown with fade in down, staggered
        $anime({
            targets: '.animate-rolldown',
            opacity: [0, 1],
            translateY: [-50, 0],
            delay: $anime.stagger(100, {start: 100}),
            easing: 'easeInOutQuad'
        })
    })
    
</script>