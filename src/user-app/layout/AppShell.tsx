import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useAppSelector } from '../../redux/hooks'
import { selectWelcomeMessage } from '../../redux/actions/login/loginSlice'
import Welcome from '../../pages/Rules/welcome'
import { UiProvider } from '../context/UiContext'
import { useUserSession, useUserSessionEffects } from '../hooks/useUserSession'
import Header from './Header'
import BottomNav from './BottomNav'
import SideDrawer from './SideDrawer'
import ProfileSheet from './ProfileSheet'
import SportList from './SportList'
import FloatingActions from './FloatingActions'
import SiteFooter from './SiteFooter'
import RulesModal from './RulesModal'
import BetslipContent from '../components/betslip/BetslipContent'
import BetslipOverlay from '../components/betslip/BetslipOverlay'
import { useBetslipController } from '../components/betslip/useBetslip'
import SignInModal from '../components/SignInModal'
import '../styles/user-app.css'

// Pages that render full-screen without the app chrome (same list as the legacy Main).
const CHROMELESS_ROUTES = ['/terms-conditions', '/responsible-gaming']

/**
 * User-panel layout: fixed header + bottom nav; on xl a sports sidebar (left) and betslip panel (right).
 * The document itself scrolls (not an inner div) so legacy pages that rely on
 * window scroll / ScrollToTop keep working.
 */
/** Dev-only notice while the logged-in UI is shown without a real login. */
const DevGuestBanner = () => {
  const { devGuest } = useUserSession()
  if (!devGuest) return null
  return (
    <p className='ua-ui tw-mb-2 tw-rounded-ua tw-bg-amber-50 tw-px-3 tw-py-1.5 tw-text-meta tw-text-amber-800'>
      Dev mode: signed in as the local guest (no backend login) — lists are empty and nothing can be saved.
    </p>
  )
}

/** Needs the UiProvider, so it lives in a child component. */
const BetslipController = () => {
  useBetslipController()
  return null
}

const AppShell = () => {
  useUserSessionEffects()
  const { pathname } = useLocation()
  const welcome = useAppSelector<{ status: boolean }>(selectWelcomeMessage)
  const chromeless = CHROMELESS_ROUTES.includes(pathname)
  // static CMS pages sit on the page background without the footer card (v2 §5.10)
  const noFooter = pathname.startsWith('/page/')

  return (
    <UiProvider>
      {/* #ua-root is the Tailwind `important` scope; it carries no utility classes itself. */}
      <div id='ua-root'>
        <div className='ua-page-bg tw-min-h-[100dvh]'>
          {!chromeless && (
            <div className='ua-ui'>
              <Header />
            </div>
          )}

          <div
            className={
              chromeless
                ? ''
                : 'tw-pb-[calc(64px+24px+env(safe-area-inset-bottom))] tw-pt-[60px] xl:tw-grid xl:tw-grid-cols-[280px_minmax(0,1fr)_320px] xl:tw-pb-6'
            }
          >
            {!chromeless && (
              <aside className='ua-ui tw-sticky tw-top-[60px] tw-hidden tw-h-[calc(100dvh-60px)] tw-overflow-hidden tw-border-0 tw-border-r tw-border-solid tw-border-line tw-bg-white xl:tw-block'>
                <SportList />
              </aside>
            )}
            <main className='tw-min-w-0 tw-px-1.5 tw-pt-2 md:tw-px-3'>
              <DevGuestBanner />
              <Outlet />
              {!chromeless && !noFooter && (
                <div className='ua-ui'>
                  <SiteFooter />
                </div>
              )}
            </main>
            {!chromeless && (
              <aside className='ua-ui tw-sticky tw-top-[60px] tw-hidden tw-h-[calc(100dvh-60px)] tw-pb-3 tw-pr-3 tw-pt-2 xl:tw-block'>
                <div className='tw-flex tw-max-h-full tw-flex-col tw-overflow-hidden tw-rounded-ua'>
                  <BetslipContent />
                </div>
              </aside>
            )}
          </div>

          {!chromeless && (
            <div className='ua-ui'>
              <BottomNav />
              <SideDrawer />
              <ProfileSheet />
              <FloatingActions />
              <BetslipOverlay />
              <BetslipController />
            </div>
          )}
          <RulesModal />
          <div className='ua-ui'>
            <SignInModal />
          </div>
        </div>
      </div>
      <ToastContainer hideProgressBar={true} autoClose={1000} />
      {welcome.status ? <Welcome /> : ''}
    </UiProvider>
  )
}

export default AppShell
