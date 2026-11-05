import React from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import User, { RoleName, RoleType } from '../../../models/User'
import userService from '../../../services/user.service'
import agentService from '../../../services/agent.service'
import GeneralSettingsModal from './modals/GeneralSettingsModal'
import UserDetailModal from './modals/UserDetailModal'
import GiveTakeModal from './modals/GiveTakeModal'
import { LimitModal, PasswordModal, StatusModal } from './modals/AccountModals'
import { Card, PageHeader } from '../../ui/PageHeader'
import { ActionSquare, Button, inputClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { ExportButtons } from '../../ui/ExportButtons'
import { Tabs } from '../../ui/Modal'
import { LuLock, LuLockOpen, LuNetwork, LuPlus } from '../../ui/icons'

type ModalKey = 'd' | 'w' | 's' | 'p' | 'e' | 'gs' | 'u'

// Same figures as the legacy list-clients page.
const exposureOf = (u: User) => Number(u.balance?.exposer || 0) + Number((u.balance as any)?.casinoexposer || 0)
const availableOf = (u: User) => Number(u.balance?.balance || 0) - exposureOf(u)
const plOf = (u: User) => Number((u.balance as any)?.profitLoss || 0)
const ptsOf = (u: User) => Number(u.creditRefrences || 0) + plOf(u)
const fixed = (n: number) => n.toFixed(2)
const sum = (rows: User[], f: (u: User) => number) => fixed(rows.reduce((t, u) => t + f(u), 0))
const tone = (n: number) => (n > 0 ? 'tw-text-ad-success' : n < 0 ? 'tw-text-ad-danger' : '')

/** Agent Listing (spec §4.3) — data and actions from the legacy list-clients page (same APIs, same modals). */
const AgentListing = () => {
  const { username = '' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [users, setUsers] = React.useState<{ items: User[]; totalPages?: number } | null>(null)
  const [page, setPage] = React.useState(1)
  const [active, setActive] = React.useState<'true' | 'false'>('true')
  const [search, setSearch] = React.useState('')
  const [modal, setModal] = React.useState<ModalKey | null>(null)
  const [modalType, setModalType] = React.useState<'EXP' | 'CRD'>('EXP')
  const [target, setTarget] = React.useState<any>(null)
  const isSearch = searchParams.get('search') === 'true'

  const load = React.useCallback(
    (p = 1) => {
      setUsers(null)
      userService
        .getUserList({ username, search: isSearch ? 'true' : 'false', type: '', status: active, page: p })
        .then((res: AxiosResponse<any>) => {
          setUsers(res.data.data)
          setPage(p)
        })
        .catch(() => setUsers({ items: [] }))
    },
    [username, isSearch, active],
  )

  React.useEffect(() => load(1), [load])

  const open = (key: ModalKey, user: User, type?: 'EXP' | 'CRD') => {
    if (type) setModalType(type)
    setTarget(null)
    setModal(key)
    userService.getParentUserDetail(user.username).then((res: AxiosResponse<any>) => setTarget(res.data.data[0]))
  }
  const close = (changed = true) => {
    setModal(null)
    if (changed) load(page)
  }

  const downlinePath = (u: User) => (agentService.isAgentLoggedIn() ? `/agent/list-clients/${u.username}` : `/admin/list-clients/${u.username}`)
  const rows = (users?.items || []).filter((u) => u.role === RoleType.admin || String(u.isLogin) === active)

  const columns: Column<User>[] = [
    {
      key: 'username',
      header: 'User Name',
      sortable: true,
      // opens the User Detail modal (spec §5.1); the Downline icon drills into the agent's list
      render: (u) => (
        <button type='button' onClick={() => open('u', u)} className='tw-font-semibold tw-text-ad-warning hover:tw-underline'>
          {u.username}
        </button>
      ),
    },
    { key: 'role', header: 'Account Type', sortable: true, value: (u) => RoleName[u.role || ''] || u.role },
    {
      key: 'downline',
      header: 'Downline',
      noExport: true,
      render: (u) =>
        u.role !== RoleType.user ? (
          <Link to={downlinePath(u)} aria-label={`Downline of ${u.username}`} className='tw-inline-flex tw-text-ad-info'>
            <LuNetwork className='tw-h-4 tw-w-4' />
          </Link>
        ) : (
          <LuNetwork className='tw-h-4 tw-w-4 tw-opacity-30' aria-hidden />
        ),
    },
    {
      key: 'betLock',
      header: 'Betting Status',
      value: (u) => (u.betLock ? 'Active' : 'Locked'),
      render: (u) =>
        u.betLock ? <LuLockOpen className='tw-h-4 tw-w-4 tw-text-ad-success' aria-label='Betting active' /> : <LuLock className='tw-h-4 tw-w-4 tw-text-ad-danger' aria-label='Betting locked' />,
    },
    { key: 'isLogin', header: 'Status', value: (u) => (u.isLogin ? 'ACTIVE' : 'INACTIVE') },
    { key: 'exposure', header: 'Net Exposure', align: 'right', value: (u) => fixed(exposureOf(u)), render: (u) => <span className='tw-text-ad-danger'>{fixed(exposureOf(u))}</span>, footer: sum(rows, exposureOf) },
    { key: 'pl', header: 'P/L', align: 'right', sortable: true, value: (u) => fixed(plOf(u)), render: (u) => <span className={tone(plOf(u))}>{fixed(plOf(u))}</span>, footer: sum(rows, plOf) },
    { key: 'credit', header: 'Credit Limit', align: 'right', sortable: true, value: (u) => fixed(Number(u.creditRefrences || 0)), render: (u) => <span className='tw-text-ad-warning'>{fixed(Number(u.creditRefrences || 0))}</span>, footer: sum(rows, (u) => Number(u.creditRefrences || 0)) },
    { key: 'available', header: 'Available Limits', align: 'right', value: (u) => fixed(availableOf(u)), footer: sum(rows, availableOf) },
    { key: 'pts', header: 'Pts', align: 'right', sortable: true, value: (u) => fixed(ptsOf(u)), footer: sum(rows, ptsOf) },
    { key: 'exposerLimit', header: 'Exposure Limit', align: 'right', value: (u) => u.exposerLimit || 0 },
    {
      key: 'action',
      header: 'Action',
      noExport: true,
      render: (u) => (
        <span className='tw-flex tw-gap-1'>
          <ActionSquare variant='success' label='G' title='Give (deposit)' onClick={() => open('d', u)} />
          <ActionSquare variant='danger' label='T' title='Take (withdraw)' onClick={() => open('w', u)} />
          <ActionSquare variant='ghost' label='L' title='Exposure limit' onClick={() => open('e', u, 'EXP')} />
          <ActionSquare variant='ghost' label='C' title='Credit reference' onClick={() => open('e', u, 'CRD')} />
          <ActionSquare variant='ghost' label='P' title='Change password' onClick={() => open('p', u)} />
          <ActionSquare variant='info' label='S' title='User / bet status' onClick={() => open('s', u)} />
          <ActionSquare variant='dark' label='GS' title='General settings' onClick={() => open('gs', u)} />
        </span>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title={username ? `Agent Listing · ${username}` : 'Agent Listing'} crumbs={username ? ['Agent Listing', username] : undefined} />
      <Card>
        <div className='tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2'>
          <form
            className='tw-flex tw-flex-wrap tw-gap-2'
            onSubmit={(e) => {
              e.preventDefault()
              navigate(search.trim() ? `/admin/list-clients/${search.trim()}?search=true` : '/admin/list-clients')
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
                navigate('/admin/list-clients')
              }}
            >
              Reset
            </Button>
          </form>
          <div className='tw-flex tw-gap-2'>
            <ExportButtons name='agent-listing' columns={columns} rows={rows} />
            <Button variant='dark' onClick={() => navigate(username ? `/admin/add-user/${username}` : '/admin/add-user')}>
              <LuPlus className='tw-h-4 tw-w-4' /> New Agent
            </Button>
          </div>
        </div>

        <Tabs<'true' | 'false'>
          tabs={[
            { key: 'true', label: 'Active Users' },
            { key: 'false', label: 'Inactive Users' },
          ]}
          active={active}
          onChange={setActive}
        />

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(u) => String(u._id)}
          loading={users === null}
          pageSizes={[25, 50, 100, 250, 500, 750, 1000]}
          server={{ page, totalPages: users?.totalPages || 1, onPage: load }}
        />
      </Card>

      {/* same validation (master/transaction password), payloads and APIs as the legacy list-clients modals */}
      <GiveTakeModal variant='give' open={modal === 'd'} user={target} onClose={close} />
      <GiveTakeModal variant='take' open={modal === 'w'} user={target} onClose={close} />
      <StatusModal open={modal === 's'} user={target} onClose={close} />
      <PasswordModal open={modal === 'p'} user={target} onClose={close} />
      <LimitModal open={modal === 'e'} user={target} onClose={close} type={modalType} />
      <GeneralSettingsModal open={modal === 'gs'} user={target} onClose={close} />
      <UserDetailModal open={modal === 'u'} user={target} onClose={() => close(false)} onAction={(a) => setModal(a)} />
    </div>
  )
}

export default AgentListing
