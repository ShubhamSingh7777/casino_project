import LMatch from '../../models/LMatch'
import { MAIN_MARKET, OUTRIGHT_SPORT_IDS } from '../constants/sports'

export type PriceCell = { price: number | null; size: number | null }
export type RunnerPrices = { name: string; back: PriceCell; lay: PriceCell }

const toCell = (o: any): PriceCell => {
  const price = Number(o?.odds ?? o?.price)
  const size = Number(o?.size ?? o?.volume)
  return { price: price > 0 ? price : null, size: size > 0 ? size : null }
}

/** Best back/lay for a runner. API sends either `odds[{otype,tno}]` or `back[]`/`lay[]`. */
export const getRunnerPrices = (runner: any): RunnerPrices => {
  const name = runner?.runnerName || runner?.name || runner?.nat || ''
  if (Array.isArray(runner?.odds)) {
    return {
      name,
      back: toCell(runner.odds.find((o: any) => o.otype === 'back' && o.tno === 0)),
      lay: toCell(runner.odds.find((o: any) => o.otype === 'lay' && o.tno === 0)),
    }
  }
  return { name, back: toCell(runner?.back?.[0]), lay: toCell(runner?.lay?.[0]) }
}

export const getMainRunners = (match: LMatch): any[] =>
  match.markets?.find((m) => m.marketName === MAIN_MARKET)?.runners || []

/** True when the main market has a draw (3 runners) — shows 1 x 2 instead of 1 2. */
export const hasDraw = (match: LMatch) => getMainRunners(match).length >= 3

/**
 * Home / Draw / Away. Same ordering as the legacy memoOdds: with 3 runners the API
 * sends [home, away, draw].
 */
export const get1x2 = (runners: any[]) => {
  if (runners.length >= 3) return { home: runners[0], draw: runners[2], away: runners[1] }
  return { home: runners[0], draw: undefined, away: runners[1] }
}

export const isSuspended = (runners: any[]) =>
  runners.length > 0 &&
  runners.every((r) => {
    const p = getRunnerPrices(r)
    return p.back.price == null && p.lay.price == null
  })

/**
 * "India v Australia" / "Mark Williams - Jak Jones" → two sides.
 * Outright events ("AZERBAIJAN GRAND PRIX - RACE") stay one name: second side is ''.
 */
export const splitTeams = (name = '', sportId?: number | string): [string, string] => {
  const vs = name.split(/\s+(?:v|vs|VS|Vs)\.?\s+/)
  if (vs.length >= 2) return [vs[0], vs.slice(1).join(' v ')]
  if (!OUTRIGHT_SPORT_IDS.includes(Number(sportId))) {
    const dash = name.split(' - ')
    if (dash.length === 2) return [dash[0], dash[1]]
  }
  return [name, '']
}

/** Series/league label; the API sends it as a string or as an object. */
export const getSeriesName = (match: any): string =>
  (typeof match.series === 'string' ? match.series : match.series?.name || match.series?.seriesName) ||
  match.seriesName ||
  match.competitionName ||
  'Others'

export const groupBy = <T,>(items: T[], key: (item: T) => string) =>
  items.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item)
    ;(acc[k] = acc[k] || []).push(item)
    return acc
  }, {})
