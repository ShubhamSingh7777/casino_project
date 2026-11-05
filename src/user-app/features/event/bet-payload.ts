import IBet, { IBetOn, IBetType } from '../../../models/IBet'
import IMarket, { OddsType } from '../../../models/IMarket'
import { IFancy } from '../../../models/IFancy'
import LFancy from '../../../models/LFancy'
import authService from '../../../services/auth.service'

// Payloads copied from the legacy odds screen (available-to-back-lay.tsx, fancy-list.tsx)
// so `placebet` receives exactly what it does today.

const MATCH_ODDS_MARKETS = ['MATCH_ODDS', 'Bookmaker', 'TIED_MATCH', 'Top 2 Finish', 'Top 3 Finish', 'Top 4 Finish', 'Top 5 Finish']

export const marketMaxBet = (market: any) =>
  Number(market.maxbet) > 0 ? Number(market.maxbet) : Number(market.max) > 0 ? Number(market.max) : Number(market.maxb) > 0 ? Number(market.maxb) : 0

/** Exchange / bookmaker runner. Returns null when the legacy code would ignore the click. */
export const marketBet = (
  market: IMarket,
  runner: any,
  isBack: boolean,
  price: { odds: number; size: number },
  matchName: string,
): IBet | null => {
  if (market.oddsType === OddsType.BM && price.size === 0) return null
  if (!(price.odds > 0 && price.size)) return null
  return {
    isBack,
    odds: parseFloat(price.odds.toFixed(4)),
    volume: price.size,
    marketId: market.marketId,
    marketName: market.marketName,
    matchId: market.matchId,
    selectionName: runner.runnerName,
    selectionId: runner.selectionId,
    pnl: 0,
    stack: 0,
    currentMarketOdds: price.odds,
    eventId: Number(market.sportId || market.marketId),
    exposure: 0,
    ipAddress: authService.getIpAddress(),
    type: IBetType.Match,
    matchName,
    betOn: MATCH_ODDS_MARKETS.includes(market.marketName) || market.sportId !== 4 ? IBetOn.MATCH_ODDS : IBetOn.FANCY,
    oddsType: market.oddsType,
    minbet: 100,
    maxbet: marketMaxBet(market),
  } as IBet
}

/** Fancy row: Yes = back, No = lay. */
export const fancyBet = (fancy: LFancy, live: IFancy, isBack: boolean, matchName: string): IBet | null => {
  const m: any = { ...fancy, ...live }
  if (isBack && !m.BackPrice1) return null
  if (!isBack && !m.LayPrice1) return null
  return {
    isBack,
    odds: isBack ? m.BackPrice1 : m.LayPrice1,
    volume: isBack ? m.BackSize1 : m.LaySize1,
    marketId: m.marketId,
    marketName: 'Fancy',
    matchId: m.matchId,
    selectionName: m.RunnerName,
    selectionId: m.SelectionId,
    pnl: 0,
    stack: 0,
    currentMarketOdds: isBack ? m.BackPrice1 : m.LayPrice1,
    eventId: m.sportId,
    exposure: -0,
    ipAddress: authService.getIpAddress(),
    type: IBetType.Match,
    matchName,
    betOn: IBetOn.FANCY,
    gtype: m.gtype,
    oppsiteVol: isBack ? m.LaySize1 : m.BackSize1,
    oddsType: OddsType.F,
  } as IBet
}
