import ICasinoMatch from '../../../models/ICasinoMatch'

/** A game as shown in a lobby, from either the own-casino list or the int-casino API. */
export type LobbyGame = {
  key: string
  name: string
  image: string
  provider: string
  category: string
  disabled?: boolean
  own?: ICasinoMatch
  identifier?: string
}

export type LobbyType = 'live' | 'slots' | 'crash'

type LobbyConfig = {
  title: string
  /** `type` param of get-casino-int-games */
  apiType: string
  /** Live lobby starts with our own casino games as the "Own" tab. */
  withOwn?: boolean
  defaultTab: string
  /** Keep only matching int-casino games (crash lobby). */
  filter?: (game: LobbyGame) => boolean
}

const CRASH_PROVIDERS = ['Spribe', 'InOut']

export const LOBBIES: Record<LobbyType, LobbyConfig> = {
  live: { title: 'Live Casino', apiType: 'live-casino', withOwn: true, defaultTab: 'Own' },
  slots: { title: 'Slots', apiType: 'slots', defaultTab: 'Jilli' },
  crash: {
    title: 'Crash',
    apiType: 'all',
    defaultTab: 'Spribe',
    filter: (g) => CRASH_PROVIDERS.includes(g.provider) || g.category === 'Crash Games',
  },
}

export const isLobbyType = (t?: string): t is LobbyType => !!t && t in LOBBIES

// The API's category names are internal ("flash", "CasinoLive"); show readable headings.
const CATEGORY_LABELS: Record<string, string> = { flash: 'Games', CasinoLive: 'Live Casino', Live: 'Live Casino' }
export const categoryLabel = (c?: string) => (c && CATEGORY_LABELS[c]) || c || 'Games'

/** Own-casino categories, matched on the game title (first match wins). */
const OWN_CATEGORIES: Array<[string, RegExp]> = [
  ['Roulette', /roulette/i],
  ['Teenpatti', /teen ?patti|teen unique|trio|muflis/i],
  ['Poker', /poker/i],
  ['Baccarat', /baccarat/i],
  ['Dragon Tiger', /dragon tiger|dtl/i],
  ['32 Cards', /32 cards/i],
  ['Andar Bahar', /andar bahar/i],
  ['Lucky7', /lucky 7/i],
  ['3 Cards Judgement', /3 cards judgement/i],
  ['Worli', /worli|matka/i],
  ['Sports', /cricket|super ?over|goal|ball by ball/i],
]
export const ownCategory = (title: string) => OWN_CATEGORIES.find(([, re]) => re.test(title))?.[0] || 'Own'

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
