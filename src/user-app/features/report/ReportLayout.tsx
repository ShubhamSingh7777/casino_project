import React from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useUserSession, useUserSessionEffects } from '../../hooks/useUserSession'
import { formatMoney } from '../../utils/format'
import { LuChevronLeft, LuMenu, LuX } from '../../icons'
import { REPORT_LINKS } from './report-links'
import '../../styles/user-app.css'

/** Report shell (v3 §13 "(report)" group): own header + reports menu, no site header / bottom nav. */
const ReportLayout = () => {
  // the report shell replaces AppShell, so it runs the session effects (balance, sockets) itself
  useUserSessionEffects()
  const { pathname } = useLocation()
  const { username, mainBalance, exposure, devGuest } = useUserSession()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const current = REPORT_LINKS.find((l) => pathname.startsWith(l.to))

  React.useEffect(() => setMenuOpen(false), [pathname])

  return (
    <div id='ua-root'>
      <div className='ua-ui ua-page-bg tw-min-h-[100dvh]'>
        <header className='tw-sticky tw-top-0 tw-z-40 tw-flex tw-h-[60px] tw-items-center tw-gap-2 tw-bg-primary tw-px-2 tw-text-white sm:tw-px-4'>
          <Link to='/' aria-label='Back to site' className='tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-px-2 tw-py-2 tw-text-body hover:tw-bg-white/10'>
            <LuChevronLeft className='tw-h-5 tw-w-5' />
            <span className='tw-hidden sm:tw-inline'>Back to site</span>
          </Link>
          <img src='/imgs/logo.png' alt='Logo' className='tw-hidden tw-h-8 tw-w-auto md:tw-block' />
          <h1 className='tw-ml-1 tw-truncate tw-text-header'>{current?.label || 'Reports'}</h1>
          <div className='tw-ml-auto tw-hidden tw-text-right tw-text-meta tw-leading-tight sm:tw-block'>
            <p className='tw-m-0 tw-font-bold'>{username}</p>
            <p className='tw-m-0 tw-text-white/70'>
              ₹ {formatMoney(mainBalance)} · Exp {formatMoney(exposure)}
            </p>
          </div>
          <button type='button' aria-label='Reports menu' onClick={() => setMenuOpen((o) => !o)} className='tw-rounded-md tw-p-2 hover:tw-bg-white/10 lg:tw-hidden'>
            {menuOpen ? <LuX className='tw-h-6 tw-w-6' /> : <LuMenu className='tw-h-6 tw-w-6' />}
          </button>
        </header>

        <div className='tw-mx-auto tw-flex tw-max-w-[1600px] tw-gap-2 tw-p-1.5 md:tw-p-3'>
          <nav
            aria-label='Reports'
            className={`${menuOpen ? 'tw-block' : 'tw-hidden'} tw-fixed tw-inset-x-2 tw-top-[64px] tw-z-30 tw-rounded-ua tw-bg-white tw-p-2 tw-shadow-xl lg:tw-sticky lg:tw-top-[72px] lg:tw-block lg:tw-h-max lg:tw-w-60 lg:tw-shrink-0 lg:tw-shadow-none`}
          >
            {REPORT_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `tw-block tw-rounded-md tw-px-3 tw-py-2.5 tw-text-body ${isActive ? 'tw-bg-primary tw-font-bold tw-text-white' : 'hover:tw-bg-row-active'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <main className='tw-min-w-0 tw-flex-1'>
            {devGuest && (
              <p className='tw-mb-2 tw-rounded-ua tw-bg-amber-50 tw-px-3 tw-py-1.5 tw-text-meta tw-text-amber-800'>
                Dev mode: signed in as the local guest (no backend login) — lists are empty and nothing can be saved.
              </p>
            )}
            <Outlet />
          </main>
        </div>
      </div>
      <ToastContainer hideProgressBar autoClose={1000} />
    </div>
  )
}

export default ReportLayout
