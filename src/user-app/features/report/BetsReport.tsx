import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import IBet from '../../../models/IBet'
import UserService from '../../../services/user.service'
import { CONSTANTS } from '../../../utils/constants'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'
import { ExportMenu, Field, fieldClass, LightButton, PrimaryButton, ReportCard, ReportColumn, ReportTable, ReportTitle } from './ReportUi'

export type BetsVariant = 'history' | 'current' | 'casino'

/**
 * Bet History (status=completed), Current Bets (status=pending) and Casino Bets
 * (pending, reportType 5000) — the alluserbetList filters the legacy pages send.
 */
const VARIANTS: Record<BetsVariant, { title: string; base: Record<string, string>; sports: boolean; statusOptions: Array<[string, string]>; statusKey: string }> = {
  history: {
    title: 'Bet History',
    base: { status: 'completed' },
    sports: true,
    statusKey: 'betStatus',
    statusOptions: [
      ['matched', 'Matched'],
      ['deleted', 'Deleted'],
    ],
  },
  current: {
    title: 'Current Bets',
    base: { status: 'pending' },
    sports: true,
    statusKey: 'bet_status',
    statusOptions: [
      ['ALL', 'All'],
      ['matched', 'Matched'],
      ['unmatched', 'Un-Matched'],
      ['deleted', 'Deleted'],
    ],
  },
  casino: { title: 'Casino Bets', base: { status: 'pending', reportType: '5000' }, sports: false, statusKey: '', statusOptions: [] },
}

// legacy BetHistory sport options
const SPORTS: Array<[string, string]> = [
  ['', 'All sports'],
  ['4', 'Cricket'],
  ['1', 'Football'],
  ['2', 'Tennis'],
  ['5000', 'Casino'],
]

const sportName = (id: any) => (id !== '' ? CONSTANTS.SPORT_NAME.filter((s: any) => s.id == id)[0]?.name || 'Casino' : '')
const rate = (b: IBet) => (b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds)

const BetsReport = ({ variant }: { variant: BetsVariant }) => {
  const cfg = VARIANTS[variant]
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [sport, setSport] = React.useState('')
  const [status, setStatus] = React.useState(cfg.statusOptions[0]?.[0] || '')
  const [data, setData] = React.useState<{ docs: IBet[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  const load = (p = 1) => {
    setLoading(true)
    UserService.getUsercompletedbets(p, {
      ...cfg.base,
      startDate: apiDate(range[0]),
      endDate: apiDate(range[1]),
      ...(cfg.sports && sport ? { reportType: sport } : {}),
      ...(cfg.statusKey ? { [cfg.statusKey]: status } : {}),
    })
      .then((res) => {
        setData(res?.data?.data || { docs: [] })
        setPage(p)
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'Could not load bets'))
      .finally(() => setLoading(false))
  }
  React.useEffect(() => load(1), [variant])

  const rows = data?.docs || []
  const columns: ReportColumn<IBet>[] = [
    { key: 'matchName', header: 'Event' },
    { key: 'selectionName', header: 'Selection' },
    ...(variant !== 'casino' ? [{ key: 'sport', header: 'Sport', value: (b: IBet) => sportName(b.sportId) } as ReportColumn<IBet>] : []),
    { key: 'marketName', header: 'Market' },
    { key: 'side', header: 'Side', value: (b) => (b.isBack ? 'Back' : 'Lay') },
    { key: 'rate', header: 'Rate', align: 'right', value: (b) => rate(b) },
    { key: 'stack', header: 'Stake', align: 'right' },
    { key: 'pl', header: 'P/L', align: 'right', value: (b) => Number(b.status === 'completed' ? b.profitLoss : b.pnl || 0).toFixed(2) },
    { key: 'createdAt', header: 'Placed', value: (b) => (b.createdAt ? moment(b.createdAt).format('DD/MM/YYYY HH:mm:ss') : '') },
  ]

  return (
    <ReportCard>
      <ReportTitle>{cfg.title}</ReportTitle>
      <div className='tw-mb-3 tw-grid tw-items-end tw-gap-2 sm:tw-grid-cols-2 lg:tw-grid-cols-[2fr_1fr_1fr_auto]'>
        <Field label='Date range'>
          <DateRange value={range} onChange={setRange} />
        </Field>
        {cfg.sports && (
          <Field label='Sport'>
            <select value={sport} onChange={(e) => setSport(e.target.value)} className={fieldClass}>
              {SPORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        )}
        {cfg.statusOptions.length > 0 && (
          <Field label='Bet status'>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
              {cfg.statusOptions.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        )}
        <div className='tw-flex tw-flex-wrap tw-gap-2'>
          <PrimaryButton onClick={() => load(1)} disabled={loading}>
            Load
          </PrimaryButton>
          <LightButton onClick={() => (setRange(lastDays(7)), setSport(''), setStatus(cfg.statusOptions[0]?.[0] || ''))}>Reset</LightButton>
          <ExportMenu name={cfg.title.toLowerCase().replace(/\s/g, '-')} columns={columns} rows={rows} />
        </div>
      </div>
      <ReportTable
        columns={columns}
        rows={rows}
        rowKey={(b, i) => String(b._id || i)}
        loading={loading}
        emptyText='No bets found'
        rowClassName={(b) => (b.isBack ? 'tw-bg-back' : 'tw-bg-lay')}
        server={{ page, totalPages: data?.totalPages || 1, onPage: load }}
      />
    </ReportCard>
  )
}

export default BetsReport
