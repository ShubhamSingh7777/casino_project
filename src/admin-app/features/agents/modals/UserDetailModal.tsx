import React from 'react'
import moment from 'moment'
import { AxiosResponse } from 'axios'
import { RoleName } from '../../../../models/User'
import accountService from '../../../../services/account.service'
import { apiDate, lastDays } from '../../../../shared/DateRange'
import { Modal, Tabs } from '../../../ui/Modal'
import { Card } from '../../../ui/PageHeader'
import { Column, DataTable } from '../../../ui/DataTable'
import { LuPhone } from '../../../ui/icons'

/** Tabs that open one of the existing action modals instead of rendering here. */
export type DetailAction = 'p' | 's' | 'gs' | 'd' | 'w'

type Tab = 'profile' | 'account' | 'credit' | DetailAction

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'profile', label: 'Profile' },
  { key: 'p', label: 'Change Password' },
  { key: 's', label: 'User lock' },
  { key: 'account', label: 'Account history' },
  { key: 'gs', label: 'Edit Profile' },
  { key: 'd', label: 'Credit Deposit' },
  { key: 'w', label: 'Credit Withdraw' },
  { key: 'credit', label: 'Credit History' },
]

const money = (n: any) => Number(n || 0).toFixed(2)
const tone = (n: number) => (n > 0 ? 'tw-text-ad-success' : n < 0 ? 'tw-text-ad-danger' : '')

type HistoryRow = { _id: string; date: string; amount: number; remark: string; from: string }

/** Statement rows for this user over the last 30 days (account-statement-list, same filter as Account Statement). */
const History = ({ userId, reportType }: { userId: string; reportType: string }) => {
  const [rows, setRows] = React.useState<HistoryRow[] | null>(null)
  React.useEffect(() => {
    const [from, to] = lastDays(30)
    setRows(null)
    accountService
      .getAccountList(1, { startDate: apiDate(from), endDate: apiDate(to), reportType, userId })
      .then((res: AxiosResponse<any>) =>
        setRows(
          (res.data?.data?.items || []).map((s: any) => ({
            _id: s._id,
            date: moment(s.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            amount: Number(s.amount || 0),
            remark: s.narration || '',
            from: s.txnBy || '',
          })),
        ),
      )
      .catch(() => setRows([]))
  }, [userId, reportType])

  const columns: Column<HistoryRow>[] = [
    { key: 'from', header: 'Transfer From' },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => <span className={tone(r.amount)}>{money(r.amount)}</span> },
    { key: 'remark', header: 'Remark' },
    { key: 'date', header: 'Date' },
  ]
  return (
    <>
      <p className='tw-mb-2 tw-text-[12px] tw-text-ad-muted'>Last 30 days.</p>
      <DataTable columns={columns} rows={rows || []} rowKey={(r) => r._id} loading={rows === null} searchable={false} />
    </>
  )
}

/**
 * User Detail (spec §5.1) — opened from the username in Agent Listing. Profile and the two
 * history tabs render here; the action tabs open the existing modals (same APIs and rules).
 */
const UserDetailModal = ({ user, open, onClose, onAction }: { user: any; open: boolean; onClose: () => void; onAction: (a: DetailAction) => void }) => {
  const [tab, setTab] = React.useState<Tab>('profile')
  React.useEffect(() => {
    if (open) setTab('profile')
  }, [open])

  const pick = (t: Tab) => {
    if (t === 'profile' || t === 'account' || t === 'credit') setTab(t)
    else onAction(t)
  }

  const exposure = Number(user?.balance?.exposer || 0) + Number(user?.balance?.casinoexposer || 0)
  const pl = Number(user?.balance?.profitLoss || 0)
  const info: Array<[string, React.ReactNode]> = user
    ? [
        ['User Name', user.username],
        ['Full Name', user.fullname || '-'],
        ['Account Type', RoleName[user.role] || user.role || '-'],
        ['Mobile Number', user.phone || '-'],
        ['City', user.city || '-'],
        ['Credit pts', money(user.creditRefrences)],
        ['pts', money(Number(user.creditRefrences || 0) + pl)],
        ['Available pts', money(Number(user.balance?.balance || 0) - exposure)],
        ['Client P/L', <span key='pl' className={tone(pl)}>{money(pl)}</span>],
        ['Exposure', <span key='exp' className='tw-text-ad-danger'>{money(exposure)}</span>],
        ['Exposure Limit', user.exposerLimit ?? '-'],
        ['Betting', user.betLock ? 'Active' : 'Locked'],
        ['Status', user.isLogin ? 'ACTIVE' : 'INACTIVE'],
        ['Created Date', user.createdAt ? moment(user.createdAt).format('DD/MM/YYYY HH:mm:ss') : '-'],
      ]
    : []
  const partnership = user?.partnership ? Object.entries(user.partnership as Record<string, any>) : []

  return (
    <Modal open={open} title={user?.username || 'User'} onClose={onClose} width='tw-max-w-5xl'>
      <Tabs<Tab> tabs={TABS} active={tab} onChange={pick} />
      {!user ? (
        <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
      ) : tab === 'profile' ? (
        <div className='tw-grid tw-gap-3 md:tw-grid-cols-[220px_1fr]'>
          <Card className='tw-text-center'>
            <span className='tw-mx-auto tw-mb-2 tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-bg-ad-info tw-text-[24px] tw-font-bold'>
              {String(user.username || '?').charAt(0).toUpperCase()}
            </span>
            <p className='tw-font-semibold'>{user.username}</p>
            <hr className='tw-my-3 tw-border-white/10' />
            <p className='tw-flex tw-items-center tw-justify-center tw-gap-1.5 tw-text-[12px] tw-text-ad-muted'>
              <LuPhone className='tw-h-3.5 tw-w-3.5' /> {user.phone || '-'}
            </p>
            <p className='tw-mt-1 tw-text-[12px] tw-text-ad-muted'>{user.city || '-'}</p>
          </Card>
          <div>
            <Card>
              <h3 className='tw-mb-2 tw-text-[13px] tw-font-semibold'>Partnership Information</h3>
              {partnership.length ? (
                <table className='tw-w-full tw-text-[12px]'>
                  <thead>
                    <tr className='tw-text-left tw-text-ad-muted'>
                      <th className='tw-py-1'>Sport</th>
                      <th className='tw-py-1'>Own %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnership.map(([sport, p]) => (
                      <tr key={sport}>
                        <td className='tw-py-1 tw-text-white'>{sport}</td>
                        <td className='tw-py-1 tw-text-white'>{p?.ownRatio ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='tw-text-[12px] tw-text-ad-muted'>No partnership details.</p>
              )}
            </Card>
            <Card>
              <h3 className='tw-mb-2 tw-text-[13px] tw-font-semibold'>Additional Information</h3>
              <dl className='tw-grid tw-gap-x-6 tw-gap-y-1.5 tw-text-[12px] sm:tw-grid-cols-2'>
                {info.map(([k, v]) => (
                  <div key={k} className='tw-flex tw-justify-between tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-py-1'>
                    <dt className='tw-text-ad-muted'>{k}</dt>
                    <dd className='tw-m-0 tw-text-right tw-font-semibold tw-tabular-nums'>{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      ) : (
        <History key={tab} userId={user._id} reportType={tab === 'credit' ? 'chip' : 'ALL'} />
      )}
    </Modal>
  )
}

export default UserDetailModal
