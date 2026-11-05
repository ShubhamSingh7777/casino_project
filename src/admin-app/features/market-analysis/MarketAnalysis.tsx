import React from 'react'
import { Link } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import betService from '../../../services/bet.service'
import { Card, PageHeader } from '../../ui/PageHeader'
import { inputClass } from '../../ui/Button'
import { LuRefreshCw } from '../../ui/icons'

const REFRESH_MS = 10000

/** Book for a runner — the API stores it from the user's side, so the agent view negates it (legacy rule). */
const bookOf = (book: Record<string, number>, marketId: string, runner: any) => {
  const sel = runner.selectionId || runner.sid || runner.SelectionId || marketId
  const v = book?.[`${marketId}_${sel}`]
  return v == null ? null : -v
}

/** Market Analysis (spec §4.1): events with downline exposure, per-runner book; auto-refresh + ↻. */
const MarketAnalysis = () => {
  const [events, setEvents] = React.useState<any[] | null>(null)
  const [query, setQuery] = React.useState('')
  const [spinning, setSpinning] = React.useState(false)

  const load = React.useCallback(() => {
    setSpinning(true)
    betService
      .getMarketAnalysis()
      .then((res: AxiosResponse) => setEvents(res.data?.data || []))
      .catch(() => setEvents((e) => e || []))
      .finally(() => setSpinning(false))
  }, [])

  React.useEffect(() => {
    load()
    const id = window.setInterval(load, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [load])

  const q = query.trim().toLowerCase()
  const shown = (events || []).filter((e) => !q || String(e.matchName).toLowerCase().includes(q))

  return (
    <div>
      <PageHeader
        title='Market Analysis'
        actions={
          <button type='button' aria-label='Refresh' onClick={load} className='tw-p-1'>
            <LuRefreshCw className={`tw-h-4 tw-w-4 ${spinning ? 'tw-animate-spin' : ''}`} />
          </button>
        }
      />
      <Card>
        <div className='tw-mb-3 tw-flex tw-justify-end'>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search Event' aria-label='Search Event' className={`${inputClass} tw-max-w-xs`} />
        </div>
        {events === null ? (
          <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
        ) : !shown.length ? (
          <p className='tw-py-6 tw-text-center tw-text-ad-muted'>There are no records to show</p>
        ) : (
          <div className='tw-grid tw-gap-3 xl:tw-grid-cols-2'>
            {shown.map((ev) => (
              <section key={ev.matchId} className='tw-overflow-hidden tw-rounded tw-bg-white/5'>
                <Link to={`/admin/odds/${ev.matchId}`} className='tw-block tw-bg-ad-item tw-px-3 tw-py-2 tw-text-[13px] tw-font-bold tw-capitalize hover:tw-underline'>
                  {ev.matchName} <span className='tw-font-normal tw-text-ad-muted'>({ev.betCount} bets)</span>
                </Link>
                {(ev.filterMarketByMatch || [])
                  .filter((m: any) => (ev.completemarket_list || []).indexOf(m.marketId) > -1)
                  .map((m: any) => (
                    <div key={m.marketId} className='tw-border-0 tw-border-t tw-border-solid tw-border-white/10 tw-px-3 tw-py-2'>
                      <p className='tw-mb-1 tw-font-bold tw-text-ad-warning'>{m.marketName}</p>
                      {(m.runners || []).map((r: any, i: number) => {
                        const v = bookOf(ev.matchWiseMarket, m.marketId, r)
                        return (
                          <div key={i} className='tw-flex tw-justify-between tw-py-0.5'>
                            <span>{r.runnerName || r.nat}</span>
                            <span className={`tw-font-bold tw-tabular-nums ${v == null ? '' : v > 0 ? 'tw-text-ad-success' : 'tw-text-ad-danger'}`}>
                              {v == null ? '' : v.toFixed(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default MarketAnalysis
