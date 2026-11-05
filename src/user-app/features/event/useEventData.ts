import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import IMatch from '../../../models/IMatch'
import IMarket from '../../../models/IMarket'
import LFancy from '../../../models/LFancy'
import { IFancy } from '../../../models/IFancy'
import { IUserBetStake } from '../../../models/IUserStake'
import sportsService from '../../../services/sports.service'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { setCurrentMatch } from '../../../redux/actions/sports/sportSlice'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import IBet from '../../../models/IBet'
import { useWebsocket } from '../../../context/webSocket'
import { useWebsocketUser } from '../../../context/webSocketUser'

export type EventData = {
  match: IMatch | null
  /** Markets from get-market-list; `live` holds the latest getMarketData payload per marketId. */
  markets: IMarket[]
  live: Record<string, any>
  fancies: LFancy[]
  /** Live fancy prices keyed by SelectionId (= fancy.marketId). */
  fancyLive: Record<string, IFancy>
  stake: IUserBetStake | null
  loading: boolean
  failed: boolean
}

const sameId = (a: any, b: any) => String(a) === String(b)

/**
 * Everything the event page needs, with the same APIs and socket events the legacy
 * odds page (odds.tsx + match-odds.tsx + fancy.tsx) uses.
 */
export const useEventData = (matchId: string): EventData => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { socket } = useWebsocket()
  const { socketUser } = useWebsocketUser()
  const userState = useAppSelector(selectUserData)

  const [match, setMatch] = React.useState<IMatch | null>(null)
  const [markets, setMarkets] = React.useState<IMarket[]>([])
  const [live, setLive] = React.useState<Record<string, any>>({})
  const [fancies, setFancies] = React.useState<LFancy[]>([])
  const [fancyLive, setFancyLive] = React.useState<Record<string, IFancy>>({})
  const [stake, setStake] = React.useState<IUserBetStake | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    setFailed(false)
    setLive({})
    setFancyLive({})
    axios
      .all([sportsService.getMatchById(matchId), sportsService.getMarketList(matchId), sportsService.getFancyList(matchId)])
      .then(
        axios.spread((matchRes, marketRes, fancyRes) => {
          const m = matchRes.data.data.match
          // keep the match the listing stored when the API returns none
          if (m) dispatch(setCurrentMatch(m))
          setMatch(m || null)
          setStake(matchRes.data.data.stake || null)
          setMarkets(marketRes.data.data.markets || [])
          setFancies(fancyRes.data.data || [])
        }),
      )
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))

    // a selection from another event must not stay in the betslip
    return () => {
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }))
    }
  }, [matchId])

  // match room + market/fancy events
  React.useEffect(() => {
    const join = () => socket.emit('joinRoom', matchId)
    join()
    socket.on('connect', join)

    const onMarketData = (market: any) => {
      setLive((prev) => ({ ...prev, [market.marketId]: market }))
      setMarkets((prev) => (prev.some((m) => sameId(m.marketId, market.marketId)) ? prev : [...prev, market]))
    }
    const onAddMarket = (market: any) =>
      setMarkets((prev) => (prev.some((m) => sameId(m.marketId, market.marketId)) ? prev : [...prev, market]))
    const onRemoveMarket = (market: any) => setMarkets((prev) => prev.filter((m) => !sameId(m.marketId, market.marketId)))
    const onFinished = (data: any) => navigate(data?.redirect || '/', { replace: true })

    const onFancyData = (fancy: IFancy) => setFancyLive((prev) => ({ ...prev, [fancy.SelectionId]: fancy }))
    const onAddFancy = ({ newFancy, fancy }: any) => {
      const id = String(newFancy.SelectionId || fancy.SelectionId || '')
      setFancies((prev) =>
        prev.some((f) => f.marketId === id)
          ? prev
          : [
              ...prev,
              {
                ...newFancy,
                fancyName: newFancy.RunnerName || fancy.RunnerName,
                marketId: id,
                matchId: newFancy.matchId || fancy.matchId,
                sportId: newFancy.sportId || fancy.sportId,
                gtype: newFancy.gtype || fancy.gtype,
                sr_no: newFancy.sr_no || Date.now(),
                active: true,
              },
            ],
      )
      setFancyLive((prev) => ({ ...prev, [id]: fancy }))
    }
    const onRemoveFancy = (fancy: any) => {
      const id = String(fancy.SelectionId || '')
      setFancies((prev) => prev.filter((f) => f.marketId !== id))
    }
    const onSuspendFancy = ({ fancy }: any) =>
      setFancies((prev) =>
        prev.map((f) => (f.marketId === fancy.marketId && sameId(f.matchId, fancy.matchId) ? { ...f, ...fancy } : f)),
      )

    socket.on('getMarketData', onMarketData)
    socket.on('addNewMarket', onAddMarket)
    socket.on('removeMarket', onRemoveMarket)
    socket.on('matchFinished', onFinished)
    socket.on('matchClosed', onFinished)
    socket.on('getFancyData', onFancyData)
    socket.on('addNewFancy', onAddFancy)
    socket.on('removeFancy', onRemoveFancy)
    socket.on('suspendedFancy', onSuspendFancy)
    return () => {
      socket.off('connect', join)
      socket.off('getMarketData', onMarketData)
      socket.off('addNewMarket', onAddMarket)
      socket.off('removeMarket', onRemoveMarket)
      socket.off('matchFinished', onFinished)
      socket.off('matchClosed', onFinished)
      socket.off('getFancyData', onFancyData)
      socket.off('addNewFancy', onAddFancy)
      socket.off('removeFancy', onRemoveFancy)
      socket.off('suspendedFancy', onSuspendFancy)
      socket.emit('leaveRoom', matchId)
    }
  }, [socket, matchId])

  // market rooms (one per market id)
  const marketIds = markets.map((m) => m.marketId).join(',')
  React.useEffect(() => {
    if (!marketIds) return
    const ids = marketIds.split(',')
    const join = () => ids.forEach((id) => socket.emit('joinMarketRoom', id))
    join()
    socket.on('connect', join)
    return () => {
      socket.off('connect', join)
      ids.forEach((id) => socket.emit('leaveRoom', id))
    }
  }, [socket, marketIds])

  // per-user room for this match (bet/exposure updates)
  React.useEffect(() => {
    const userId = userState.user._id
    if (!userId) return
    const join = () => socketUser.emit('joinRoomMatchIdWUserId', `${userId}-${matchId}`)
    join()
    socketUser.on('connect', join)
    return () => {
      socketUser.off('connect', join)
    }
  }, [socketUser, userState.user._id, matchId])

  return { match, markets, live, fancies, fancyLive, stake, loading, failed }
}
