import React from 'react'
import IMarket from '../../../models/IMarket'
import { useAppSelector } from '../../../redux/hooks'
import { selectMarketBook } from '../../../redux/actions/bet/betSlice'
import OddsCell from '../../components/OddsCell'
import { SuspendedBlock } from '../../components/SuspendedBlock'
import { formatLakh, formatLimit, getLadder, isBookmaker, isRunnerSuspended, Level, marketTitle } from './market-utils'
import { marketMaxBet } from './bet-payload'
import { SaddleCloth } from './SaddleCloth'

type MarketTableProps = {
  market: IMarket
  /** latest getMarketData payload for this market (runners with back/lay ladders) */
  live?: any
  onBet: (market: IMarket, runner: any, isBack: boolean, price: Level) => void
  /** racing: saddle-cloth numbers before runner names */
  racing?: 'horse' | 'greyhound'
  /** admin view: book is shown from the agent side (negated, legacy rule) */
  bookSign?: 1 | -1
}

const DEPTH = 3
const CELL = 'tw-h-11 tw-w-14'

export const BookValue = ({ value }: { value?: number }) =>
  value ? (
    <span className={`tw-text-meta tw-font-bold tw-tabular-nums ${value > 0 ? 'tw-text-success' : 'tw-text-red-600'}`}>
      {value > 0 ? '+' : ''}
      {Number(value).toFixed(0)}
    </span>
  ) : null

/**
 * Exchange / bookmaker market (v2 §7): 1 back + 1 lay on mobile, 3+3 ladder from md
 * (best prices nearest the centre in the strong colour). Bookmaker sizes in lakh.
 */
const MarketTable = ({ market, live, onBet, racing, bookSign = 1 }: MarketTableProps) => {
  const book = useAppSelector(selectMarketBook) as Record<string, number>
  const bm = isBookmaker(market)
  const runners: any[] = [...(live?.runners || market.runners || [])].sort(
    (a, b) => (a?.sortPriority ?? 0) - (b?.sortPriority ?? 0),
  )
  const allSuspended = runners.length > 0 && runners.every(isRunnerSuspended)
  const remark = live?.rem || market.rem
  const sizeLabel = (l: Level) => (bm ? formatLakh(l.size) : undefined)

  return (
    <section className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
      <header className='tw-flex tw-items-center tw-gap-1 tw-bg-table-head tw-px-3 tw-py-2 tw-text-table-head-fg'>
        <div className='tw-min-w-0 tw-flex-1'>
          <h3 className='tw-truncate tw-text-strong tw-text-fg'>{marketTitle(market)}</h3>
          <p className='tw-m-0 tw-text-badge tw-font-normal'>Min: 100 · Max: {formatLimit(marketMaxBet({ ...market, ...live }))}</p>
        </div>
        <span className='tw-hidden tw-gap-1 md:tw-flex' aria-hidden>
          <span className={`${CELL} tw-h-auto`} />
          <span className={`${CELL} tw-h-auto`} />
        </span>
        <span className='tw-w-14 tw-text-center tw-text-meta tw-font-bold'>Back</span>
        <span className='tw-w-14 tw-text-center tw-text-meta tw-font-bold'>Lay</span>
        <span className='tw-hidden tw-gap-1 md:tw-flex' aria-hidden>
          <span className={`${CELL} tw-h-auto`} />
          <span className={`${CELL} tw-h-auto`} />
        </span>
      </header>

      <div className='tw-relative'>
        {runners.map((runner, idx) => {
          const { back, lay } = getLadder(runner, DEPTH)
          const suspended = isRunnerSuspended(runner)
          const raw = book?.[`${market.marketId}_${runner.selectionId}`]
          const pnl = raw == null ? raw : raw * bookSign
          return (
            <div
              key={runner.selectionId ?? idx}
              className='tw-flex tw-min-h-[52px] tw-items-center tw-gap-1 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-px-3 tw-py-1 last:tw-border-b-0'
            >
              <div className='tw-flex tw-min-w-0 tw-flex-1 tw-items-center tw-gap-2'>
                {racing && <SaddleCloth number={idx + 1} kind={racing} />}
                <div className='tw-min-w-0'>
                  <p className='tw-m-0 tw-truncate tw-text-[15px]'>{runner.runnerName || runner.nat}</p>
                  <BookValue value={pnl} />
                </div>
              </div>
              {suspended && !allSuspended ? (
                <>
                  <SuspendedBlock className='tw-h-11 tw-w-[116px] md:tw-hidden' />
                  <SuspendedBlock className='tw-hidden tw-h-11 tw-w-[356px] md:tw-flex' />
                </>
              ) : (
                <>
                  {back.map((l, i) => (
                    <OddsCell
                      key={`b${i}`}
                      side='back'
                      strong={i === DEPTH - 1}
                      cell={{ price: l.odds || null, size: l.size || null }}
                      sizeLabel={sizeLabel(l)}
                      onClick={allSuspended ? undefined : () => onBet(market, runner, true, l)}
                      className={`${CELL} ${i < DEPTH - 1 ? 'tw-hidden md:tw-flex' : ''}`}
                    />
                  ))}
                  {lay.map((l, i) => (
                    <OddsCell
                      key={`l${i}`}
                      side='lay'
                      strong={i === 0}
                      cell={{ price: l.odds || null, size: l.size || null }}
                      sizeLabel={sizeLabel(l)}
                      onClick={allSuspended ? undefined : () => onBet(market, runner, false, l)}
                      className={`${CELL} ${i > 0 ? 'tw-hidden md:tw-flex' : ''}`}
                    />
                  ))}
                </>
              )}
            </div>
          )
        })}
        {/* whole market suspended: one block across every runner's odds */}
        {allSuspended && (
          <div className='tw-absolute tw-inset-y-1 tw-right-3 tw-w-[116px] md:tw-w-[356px]'>
            <SuspendedBlock className='tw-h-full' />
          </div>
        )}
      </div>
      {remark && <p className='tw-m-0 tw-bg-muted tw-px-3 tw-py-1 tw-text-meta tw-text-muted-fg'>{remark}</p>}
    </section>
  )
}

export default MarketTable
