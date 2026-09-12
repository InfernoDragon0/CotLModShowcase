# CotL Mods Showcase

The site for InfernoDragon0's Cult of the Lamb mods: showcase pages for
CultTweaker, the Supercharged series, CotL MiniMods and the upcoming COTL MP
Steam co-op mod, their documentation, and a follower skin builder.

Built with Nuxt 4, [Docus](https://docus.dev) (Nuxt Content 3 + Nuxt UI 4 +
Tailwind 4), anime.js v4 and the Spine 3.8 web runtime.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # unit tests for the skin builder
```

Node 22.19 or later is required. The install pins `legacy-peer-deps` in
`.npmrc`: npm 10's peer resolver crashes on the Nuxt 4 + Docus dependency graph.

### Build memory

`npm run build` raises the Node heap to 6 GB, and `ogImage` is turned off in
`nuxt.config.ts`. Docus enables nuxt-og-image, which rasterises a 1200x630 PNG
for every prerendered page through satori and resvg-wasm - 32 of them here.
That was the slow part of the build and it exhausted the V8 zone allocator
(`Fatal process out of memory: Zone`) when a dev server and a browser were
running alongside it. Link previews now use the static `og:image` declared in
`nuxt.config.ts` instead.

Building while `npm run dev` is running still costs a gigabyte or so of memory;
stop the dev server first if the machine is tight.

## Layout

| Path | What lives there |
| --- | --- |
| `app/pages` | Showcase pages, the `/builder` tool. Docs routes come from Docus. |
| `app/components/cotl` | Themed primitives: ribbon buttons, torn-paper frames, the scroll rail. |
| `app/components/app` | Overrides of Docus header and footer slots. |
| `app/components/spine` | Spine renderers for the hero and background followers. |
| `app/components/builder` | Skin builder panels. |
| `app/data` | Mod catalogue and feature data, shared by pages and docs. |
| `app/app.css` | Every colour, font and surface treatment. Start here to restyle. |
| `content/docs` | Documentation, one numbered folder per mod family. |
| `public/` | Images, the Spine runtime and follower skeleton, `followerSlots.json`. |

## The skin builder

`/builder` writes [CultTweaker](https://github.com/InfernoDragon0/COTL-CustomSpineLoader)
follower forms. It can:

- convert a legacy COTL JSONLoader skin plus its spritesheet into the folder
  format CultTweaker reads, cropping each part out of the sheet;
- author new forms, picking slots from `public/data/followerSlots.json`;
- preview the result on a live Spine skeleton, applying parts the same way the
  mod does in game (see `app/composables/useSkinPreview.ts`, which mirrors
  `SpineLoaderHelper/FollowerSpineLoader.cs`);
- export a zip that unpacks into `BepInEx/plugins/CultTweaker/FollowerSkins/`.

### Refreshing the follower skeleton

`public/Follower.skel.bytes` and `public/Follower.atlas` are a Spine 3.8.99
export taken from an older build of the game. Thirteen slots added since then
(the `LESHY_FACE_*` family, `EYE_CURSED`, `Face/MOUTH_CURSED` and the
`MOUTH_CHATTERING*` pair) are missing, so those parts cannot be previewed even
though they export and work correctly. The list is in
`app/composables/useFollowerSlots.ts` as `PREVIEW_GAPS`.

To refresh, export the current follower skeleton from the game and replace both
files, then update `PREVIEW_GAPS`. The slot list itself comes from CultTweaker's
`DumpFollowerSpineAtlas` config option, which writes `followerSlots.json`.

## Deployment

Vercel, using the default Nitro preset. Set the project's Node version to 22.x.
Analytics comes from `app/plugins/vercel.client.ts`.
