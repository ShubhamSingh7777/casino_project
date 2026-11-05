import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LuUser } from '../icons'
import { useUi } from '../context/UiContext'
import { useUserSession } from '../hooks/useUserSession'
import { isNavActive, MAIN_NAV } from './nav-items'

const itemClass = (active: boolean) =>
  `tw-flex tw-min-w-[68px] tw-flex-1 tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-text-[13px] tw-font-semibold ${
    active ? 'tw-text-menu' : 'tw-text-white'
  }`

/** Mobile/tablet bottom navigation; hidden from xl, where the header shows inline links. */
const BottomNav = () => {
  const { pathname } = useLocation()
  const { setProfileOpen, setSignInOpen } = useUi()
  const { isLoggedIn } = useUserSession()

  return (
    <nav
      aria-label='Main'
      className='ua-safe-bottom tw-fixed tw-inset-x-0 tw-bottom-0 tw-z-40 tw-bg-primary xl:tw-hidden'
    >
      <div className='ua-no-scrollbar tw-flex tw-h-16 tw-overflow-x-auto'>
        <div className='tw-flex tw-w-max tw-min-w-full'>
          <div className='tw-flex tw-flex-1 tw-justify-around'>
            {MAIN_NAV.map((item) => {
              const Icon = item.icon
              const active = isNavActive(item, pathname)
              return (
                <Link key={item.to} to={item.to} className={itemClass(active)} aria-current={active ? 'page' : undefined}>
                  <Icon className='tw-h-6 tw-w-6' />
                  <span className='tw-whitespace-nowrap'>{item.label}</span>
                </Link>
              )
            })}
          </div>
          <div className='tw-flex tw-border-0 tw-border-l tw-border-solid tw-border-white/20'>
            <button
              type='button'
              onClick={() => (isLoggedIn ? setProfileOpen(true) : setSignInOpen(true))}
              className={itemClass(false)}
            >
              <LuUser className='tw-h-6 tw-w-6' />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
