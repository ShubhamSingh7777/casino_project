import React from 'react'
import { toast } from 'react-toastify'
import accountService from '../../../services/account.service'
import { SportName } from '../../../models/SportTypes'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, labelClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'
import { UserOption, UserSelect } from '../../ui/UserSelect'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'

type Item = { _id?: string; sportId: string | number; narration: string; total: number }

const eventOf = (i: Item) => (i.narration ? i.narration.split('/')[0] : '')
/** Casino rows are grouped by game (narration), others by sport — same grouping as the legacy summary. */
const groupOf = (i: Item) => (SportName[i.sportId] === 'Casino' ? eventOf(i) : SportName[i.sportId] || String(i.sportId))
const tone = (n: number) => (n > 0 ? 'tw-text-ad-success' : n < 0 ? 'tw-text-ad-danger' : '')

/** Profit & Loss (spec §4.8 "Party Win Loss" layout on the existing profit-loss API). */
const ProfitLoss = () => {
  const [user, setUser] = React.useState<UserOption | null>(null)
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [data, setData] = React.useState<{ items: Item[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)

  const load = (p = 1) => {
    setLoading(true)
    accountService
      .getProfitLoss(p, { startDate: apiDate(range[0]), endDate: apiDate(range[1]), ...(user ? { userId: user._id } : {}) })
      .then((res) => {
        setData(res?.data?.data || { items: [] })
        setPage(p)
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'error'))
      .finally(() => setLoading(false))
  }

  const items = data?.items || []
  const total = items.reduce((t, i) => t + Number(i.total || 0), 0)
  const groups = React.useMemo(() => {
    const g: Record<string, number> = {}
    items.forEach((i) => (g[groupOf(i)] = (g[groupOf(i)] || 0) + Number(i.total || 0)))
    return Object.entries(g)
  }, [items])

  const columns: Column<Item>[] = [
    { key: 'sport', header: 'Sport', sortable: true, value: (i) => SportName[i.sportId] || i.sportId, footer: 'Total' },
    { key: 'event', header: 'Event', sortable: true, value: eventOf },
    {
      key: 'total',
      header: 'Profit/Loss',
      align: 'right',
      sortable: true,
      value: (i) => Number(i.total || 0).toFixed(2),
      render: (i) => <span className={tone(i.total)}>{Number(i.total || 0).toFixed(2)}</span>,
      footer: <span className={tone(total)}>{total.toFixed(2)}</span>,
    },
  ]

  return (
    <div>
      <PageHeader title='Profit & Loss' crumbs={['Reports', 'Profit & Loss']} />
      <Card>
        <div className='tw-mb-3 tw-grid tw-items-end tw-gap-3 md:tw-grid-cols-[1fr_1fr_auto]'>
          <div>
            <span className={labelClass}>Search By Client Name</span>
            <UserSelect value={user} onChange={setUser} />
          </div>
          <div>
            <span className={labelClass}>Select Date Range</span>
            <DateRange value={range} onChange={setRange} />
          </div>
          <div className='tw-flex tw-gap-2'>
            <Button onClick={() => load(1)} disabled={loading}>
              Load
            </Button>
            <Button
              variant='light'
              onClick={() => {
                setUser(null)
                setRange(lastDays(7))
                setData(null)
              }}
            >
              Reset
            </Button>
            <ExportButtons name='profit-loss' columns={columns} rows={items} disabled={!data} />
          </div>
        </div>

        {groups.length > 0 && (
          <div className='tw-mb-3 tw-flex tw-flex-wrap tw-gap-2'>
            {groups.map(([name, value]) => (
              <span key={name} className='tw-rounded tw-bg-ad-item tw-px-3 tw-py-1.5 tw-text-[12px] tw-font-semibold'>
                {name}: <span className={tone(value)}>{value.toFixed(2)}</span>
              </span>
            ))}
          </div>
        )}

        <DataTable
          columns={columns}
          rows={items}
          rowKey={(i, n) => String(i._id || n)}
          loading={loading}
          server={data?.totalPages ? { page, totalPages: data.totalPages, onPage: load } : undefined}
        />
      </Card>
    </div>
  )
}

export default ProfitLoss
