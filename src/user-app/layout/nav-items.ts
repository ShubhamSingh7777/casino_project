import { IconType, LuArrowLeftRight, LuCherry, LuDices, LuHouse, LuRocket } from '../icons'

export type NavItem = {
  label: string
  to: string
  icon: IconType
  /** Path prefixes that mark this item active. */
  activePrefixes: string[]
}

/** Bottom nav (v2 §3.2). On `/` nothing is active. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Exchange', to: '/exchange', icon: LuArrowLeftRight, activePrefixes: ['/exchange', '/virtual', '/tp-virtual', '/odds'] },
  { label: 'Live Casino', to: '/casino/live', icon: LuDices, activePrefixes: ['/casino/live'] },
  { label: 'Slots', to: '/casino/slots', icon: LuCherry, activePrefixes: ['/casino/slots'] },
  { label: 'Crash', to: '/casino/crash', icon: LuRocket, activePrefixes: ['/casino/crash'] },
]

/** Header links on xl: Home first, then the bottom-nav items. */
export const HEADER_NAV: NavItem[] = [{ label: 'Home', to: '/', icon: LuHouse, activePrefixes: [] }, ...MAIN_NAV]

export const isNavActive = (item: { to: string; activePrefixes: string[] }, pathname: string) =>
  item.to === '/' ? pathname === '/' : item.activePrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
