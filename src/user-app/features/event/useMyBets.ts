import React from 'react'
import IBet from '../../../models/IBet'
import betService from '../../../services/bet.service'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectPlaceBet, setBetCount, setbetlist, setBookMarketList } from '../../../redux/actions/bet/betSlice'
import { useWebsocketUser } from '../../../context/webSocketUser'

/**
 * Open bets for one match + the per-runner book (odds_profit → redux userBookMarketList),
 * refreshed after a placed / deleted bet — same as the legacy my-bet.component.
 */
export const useMyBets = (matchId?: number | string) => {
  const dispatch = useAppDispatch()
  const { socketUser } = useWebsocketUser()
  const placeBet = useAppSelector(selectPlaceBet)
  const [bets, setBets] = React.useState<IBet[]>([])
  const [refresh, setRefresh] = React.useState(0)
  const bump = React.useCallback(() => setRefresh((n) => n + 1), [])

  React.useEffect(() => {
    if (!matchId) return
    betService
      .getBets(Number(matchId))
      .then((res) => {
        const data = res?.data?.data
        if (!data) return
        setBets(data.bets || [])
        dispatch(setbetlist(data.bets || []))
        dispatch(setBookMarketList(data.odds_profit || {}))
        dispatch(setBetCount((data.bets || []).length))
      })
      .catch(() => undefined)
  }, [matchId, refresh])

  React.useEffect(() => {
    if (placeBet.bet?.marketId) bump()
  }, [placeBet.bet])

  React.useEffect(() => {
    socketUser.on('placedBet', bump)
    socketUser.on('betDelete', bump)
    return () => {
      socketUser.off('placedBet', bump)
      socketUser.off('betDelete', bump)
    }
  }, [socketUser, bump])

  return bets
}
