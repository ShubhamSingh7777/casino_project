import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import User from '../../models/User'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { logout, selectUserData, userUpdate } from '../../redux/actions/login/loginSlice'
import { useClock } from '../../user-app/hooks/useClock'
import { useClickOutside } from '../../user-app/hooks/useClickOutside'
import { TIMEZONES, TimezoneOption } from '../../user-app/utils/format'
import { UserSelect } from '../ui/UserSelect'
import UserQuickView from '../features/agents/UserQuickView'
import { useAdminDemo } from '../dev-auth'
import { setAdminDemo } from '../../shared/dev-auth'
import { LuChevronDown, LuKeyRound, LuLogOut, LuMenu, LuSettings, LuShieldCheck } from '../ui/icons'

const TZ_LABEL: Record<TimezoneOption['id'], string> = {
  system: 'System time - (GMT +00:00)',
  local: 'Your computer time - (GMT +05:30)',
  ist: 'India Standard time - (GMT +05:30)',
}

const Dropdown = ({ button, children }: { button: (toggle: () => void) => React.ReactNode; children: (close: () => void) => React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)
  return (
    <div ref={ref} className='tw-relative'>
      {button(() => setOpen((o) => !o))}
      {open && (
        <div className='tw-absolute tw-right-0 tw-top-full tw-z-50 tw-mt-1 tw-min-w-[220px] tw-overflow-hidden tw-rounded tw-bg-white tw-py-1 tw-text-[13px] tw-text-[#212529] tw-shadow-xl'>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

/** Header (admin spec §1.1). */
const AdminHeader = ({ timezone, onTimezone, onMenu }: { timezone: TimezoneOption; onTimezone: (tz: TimezoneOption) => void; onMenu: () => void }) => {
  const { user } = useAppSelector<{ user: User }>(selectUserData)
  const demo = useAdminDemo() && !user.username
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const clock = useClock(timezone)
  const [quickView, setQuickView] = React.useState<string | null>(null)
  const [monthDay, year] = clock.date.split(', ')

  // same as the legacy admin header
  const logoutUser = () => {
    setAdminDemo(false)
    dispatch(userUpdate({} as User))
    setTimeout(() => {
      dispatch(logout())
      navigate('/admin/login')
    }, 1)
  }

  return (
    <header className='tw-sticky tw-top-0 tw-z-40 tw-flex tw-h-[60px] tw-items-center tw-gap-3 tw-bg-ad-bg tw-px-3 tw-shadow-md'>
      <button type='button' aria-label='Open menu' onClick={onMenu} className='tw-p-1 lg:tw-hidden'>
        <LuMenu className='tw-h-6 tw-w-6' />
      </button>
      <Link to='/admin' className='tw-flex tw-h-10 tw-w-[120px] tw-shrink-0 tw-items-center tw-overflow-hidden sm:tw-w-[150px]'>
        <img src='/imgs/logo.png' alt='Logo' className='tw-max-h-10 tw-max-w-full tw-object-contain' />
      </Link>

      <div className='tw-hidden tw-items-center tw-gap-2 md:tw-flex'>
        <span className='tw-text-[12px] tw-leading-tight'>
          {monthDay},<br />
          {year}
        </span>
        <span className='tw-text-[20px] tw-font-bold tw-tabular-nums'>{clock.time}</span>
        <Dropdown
          button={(toggle) => (
            <button type='button' onClick={toggle} className='tw-flex tw-items-center tw-gap-0.5 tw-text-[12px]'>
              ({timezone.offsetMinutes ? '+05:30' : '+00:00'}) <LuChevronDown className='tw-h-3.5 tw-w-3.5' />
            </button>
          )}
        >
          {(close) =>
            TIMEZONES.map((tz) => (
              <button
                key={tz.id}
                type='button'
                onClick={() => {
                  onTimezone(tz)
                  close()
                }}
                className={`tw-block tw-w-full tw-px-3 tw-py-2 tw-text-left hover:tw-bg-[#f1f3f7] ${tz.id === timezone.id ? 'tw-font-bold' : ''}`}
              >
                {TZ_LABEL[tz.id]}
              </button>
            ))
          }
        </Dropdown>
      </div>

      <div className='tw-ml-auto tw-hidden tw-w-64 sm:tw-block'>
        <UserSelect
          dark
          value={null}
          placeholder='Search User...'
          onChange={(u) => u && setQuickView(u.username)}
        />
      </div>
      <UserQuickView username={quickView} onClose={() => setQuickView(null)} />

      <div className='tw-ml-auto tw-hidden tw-text-right tw-text-[12px] tw-leading-tight lg:tw-block sm:tw-ml-0'>
        <p>
          Logged in as <b>{user.username || (demo ? 'Demo Admin' : '')}</b>
        </p>
        {(user as any).lastLogin && <p className='tw-text-ad-muted'>Last logged in : {moment((user as any).lastLogin).format('DD/MM/YYYY HH:mm')}</p>}
      </div>

      <Dropdown
        button={(toggle) => (
          <button type='button' onClick={toggle} className='tw-flex tw-flex-col tw-items-center tw-text-[11px]' aria-label='Settings'>
            <LuSettings className='tw-h-5 tw-w-5' /> Settings
          </button>
        )}
      >
        {(close) => (
          <>
            <Link to='/admin/change-password' onClick={close} className='tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 hover:tw-bg-[#f1f3f7]'>
              <LuKeyRound className='tw-h-4 tw-w-4' /> Change Password
            </Link>
            <Link to='/admin/secureauth' onClick={close} className='tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 hover:tw-bg-[#f1f3f7]'>
              <LuShieldCheck className='tw-h-4 tw-w-4' /> Secure Auth
            </Link>
          </>
        )}
      </Dropdown>
      <button type='button' onClick={logoutUser} className='tw-flex tw-flex-col tw-items-center tw-text-[11px]' aria-label='Logout'>
        <LuLogOut className='tw-h-5 tw-w-5' /> Logout
      </button>
    </header>
  )
}

export default AdminHeader
