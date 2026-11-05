import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LuMenu, LuSearch, LuTicket, LuUser } from '../icons'
import { useUi } from '../context/UiContext'
import { useClock } from '../hooks/useClock'
import { useUserSession } from '../hooks/useUserSession'
import TimezoneMenu from '../components/TimezoneMenu'
import BalanceMenu from '../components/account/BalanceMenu'
import SearchDrawer from '../components/account/SearchDrawer'
import { HEADER_NAV, isNavActive } from './nav-items'
import { useBetslip } from '../components/betslip/useBetslip'

const Header = () => {
  const { timezone, setDrawerOpen, setProfileOpen, setSignInOpen, setBetslipOpen } = useUi()
  const clock = useClock(timezone)
  const { pathname } = useLocation()
  const { isLoggedIn, username } = useUserSession()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { bet } = useBetslip()
  const betslipCount = bet ? 1 : 0

  return (
    <header className='tw-fixed tw-inset-x-0 tw-top-0 tw-z-40 tw-flex tw-h-[60px] tw-items-center tw-gap-2 tw-bg-primary tw-px-2 tw-text-white sm:tw-px-4'>
      <button
        type='button'
        aria-label='Open navigation menu'
        onClick={() => setDrawerOpen(true)}
        className='tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-md hover:tw-bg-white/10 xl:tw-hidden'
      >
        <LuMenu className='tw-h-6 tw-w-6' />
      </button>

      <Link to='/' aria-label='Home' className='tw-flex tw-h-8 tw-w-20 tw-shrink-0 tw-items-center sm:tw-w-48'>
        <img src='/imgs/logo.png' alt='Logo' className='tw-max-h-8 tw-w-auto tw-object-contain' />
      </Link>

      <nav className='tw-ml-4 tw-hidden tw-items-center tw-gap-1 xl:tw-flex'>
        {HEADER_NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`tw-flex tw-items-center tw-gap-2 tw-rounded-md tw-px-3 tw-py-2 tw-text-strong hover:tw-bg-white/10 ${
              isNavActive(item, pathname) ? 'tw-text-menu' : 'tw-text-white'
            }`}
          >
            <item.icon className='tw-h-5 tw-w-5 tw-opacity-80' aria-hidden />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className='tw-ml-auto tw-flex tw-items-center tw-gap-2'>
        <div className='tw-hidden tw-flex-col tw-items-end tw-text-xs tw-font-bold tw-leading-tight sm:tw-flex'>
          <span className='tw-text-white/70'>{clock.date}</span>
          <span className='tw-tabular-nums'>{clock.time}</span>
        </div>
        <div className='tw-hidden sm:tw-block'>
          <TimezoneMenu />
        </div>
        <span className='tw-mx-1 tw-hidden tw-h-8 tw-w-px tw-bg-white/20 sm:tw-block' />

        <button
          type='button'
          onClick={() => setBetslipOpen(true)}
          aria-label={betslipCount ? `Open betslip, ${betslipCount} selection${betslipCount > 1 ? 's' : ''}` : 'Open betslip, empty'}
          className='tw-relative tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-md hover:tw-bg-white/10'
        >
          <LuTicket className='tw-h-6 tw-w-6' />
          {betslipCount > 0 && (
            <span className='tw-absolute tw-right-0.5 tw-top-0.5 tw-flex tw-h-[18px] tw-min-w-[18px] tw-items-center tw-justify-center tw-rounded-full tw-bg-red-600 tw-px-1 tw-text-[10px] tw-font-bold'>
              {betslipCount}
            </span>
          )}
        </button>

        {isLoggedIn ? (
          <>
            <button
              type='button'
              aria-label='Search events'
              onClick={() => setSearchOpen(true)}
              className='tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-md hover:tw-bg-white/10'
            >
              <LuSearch className='tw-h-5 tw-w-5' />
            </button>
            <BalanceMenu />
            <button
              type='button'
              onClick={() => setProfileOpen(true)}
              aria-label='Open account menu'
              className='tw-hidden tw-h-10 tw-items-center tw-gap-1.5 tw-rounded-md tw-border tw-border-solid tw-border-white/25 tw-px-3 tw-text-strong xl:tw-flex'
            >
              <LuUser className='tw-h-4 tw-w-4' />
              <span className='tw-max-w-[120px] tw-truncate'>{username}</span>
            </button>
            <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
          </>
        ) : (
          <button
            type='button'
            onClick={() => setSignInOpen(true)}
            className='tw-flex tw-h-10 tw-items-center tw-rounded-md tw-bg-secondary tw-px-4 tw-font-bold tw-text-white'
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
