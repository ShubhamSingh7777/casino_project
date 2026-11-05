import React from 'react'
import { toast } from 'react-toastify'
import IBet, { IBetOn, IBetType } from '../../../models/IBet'
import { OddsType } from '../../../models/IMarket'
import { IApiStatus } from '../../../models/IApiStatus'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { betPopup, selectBetCount, selectBetPopup, selectPlaceBet, setBetCount } from '../../../redux/actions/bet/betSlice'
import { getPlaceBetAction } from '../../../redux/actions/bet/bet.action'
import { useWebsocketUser } from '../../../context/webSocketUser'
import { calculateBetPnl } from '../../../utils/bet-pnl'
import { useUi } from '../../context/UiContext'

const EMPTY_BET = {} as IBet

/** The exchange betslip uses the same redux `betPopup` state as the legacy one; casino pages keep their own box. */
export const isExchangeBet = (bet?: IBet) => !!bet && !!bet.marketId && bet.betOn !== IBetOn.CASINO

const withPnl = (bet: IBet): IBet => ({ ...bet, ...calculateBetPnl(bet) })

/** Selection state + actions; every change goes through redux so all betslip views stay in sync. */
export const useBetslip = () => {
  const dispatch = useAppDispatch()
  const popup = useAppSelector(selectBetPopup)
  const placeBet = useAppSelector(selectPlaceBet)
  const bet = isExchangeBet(popup.betData) && popup.isOpen ? popup.betData : null

  const update = React.useCallback(
    (next: IBet) => dispatch(betPopup({ isOpen: true, betData: withPnl(next) })),
    [dispatch],
  )

  const addStake = (amount: number) => bet && update({ ...bet, stack: (Number(bet.stack) || 0) + amount })
  const setStake = (value: number) => bet && update({ ...bet, stack: Number.isFinite(value) && value > 0 ? value : 0 })

  /** −/+ 0.01 on exchange odds only (bookmaker/fancy prices are fixed) — legacy incrementDecrementOdds. */
  const canStep = !!bet && bet.oddsType !== OddsType.BM && bet.oddsType !== OddsType.F
  const stepOdds = (dir: 1 | -1) => {
    if (!bet || !canStep) return
    const odds = parseFloat((bet.odds + dir * 0.01).toFixed(4))
    if (odds <= 1) return
    update({ ...bet, odds, type: odds !== bet.currentMarketOdds ? IBetType.UnMatch : IBetType.Match })
  }

  const clear = () => dispatch(betPopup({ isOpen: false, betData: EMPTY_BET }))

  /** Same checks as the legacy onSubmit, then the same placebet action. */
  const place = () => {
    if (!bet) return
    const minBet = Number(bet.minbet) > 0 ? Number(bet.minbet) : 100
    const maxBet = Number(bet.maxbet) > 0 ? Number(bet.maxbet) : Number((bet as any).maxb) > 0 ? Number((bet as any).maxb) : 0
    const stake = Number(bet.stack)
    if (!Number.isFinite(stake) || stake <= 0) return toast.error('Please enter a valid bet amount', { autoClose: 1000 })
    if (stake < minBet) return toast.error(`Minimum bet allowed is ${minBet}`, { autoClose: 1000 })
    if (maxBet > 0 && stake > maxBet) return toast.error(`Maximum bet allowed is ${maxBet}`, { autoClose: 1000 })
    dispatch(getPlaceBetAction(bet))
  }

  return {
    bet,
    addStake,
    setStake,
    canStep,
    stepOdds,
    clear,
    place,
    placing: placeBet.status === IApiStatus.Loading,
  }
}

/**
 * Mount once (AppShell): opens the sheet when a selection is added and, after a
 * successful bet, does what the legacy box did — emit `place-bet`, close, bump the count.
 */
export const useBetslipController = () => {
  const dispatch = useAppDispatch()
  const { socketUser } = useWebsocketUser()
  const popup = useAppSelector(selectBetPopup)
  const placeBet = useAppSelector(selectPlaceBet)
  const betCount = useAppSelector(selectBetCount)
  const { setBetslipOpen } = useUi()

  const selectionKey = isExchangeBet(popup.betData) && popup.isOpen ? `${popup.betData.marketId}-${popup.betData.selectionId}-${popup.betData.isBack}` : ''
  React.useEffect(() => {
    if (selectionKey) setBetslipOpen(true)
  }, [selectionKey])

  React.useEffect(() => {
    if (placeBet.status !== IApiStatus.Done || !isExchangeBet(popup.betData)) return
    socketUser.emit('place-bet', placeBet.bet)
    dispatch(betPopup({ isOpen: false, betData: EMPTY_BET }))
    dispatch(setBetCount(betCount + 1))
    setBetslipOpen(false)
  }, [placeBet.status])
}
