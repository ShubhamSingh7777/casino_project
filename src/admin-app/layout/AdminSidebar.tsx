import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import ISport from '../../models/ISport'
import { useAppSelector } from '../../redux/hooks'
import { selectSportList } from '../../redux/actions/sports/sportSlice'
import sportsService from '../../services/sports.service'
import { LuChevronDown, LuChevronUp } from '../ui/icons'
import { ADMIN_MENU, allowed, isGroup, MenuLink } from './admin-menu'
import { useAdminRole } from '../dev-auth'

const itemClass = 'tw-flex tw-w-full tw-items-center tw-gap-2 tw-rounded tw-px-3 tw-py-2 tw-text-left tw-text-[13px]'

const Badge = ({ text }: { text: string }) => (
  // "Soon" = page is ready but its API is not (see admin-menu.ts)
  <span className={`tw-rounded-full tw-px-2 tw-py-px tw-text-[10px] tw-font-bold ${text === 'Soon' ? 'tw-bg-white/20' : 'tw-bg-ad-success'}`}>{text}</span>
)

const Link = ({ item, nested }: { item: MenuLink; nested?: boolean }) => (
  <NavLink
    to={item.to}
    end
    className={({ isActive }) =>
      `${itemClass} ${nested ? 'tw-pl-6 tw-bg-black/20' : 'tw-bg-ad-item'} ${isActive ? 'tw-font-bold tw-text-white' : 'tw-text-white/80 hover:tw-text-white'}`
    }
  >
    <span className='tw-flex-1'>{item.label}</span>
    {item.badge && <Badge text={item.badge} />}
  </NavLink>
)

const Group = ({ label, defaultOpen, children, count, onOpen, level = 0 }: any) => {
  const [open, setOpen] = React.useState(!!defaultOpen)
  return (
    <div>
      <button
        type='button'
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o)
          if (!open) onOpen?.()
        }}
        className={`${itemClass} ${level === 0 ? 'tw-bg-ad-item' : 'tw-bg-black/20'} tw-text-white/90`}
        style={{ paddingLeft: 12 + level * 12 }}
      >
        <span className='tw-flex-1'>
          {label}
          {count != null && <span className='tw-text-ad-muted'> ({count})</span>}
        </span>
        {open ? <LuChevronUp className='tw-h-4 tw-w-4' /> : <LuChevronDown className='tw-h-4 tw-w-4' />}
      </button>
      {open && <div className='tw-mt-0.5 tw-flex tw-flex-col tw-gap-0.5'>{children}</div>}
    </div>
  )
}

type Series = { id: string; name: string; matches: Array<{ id: string; name: string }> }

/** Sport → Competition → Event, loaded per sport on first expand (same API as the legacy header drawer). */
const SportNode = ({ sport }: { sport: ISport }) => {
  const [series, setSeries] = React.useState<Series[] | null>(null)
  const load = () => {
    if (series) return
    sportsService
      .getSeriesWithMatch(sport.sportId as number)
      .then((res: any) =>
        setSeries(
          (res?.data?.data || []).map((s: any) => ({
            id: String(s.competition?.id),
            name: s.competition?.name,
            matches: (s.matches || []).map((m: any) => ({ id: String(m.event?.id), name: m.event?.name })),
          })),
        ),
      )
      .catch(() => setSeries([]))
  }
  const total = series?.reduce((n, s) => n + s.matches.length, 0)
  return (
    <Group label={sport.name} count={total} onOpen={load} level={1}>
      {series === null ? (
        <p className='tw-px-6 tw-py-1 tw-text-ad-muted'>Loading…</p>
      ) : !series.length ? (
        <p className='tw-px-6 tw-py-1 tw-text-ad-muted'>No events</p>
      ) : (
        series.map((s) => (
          <Group key={s.id} label={s.name} count={s.matches.length} level={2}>
            {s.matches.map((m) => (
              <NavLink
                key={m.id}
                to={`/admin/odds/${m.id}`}
                className={({ isActive }) => `tw-block tw-py-1.5 tw-pl-12 tw-pr-2 tw-text-[12px] ${isActive ? 'tw-font-bold' : 'tw-text-white/80 hover:tw-text-white'}`}
              >
                {m.name}
              </NavLink>
            ))}
          </Group>
        ))
      )}
    </Group>
  )
}

const AdminSidebar = () => {
  const role = useAdminRole()
  const { sports } = useAppSelector<{ sports: ISport[] }>(selectSportList)
  const { pathname } = useLocation()

  return (
    <nav aria-label='Admin menu' className='tw-flex tw-flex-col tw-gap-0.5 tw-p-2'>
      {ADMIN_MENU.filter((e) => allowed(e.roles, role)).map((entry) =>
        isGroup(entry) ? (
          <Group key={entry.label} label={entry.label} defaultOpen={entry.children.some((c) => pathname.startsWith(c.to))}>
            {entry.children
              .filter((c) => allowed(c.roles, role))
              .map((c) => (
                <Link key={c.to} item={c} nested />
              ))}
          </Group>
        ) : (
          <Link key={entry.to} item={entry} />
        ),
      )}
      <Group label='Events' defaultOpen={pathname.startsWith('/admin/odds')}>
        {sports.length ? (
          sports.map((s) => <SportNode key={s._id || s.sportId} sport={s} />)
        ) : (
          <p className='tw-px-4 tw-py-1 tw-text-ad-muted'>No sports</p>
        )}
      </Group>
    </nav>
  )
}

export default AdminSidebar
