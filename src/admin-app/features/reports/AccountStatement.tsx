import React from 'react'
import moment from 'moment'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import betService from '../../../services/bet.service'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, inputClass, labelClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'
import { UserOption, UserSelect } from '../../ui/UserSelect'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'
import { Modal } from '../../ui/Modal'

type Row = { _id: string; srNo: number; date: string; amount: number; closing: number; remark: string; fromTo: string; type: string; stmt: any }

// Report types accepted by account-statement-list (same options as the legacy page).
const TYPES = [
  { value: 'ALL', label: 'All' },
  { value: 'chip', label: 'Deposit/Withdraw Report' },
  { value: 'game', label: 'Game Report' },
  { value: 'casino', label: 'Casino' },
  { value: 'sport', label: 'Sport' },
]

/** Running balance from the opening balance — the legacy `dataformat` rule. */
const toRows = (items: any[], opening: number): Row[] => {
  let closing = opening
  return items.map((s, i) => {
    closing += s.amount
    return {
      _id: s._id,
      srNo: i + 1,
      date: moment(s.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      amount: s.amount,
      closing,
      remark: s.narration,
      fromTo: s.txnBy || '',
      type: s.type,
      stmt: s,
    }
  })
}

/** Account Statement (spec §4.7). Loads on "Load", like the reference. */
const AccountStatement = () => {
  const [user, setUser] = React.useState<UserOption | null>(null)
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [type, setType] = React.useState('ALL')
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [bets, setBets] = React.useState<{ open: boolean; items: any[] }>({ open: false, items: [] })

  const load = () => {
    setLoading(true)
    accountService
      .getAccountList(1, { startDate: apiDate(range[0]), endDate: apiDate(range[1]), reportType: type, userId: user?._id || '' })
      .then((res: AxiosResponse) => {
        const data = res?.data?.data
        setRows(toRows(data?.items || [], data?.openingBalance || 0))
      })
      .catch(() => toast.error('error'))
      .finally(() => setLoading(false))
  }

  const reset = () => {
    setUser(null)
    setRange(lastDays(7))
    setType('ALL')
    setRows(null)
  }

  const openBets = (row: Row) => {
    const ids = (row.stmt?.allBets || []).map((b: any) => b.betId)
    if (!ids.length) return
    setBets({ open: true, items: [] })
    betService.getBetListByIds(ids, 1).then((res: AxiosResponse) => setBets({ open: true, items: res.data?.data?.items || [] }))
  }

  const columns: Column<Row>[] = [
    { key: 'date', header: 'Date', sortable: true },
    { key: 'srNo', header: 'Sr No', sortable: true },
    { key: 'credit', header: 'Credit', align: 'right', value: (r) => (r.amount >= 0 ? r.amount.toFixed(2) : ''), render: (r) => (r.amount >= 0 ? <span className='tw-text-ad-success'>{r.amount.toFixed(2)}</span> : null) },
    { key: 'debit', header: 'Debit', align: 'right', value: (r) => (r.amount < 0 ? r.amount.toFixed(2) : ''), render: (r) => (r.amount < 0 ? <span className='tw-text-ad-danger'>{r.amount.toFixed(2)}</span> : null) },
    { key: 'pts', header: 'pts', align: 'right', value: (r) => r.closing.toFixed(2) },
    {
      key: 'remark',
      header: 'Remark',
      render: (r) =>
        r.stmt?.allBets?.length ? (
          <button type='button' onClick={() => openBets(r)} className='tw-text-left tw-text-ad-info hover:tw-underline'>
            {r.remark}
          </button>
        ) : (
          r.remark
        ),
      value: (r) => r.remark,
    },
    { key: 'fromTo', header: 'Fromto' },
  ]

  const betColumns: Column<any>[] = [
    { key: 'selectionName', header: 'Nation' },
    { key: 'side', header: 'Side', value: (b) => (b.isBack ? 'Back' : 'Lay') },
    { key: 'odds', header: 'Rate', value: (b) => (b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds) },
    { key: 'stack', header: 'Amount', align: 'right' },
    { key: 'pnl', header: 'P/L', align: 'right', value: (b) => Number(b.profitLoss ?? b.pnl ?? 0).toFixed(2) },
    { key: 'createdAt', header: 'Date', value: (b) => (b.createdAt ? moment(b.createdAt).format('DD/MM/YYYY HH:mm') : '') },
  ]

  return (
    <div>
      <PageHeader title='Account Statement' crumbs={['Reports', 'Account Statement']} />
      <Card>
        <div className='tw-mb-3 tw-grid tw-items-end tw-gap-3 md:tw-grid-cols-2 xl:tw-grid-cols-[1fr_1fr_1fr_auto]'>
          <div>
            <span className={labelClass}>Search By Client Name</span>
            <UserSelect value={user} onChange={setUser} />
          </div>
          <div>
            <span className={labelClass}>Select Date Range</span>
            <DateRange value={range} onChange={setRange} />
          </div>
          <label className='tw-block'>
            <span className={labelClass}>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <div className='tw-flex tw-gap-2'>
            <Button onClick={load} disabled={loading}>
              Load
            </Button>
            <Button variant='light' onClick={reset}>
              Reset
            </Button>
            <ExportButtons name='account-statement' columns={columns} rows={rows || []} disabled={!rows} />
          </div>
        </div>
        <DataTable columns={columns} rows={rows || []} rowKey={(r) => `${r._id}-${r.srNo}`} loading={loading} />
      </Card>

      <Modal open={bets.open} title='Bet List' onClose={() => setBets({ open: false, items: [] })} width='tw-max-w-5xl'>
        <DataTable columns={betColumns} rows={bets.items} rowKey={(b, i) => String(b._id || i)} rowClassName={(b) => (b.isBack ? 'tw-bg-[#72bbef]/20' : 'tw-bg-[#faa9ba]/20')} />
      </Modal>
    </div>
  )
}

export default AccountStatement
