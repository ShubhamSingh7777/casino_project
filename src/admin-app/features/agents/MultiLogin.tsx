import React from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import agentService, { AGENT_PERMISSIONS, AgentPermission, IAgent } from '../../../services/agent.service'
import AgentLogs from '../../pages/agent-management/AgentLogs'
import { Card, PageHeader } from '../../ui/PageHeader'
import { ActionSquare, Button, inputClass, labelClass } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { Modal, Tabs, Toggle } from '../../ui/Modal'
import { LuCheck, LuX } from '../../ui/icons'
import { Input, Row } from './modals/fields'

// English labels for the backend's sub-login permission keys (the service's own labels are Hindi).
const LABELS: Record<AgentPermission, string> = {
  'view-clients': 'User List',
  'add-client': 'Insert User',
  'deposit-withdraw': 'Deposit / Withdraw',
  'account-statement': 'Account Statement',
  'profit-loss': 'Profit & Loss',
  'current-bets': 'Current Bets',
  'all-bets': 'All Bets',
  'deleted-bets': 'Deleted Bets',
  'game-reports': 'Game Reports',
  'block-markets': 'Block Markets',
  'add-match': 'Add Match',
  'casino-list': 'Casino List',
  'payment-method': 'Payment Method',
  'contact-details': 'Contact Details',
  messages: 'Messages',
  'change-user-password': 'User Password Change',
  'user-enable-disable': 'User Lock',
}

const EMPTY = { username: '', fullName: '', phone: '', password: '', confirmPassword: '', permissions: [] as AgentPermission[] }

/** Same rules as the legacy CreateAgent form. */
const validate = (f: typeof EMPTY, isEdit: boolean): string | null => {
  if (!isEdit && !f.username.trim()) return 'Username is required'
  if (!isEdit && f.username.trim().length < 3) return 'Username must be at least 3 characters'
  if (!isEdit && !f.password) return 'Password is required'
  if (!isEdit && f.password.length < 6) return 'Password must be at least 6 characters'
  if (!isEdit && f.password !== f.confirmPassword) return 'Passwords do not match'
  if (isEdit && f.password && f.password.length < 6) return 'New password must be at least 6 characters'
  if (isEdit && f.password && f.password !== f.confirmPassword) return 'Passwords do not match'
  if (!f.permissions.length) return 'Please select at least one permission'
  return null
}

const errorText = (err: any, fallback: string) => err?.response?.data?.message || err?.response?.data?.error || fallback

/** Multi Login (spec §4.2) on the existing sub-agent API (create-agent / get-agents / update-agent). */
const MultiLogin = () => {
  const [tab, setTab] = React.useState<'accounts' | 'logs'>('accounts')
  const [form, setForm] = React.useState({ ...EMPTY })
  const [editing, setEditing] = React.useState<IAgent | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [agents, setAgents] = React.useState<IAgent[] | null>(null)
  const [statusFor, setStatusFor] = React.useState<IAgent | null>(null)
  const [passwordFor, setPasswordFor] = React.useState<IAgent | null>(null)
  const [newPassword, setNewPassword] = React.useState({ password: '', confirm: '' })
  const [logsFor, setLogsFor] = React.useState<IAgent | null>(null)

  const load = () =>
    agentService
      .getAgents(1, 500)
      .then((res) => setAgents(res.data.data || []))
      .catch(() => {
        setAgents([])
        toast.error('Failed to load agents')
      })

  React.useEffect(() => {
    load()
  }, [])

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const toggle = (p: AgentPermission) =>
    setForm((f) => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter((x) => x !== p) : [...f.permissions, p] }))
  const all = form.permissions.length === AGENT_PERMISSIONS.length

  const resetForm = () => {
    setForm({ ...EMPTY })
    setEditing(null)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validate(form, !!editing)
    if (err) return toast.error(err)
    setSaving(true)
    try {
      if (editing) {
        const payload: any = { fullName: form.fullName, phone: form.phone, permissions: form.permissions }
        if (form.password) payload.password = form.password
        await agentService.updateAgent(editing._id, payload)
        toast.success('Agent updated successfully!')
      } else {
        await agentService.createAgent({ username: form.username.trim(), password: form.password, fullName: form.fullName, phone: form.phone, permissions: form.permissions })
        toast.success('Agent created successfully!')
      }
      resetForm()
      load()
    } catch (err) {
      toast.error(errorText(err, editing ? 'Failed to update agent' : 'Failed to create agent'))
    } finally {
      setSaving(false)
    }
  }

  const edit = (a: IAgent) => {
    setEditing(a)
    setForm({ username: a.username, fullName: a.fullName || '', phone: a.phone || '', password: '', confirmPassword: '', permissions: [...a.permissions] })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveStatus = async (a: IAgent, isActive: boolean) => {
    try {
      await agentService.updateAgent(a._id, { isActive })
      toast.success(`Agent ${isActive ? 'enabled' : 'disabled'} successfully`)
      setStatusFor(null)
      load()
    } catch (err) {
      toast.error(errorText(err, 'Failed to update status'))
    }
  }

  const savePassword = async () => {
    if (!passwordFor) return
    if (newPassword.password.length < 6) return toast.error('New password must be at least 6 characters')
    if (newPassword.password !== newPassword.confirm) return toast.error('Passwords do not match')
    try {
      await agentService.updateAgent(passwordFor._id, { password: newPassword.password })
      toast.success('Password updated successfully')
      setPasswordFor(null)
      setNewPassword({ password: '', confirm: '' })
    } catch (err) {
      toast.error(errorText(err, 'Failed to update password'))
    }
  }

  const remove = async (a: IAgent) => {
    if (!window.confirm(`Delete agent "${a.username}"?`)) return
    try {
      await agentService.deleteAgent(a._id)
      toast.success('Agent deleted')
      load()
    } catch (err) {
      toast.error(errorText(err, 'Failed to delete agent'))
    }
  }

  const columns: Column<IAgent>[] = [
    {
      key: 'action',
      header: 'Action',
      noExport: true,
      render: (a) => (
        <span className='tw-flex tw-gap-1'>
          <ActionSquare variant='primary' label='U' title='Update' onClick={() => edit(a)} />
          <ActionSquare variant='info' label='S' title='Change status' onClick={() => setStatusFor(a)} />
          <ActionSquare variant='success' label='P' title='Change password' onClick={() => setPasswordFor(a)} />
          <ActionSquare variant='dark' label='L' title='Activity logs' onClick={() => (setLogsFor(a), setTab('logs'))} />
          <ActionSquare variant='danger' label='D' title='Delete' onClick={() => remove(a)} />
        </span>
      ),
    },
    {
      key: 'username',
      header: 'Username',
      sortable: true,
      render: (a) => (
        <span className='tw-inline-flex tw-items-center tw-gap-1'>
          {a.username}
          {a.isActive ? <LuCheck className='tw-h-3.5 tw-w-3.5 tw-text-ad-success' aria-label='Active' /> : <LuX className='tw-h-3.5 tw-w-3.5 tw-text-ad-danger' aria-label='Disabled' />}
        </span>
      ),
      value: (a) => a.username,
    },
    { key: 'fullName', header: 'Full Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'lastLogin', header: 'Last Login', value: (a) => (a.lastLogin ? moment(a.lastLogin).format('DD/MM/YYYY HH:mm') : '-') },
    ...AGENT_PERMISSIONS.map(
      (p) =>
        ({
          key: p,
          header: LABELS[p],
          align: 'center',
          value: (a: IAgent) => (a.permissions.includes(p) ? 'Yes' : 'No'),
          render: (a: IAgent) =>
            a.permissions.includes(p) ? (
              <span className='tw-inline-flex tw-h-5 tw-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-white tw-text-ad-bg'>
                <LuCheck className='tw-h-3 tw-w-3' />
              </span>
            ) : (
              <LuX className='tw-mx-auto tw-h-3.5 tw-w-3.5 tw-opacity-40' />
            ),
        } as Column<IAgent>),
    ),
  ]

  return (
    <div>
      <PageHeader title='Multi Login Account' crumbs={['Multi Login', 'Create Account']} />
      <Tabs<'accounts' | 'logs'>
        tabs={[
          { key: 'accounts', label: 'Accounts' },
          { key: 'logs', label: 'Activity Logs' },
        ]}
        active={tab}
        onChange={(t) => (setTab(t), t === 'accounts' && setLogsFor(null))}
      />

      {tab === 'logs' ? (
        // legacy logs view (light surface)
        <div className='ad-legacy-surface'>
          <AgentLogs filterAgent={logsFor} onBack={() => (setTab('accounts'), setLogsFor(null))} />
        </div>
      ) : (
        <>
          <Card>
            <form onSubmit={submit} autoComplete='off'>
              <h2 className='tw-mb-3 tw-text-[13px] tw-font-semibold tw-uppercase'>{editing ? `Update · ${editing.username}` : 'Personal Information'}</h2>
              <div className='tw-mb-4 tw-grid tw-gap-3 sm:tw-grid-cols-2 xl:tw-grid-cols-5'>
                <label>
                  <span className={labelClass}>Client ID *</span>
                  <input value={form.username} onChange={set('username')} disabled={!!editing} className={inputClass} />
                </label>
                <label>
                  <span className={labelClass}>Full Name</span>
                  <input value={form.fullName} onChange={set('fullName')} className={inputClass} />
                </label>
                <label>
                  <span className={labelClass}>Phone</span>
                  <input value={form.phone} onChange={set('phone')} inputMode='tel' className={inputClass} />
                </label>
                <label>
                  <span className={labelClass}>{editing ? 'New Password' : 'Password *'}</span>
                  <input type='password' autoComplete='new-password' value={form.password} onChange={set('password')} className={inputClass} />
                </label>
                <label>
                  <span className={labelClass}>Confirm Password{editing ? '' : ' *'}</span>
                  <input type='password' autoComplete='new-password' value={form.confirmPassword} onChange={set('confirmPassword')} className={inputClass} />
                </label>
              </div>

              <h2 className='tw-mb-2 tw-text-[13px] tw-font-semibold tw-uppercase'>Privileges</h2>
              <div className='tw-mb-4 tw-grid tw-gap-2 sm:tw-grid-cols-2 lg:tw-grid-cols-3'>
                <label className='tw-flex tw-items-center tw-gap-2 tw-text-[13px] tw-font-bold'>
                  <input type='checkbox' checked={all} onChange={() => setForm((f) => ({ ...f, permissions: all ? [] : [...AGENT_PERMISSIONS] }))} />
                  All
                </label>
                {AGENT_PERMISSIONS.map((p) => (
                  <label key={p} className='tw-flex tw-items-center tw-gap-2 tw-text-[13px]'>
                    <input type='checkbox' checked={form.permissions.includes(p)} onChange={() => toggle(p)} />
                    {LABELS[p]}
                  </label>
                ))}
              </div>

              <div className='tw-flex tw-justify-end tw-gap-2'>
                <Button type='submit' variant='dark' disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Submit'}
                </Button>
                <Button variant='light' onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <DataTable columns={columns} rows={agents || []} rowKey={(a) => a._id} loading={agents === null} />
          </Card>
        </>
      )}

      <Modal open={!!statusFor} title='Change User Status' onClose={() => setStatusFor(null)} width='tw-max-w-lg'>
        {statusFor && <StatusForm agent={statusFor} onSave={saveStatus} />}
      </Modal>

      <Modal open={!!passwordFor} title='Change Password' onClose={() => setPasswordFor(null)} width='tw-max-w-lg'>
        <Row label='Password'>
          <Input type='password' autoComplete='new-password' value={newPassword.password} onChange={(e) => setNewPassword((p) => ({ ...p, password: e.target.value }))} />
        </Row>
        <Row label='Confirm Password'>
          <Input type='password' autoComplete='new-password' value={newPassword.confirm} onChange={(e) => setNewPassword((p) => ({ ...p, confirm: e.target.value }))} />
        </Row>
        <div className='tw-flex tw-justify-end'>
          <Button onClick={savePassword}>submit ⇥</Button>
        </div>
      </Modal>
    </div>
  )
}

const StatusForm = ({ agent, onSave }: { agent: IAgent; onSave: (a: IAgent, active: boolean) => void }) => {
  const [active, setActive] = React.useState(agent.isActive)
  return (
    <>
      <Row label='User Active'>
        <div className='tw-pt-2'>
          <Toggle checked={active} onChange={setActive} label='User active' />
        </div>
      </Row>
      <div className='tw-flex tw-justify-end'>
        <Button onClick={() => onSave(agent, active)}>submit ⇥</Button>
      </div>
    </>
  )
}

export default MultiLogin
