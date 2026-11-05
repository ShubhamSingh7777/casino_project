import React from 'react'
import { AxiosResponse } from 'axios'
import matchService from '../../../services/match.service'
import LMatch from '../../../models/LMatch'
import { useUi } from '../../context/UiContext'
import { useOpenMatch } from '../../hooks/useOpenMatch'
import { formatMatchTime } from '../../utils/format'
import { getSportName } from '../../constants/sports'
import { LuSearch, LuX } from '../../icons'
import Sheet from '../Sheet'
import SportIcon from '../SportIcon'

const MIN_CHARS = 3

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (!query || i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className='tw-rounded tw-bg-amber-200 tw-px-0.5 tw-text-fg'>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}

/** Event search (logged in): right drawer 560px (680px at 2xl), ≥3 chars, uses get-match-list-suggestion. */
const SearchDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { timezone } = useUi()
  const openMatch = useOpenMatch()
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<LMatch[] | null>(null)
  const q = query.trim()

  React.useEffect(() => {
    if (q.length < MIN_CHARS) return setResults(null)
    let cancelled = false
    const id = window.setTimeout(() => {
      matchService
        .getMatchListSuggestion({ name: q })
        .then((res: AxiosResponse) => !cancelled && setResults(res.data?.data || []))
        .catch(() => !cancelled && setResults([]))
    }, 300)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [q])

  React.useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <Sheet open={open} onClose={onClose} side='right' wide label='Search events' className='ua-ui'>
      <div className='tw-flex tw-items-center tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-3'>
        <label className='tw-flex tw-h-11 tw-flex-1 tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-3'>
          <LuSearch className='tw-h-4 tw-w-4 tw-text-muted-fg' aria-hidden />
          <input
            autoFocus
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search events, teams or leagues'
            aria-label='Search events'
            className='tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-body tw-outline-none'
          />
        </label>
        <button type='button' aria-label='Close search' onClick={onClose} className='tw-p-2'>
          <LuX className='tw-h-5 tw-w-5' />
        </button>
      </div>
      <div className='tw-flex-1 tw-overflow-y-auto tw-p-3'>
        {q.length < MIN_CHARS ? (
          <p className='tw-m-0 tw-py-10 tw-text-center tw-text-body tw-text-muted-fg'>Type at least {MIN_CHARS} characters to search.</p>
        ) : results === null ? (
          <div className='tw-grid tw-gap-2 2xl:tw-grid-cols-2'>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className='tw-h-16 tw-animate-pulse tw-rounded-md tw-bg-gray-100' />
            ))}
          </div>
        ) : !results.length ? (
          <p className='tw-m-0 tw-py-10 tw-text-center tw-text-body tw-text-muted-fg'>No events found for “{q}”.</p>
        ) : (
          <ul className='tw-m-0 tw-grid tw-list-none tw-gap-2 tw-p-0 2xl:tw-grid-cols-2'>
            {results.map((m) => {
              const t = m.matchDateTime ? formatMatchTime(m.matchDateTime, timezone) : null
              return (
                <li key={m.matchId}>
                  <button
                    type='button'
                    onClick={() => {
                      onClose()
                      openMatch(m)
                    }}
                    className='tw-flex tw-w-full tw-items-center tw-gap-3 tw-rounded-md tw-border tw-border-solid tw-border-line tw-p-3 tw-text-left hover:tw-bg-row-active'
                  >
                    <SportIcon name={getSportName(m.sportId)} className='tw-h-5 tw-w-5 tw-shrink-0 tw-text-primary' />
                    <span className='tw-min-w-0 tw-flex-1'>
                      <span className='tw-block tw-truncate tw-text-strong'>
                        <Highlight text={m.name || ''} query={q} />
                      </span>
                      <span className='tw-block tw-truncate tw-text-meta tw-text-muted-fg'>
                        {getSportName(m.sportId)}
                        {t ? ` · ${t.day} ${t.time}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Sheet>
  )
}

export default SearchDrawer
