import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconType,
  LuArrowDownToLine,
  LuArrowUpFromLine,
  LuBookOpen,
  LuChartLine,
  LuClock,
  LuDices,
  LuFileText,
  LuHistory,
  LuLock,
  LuLogOut,
  LuSettings,
  LuX,
} from '../icons'
import { useUi } from '../context/UiContext'
import { useUserSession } from '../hooks/useUserSession'
import { formatMoney } from '../utils/format'
import Sheet from '../components/Sheet'

type Item = { label: string; to: string; icon: IconType }

// Same destinations as the legacy header dropdown, grouped like the reference account drawer.
const SECTIONS: Array<{ title: string; items: Item[] }> = [
  {
    title: 'Account',
    items: [
      { label: 'General Settings', to: '/settings', icon: LuSettings },
      { label: 'Rules', to: '/rules', icon: LuBookOpen },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Account Statement', to: '/report/account-statement', icon: LuFileText },
      { label: 'Profit & Loss', to: '/report/profit-loss', icon: LuChartLine },
      { label: 'Bet History', to: '/report/bet-history', icon: LuHistory },
      { label: 'Current Bets', to: '/report/current-bets', icon: LuClock },
      { label: 'Casino Result', to: '/report/casino-result', icon: LuDices },
      { label: 'Deposit Statement', to: '/report/deposit-statement', icon: LuArrowDownToLine },
      { label: 'Withdraw Statement', to: '/report/withdraw-statement', icon: LuArrowUpFromLine },
    ],
  },
  { title: 'Security', items: [{ label: 'Change Password', to: '/settings/change-password', icon: LuLock }] },
]

const sectionTitle = 'tw-m-0 tw-px-5 tw-pb-1 tw-pt-4 tw-text-meta tw-font-bold tw-uppercase tw-tracking-wider'
const row = 'tw-flex tw-h-11 tw-items-center tw-gap-3 tw-px-5 tw-text-[15px] hover:tw-bg-muted'

const ProfileSheet = () => {
  const { profileOpen, setProfileOpen } = useUi()
  const { username, mainBalance, exposure, signOut } = useUserSession()
  const { pathname } = useLocation()
  const close = React.useCallback(() => setProfileOpen(false), [setProfileOpen])

  React.useEffect(close, [pathname])

  return (
    <Sheet open={profileOpen} onClose={close} side='right' label='Account menu' className='ua-ui'>
      <div className='tw-flex tw-items-start tw-gap-3 tw-px-5 tw-pb-4 tw-pt-5'>
        <span className='tw-flex tw-h-12 tw-w-12 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary tw-text-lg tw-font-bold tw-text-white'>
          {(username || '?').charAt(0).toUpperCase()}
        </span>
        <div className='tw-min-w-0 tw-flex-1'>
          <p className='tw-m-0 tw-text-meta tw-uppercase tw-tracking-wider tw-text-muted-fg'>Account</p>
          <p className='tw-m-0 tw-truncate tw-text-lg tw-font-bold'>{username}</p>
        </div>
        <button type='button' aria-label='Close account menu' onClick={close} className='tw-p-1 tw-text-muted-fg'>
          <LuX className='tw-h-5 tw-w-5' />
        </button>
      </div>

      <div className='tw-grid tw-grid-cols-2 tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-px-5 tw-pb-4'>
        <div className='tw-rounded-ua tw-border tw-border-solid tw-border-line tw-p-3'>
          <p className='tw-m-0 tw-text-meta tw-uppercase tw-text-muted-fg'>Balance</p>
          <p className='tw-m-0 tw-text-base tw-font-bold tw-tabular-nums'>{formatMoney(mainBalance)}</p>
        </div>
        <Link to='/report/current-bets' className='tw-rounded-ua tw-border tw-border-solid tw-border-line tw-p-3'>
          <p className='tw-m-0 tw-text-meta tw-uppercase tw-text-muted-fg'>Exposure</p>
          <p className='tw-m-0 tw-text-base tw-font-bold tw-tabular-nums'>{formatMoney(exposure)}</p>
        </Link>
      </div>

      <nav className='tw-flex-1 tw-overflow-y-auto tw-pb-2'>
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <p className={sectionTitle}>{s.title}</p>
            <ul className='tw-m-0 tw-list-none tw-p-0'>
              {s.items.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} aria-current={pathname === to ? 'page' : undefined} className={`${row} ${pathname === to ? 'tw-bg-muted' : ''}`}>
                    <Icon className='tw-h-5 tw-w-5' aria-hidden />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <button
        type='button'
        onClick={() => {
          close()
          signOut()
        }}
        className={`${row} tw-h-14 tw-w-full tw-border-0 tw-border-t tw-border-solid tw-border-line`}
      >
        <LuLogOut className='tw-h-5 tw-w-5' /> Sign Out
      </button>
    </Sheet>
  )
}

export default ProfileSheet
