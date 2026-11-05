import React from 'react'
import moment from 'moment'
import depositWithdrawService from '../../../services/deposit-withdraw.service'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'
import { ExportMenu, Field, fieldClass, LightButton, PrimaryButton, ReportCard, ReportColumn, ReportTable, ReportTitle } from './ReportUi'

const STATUSES: Array<[string, string]> = [
  ['', 'All'],
  ['approved', 'Approved'],
  ['pending', 'Pending'],
  ['rejected', 'Rejected'],
]

const STATUS_TONE: Record<string, string> = {
  approved: 'tw-bg-green-100 tw-text-green-800',
  pending: 'tw-bg-amber-100 tw-text-amber-800',
  rejected: 'tw-bg-red-100 tw-text-red-800',
}

/** Deposit / Withdraw statement — get-deposit-withdraw-list with the legacy filters. */
const DepositWithdrawReport = ({ type }: { type: 'deposit' | 'withdraw' }) => {
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [status, setStatus] = React.useState('')
  const [rows, setRows] = React.useState<any[] | null>(null)
  const [loading, setLoading] = React.useState(false)

  const load = () => {
    setLoading(true)
    depositWithdrawService
      .getDepositWithdrawLists({ type, startDate: apiDate(range[0]), endDate: apiDate(range[1]), reportType: status })
      .then((res) => setRows(Array.isArray(res?.data?.data) ? res.data.data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }
  React.useEffect(load, [type])

  const columns: ReportColumn<any>[] = [
    { key: 'type', header: 'Type', value: (d) => d.type },
    { key: 'amount', header: 'Amount', align: 'right' },
    { key: 'createdAt', header: 'Date', value: (d) => moment(d.createdAt).format('DD/MM/YYYY hh:mm:ss A') },
    {
      key: 'status',
      header: 'Status',
      value: (d) => d.status,
      render: (d) => <span className={`tw-rounded-full tw-px-2 tw-py-0.5 tw-text-meta tw-font-semibold tw-capitalize ${STATUS_TONE[d.status] || 'tw-bg-gray-100'}`}>{d.status}</span>,
    },
    { key: 'remark', header: 'Remark' },
  ]

  return (
    <ReportCard>
      <ReportTitle>{type === 'deposit' ? 'Deposit Statement' : 'Withdraw Statement'}</ReportTitle>
      <div className='tw-mb-3 tw-grid tw-items-end tw-gap-2 sm:tw-grid-cols-2 lg:tw-grid-cols-[2fr_1fr_auto]'>
        <Field label='Date range'>
          <DateRange value={range} onChange={setRange} />
        </Field>
        <Field label='Status'>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
            {STATUSES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <div className='tw-flex tw-flex-wrap tw-gap-2'>
          <PrimaryButton onClick={load} disabled={loading}>
            Load
          </PrimaryButton>
          <LightButton onClick={() => (setRange(lastDays(7)), setStatus(''))}>Reset</LightButton>
          <ExportMenu name={`${type}-statement`} columns={columns} rows={rows || []} />
        </div>
      </div>
      <ReportTable columns={columns} rows={rows || []} rowKey={(d, i) => String(d._id || i)} loading={loading} />
    </ReportCard>
  )
}

export default DepositWithdrawReport
