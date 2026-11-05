import React from 'react'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import User, { RoleType } from '../../models/User'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { logout, selectUserData } from '../../redux/actions/login/loginSlice'
import { getContact, getContactFixed } from '../../redux/actions/login/login.action'
import {
  hideBalExp,
  selectBalance,
  setBalance,
  setExposer,
  setSingleBal,
} from '../../redux/actions/balance/balanceSlice'
import { selectInitApp } from '../../redux/actions/common/commonSlice'
import { selectSportList } from '../../redux/actions/sports/sportSlice'
import { getSportListAction } from '../../redux/actions/sports/sport.action'
import { useWebsocketUser } from '../../context/webSocketUser'
import userService from '../../services/user.service'
import { CONSTANTS } from '../../utils/constants'
import { setDevGuest, useDevGuest } from '../../shared/dev-auth'

/**
 * Session side-effects for the user panel, moved here from the legacy Main + Header:
 * socket login, balance/exposure sync, hide-balance preference and contact details.
 * Mount once, in the AppShell.
 */
export const useUserSessionEffects = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userState = useAppSelector<{ user: User; status?: string }>(selectUserData)
  const balance = useAppSelector(selectBalance)
  const initApp = useAppSelector(selectInitApp)
  const { socketUser } = useWebsocketUser()

  React.useEffect(() => {
    const { user } = userState
    if (!user._id) return

    const nonUserRoles = Object.keys(RoleType).filter((role) => role !== RoleType.user)
    if (user.role && nonUserRoles.includes(user.role)) {
      // legacy useNavigateCustom().go('/') resolved to /admin for non-user roles
      navigate('/admin')
      return
    }

    if (userState.status === 'done') {
      localStorage.setItem('username', user.username)
      localStorage.setItem('login-session', user.sessionId as string)
      if (localStorage.getItem('isDemo') === null) localStorage.setItem('isDemo', 'false')
    }

    socketUser.emit('login', {
      role: user.role,
      sessionId: localStorage.getItem('login-session'),
      _id: user._id,
    })
  }, [userState])

  const loggedIn = !!userState.user?._id || !!localStorage.getItem('token')

  React.useEffect(() => {
    if (!loggedIn) return
    userService.getUserBalance().then((res: AxiosResponse) => {
      dispatch(setBalance(res.data.data))
    })
  }, [initApp, loggedIn])

  // App.tsx only loads sports after login; the public home needs them too (the endpoint is public).
  const sportsStatus = useAppSelector(selectSportList).status
  React.useEffect(() => {
    if (!sportsStatus) dispatch(getSportListAction())
  }, [sportsStatus])

  React.useEffect(() => {
    if (balance.balance != null) localStorage.setItem('balance', balance.balance.toFixed(2))
    if (balance.exposer != null) localStorage.setItem('exposer', balance.exposer.toFixed(2))
  }, [balance])

  React.useEffect(() => {
    const onExposer = ({ exposer, balance }: any) => {
      if (balance !== undefined) dispatch(setSingleBal(balance))
      if (exposer !== undefined) dispatch(setExposer(exposer))
    }
    socketUser.on('updateExposer', onExposer)
    return () => {
      socketUser.removeListener('updateExposer', onExposer)
    }
  }, [socketUser])

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSTANTS.HIDE_BAL_EXP)
      if (stored) dispatch(hideBalExp(JSON.parse(stored)))
    } catch (e) {
      console.log((e as Error).stack)
    }
  }, [])

  React.useEffect(() => {
    if (!userState.user?._id) return
    dispatch(getContact())
    dispatch(getContactFixed())
  }, [dispatch, userState.user?._id])
}

/** Read-only session info for components (header, profile sheet). */
export const useUserSession = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const userState = useAppSelector<{ user: User }>(selectUserData)
  const balance = useAppSelector(selectBalance)

  const realLogin = !!userState.user?._id || !!localStorage.getItem('token')
  // dev-only guest session (guest / guest123 on the login form, src/shared/dev-auth.ts)
  const devGuest = useDevGuest() && !realLogin
  const isLoggedIn = realLogin || devGuest
  const mainBalance = Math.floor(Number(balance?.balance ?? localStorage.getItem('balance') ?? 0))
  const exposure = Number(balance?.exposer ?? localStorage.getItem('exposer') ?? 0)
  const username = userState.user?.username || localStorage.getItem('username') || (devGuest ? 'Guest (dev)' : '')

  const signOut = React.useCallback(() => {
    localStorage.removeItem('login-session')
    localStorage.removeItem('isDemo')
    setDevGuest(false)
    dispatch(logout())
    navigate('/')
  }, [dispatch, navigate])

  return { isLoggedIn, devGuest, username, mainBalance, exposure, signOut }
}
