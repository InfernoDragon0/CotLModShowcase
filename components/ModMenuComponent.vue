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
                "new": "1.2.1"
            },
            {
                "title": "Lucky Narinder",
                "link": "#luckynarinder",
                "imgsrc": "/images/luckynarinder.png"
            },
            {
                "title": "AIO Miner",
                "link": "#aiominer",
                "imgsrc": "/images/aio.png"
            },
            {
                "title": "AIO Incubator",
                "link": "#luckynarinder",
                "imgsrc": "/images/aiofarm.png"
            },
            {
                "title": "Bone Mines",
                "link": "#bonemines",
                "imgsrc": "/images/bonemines.png"
            },
            {
                "title": "Alchemy",
                "link": "#alchemycauldron",
                "imgsrc": "/images/cauldron.png"
            },
            {
                "title": "Sous Chef Desk",
                "link": "#souschefdesk",
                "imgsrc": "/images/chefdesk.png"
            },
            {
                "title": "HR Device",
                "link": "#followermanagement",
                "imgsrc": "/images/cotlpc.png"
            },
            {
                "title": "Crystal Mines",
                "link": "#crystalmines",
                "imgsrc": "/images/crystalmines.png"
            },
            {
                "title": "Endless Pit",
                "link": "#endlesspit",
                "imgsrc": "/images/endlesspit.png"
            },
            {
                "title": "Generator",
                "link": "#strangegenerator",
                "imgsrc": "/images/generator.png"
            },
            {
                "title": "Gift Tree",
                "link": "#gifttree",
                "imgsrc": "/images/GiftTree.png"
            },
            {
                "title": "Fishing Hut",
                "link": "#fishinghut",
                "imgsrc": "/images/Icon_FishingHut.png"
            },
            {
                "title": "Wishing Well",
                "link": "#wishingwell",
                "imgsrc": "/images/Icon_Pond.png"
            },
            {
                "title": "Silk Mines",
                "link": "#silkmines",
                "imgsrc": "/images/silkmines.png"
            },
            {
                "title": "Stasis Chamber",
                "link": "#stasis",
                "imgsrc": "/images/stasis.png"
            },
            {
                "title": "Study Table",
                "link": "#studytable",
                "imgsrc": "/images/study.png"
            },
            {
                "title": "Telescope",
                "link": "#telescope",
                "imgsrc": "/images/telescope.png"
            },
            {
                "title": "Waiter Desk",
                "link": "#waiterdesk",
                "imgsrc": "/images/waiterdesk.png"
            },
            {
                "title": "Wireless Energy",
                "link": "#wireless",
                "imgsrc": "/images/wireless.png"
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
                "img1": "",
                "img2": "/images/Lamb-idle.gif",
                "img3": "",
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
                "new": "1.2.1"
            },
            {
                "title": "Waiter",
                "link": "#waiter",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Narinder",
                "link": "#narinder",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Astrologer",
                "link": "#astrologer",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Study",
                "link": "#study",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Reaper",
                "link": "#reaper",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Mining",
                "link": "#mining",
                "imgsrc": "/images/comingsoon2.gif"
            },
            {
                "title": "Fishing",
                "link": "#fishing",
                "imgsrc": "/images/comingsoon2.gif"
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