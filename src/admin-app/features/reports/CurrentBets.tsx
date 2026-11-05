import React from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import IBet from '../../../models/IBet'
import { RoleType } from '../../../models/User'
import UserService from '../../../services/user.service'
import betService from '../../../services/bet.service'
import { CONSTANTS } from '../../../utils/constants'
import { useWebsocketUser } from '../../../context/webSocketUser'
import { useAdminRole } from '../../dev-auth'
import EditBetModal from '../../pages/UnsetteleBetHistory/EditBetModal'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, labelClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'
import { Tabs } from '../../ui/Modal'
import { UserOption, UserSelect } from '../../ui/UserSelect'
import { apiDate, DateRange, lastDays, Range } from '../../../shared/DateRange'

type Kind = 'sports' | 'casino'
type BetStatus = 'matched' | 'unmatched' | 'deleted'
type Side = 'all' | 'back' | 'lay'

// legacy bet-list helper: unknown sport id → casino
const sportName = (id: any) => (id !== '' ? CONSTANTS.SPORT_NAME.filter((s: any) => s.id == id)[0]?.name || 'Casino' : '')
const rate = (b: IBet) => (b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds)

const Radio = <T extends string>({ name, value, current, onChange, label }: { name: string; value: T; current: T; onChange: (v: T) => void; label: string }) => (
  <label className='tw-flex tw-cursor-pointer tw-items-center tw-gap-1.5 tw-text-[13px]'>
    <input type='radio' name={name} checked={current === value} onChange={() => onChange(value)} />
    {label}
  </label>
)

/**
 * Current Bets (spec §4.9) on the legacy alluserbetList API (status=pending).
 * Back/Lay and Sports/Casino are filtered on the loaded page — the API has no such params.
 */
const CurrentBets = () => {
  const params = useParams()
  const deletedView = params.type === 'deleted'
  const isAdmin = useAdminRole() === RoleType.admin
  const { socketUser } = useWebsocketUser()

  const [kind, setKind] = React.useState<Kind>('sports')
  const [status, setStatus] = React.useState<BetStatus>(deletedView ? 'deleted' : 'matched')
  const [side, setSide] = React.useState<Side>('all')
  const [user, setUser] = React.useState<UserOption | null>(null)
  const [range, setRange] = React.useState<Range>(lastDays(7))
  const [data, setData] = React.useState<{ docs: IBet[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [selected, setSelected] = React.useState<Record<string, boolean>>({})
  const [editBet, setEditBet] = React.useState<IBet | null>(null)

  const load = (p = 1) => {
    setLoading(true)
    setSelected({})
    UserService.getUsercompletedbets(p, {
      status: 'pending',
      type: params.type,
      bet_status: status,
      startDate: apiDate(range[0]),
      endDate: apiDate(range[1]),
      ...(user ? { userId: user._id } : {}),
    })
      .then((res: AxiosResponse) => {
        setData(res?.data?.data || { docs: [] })
        setPage(p)
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'error'))
      .finally(() => setLoading(false))
  }

  React.useEffect(() => {
    setStatus(deletedView ? 'deleted' : 'matched')
  }, [deletedView])
  React.useEffect(() => load(1), [status, params.type])

  const rows = (data?.docs || []).filter(
    (b) => (kind === 'casino') === (sportName(b.sportId) === 'Casino') && (side === 'all' || (side === 'back') === !!b.isBack),
  )
  const totalAmount = rows.reduce((t, b) => t + Number(b.stack || 0), 0)

  // legacy single delete: confirm → delete-current-bet → socket betDelete
  const remove = (bet: IBet) => {
    if (!bet._id || !window.confirm('Are you sure you want to delete?')) return
    betService
      .deleteCurrentBet(bet._id)
      .then((res: AxiosResponse) => {
        const { success, message } = res.data.data
        if (!success) return toast.error('Failed to delete bet.')
        socketUser.emit('betDelete', { betId: bet._id, userId: bet.userId })
        toast.success(message)
        setData((d) => d && { ...d, docs: d.docs.filter((x) => x._id !== bet._id) })
      })
      .catch(() => toast.error('An error occurred while deleting the bet.'))
  }

  // legacy bulk delete (delete-bets)
  const removeSelected = () => {
    const ids = rows.filter((b) => b._id && selected[b._id]).map((b) => b._id as string)
    if (!ids.length) return toast.error('Please select one item')
    if (!window.confirm(`Delete ${ids.length} bet(s)?`)) return
    betService.deleteBets({ ids }).then((res) => {
      if (!res.data.data.success) return
      toast.success(res.data.message)
      setData((d) => d && { ...d, docs: d.docs.filter((x) => !x._id || !ids.includes(x._id)) })
      setSelected({})
    })
  }

  const canEdit = (b: IBet) => b.status === 'pending' && isAdmin && !deletedView
  const allChecked = rows.length > 0 && rows.every((b) => b._id && selected[b._id])

  const columns: Column<IBet>[] = [
    ...(isAdmin && !deletedView
      ? [
          {
            key: 'select',
            header: '',
            noExport: true,
            render: (b: IBet) => (
              <input
                type='checkbox'
                aria-label='Select bet'
                checked={!!(b._id && selected[b._id])}
                onChange={() => b._id && setSelected((s) => ({ ...s, [b._id as string]: !s[b._id as string] }))}
              />
            ),
          } as Column<IBet>,
        ]
      : []),
    ...(kind === 'sports' ? [{ key: 'eventType', header: 'Event Type', value: (b: IBet) => sportName(b.sportId) } as Column<IBet>] : []),
    { key: 'matchName', header: 'Event Name', sortable: true },
    { key: 'userName', header: 'User Name', sortable: true, render: (b) => <span className='tw-font-semibold tw-text-ad-warning'>{b.userName}</span>, value: (b) => b.userName },
    { key: 'uplevel', header: 'Uplevel', value: (b) => b.parentNameStr },
    ...(kind === 'sports' ? [{ key: 'marketName', header: 'M Name' } as Column<IBet>] : []),
    { key: 'selectionName', header: 'Nation' },
    { key: 'rate', header: 'U Rate', align: 'right', value: (b) => rate(b) },
    { key: 'stack', header: 'Amount', align: 'right', sortable: true },
    { key: 'pnl', header: 'P/L', align: 'right', value: (b) => Number(b.status === 'completed' ? b.profitLoss : b.pnl || 0).toFixed(2) },
    { key: 'createdAt', header: 'Place Date', sortable: true, value: (b) => (b.createdAt ? moment(b.createdAt).format('DD/MM/YYYY HH:mm:ss') : '') },
    { key: 'ip', header: 'IP', value: (b) => b.ipAddress || (b as any).userIp || '' },
    { key: 'browser', header: 'Browser', value: (b) => (b as any).browserDetail || (b as any).browser || '' },
    {
      key: 'action',
      header: 'Action',
      noExport: true,
      render: (b) =>
        canEdit(b) ? (
          <span className='tw-flex tw-gap-2'>
            <button type='button' onClick={() => setEditBet(b)} className='tw-text-ad-info hover:tw-underline'>
              Edit
            </button>
            <button type='button' onClick={() => remove(b)} className='tw-text-ad-danger hover:tw-underline'>
              Delete
            </button>
          </span>
        ) : null,
    },
  ]

  return (
    <div>
      <PageHeader title={deletedView ? 'Deleted Bets' : 'Current Bets'} crumbs={['Reports', deletedView ? 'Deleted Bets' : 'Current Bets']} />
      <Card>
        <Tabs<Kind>
          tabs={[
            { key: 'sports', label: 'Sports' },
            { key: 'casino', label: 'Casino' },
          ]}
          active={kind}
          onChange={setKind}
        />

        <div className='tw-mb-3 tw-grid tw-items-end tw-gap-3 lg:tw-grid-cols-[auto_auto_1fr_1fr_auto]'>
          {!deletedView ? (
            <div className='tw-flex tw-flex-col tw-gap-1'>
              <Radio<BetStatus> name='bstatus' value='matched' current={status} onChange={setStatus} label='Matched' />
              <Radio<BetStatus> name='bstatus' value='unmatched' current={status} onChange={setStatus} label='Unmatched' />
              <Radio<BetStatus> name='bstatus' value='deleted' current={status} onChange={setStatus} label='Deleted' />
            </div>
          ) : (
            <span />
          )}
          <div className='tw-flex tw-gap-3'>
            <Radio<Side> name='side' value='all' current={side} onChange={setSide} label='All' />
            <Radio<Side> name='side' value='back' current={side} onChange={setSide} label='Back' />
            <Radio<Side> name='side' value='lay' current={side} onChange={setSide} label='Lay' />
          </div>
          <div>
            <span className={labelClass}>User</span>
            <UserSelect value={user} onChange={setUser} />
          </div>
          <div>
            <span className={labelClass}>Date Range</span>
            <DateRange value={range} onChange={setRange} />
          </div>
          <div className='tw-flex tw-gap-2'>
            <Button onClick={() => load(1)} disabled={loading}>
              Load
            </Button>
            <ExportButtons name={deletedView ? 'deleted-bets' : 'current-bets'} columns={columns} rows={rows} />
            {isAdmin && !deletedView && (
              <Button variant='danger' onClick={removeSelected}>
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className='tw-mb-3 tw-flex tw-flex-wrap tw-gap-6 tw-text-[18px]'>
          <span>
            Total Soda: <b>{rows.length}</b>
          </span>
          <span>
            Total Amount: <b>{totalAmount.toFixed(2)}</b>
          </span>
          {isAdmin && !deletedView && rows.length > 0 && (
            <label className='tw-ml-auto tw-flex tw-items-center tw-gap-1.5 tw-text-[13px]'>
              <input
                type='checkbox'
                checked={allChecked}
                onChange={() => setSelected(allChecked ? {} : Object.fromEntries(rows.filter((b) => b._id).map((b) => [b._id as string, true])))}
              />
              Select all
            </label>
          )}
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(b, i) => String(b._id || i)}
          loading={loading}
          rowClassName={(b) => (b.isBack ? 'tw-bg-[#72bbef]/25' : 'tw-bg-[#faa9ba]/25')}
          server={{ page, totalPages: data?.totalPages || 1, onPage: load }}
        />
      </Card>

      <EditBetModal show={!!editBet} onHide={() => setEditBet(null)} bet={editBet} onUpdate={() => load(page)} />
    </div>
  )
}

export default CurrentBets
