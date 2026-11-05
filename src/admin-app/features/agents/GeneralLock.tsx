import React from 'react'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import User, { RoleName } from '../../../models/User'
import userService from '../../../services/user.service'
import betService from '../../../services/bet.service'
import { Card, PageHeader } from '../../ui/PageHeader'
import { Button, inputClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { LuLock, LuLockOpen } from '../../ui/icons'

type LockType = 'loginLock' | 'betLock'

const State = ({ on, label }: { on: boolean; label: string }) =>
  on ? (
    <span className='tw-inline-flex tw-items-center tw-gap-1 tw-text-ad-success'>
      <LuLockOpen className='tw-h-4 tw-w-4' /> Active
    </span>
  ) : (
    <span className='tw-inline-flex tw-items-center tw-gap-1 tw-text-ad-danger' aria-label={`${label} locked`}>
      <LuLock className='tw-h-4 tw-w-4' /> Locked
    </span>
  )

/**
 * General Lock (spec §4.11): lock / unlock login and betting for selected downline users.
 * Same users-lock call as the legacy list-clients bulk buttons (lock = the new "active" value).
 */
const GeneralLock = () => {
  const [users, setUsers] = React.useState<{ items: User[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState('')
  const [applied, setApplied] = React.useState('')
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [busy, setBusy] = React.useState(false)

  const load = React.useCallback(
    (p = 1) => {
      setUsers(null)
      setSelected(new Set())
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

  const rows = users?.items || []
  const allOn = rows.length > 0 && rows.every((u) => selected.has(String(u._id)))
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const apply = (type: LockType, active: boolean) => {
    const ids = Array.from(selected)
    if (!ids.length) return toast.error('Select at least one user')
    setBusy(true)
    betService
      .usersLockClientList({ ids, lock: active, type })
      .then((res: AxiosResponse<any>) => {
        if (!res.data?.data?.success) throw { response: { data: res.data } }
        toast.success(res.data.message || 'Updated')
        const key = type === 'betLock' ? 'betLock' : 'isLogin'
        setUsers((u) => u && { ...u, items: u.items.map((x) => (ids.includes(String(x._id)) ? { ...x, [key]: active } : x)) })
        setSelected(new Set())
      })
      .catch((e: any) => toast.error(e?.response?.data?.message || 'Could not update the lock'))
      .finally(() => setBusy(false))
  }

  const columns: Column<User>[] = [
    {
      key: 'select',
      header: '',
      noExport: true,
      render: (u) => (
        <input type='checkbox' aria-label={`Select ${u.username}`} checked={selected.has(String(u._id))} onChange={() => toggle(String(u._id))} className='tw-h-4 tw-w-4' />
      ),
    },
    { key: 'username', header: 'User Name', sortable: true, render: (u) => <span className='tw-font-semibold tw-text-ad-warning'>{u.username}</span> },
    { key: 'role', header: 'Account Type', value: (u) => RoleName[u.role || ''] || u.role },
    { key: 'isLogin', header: 'User Lock', value: (u) => (u.isLogin ? 'Active' : 'Locked'), render: (u) => <State on={!!u.isLogin} label='Login' /> },
    { key: 'betLock', header: 'Bet Lock', value: (u) => (u.betLock ? 'Active' : 'Locked'), render: (u) => <State on={!!u.betLock} label='Betting' /> },
  ]

  return (
    <div>
      <PageHeader title='General Lock' crumbs={['Reports', 'General Lock']} />
      <Card>
        <form
          className='tw-mb-3 tw-flex tw-flex-wrap tw-gap-2'
          onSubmit={(e) => {
            e.preventDefault()
            setApplied(search.trim())
          }}
        >
          <span className='tw-w-56'>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search By Client Name' aria-label='Search By Client Name' className={inputClass} />
          </span>
          <Button type='submit'>Load</Button>
          <Button
            variant='light'
            onClick={() => {
              setSearch('')
              setApplied('')
            }}
          >
            Reset
          </Button>
        </form>

        <div className='tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-gap-2'>
          <label className='tw-mr-2 tw-flex tw-items-center tw-gap-2 tw-text-[13px]'>
            <input type='checkbox' checked={allOn} onChange={() => setSelected(allOn ? new Set() : new Set(rows.map((u) => String(u._id))))} className='tw-h-4 tw-w-4' />
            All ({selected.size} selected)
          </label>
          <Button variant='danger' size='sm' disabled={busy} onClick={() => apply('loginLock', false)}>
            User Lock
          </Button>
          <Button variant='success' size='sm' disabled={busy} onClick={() => apply('loginLock', true)}>
            User Unlock
          </Button>
          <Button variant='danger' size='sm' disabled={busy} onClick={() => apply('betLock', false)}>
            Bet Lock
          </Button>
          <Button variant='success' size='sm' disabled={busy} onClick={() => apply('betLock', true)}>
            Bet Unlock
          </Button>
        </div>

        <DataTable columns={columns} rows={rows} rowKey={(u) => String(u._id)} loading={users === null} server={{ page, totalPages: users?.totalPages || 1, onPage: load }} />
      </Card>
    </div>
  )
}

export default GeneralLock
