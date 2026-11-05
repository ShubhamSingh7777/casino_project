import React from 'react'
import { useNavigate } from 'react-router-dom'
import LMatch from '../../models/LMatch'
import IMatch from '../../models/IMatch'
import { useAppDispatch } from '../../redux/hooks'
import { setCurrentMatch } from '../../redux/actions/sports/sportSlice'
import { useUi } from '../context/UiContext'
import { useUserSession } from './useUserSession'
import { VIRTUAL_SPORT_ID } from '../constants/sports'

/** Virtual sports and e-cricket (T10 stream) events use the virtual event variants (v2 §5.7–5.8). */
export const eventBasePath = (match: LMatch) =>
  match.isT10 ? '/tp-virtual' : Number(match.sportId) === VIRTUAL_SPORT_ID ? '/virtual' : '/exchange'

/**
 * Opens an event page. The market APIs need a token, so logged-out visitors get
 * the Sign-In modal instead (v2 wants open browsing — needs those APIs made public first).
 */
export const useOpenMatch = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useUserSession()
  const { setSignInOpen } = useUi()

  return React.useCallback(
    (match: LMatch) => {
      if (!isLoggedIn) return setSignInOpen(true)
      dispatch(setCurrentMatch(match as unknown as IMatch))
      navigate(`${eventBasePath(match)}/${match.sportId}/${match.matchId}`)
    },
    [dispatch, navigate, isLoggedIn, setSignInOpen],
  )
}
