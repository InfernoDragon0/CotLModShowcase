export interface SiteLink {
  label: string
  to: string
}

/** The primary navigation, shared by the desktop header and the mobile menu. */
export function useSiteNavigation(): SiteLink[] {
  return [
    { label: 'Home', to: '/' },
    { label: 'CultTweaker', to: '/mods/culttweaker' },
    { label: 'Supercharged', to: '/mods/supercharged' },
    { label: 'MiniMods', to: '/mods/minimods' },
    { label: 'Skin Builder', to: '/builder' },
    { label: 'Docs', to: '/docs' },
  ]
}
