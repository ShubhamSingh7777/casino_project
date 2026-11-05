import React from 'react'
import { TimezoneOption, TIMEZONES } from '../utils/format'
import { IUserBetStake } from '../../models/IUserStake'

const TZ_STORAGE_KEY = 'ua-timezone'

type UiState = {
  timezone: TimezoneOption
  setTimezone: (tz: TimezoneOption) => void
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  profileOpen: boolean
  setProfileOpen: (open: boolean) => void
  signInOpen: boolean
  setSignInOpen: (open: boolean) => void
  /** mobile sheet / tablet dialog visibility (the xl panel is always visible) */
  betslipOpen: boolean
  setBetslipOpen: (open: boolean) => void
  /** quick-stake buttons of the open event (get-match-by-id `stake`) */
  betStake: IUserBetStake | null
  setBetStake: (stake: IUserBetStake | null) => void
}

const UiContext = React.createContext<UiState | null>(null)

const readStoredTimezone = () => {
  try {
    const id = localStorage.getItem(TZ_STORAGE_KEY)
    return TIMEZONES.find((tz) => tz.id === id)
  } catch {
    return undefined
  }
}

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [timezone, setTimezoneState] = React.useState<TimezoneOption>(
    () => readStoredTimezone() || TIMEZONES[1],
  )
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [profileOpen, setProfileOpen] = React.useState(false)
  const [signInOpen, setSignInOpen] = React.useState(false)
  const [betslipOpen, setBetslipOpen] = React.useState(false)
  const [betStake, setBetStake] = React.useState<IUserBetStake | null>(null)

  const setTimezone = React.useCallback((tz: TimezoneOption) => {
    setTimezoneState(tz)
    try {
      localStorage.setItem(TZ_STORAGE_KEY, tz.id)
    } catch {
      // storage unavailable (private mode) — keep it in memory only
    }
  }, [])

  const value = React.useMemo(
    () => ({
      timezone,
      setTimezone,
      drawerOpen,
      setDrawerOpen,
      profileOpen,
      setProfileOpen,
      signInOpen,
      setSignInOpen,
      betslipOpen,
      setBetslipOpen,
      betStake,
      setBetStake,
    }),
    [timezone, setTimezone, drawerOpen, profileOpen, signInOpen, betslipOpen, betStake],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export const useUi = () => {
  const ctx = React.useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>')
  return ctx
}
