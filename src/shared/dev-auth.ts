import React from 'react'
import { AxiosError } from 'axios'
import api from '../utils/api'
import authService from '../services/auth.service'

/**
 * TEMPORARY (frontend-only phase): see the logged-in UI without a backend login.
 * Only in `npm start` (NODE_ENV=development) — a production build (what the Bitbucket
 * pipeline deploys) has none of this. Both panels keep their normal login screens:
 *  - User panel: sign in with DEV_GUEST → local "guest" session.
 *  - Admin panel: "Demo Login" button (or DEV_ADMIN_DEMO credentials) → local demo session
 *    with the admin role, so every menu item and page is visible.
 * No API is called for these sessions; logout ends them. Turn off in .env.development.local:
 *   REACT_APP_USER_DEV_LOGIN=false
 *   REACT_APP_ADMIN_DEMO_LOGIN=false
 */
const DEV = process.env.NODE_ENV === 'development'
export const USER_DEV_LOGIN = DEV && process.env.REACT_APP_USER_DEV_LOGIN !== 'false'
export const ADMIN_DEMO_LOGIN = DEV && process.env.REACT_APP_ADMIN_DEMO_LOGIN !== 'false'

/** Dev-only credentials. */
export const DEV_GUEST = { username: 'guest', password: 'guest123' }
export const DEV_ADMIN_DEMO = { username: 'demo', password: 'demo123' }

/** A local on/off session kept in localStorage, with a hook that re-renders on change. */
const devSession = (key: string, enabled: boolean) => {
  const listeners = new Set<() => void>()
  const read = () => {
    try {
      return enabled && localStorage.getItem(key) === '1'
    } catch {
      return false
    }
  }
  const set = (on: boolean) => {
    try {
      if (on) localStorage.setItem(key, '1')
      else localStorage.removeItem(key)
    } catch {
      // storage blocked: the session just won't survive a reload
    }
    listeners.forEach((l) => l())
  }
  const subscribe = (l: () => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }
  const useSession = () => React.useSyncExternalStore(subscribe, read)
  return { read, set, useSession }
}

const matches = (creds: { username: string; password: string }, username: string, password: string) =>
  username.trim().toLowerCase() === creds.username && password === creds.password

const guest = devSession('dev-guest-session', USER_DEV_LOGIN)
export const isDevGuestCredentials = (username: string, password: string) => USER_DEV_LOGIN && matches(DEV_GUEST, username, password)
export const setDevGuest = guest.set
export const useDevGuest = guest.useSession

const adminDemo = devSession('dev-admin-demo-session', ADMIN_DEMO_LOGIN)
export const isAdminDemoCredentials = (username: string, password: string) => ADMIN_DEMO_LOGIN && matches(DEV_ADMIN_DEMO, username, password)
export const readAdminDemo = adminDemo.read
export const setAdminDemo = adminDemo.set
export const useAdminDemo = adminDemo.useSession

const onAdminPath = () => window.location.pathname.startsWith('/admin')

/** True while the current panel is shown "logged in" through a dev session instead of a real login. */
export const isBypassingLogin = () => (onAdminPath() ? adminDemo.read() : guest.read()) && !authService.isLoggedIn()

/**
 * "Empty" API payload for logged-out dev browsing: an empty array (for `.map` / `.length`)
 * that also carries the empty fields the admin pages read (`items`, `docs`, `totalPages`…).
 */
const emptyPayload = () =>
  Object.assign([], {
    items: [],
    docs: [],
    bets: [],
    markets: [],
    completeBookList: [],
    totalPages: 0,
    total: 0,
    totalAmount: 0,
    openingBalance: 0,
    settings: [],
    odds_profit: {},
    profitlist: {},
  })

/** POST endpoints that only read data (reports, lists, suggestions) — treated like GETs. */
const READ_ONLY_POSTS = [
  'account-statement-list',
  'profit-loss',
  'alluserbetList',
  'get-deposit-withdraw-list',
  'get-bet-list-by-ids',
  'get-user-list-suggestion',
  'get-match-list-suggestion',
  'get-user-wise-book',
  'get-fancy-position',
]

/** Session endpoints keep their real 401: an empty "user" would break the login reducers. */
const SESSION_ENDPOINTS = ['user-info', 'refresh-token', 'login', 'login-admin', 'agent-login']

const endpointOf = (error: AxiosError<any>) => String(error.config?.url || '').replace(/^\//, '').split('?')[0].replace(/\/$/, '')

const isRead = (error: AxiosError<any>) => {
  const method = (error.config?.method || 'get').toLowerCase()
  const url = endpointOf(error)
  if (SESSION_ENDPOINTS.includes(url)) return false
  return method === 'get' || (method === 'post' && READ_ONLY_POSTS.includes(url))
}

const isNoTokenError = (error: AxiosError<any>) =>
  error.response?.status === 401 && /no auth token/i.test(String(error.response?.data?.message || ''))

/**
 * While a dev session is on and nobody is logged in, pages must not show "No auth token":
 * - reads (GET, and the read-only POSTs above) resolve with an empty payload, so lists render empty;
 * - writes never fake a success — they fail with a clear "login to save" message instead.
 * Only in development, only while a dev session (user guest / admin demo) is in effect.
 */
if (ADMIN_DEMO_LOGIN || USER_DEV_LOGIN) {
  api.interceptors.response.use(undefined, (error: AxiosError<any>) => {
    if (!isBypassingLogin() || !isNoTokenError(error) || SESSION_ENDPOINTS.includes(endpointOf(error))) return Promise.reject(error)
    if (isRead(error)) {
      return Promise.resolve({ ...error.response, status: 200, data: { error: false, data: emptyPayload() } })
    }
    if (error.response) error.response.data = { ...error.response.data, message: 'Dev mode: login to save changes' }
    return Promise.reject(error)
  })
}
