import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import User, { RoleType } from '../../models/User'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import authService from '../../services/auth.service'
import { useNavigateCustom } from '../../pages/_layout/elements/custom-link'
import { TIMEZONES, TimezoneOption } from '../../user-app/utils/format'
import { useAdminDemo } from '../dev-auth'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import BalanceStrip from './BalanceStrip'
import '../../user-app/styles/user-app.css'
import '../styles/admin-ui.css'

/** Routes already rebuilt with the new admin UI; everything else is a legacy page on a light surface. */
const NEW_UI_PREFIXES = [
  '/admin/market-analysis',
  '/admin/list-clients',
  '/admin/add-user',
  '/admin/agent-management',
  '/admin/accountstatement',
  '/admin/profitloss',
  '/admin/unsettledbet',
  '/admin/casinos',
  '/admin/odds',
  '/admin/transfer',
  '/admin/general-lock',
  '/admin/secureauth',
  '/admin/assign-agent',
  '/admin/userhistory',
  '/admin/casinoresult',
  '/admin/livecasinoreport',
  '/admin/sportbookreport',
  '/admin/turnover',
  '/admin/authlist',
  '/admin/fraud',
]
const isNewUi = (path: string) => path === '/admin' || path === '/admin/' || NEW_UI_PREFIXES.some((p) => path.startsWith(p))

export const AdminTimezoneContext = React.createContext<TimezoneOption>(TIMEZONES[1])

const AdminFooter = () => (
  <div className='ad-footer-bg tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-px-4 tw-py-3 tw-text-[11px] tw-text-ad-muted'>
    <span className='tw-flex tw-gap-3'>
      <Link to='/responsible-gaming' className='hover:tw-text-white'>
        Responsible Gambling
      </Link>
      <span>18+</span>
    </span>
    <span>Rules &amp; Regulations © 2016-{new Date().getFullYear()}</span>
  </div>
)

/**
 * Admin layout (spec §1): sticky header, 230px sidebar (off-canvas below lg), balance strip, footer.
 * Keeps the legacy MainAdmin auth rule: not logged in or a plain user → /admin/login.
 */
const AdminShell = () => {
  const { user } = useAppSelector<{ user: User }>(selectUserData)
  const navigate = useNavigateCustom()
  const { pathname } = useLocation()
  const [timezone, setTimezone] = React.useState<TimezoneOption>(TIMEZONES[1])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const demo = useAdminDemo() && !authService.isLoggedIn()

  React.useEffect(() => {
    // a logged-in plain user is always sent away; "not logged in" is allowed only in the dev demo session
    if (user.role === RoleType.user || (!authService.isLoggedIn() && !demo)) navigate.go('/admin/login')
  }, [user, demo])

  React.useEffect(() => setMenuOpen(false), [pathname])

  return (
    <AdminTimezoneContext.Provider value={timezone}>
      <div id='ua-root'>
        <div className='ad-ui tw-min-h-[100dvh] tw-bg-ad-bg'>
          <AdminHeader timezone={timezone} onTimezone={setTimezone} onMenu={() => setMenuOpen(true)} />
          <div className='tw-flex'>
            <aside
              className={`tw-fixed tw-inset-y-0 tw-left-0 tw-z-50 tw-w-[230px] tw-overflow-y-auto tw-bg-[#262e5e] tw-transition-transform lg:tw-sticky lg:tw-top-[60px] lg:tw-z-auto lg:tw-h-[calc(100dvh-60px)] lg:tw-translate-x-0 lg:tw-bg-ad-side ${
                menuOpen ? 'tw-translate-x-0' : '-tw-translate-x-full'
              }`}
            >
              <AdminSidebar />
            </aside>
            {menuOpen && <div className='tw-fixed tw-inset-0 tw-z-40 tw-bg-black/50 lg:tw-hidden' onClick={() => setMenuOpen(false)} />}
            <main className='tw-min-w-0 tw-flex-1 tw-p-3'>
              {demo && (
                <p className='tw-mb-2 tw-rounded tw-bg-ad-warning/20 tw-px-3 tw-py-1.5 tw-text-[12px] tw-text-ad-warning'>
                  Demo mode (dev only): every page is open, but without a real login lists are empty and nothing is saved.
                </p>
              )}
              <BalanceStrip />
              {isNewUi(pathname) ? (
                <Outlet />
              ) : (
                // legacy page: keep its expected `.admin .main` wrappers and light background
                <div className='admin'>
                  <div className='main ad-legacy-surface'>
                    <Outlet />
                  </div>
                </div>
              )}
            </main>
          </div>
          <AdminFooter />
        </div>
      </div>
      <ToastContainer />
    </AdminTimezoneContext.Provider>
  )
}

export default AdminShell
