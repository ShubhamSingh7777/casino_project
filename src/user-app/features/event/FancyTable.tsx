import React from 'react'
import LFancy from '../../../models/LFancy'
import { IFancy } from '../../../models/IFancy'
import { useAppSelector } from '../../../redux/hooks'
import { selectMarketBook } from '../../../redux/actions/bet/betSlice'
import OddsCell from '../../components/OddsCell'
import { BookValue } from './MarketTable'
import { formatLimit } from './market-utils'

type FancyTableProps = {
  title: string
  fancies: LFancy[]
  live: Record<string, IFancy>
  onBet: (fancy: LFancy, live: IFancy, isBack: boolean) => void
  bookSign?: 1 | -1
}

const SUSPEND_STATUSES = ['SUSPENDED', 'Ball Running']

/** A fancy row is shown once live prices arrived (legacy rule: LayPrice1 present) and it is active. */
export const visibleFancies = (fancies: LFancy[], live: Record<string, IFancy>) =>
  fancies.filter((f) => f?.active && live[f.marketId]?.LayPrice1 !== undefined).sort((a, b) => (a.sr_no || 0) - (b.sr_no || 0))

const FancyRow = ({ fancy, live, onBet, bookSign = 1 }: { fancy: LFancy; live: IFancy; onBet: FancyTableProps['onBet']; bookSign?: 1 | -1 }) => {
  const book = useAppSelector(selectMarketBook) as Record<string, number>
  const status = live.GameStatus || fancy.GameStatus || ''
  const suspended = fancy.isSuspend || SUSPEND_STATUSES.includes(status)
  const raw = book?.[fancy.marketId]
  const pnl = raw == null ? raw : raw * bookSign

  return (
    <div className='tw-relative tw-flex tw-min-h-[52px] tw-items-center tw-gap-1 tw-bg-white tw-border-0 tw-border-b tw-border-solid tw-border-line tw-px-3 tw-py-1'>
      <div className='tw-min-w-0 tw-flex-1'>
        <p className='tw-m-0 tw-text-body'>{fancy.fancyName}</p>
        <p className='tw-m-0 tw-flex tw-gap-2 tw-text-badge tw-font-normal tw-text-muted-fg'>
          <span>
            Min: {formatLimit(live.min)} Max: {formatLimit(live.max)}
          </span>
          <BookValue value={pnl} />
        </p>
      </div>
      {/* fancy: No (pink) first, Yes (blue) second */}
      <OddsCell
        side='lay'
        cell={{ price: live.LayPrice1 || null, size: null }}
        sizeLabel={live.LaySize1 ? String(live.LaySize1) : undefined}
        onClick={suspended ? undefined : () => onBet(fancy, live, false)}
        className='tw-h-11 tw-w-14'
      />
      <OddsCell
        side='back'
        cell={{ price: live.BackPrice1 || null, size: null }}
        sizeLabel={live.BackSize1 ? String(live.BackSize1) : undefined}
        onClick={suspended ? undefined : () => onBet(fancy, live, true)}
        className='tw-h-11 tw-w-14'
      />
      {suspended && (
        <div className='tw-absolute tw-inset-y-1 tw-right-3 tw-flex tw-w-[116px] tw-items-center tw-justify-center tw-rounded-md tw-bg-suspended tw-text-meta tw-font-semibold tw-text-suspended-fg'>
          {status || 'Suspended'}
        </div>
      )}
      {(live.rem || fancy.rem) && <p className='tw-sr-only'>{live.rem || fancy.rem}</p>}
    </div>
  )
}

/** Fancy-type markets (v2 §7): 1 per row on mobile, 2 per row from md. */
const FancyTable = ({ title, fancies, live, onBet, bookSign }: FancyTableProps) => (
  <section className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
    <header className='tw-flex tw-items-center tw-gap-1 tw-bg-table-head tw-px-3 tw-py-2 tw-text-table-head-fg'>
      <h3 className='tw-min-w-0 tw-flex-1 tw-truncate tw-text-strong tw-text-fg'>{title}</h3>
      <span className='tw-w-14 tw-text-center tw-text-meta tw-font-bold'>No</span>
      <span className='tw-w-14 tw-text-center tw-text-meta tw-font-bold'>Yes</span>
      <span className='tw-hidden tw-flex-1 md:tw-flex' aria-hidden />
      <span className='tw-hidden tw-w-14 tw-text-center tw-text-meta tw-font-bold md:tw-block'>No</span>
      <span className='tw-hidden tw-w-14 tw-text-center tw-text-meta tw-font-bold md:tw-block'>Yes</span>
    </header>
    <div className='tw-grid md:tw-grid-cols-2 md:tw-gap-x-px md:tw-bg-line'>
      {fancies.map((f) => (
        <FancyRow key={f.marketId} fancy={f} live={live[f.marketId]} onBet={onBet} bookSign={bookSign} />
      ))}
    </div>
  </section>
)

export default FancyTable
