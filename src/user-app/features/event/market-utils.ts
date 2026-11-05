import IMarket, { OddsType } from '../../../models/IMarket'
import LFancy from '../../../models/LFancy'

export type Level = { odds: number; size: number }

const levels = (list: any[] | undefined): Level[] =>
  (list || []).map((o) => ({ odds: Number(o?.odds ?? o?.price) || 0, size: Number(o?.size ?? o?.volume) || 0 }))

/**
 * Back/lay ladders ordered for display, best price nearest the centre:
 * back ascending (best = last), lay ascending (best = first). Missing levels → odds 0.
 * Sorting by price makes this independent of the order the feed sends levels in.
 */
export const getLadder = (runner: any, depth: number) => {
  const pad = (l: Level[]) => [...l, ...Array(Math.max(0, depth - l.length)).fill({ odds: 0, size: 0 })]
  // listing feed sends `odds: [{ otype: 'back' | 'lay', odds, size }]` instead of back[] / lay[]
  if (!runner?.back && Array.isArray(runner?.odds)) {
    runner = { back: runner.odds.filter((o: any) => o.otype === 'back'), lay: runner.odds.filter((o: any) => o.otype === 'lay') }
  }
  const backs = levels(runner?.back).filter((l) => l.odds > 0).sort((a, b) => b.odds - a.odds).slice(0, depth)
  const lays = levels(runner?.lay).filter((l) => l.odds > 0).sort((a, b) => a.odds - b.odds).slice(0, depth)
  return { back: pad(backs).reverse(), lay: pad(lays) }
}

export const isRunnerSuspended = (runner: any) => {
  const s = String(runner?.gstatus || runner?.status || '').toUpperCase()
  return s === 'SUSPENDED' || s === 'CLOSED'
}

export const marketTitle = (m: IMarket | any) => {
  const name = m.mname || m.marketName || ''
  return name === 'MATCH_ODDS' ? 'Match Odds' : name === 'TIED_MATCH' ? 'Tied Match' : name.replace(/_/g, ' ')
}

export const isBookmaker = (m: IMarket | any) => m.oddsType === OddsType.BM || /bookmaker/i.test(m.mname || m.marketName || '')

/** 200000 → 2L, 2500000 → 25L, 20000000 → 2Cr */
export const formatLakh = (n: number) => {
  if (!n) return ''
  if (n >= 1e7) return `${+(n / 1e7).toFixed(2)}Cr`
  if (n >= 1e5) return `${+(n / 1e5).toFixed(2)}L`
  if (n >= 1e3) return `${+(n / 1e3).toFixed(2)}K`
  return String(n)
}

export const formatLimit = (n?: number | string) => {
  const v = Number(n)
  return v > 0 ? formatLakh(v) : '-'
}

/** Fancy groups, same gtype rules as the legacy fancy.tsx filters. */
export const FANCY_GROUPS: Array<{ key: string; label: string; test: (gtype: string) => boolean }> = [
  { key: 'fancy', label: 'Fancy', test: (g) => g === 'normal' || g === 'normal1' || g === 'session' || !g },
  { key: 'fancy1', label: 'Fancy1', test: (g) => g === 'fancy1' },
  { key: 'ballbyball', label: 'Ball by Ball', test: (g) => g === 'ball by ball' || g === 'ballbyball' },
  { key: 'meter', label: 'Meter', test: (g) => g === 'meter' },
  { key: 'khado', label: 'Khado', test: (g) => g === 'khado' },
  { key: 'oddeven', label: 'Odd / Even', test: (g) => g === 'oddeven' },
  { key: 'wkt', label: 'Wicket', test: (g) => g === 'wkt' },
  { key: 'four', label: 'Four', test: (g) => g === 'four' },
  { key: 'sixes', label: 'Sixes', test: (g) => g === 'sixes' },
]

export const fancyGroupOf = (f: LFancy) => {
  const g = String(f.gtype || '').toLowerCase()
  return FANCY_GROUPS.find((grp) => grp.test(g))?.key || 'fancy'
}
