import React from 'react'
import { NavLink } from 'react-router-dom'
import { LuSearch } from '../icons'
import { SPORTS } from '../constants/sports'
import SportIcon from '../components/SportIcon'

/** Searchable sports list (v2 §3.3) — the mobile drawer and the xl sidebar. */
const SportList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const [query, setQuery] = React.useState('')
  const q = query.trim().toLowerCase()
  const filtered = SPORTS.filter((s) => s.name.toLowerCase().includes(q))

  return (
    <div className='tw-flex tw-h-full tw-flex-col'>
      <div className='tw-sticky tw-top-0 tw-bg-white tw-p-3'>
        <label className='tw-flex tw-h-10 tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-solid tw-border-line tw-bg-muted tw-px-3'>
          <LuSearch className='tw-h-4 tw-w-4 tw-text-muted-fg' aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search'
            aria-label='Search sports'
            className='tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-body tw-outline-none'
          />
        </label>
      </div>
      <ul className='tw-m-0 tw-flex-1 tw-list-none tw-overflow-y-auto tw-p-0 tw-pb-4'>
        {filtered.map((s) => (
          <li key={s.id}>
            <NavLink
              to={s.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `tw-flex tw-h-11 tw-items-center tw-gap-3 tw-px-4 tw-text-[15px] hover:tw-bg-row-active ${
                  isActive ? 'tw-bg-row-active tw-font-bold' : ''
                }`
              }
            >
              <SportIcon name={s.name} className='tw-h-5 tw-w-5 tw-shrink-0 tw-text-primary' />
              <span className='tw-truncate'>{s.name}</span>
            </NavLink>
          </li>
        ))}
        {!filtered.length && <li className='tw-px-4 tw-py-6 tw-text-center tw-text-body tw-text-muted-fg'>No sports found</li>}
      </ul>
    </div>
  )
}

export default SportList
