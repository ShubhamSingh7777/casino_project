import React from 'react'
import LMatch from '../../models/LMatch'
import { IApiStatus } from '../../models/IApiStatus'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectAllMatches } from '../../redux/actions/sports/sportSlice'
import { getMatchListAction } from '../../redux/actions/sports/sport.action'
import { useWebsocket } from '../../context/webSocket'
import { MAIN_MARKET } from '../constants/sports'

/** Legacy rule: hide matches that started before yesterday. */
const isRecent = (match: LMatch) => {
  const yesterday = new Date()
  yesterday.setHours(0, 0, 0, 0)
  yesterday.setDate(yesterday.getDate() - 1)
  const day = new Date(match.matchDateTime)
  day.setHours(0, 0, 0, 0)
  return day >= yesterday
}

/**
 * All matches from the store, kept live via the `dashboardMatches` socket event
 * (which only carries MATCH_ODDS runners). Pass sportIds to limit the socket subscriptions.
 */
export const useLiveMatches = (sportIds?: string[]) => {
  const dispatch = useAppDispatch()
  const { socket } = useWebsocket()
  const allMatches = useAppSelector(selectAllMatches) as unknown as { matches: LMatch[]; status: string }
  const [matches, setMatches] = React.useState<LMatch[]>([])

  React.useEffect(() => {
    if (allMatches.status !== IApiStatus.Done && allMatches.status !== IApiStatus.Loading) {
      dispatch(getMatchListAction('all'))
    }
  }, [dispatch, allMatches.status])

  React.useEffect(() => {
    if (allMatches.status === IApiStatus.Done) setMatches(allMatches.matches.filter(isRecent))
  }, [allMatches.status, allMatches.matches])

  // Without explicit ids, subscribe to every sport present in the list.
  const subscribeKey = (sportIds || Array.from(new Set(matches.map((m) => String(m.sportId))))).sort().join(',')
  React.useEffect(() => {
    if (allMatches.status !== IApiStatus.Done || !subscribeKey) return
    const ids = subscribeKey.split(',')
    ids.forEach((id) => socket.emit('subscribeDashboard', id))
    return () => {
      ids.forEach((id) => socket.emit('unsubscribeDashboard', id))
    }
  }, [socket, allMatches.status, subscribeKey])

  React.useEffect(() => {
    const onUpdate = (updates: any[]) => {
      const byId = new Map(updates.map((m) => [String(m.matchId), m]))
      setMatches((prev) =>
        prev.map((match) => {
          const update = byId.get(String(match.matchId))
          if (!update) return match
          return {
            ...match,
            markets:
              match.markets?.map((m) =>
                m.marketName === MAIN_MARKET ? { ...m, runners: update.markets?.[0]?.runners || m.runners } : m,
              ) || update.markets,
          }
        }),
      )
    }
    socket.on('dashboardMatches', onUpdate)
    return () => {
      socket.off('dashboardMatches', onUpdate)
    }
  }, [socket])

  return {
    matches,
    loading: allMatches.status === IApiStatus.Loading || allMatches.status === '',
    failed: allMatches.status === IApiStatus.Fail,
  }
}
