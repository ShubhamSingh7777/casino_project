import React from 'react'
import { AxiosResponse } from 'axios'
import User, { RoleName } from '../../../models/User'
import userService from '../../../services/user.service'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, inputClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'

type Side = 'D' | 'W'
type Entry = { amount: string; side: Side; status?: { ok: boolean; text: string }; busy?: boolean }

// Same figures as Agent Listing.
const exposureOf = (u: User) => Number(u.balance?.exposer || 0) + Number((u.balance as any)?.casinoexposer || 0)
const availableOf = (u: User) => Number(u.balance?.balance || 0) - exposureOf(u)
const fixed = (n: number) => n.toFixed(2)

/**
 * Transfer (spec §4.5): give/take points for many downline users at once with one master
 * password. Each row is the same deposit/withdraw call the G / T modals make (user-account-balance).
 */
const Transfer = () => {
  const [users, setUsers] = React.useState<{ items: User[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [applied, setApplied] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [entries, setEntries] = React.useState<Record<string, Entry>>({})

  const load = React.useCallback(
    (p = 1) => {
      setUsers(null)
      userService
        .getUserList({ username: applied, search: applied ? 'true' : 'false', type: '', status: 'true', page: p })
        .then((res: AxiosResponse<any>) => {
          setUsers(res.data.data)
          setPage(p)
        })
        .catch(() => setUsers({ items: [] }))
    },
    [applied],
  )
  React.useEffect(() => load(1), [load])

  const entryOf = (u: User): Entry => entries[String(u._id)] || { amount: '', side: 'D' }
  const setEntry = (u: User, patch: Partial<Entry>) => setEntries((e) => ({ ...e, [String(u._id)]: { ...entryOf(u), ...patch } }))

  const submitRow = (u: User): Promise<boolean> => {
    const entry = entryOf(u)
    const amount = Number(entry.amount)
    if (!password) {
      setEntry(u, { status: { ok: false, text: 'Enter the master password' } })
      return Promise.resolve(false)
    }
    if (!(amount > 0)) {
      setEntry(u, { status: { ok: false, text: 'Enter an amount' } })
      return Promise.resolve(false)
    }
    if (entry.side === 'W' && amount > Number(u.balance?.balance || 0)) {
      setEntry(u, { status: { ok: false, text: `Max ${fixed(Number(u.balance?.balance || 0))}` } })
      return Promise.resolve(false)
    }
    setEntry(u, { busy: true, status: undefined })
    return userService
      .updateDepositBalance({
        amount,
        narration: 'Transfer',
        transactionPassword: password,
        userId: u._id,
        parentUserId: u.role === 'admin' ? u._id : u.parentId,
        balanceUpdateType: entry.side,
      })
      .then((res: AxiosResponse) => {
        if (res.data?.error === true) throw { response: { data: res.data } }
        setEntry(u, { busy: false, amount: '', status: { ok: true, text: 'Done' } })
        return true
      })
      .catch((e: any) => {
        setEntry(u, { busy: false, status: { ok: false, text: e?.response?.data?.message || 'Failed' } })
        return false
      })
  }

  const rows = users?.items || []
  const pending = rows.filter((u) => Number(entryOf(u).amount) > 0)

  const transferAll = async () => {
    let changed = false
    // one at a time, so balances on the server update in order
    for (const u of pending) changed = (await submitRow(u)) || changed
    if (changed) load(page)
  }

  const columns: Column<User>[] = [
    { key: 'username', header: 'User Name', sortable: true, render: (u) => <span className='tw-font-semibold tw-text-ad-warning'>{u.username}</span> },
    { key: 'role', header: 'Account Type', value: (u) => RoleName[u.role || ''] || u.role },
    { key: 'credit', header: 'Credit', align: 'right', value: (u) => fixed(Number(u.creditRefrences || 0)) },
    { key: 'exposure', header: 'Exposure', align: 'right', value: (u) => fixed(exposureOf(u)), render: (u) => <span className='tw-text-ad-danger'>{fixed(exposureOf(u))}</span> },
    { key: 'available', header: 'Available Balance', align: 'right', value: (u) => fixed(availableOf(u)) },
    {
      key: 'side',
      header: 'G/T',
      noExport: true,
      render: (u) => (
        <select aria-label={`Give or take for ${u.username}`} value={entryOf(u).side} onChange={(e) => setEntry(u, { side: e.target.value as Side })} className={`${inputClass} tw-w-24`}>
          <option value='D'>Give</option>
          <option value='W'>Take</option>
        </select>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      noExport: true,
      render: (u) => (
        <span className='tw-flex tw-items-center tw-gap-2'>
          <button type='button' className='tw-whitespace-nowrap tw-text-[12px] tw-font-semibold tw-text-ad-success' onClick={() => setEntry(u, { amount: String(Math.max(0, Math.floor(availableOf(u)))) })}>
            All →
          </button>
          <input
            type='number'
            min={0}
            aria-label={`Amount for ${u.username}`}
            placeholder='0'
            value={entryOf(u).amount}
            onChange={(e) => setEntry(u, { amount: e.target.value })}
            className={`${inputClass} tw-w-28`}
          />
          <Button
            variant='info'
            size='sm'
            disabled={entryOf(u).busy}
            onClick={() => submitRow(u).then((ok) => ok && load(page))}
          >
            Submit
          </Button>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      noExport: true,
      render: (u) => {
        const st = entryOf(u).status
        return st ? <span className={`tw-text-[12px] ${st.ok ? 'tw-text-ad-success' : 'tw-text-ad-danger'}`}>{st.ok ? '✓ ' : ''}{st.text}</span> : null
      },
    },
  ]

  return (
    <div>
      <PageHeader title='Transfer' crumbs={['Agency Management', 'Transfer']} />
      <Card>
        <div className='tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2'>
          <form
            className='tw-flex tw-flex-wrap tw-gap-2'
            onSubmit={(e) => {
              e.preventDefault()
              setApplied(search.trim())
            }}
          >
            <span className='tw-w-52'>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search User' aria-label='Search User' className={inputClass} />
            </span>
            <Button type='submit'>Load</Button>
            <Button
              variant='light'
              onClick={() => {
                setSearch('')
                setApplied('')
                setEntries({})
              }}
            >
              Reset
            </Button>
          </form>
          <div className='tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
            <ExportButtons name='transfer' columns={columns} rows={rows} />
            <span className='tw-w-44'>
              <input type='password' autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Master Password' aria-label='Master Password' className={inputClass} />
            </span>
            <Button onClick={transferAll} disabled={!pending.length}>
              Transfer All{pending.length ? ` (${pending.length})` : ''}
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(u) => String(u._id)}
          loading={users === null}
          pageSizes={[25, 50, 100, 250, 500, 750, 1000]}
          server={{ page, totalPages: users?.totalPages || 1, onPage: load }}
        />
      </Card>
    </div>
  )
}

export default Transfer
