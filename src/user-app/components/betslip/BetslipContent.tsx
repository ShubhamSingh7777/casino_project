import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import IBet, { IBetOn } from '../../../models/IBet'
import { OddsType } from '../../../models/IMarket'
import { useAppSelector } from '../../../redux/hooks'
import { selectBetListUser } from '../../../redux/actions/bet/betSlice'
import { useUi } from '../../context/UiContext'
import UserService from '../../../services/user.service'
import { formatMatchTime } from '../../utils/format'
import { LuSettings, LuTicket, LuTrash } from '../../icons'
import { useBetslip } from './useBetslip'

const DEFAULT_STAKES = [1000, 2000, 5000, 10000]
const label = (n: number) => (n >= 1000 ? `${+(n / 1000).toFixed(1)}K` : String(n))

/**
 * Up to 4 quick stakes: the open event's stake (get-match-by-id), else the user's own presets
 * (get-user-stake, Settings → Stakes), else +100 +200 +500 +1K.
 */
const useQuickStakes = () => {
  const { betStake } = useUi()
  const [presets, setPresets] = React.useState<Record<string, any> | null>(null)
  React.useEffect(() => {
    if (betStake || presets) return
    UserService.getUserStake()
      .then((res) => setPresets(res.data?.data?.userStake || {}))
      .catch(() => setPresets({}))
  }, [betStake])
  return React.useMemo(() => {
    const source = betStake || presets
    const values = source ? Array.from({ length: 10 }, (_, i) => Number(source[`value${i + 1}`])).filter((v) => v > 0) : []
    return (values.length ? values : DEFAULT_STAKES).slice(0, 4)
  }, [betStake, presets])
}

const ActionRow = ({ onClear, disabled }: { onClear: () => void; disabled: boolean }) => (
  <div className='tw-flex tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-2'>
    <Link
      to='/settings/stakes'
      className='tw-flex tw-h-8 tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-2 tw-text-meta tw-font-semibold'
    >
      <LuSettings className='tw-h-3.5 tw-w-3.5' /> Settings
    </Link>
    <button
      type='button'
      disabled={disabled}
      onClick={onClear}
      className='tw-flex tw-h-8 tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-2 tw-text-meta tw-font-semibold disabled:tw-opacity-50'
    >
      <LuTrash className='tw-h-3.5 tw-w-3.5' /> Remove All
    </button>
  </div>
)

const SelectionCard = ({ bet }: { bet: IBet }) => {
  const { timezone } = useUi()
  const { setStake, addStake, canStep, stepOdds, clear } = useBetslip()
  const quick = useQuickStakes()
  const match = useAppSelector((s) => s.sportReducer.currentMatch)
  const when = match?.matchDateTime ? formatMatchTime(match.matchDateTime, timezone) : null
  const tone = bet.isBack ? 'tw-bg-back' : 'tw-bg-lay'
  const fancy = bet.betOn === IBetOn.FANCY || bet.oddsType === OddsType.F
  const sideLabel = fancy ? (bet.isBack ? 'Yes' : 'No') : bet.isBack ? 'Back' : 'Lay'

  return (
    <div className={`tw-m-2 tw-rounded-ua tw-p-2.5 ${tone}`}>
      <div className='tw-flex tw-items-center tw-gap-2 tw-text-meta'>
        <button type='button' aria-label='Remove selection' onClick={clear} className='tw-text-muted-fg'>
          <LuTrash className='tw-h-4 tw-w-4' />
        </button>
        {when && (
          <span className='tw-text-muted-fg'>
            {when.day === 'TODAY' ? 'Today' : when.day} {when.time}
          </span>
        )}
        <span className='tw-truncate tw-font-semibold'>{bet.matchName}</span>
      </div>

      <div className='tw-mt-2 tw-flex tw-items-center tw-gap-2'>
        <span className='tw-flex tw-h-8 tw-w-8 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-white tw-text-strong'>
          {sideLabel[0]}
        </span>
        <div className='tw-min-w-0 tw-flex-1'>
          <p className='tw-m-0 tw-text-meta tw-text-muted-fg'>
            {fancy ? 'Normal' : bet.marketName === 'MATCH_ODDS' ? 'Match Odds' : bet.marketName} · {sideLabel}
          </p>
          <p className='tw-m-0 tw-truncate tw-text-strong'>{bet.selectionName}</p>
        </div>
        {canStep ? (
          <div className='tw-flex tw-items-center tw-rounded-md tw-bg-white'>
            <button type='button' aria-label='Decrease odds' onClick={() => stepOdds(-1)} className='tw-h-9 tw-w-8 tw-text-header'>
              −
            </button>
            <span className='tw-min-w-[44px] tw-text-center tw-text-price tw-tabular-nums'>{bet.odds}</span>
            <button type='button' aria-label='Increase odds' onClick={() => stepOdds(1)} className='tw-h-9 tw-w-8 tw-text-header'>
              +
            </button>
          </div>
        ) : (
          <span className='tw-text-price tw-tabular-nums'>
            {bet.odds}
            {fancy && bet.volume ? <span className='tw-text-meta tw-font-normal'>/{bet.volume}</span> : null}
          </span>
        )}
      </div>

      <label className='tw-mt-2 tw-flex tw-h-11 tw-items-center tw-rounded-md tw-bg-white tw-px-3'>
        <input
          inputMode='numeric'
          placeholder='Enter Stake'
          aria-label='Stake'
          value={bet.stack ? String(bet.stack) : ''}
          onChange={(e) => setStake(parseInt(e.target.value.replace(/\D/g, ''), 10))}
          className='tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-body tw-outline-none'
        />
      </label>
      <p className='tw-m-0 tw-mt-1 tw-text-meta tw-text-muted-fg'>
        Min: {Number(bet.minbet) > 0 ? bet.minbet : 100} Max: {Number(bet.maxbet) > 0 ? bet.maxbet : '-'}
      </p>

      <div className='tw-mt-2 tw-grid tw-grid-cols-4 tw-gap-1.5'>
        {quick.map((v) => (
          <button key={v} type='button' onClick={() => addStake(v)} className='tw-h-9 tw-rounded-md tw-bg-white tw-text-strong'>
            +{label(v)}
          </button>
        ))}
      </div>

      <div className='tw-mt-2 tw-flex tw-justify-between tw-text-meta'>
        <span>
          Profit: <b className='tw-text-success'>{Number(bet.pnl || 0).toFixed(2)}</b>
        </span>
        <span>
          Liability: <b className='tw-text-red-700'>{Math.abs(Number(bet.exposure || 0)).toFixed(2)}</b>
        </span>
      </div>
    </div>
  )
}

/** betlist is briefly a single bet object right after placing (legacy action) — treat non-arrays as empty. */
const useOpenBets = () => {
  const list = useAppSelector(selectBetListUser)
  return Array.isArray(list) ? (list as IBet[]) : []
}

const OpenBets = () => {
  const bets = useOpenBets()
  if (!bets.length) return <p className='tw-m-0 tw-p-6 tw-text-center tw-text-body tw-text-muted-fg'>No open bets.</p>
  return (
    <ul className='tw-m-0 tw-list-none tw-p-2'>
      {bets.map((b) => (
        <li key={(b as any)._id} className={`tw-mb-1.5 tw-rounded-md tw-p-2 tw-text-meta ${b.isBack ? 'tw-bg-back' : 'tw-bg-lay'}`}>
          <div className='tw-flex tw-justify-between tw-gap-2'>
            <span className='tw-truncate tw-text-strong'>{b.selectionName}</span>
            <span className='tw-tabular-nums'>
              {b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds} · {b.stack}
            </span>
          </div>
          {b.createdAt && <span className='tw-text-muted-fg'>{moment(b.createdAt).format('DD/MM HH:mm')}</span>}
        </li>
      ))}
    </ul>
  )
}

/** Betslip body shared by the mobile sheet, tablet dialog and xl panel (v2 §8). */
const BetslipContent = ({ onHide }: { onHide?: () => void }) => {
  const { bet, clear, place, placing } = useBetslip()
  const openCount = useOpenBets().length
  const [tab, setTab] = React.useState<'slip' | 'open'>('slip')
  const total = Number(bet?.stack || 0)

  return (
    <div className='tw-flex tw-max-h-full tw-flex-col tw-overflow-hidden tw-bg-white'>
      <div className='tw-flex tw-h-11 tw-shrink-0 tw-items-center tw-justify-between tw-bg-primary tw-px-3 tw-text-white'>
        <span className='tw-text-header'>Betslip</span>
        {onHide && (
          <button type='button' onClick={onHide} className='tw-rounded-md tw-bg-white/10 tw-px-3 tw-py-1 tw-text-meta tw-font-bold'>
            Hide
          </button>
        )}
      </div>

      {bet || openCount ? (
        <div role='tablist' className='tw-flex tw-shrink-0 tw-border-0 tw-border-b tw-border-solid tw-border-line'>
          {(['slip', 'open'] as const).map((t) => (
            <button
              key={t}
              role='tab'
              type='button'
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`tw-h-10 tw-flex-1 tw-border-0 tw-border-b-2 tw-border-solid tw-text-meta tw-font-bold ${
                tab === t ? 'tw-border-primary tw-text-fg' : 'tw-border-transparent tw-text-muted-fg'
              }`}
            >
              {t === 'slip' ? `BETSLIP (${bet ? 1 : 0})` : `OPEN BETS (${openCount})`}
            </button>
          ))}
        </div>
      ) : null}

      <div className='tw-min-h-0 tw-flex-1 tw-overflow-y-auto'>
        {tab === 'open' ? (
          <OpenBets />
        ) : (
          <>
            <ActionRow onClear={clear} disabled={!bet} />
            {bet ? (
              <SelectionCard bet={bet} />
            ) : (
              <div className='tw-flex tw-flex-col tw-items-center tw-gap-2 tw-px-4 tw-py-8 tw-text-center'>
                <LuTicket className='tw-h-9 tw-w-9 tw-text-gray-300' aria-hidden />
                <p className='tw-m-0 tw-text-body tw-text-muted-fg'>No selections yet.</p>
              </div>
            )}
          </>
        )}
      </div>

      {tab === 'slip' && (
        <div className='tw-shrink-0 tw-border-0 tw-border-t tw-border-solid tw-border-line tw-p-2'>
          <button
            type='button'
            disabled={!bet || placing || !(Number(bet.stack) > 0)}
            onClick={place}
            className='tw-h-11 tw-w-full tw-rounded-md tw-bg-secondary tw-text-strong tw-text-white disabled:tw-bg-gray-300 disabled:tw-text-gray-600'
          >
            {placing ? 'Placing…' : `Place ${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  )
}

export default BetslipContent
