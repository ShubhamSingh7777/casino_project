import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

/**
 * Old URLs still used by legacy pages/bookmarks → v2 routes.
 * /match/4, /match/4/in-play → /exchange/4 · /match/in-play, /match/all → /exchange
 */
export const MatchRedirect = () => {
  const { sportId = '' } = useParams()
  return <Navigate to={/^\d+$/.test(sportId) ? `/exchange/${sportId}` : '/exchange'} replace />
}
