import React from 'react'
import { Link } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import userService from '../../../services/user.service'
import casinoSlugs from '../../../utils/casino-slugs.json'
import { useUserSession } from '../../hooks/useUserSession'
import { useClickOutside, useEscape } from '../../hooks/useClickOutside'
import { formatMoney } from '../../utils/format'
import { LuChevronDown, LuEye, LuWallet, LuX } from '../../icons'

/** Where an exposure row links to — legacy header rule (5000 = casino, slug from casino-slugs.json). */
const exposureLink = (e: any) =>
  e.sportId && Number.isInteger(+e.sportId) && e.sportId != 5000 ? `/odds/${e._id}` : `/casino/${(casinoSlugs as any)?.[e?.matchId] || ''}/${e._id}`

/** "Market Analysis": events that hold the user's exposure (get-exposer-event). */
export const MarketAnalysisDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [rows, setRows] = React.useState<any[] | null>(null)
  useEscape(onClose, open)

  React.useEffect(() => {
    if (!open) return
    setRows(null)
    userService
      .getExposerEvent()
      .then((res: AxiosResponse) => setRows(res.data?.data || []))
      .catch(() => setRows([]))
  }, [open])

  if (!open) return null
  return (
    <div className='tw-fixed tw-inset-0 tw-z-[70] tw-flex tw-items-center tw-justify-center tw-p-3'>
      <div className='tw-absolute tw-inset-0 tw-bg-black/60' onClick={onClose} />
      <div role='dialog' aria-modal='true' aria-label='Market Analysis' className='tw-relative tw-w-full tw-max-w-lg tw-overflow-hidden tw-rounded-xl tw-bg-white'>
        <div className='tw-flex tw-items-center tw-justify-between tw-bg-primary tw-px-4 tw-py-3 tw-text-white'>
          <h2 className='tw-text-section'>Market Analysis</h2>
          <button type='button' aria-label='Close' onClick={onClose} className='tw-p-1'>
            <LuX className='tw-h-5 tw-w-5' />
          </button>
        </div>
        <div className='tw-max-h-[60dvh] tw-overflow-y-auto tw-p-3'>
          {rows === null ? (
            <div className='tw-h-24 tw-animate-pulse tw-rounded tw-bg-gray-100' />
          ) : !rows.length ? (
            <p className='tw-m-0 tw-py-8 tw-text-center tw-text-body tw-text-muted-fg'>No open exposure right now.</p>
          ) : (
            <ul className='tw-m-0 tw-list-none tw-p-0'>
              {rows.map((e) => (
                <li key={e._id || e.matchName} className='tw-border-0 tw-border-b tw-border-solid tw-border-line last:tw-border-b-0'>
                  <Link to={exposureLink(e)} onClick={onClose} className='tw-flex tw-items-center tw-justify-between tw-gap-2 tw-py-2.5 hover:tw-text-link'>
                    <span className='tw-truncate tw-text-strong'>{e.matchName}</span>
                    <span className='tw-shrink-0 tw-rounded-full tw-bg-row-active tw-px-2 tw-text-meta'>{e.myCount} bets</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Header balance pill (logged in), like the reference site: wallet + balance, dropdown with
 * "Balance Information" (available credit, net exposure) and the eye that opens Market Analysis.
 * No Deposit / Withdraw here — the reference site has none; those pages stay reachable by URL.
 */
const BalanceMenu = () => {
  const { mainBalance, exposure } = useUserSession()
  const [open, setOpen] = React.useState(false)
  const [analysis, setAnalysis] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className='tw-relative'>
      <button
        type='button'
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-label={`Balance ${formatMoney(mainBalance)}, show balance information`}
        onClick={() => setOpen((o) => !o)}
        className='tw-flex tw-h-10 tw-items-center tw-gap-2 tw-rounded-md tw-bg-white/10 tw-px-3 tw-text-strong tw-tabular-nums hover:tw-bg-white/15'
      >
        <LuWallet className='tw-h-5 tw-w-5' aria-hidden />
        {formatMoney(mainBalance)}
        <LuChevronDown className='tw-h-4 tw-w-4' aria-hidden />
      </button>
      {open && (
        <div role='dialog' aria-label='Balance information' className='tw-absolute tw-right-0 tw-top-12 tw-z-50 tw-w-72 tw-rounded-ua tw-bg-white tw-text-fg tw-shadow-xl'>
          <p className='tw-m-0 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-px-4 tw-py-3 tw-text-strong'>Balance Information</p>
          <div className='tw-flex tw-items-center tw-justify-between tw-px-4 tw-pt-3 tw-text-body'>
            <span>Available Credit:</span>
            <b className='tw-tabular-nums'>{formatMoney(mainBalance)}</b>
          </div>
          <div className='tw-flex tw-items-center tw-justify-between tw-px-4 tw-pb-3 tw-pt-2 tw-text-body'>
            <span>Net Exposure:</span>
            <span className='tw-flex tw-items-center tw-gap-2'>
              <span className='tw-tabular-nums'>{formatMoney(exposure)}</span>
              <button
                type='button'
                aria-label='Open market analysis'
                onClick={() => {
                  setOpen(false)
                  setAnalysis(true)
                }}
                className='tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-line hover:tw-bg-muted'
              >
                <LuEye className='tw-h-4 tw-w-4' />
              </button>
            </span>
          </div>
        </div>
      )}
      <MarketAnalysisDialog open={analysis} onClose={() => setAnalysis(false)} />
    </div>
  )
}

export default BalanceMenu
