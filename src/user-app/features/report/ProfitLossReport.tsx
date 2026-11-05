import React from 'react'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import { SportName } from '../../../models/SportTypes'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'
import { ExportMenu, Field, LightButton, PrimaryButton, ReportCard, ReportColumn, ReportTable, ReportTitle } from './ReportUi'

type Item = { _id?: string; sportId: string | number; narration: string; total: number }
const eventOf = (i: Item) => (i.narration ? i.narration.split('/')[0] : '')
const tone = (n: number) => (n > 0 ? 'tw-text-success' : n < 0 ? 'tw-text-red-600' : '')

/** Profit & Loss — legacy user profit-loss API, per event, with a total row. */
const ProfitLossReport = () => {
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [data, setData] = React.useState<{ items: Item[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  const load = (p = 1) => {
    setLoading(true)
    accountService
      .getProfitLoss(p, { startDate: apiDate(range[0]), endDate: apiDate(range[1]) })
      .then((res) => {
        setData(res?.data?.data || { items: [] })
        setPage(p)
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'Could not load the report'))
      .finally(() => setLoading(false))
  }
  React.useEffect(() => load(1), [])

  const items = data?.items || []
  const total = items.reduce((t, i) => t + Number(i.total || 0), 0)
  const columns: ReportColumn<Item>[] = [
    { key: 'sport', header: 'Sport', value: (i) => SportName[i.sportId] || i.sportId, footer: 'Total' },
    { key: 'event', header: 'Event', value: eventOf },
    {
      key: 'total',
      header: 'Profit / Loss',
      align: 'right',
      value: (i) => Number(i.total || 0).toFixed(2),
      render: (i) => <span className={`tw-font-bold ${tone(i.total)}`}>{Number(i.total || 0).toFixed(2)}</span>,
      footer: <span className={tone(total)}>{total.toFixed(2)}</span>,
    },
  ]

  return (
    <ReportCard>
      <ReportTitle>Profit &amp; Loss</ReportTitle>
      <div className='tw-mb-3 tw-grid tw-items-end tw-gap-2 sm:tw-grid-cols-[2fr_auto]'>
        <Field label='Date range'>
          <DateRange value={range} onChange={setRange} />
        </Field>
        <div className='tw-flex tw-flex-wrap tw-gap-2'>
          <PrimaryButton onClick={() => load(1)} disabled={loading}>
            Load
          </PrimaryButton>
          <LightButton onClick={() => setRange(lastDays(7))}>Reset</LightButton>
          <ExportMenu name='profit-loss' columns={columns} rows={items} />
        </div>
      </div>
      <ReportTable
        columns={columns}
        rows={items}
        rowKey={(i, n) => String(i._id || n)}
        loading={loading}
        server={data?.totalPages ? { page, totalPages: data.totalPages, onPage: load } : undefined}
      />
    </ReportCard>
  )
}

export default ProfitLossReport
