import React from 'react'
import moment from 'moment'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import betService from '../../../services/bet.service'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'
import { useEscape } from '../../hooks/useClickOutside'
import { LuX } from '../../icons'
import { ExportMenu, Field, fieldClass, LightButton, PrimaryButton, ReportCard, ReportColumn, ReportTable, ReportTitle } from './ReportUi'

type Row = { id: string; srNo: number; date: string; amount: number; closing: number; remark: string; stmt: any }

// Options of the legacy user account statement.
const TYPES = [
  { value: 'ALL', label: 'All' },
  { value: 'chip', label: 'Deposit / Withdraw' },
  { value: 'game', label: 'Game Report' },
]

/** Running balance from the opening balance (legacy dataformat rule). */
const toRows = (items: any[], opening: number): Row[] => {
  let closing = opening
  return items.map((s, i) => {
    closing += s.amount
    return { id: s._id, srNo: i + 1, date: moment(s.createdAt).format('DD/MM/YYYY HH:mm:ss'), amount: s.amount, closing, remark: s.narration, stmt: s }
  })
}

export const BetListDialog = ({ bets, onClose }: { bets: any[] | null; onClose: () => void }) => {
  useEscape(onClose, !!bets)
  if (!bets) return null
  return (
    <div className='tw-fixed tw-inset-0 tw-z-[70] tw-flex tw-items-center tw-justify-center tw-p-3'>
      <div className='tw-absolute tw-inset-0 tw-bg-black/60' onClick={onClose} />
      <div role='dialog' aria-modal='true' aria-label='Bets' className='tw-relative tw-max-h-[85dvh] tw-w-full tw-max-w-3xl tw-overflow-y-auto tw-rounded-xl tw-bg-white tw-p-4'>
        <div className='tw-mb-3 tw-flex tw-items-center tw-justify-between'>
          <h2 className='tw-text-header'>Bets</h2>
          <button type='button' aria-label='Close' onClick={onClose} className='tw-p-1'>
            <LuX className='tw-h-5 tw-w-5' />
          </button>
        </div>
        <ReportTable
          rows={bets}
          rowKey={(b, i) => String(b._id || i)}
          rowClassName={(b) => (b.isBack ? 'tw-bg-back' : 'tw-bg-lay')}
          emptyText='Loading…'
          columns={[
            { key: 'selectionName', header: 'Selection' },
            { key: 'side', header: 'Side', value: (b: any) => (b.isBack ? 'Back' : 'Lay') },
            { key: 'odds', header: 'Rate', align: 'right', value: (b: any) => (b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds) },
            { key: 'stack', header: 'Stake', align: 'right' },
            { key: 'pl', header: 'P/L', align: 'right', value: (b: any) => Number(b.profitLoss ?? b.pnl ?? 0).toFixed(2) },
          ]}
        />
      </div>
    </div>
  )
}

const AccountStatementReport = () => {
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [type, setType] = React.useState('ALL')
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [bets, setBets] = React.useState<any[] | null>(null)

  const load = () => {
    setLoading(true)
    accountService
      .getAccountList(1, { startDate: apiDate(range[0]), endDate: apiDate(range[1]), reportType: type })
      .then((res: AxiosResponse) => setRows(toRows(res?.data?.data?.items || [], res?.data?.data?.openingBalance || 0)))
      .catch(() => toast.error('Could not load the statement'))
      .finally(() => setLoading(false))
  }
  React.useEffect(load, [])

  const openBets = (r: Row) => {
    const ids = (r.stmt?.allBets || []).map((b: any) => b.betId)
    if (!ids.length) return
    setBets([])
    betService.getBetListByIds(ids, 1).then((res: AxiosResponse) => setBets(res.data?.data?.items || []))
  }

  const columns: ReportColumn<Row>[] = [
    { key: 'date', header: 'Date' },
    { key: 'srNo', header: 'Sr No' },
    { key: 'credit', header: 'Credit', align: 'right', value: (r) => (r.amount >= 0 ? r.amount.toFixed(2) : ''), render: (r) => (r.amount >= 0 ? <span className='tw-font-bold tw-text-success'>{r.amount.toFixed(2)}</span> : null) },
    { key: 'debit', header: 'Debit', align: 'right', value: (r) => (r.amount < 0 ? r.amount.toFixed(2) : ''), render: (r) => (r.amount < 0 ? <span className='tw-font-bold tw-text-red-600'>{r.amount.toFixed(2)}</span> : null) },
    { key: 'closing', header: 'Balance', align: 'right', value: (r) => r.closing.toFixed(2) },
    {
      key: 'remark',
      header: 'Remark',
      value: (r) => r.remark,
      render: (r) =>
        r.stmt?.allBets?.length ? (
          <button type='button' onClick={() => openBets(r)} className='tw-text-left tw-text-link tw-underline'>
            {r.remark}
          </button>
        ) : (
          r.remark
        ),
    },
  ]

  return (
    <ReportCard>
      <ReportTitle>Account Statement</ReportTitle>
      <div className='tw-mb-3 tw-grid tw-items-end tw-gap-2 sm:tw-grid-cols-2 lg:tw-grid-cols-[2fr_1fr_auto]'>
        <Field label='Date range'>
          <DateRange value={range} onChange={setRange} />
        </Field>
        <Field label='Type'>
          <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <div className='tw-flex tw-flex-wrap tw-gap-2'>
          <PrimaryButton onClick={load} disabled={loading}>
            Load
          </PrimaryButton>
          <LightButton onClick={() => (setRange(lastDays(7)), setType('ALL'))}>Reset</LightButton>
          <ExportMenu name='account-statement' columns={columns} rows={rows || []} />
        </div>
      </div>
      <ReportTable columns={columns} rows={rows || []} rowKey={(r) => `${r.id}-${r.srNo}`} loading={loading} />
      <BetListDialog bets={bets} onClose={() => setBets(null)} />
    </ReportCard>
  )
}

export default AccountStatementReport
