import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import UserService from '../../../services/user.service'
import { useAppDispatch } from '../../../redux/hooks'
import { logout } from '../../../redux/actions/login/loginSlice'
import { IconType, LuCheck, LuChevronLeft, LuChevronRight, LuBell, LuEye, LuEyeOff, LuKeyRound, LuSettings, LuShieldCheck } from '../../icons'

const card = 'tw-mb-2 tw-rounded-ua tw-bg-white tw-p-4'
const inputClass = 'tw-h-11 tw-w-full tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white tw-px-3 tw-text-body tw-outline-none focus:tw-border-primary'
const primary = 'tw-h-11 tw-rounded-md tw-bg-secondary tw-px-5 tw-text-strong tw-text-white disabled:tw-opacity-60'

/** Page bar: back + "General Settings / <page>" breadcrumb (hub: back goes home). */
const Back = ({ title }: { title?: string }) => (
  <div className='tw-mb-2 tw-flex tw-h-12 tw-items-center tw-rounded-ua tw-bg-primary tw-text-white'>
    <Link to={title ? '/settings' : '/'} aria-label={title ? 'Back to general settings' : 'Back to home'} className='tw-flex tw-h-full tw-w-12 tw-items-center tw-justify-center hover:tw-bg-white/10'>
      <LuChevronLeft className='tw-h-5 tw-w-5' />
    </Link>
    <span className='tw-h-full tw-w-px tw-bg-white/20' />
    <h1 className='tw-m-0 tw-truncate tw-px-4 tw-text-section'>
      {title ? (
        <>
          <Link to='/settings' className='tw-font-normal tw-text-white/80'>
            General Settings
          </Link>{' '}
          / {title}
        </>
      ) : (
        'General Settings'
      )}
    </h1>
  </div>
)

const ITEMS: Array<{ to?: string; label: string; hint: string; icon: IconType }> = [
  { to: '/settings/security', label: 'Security', hint: 'Manage two-factor authentication.', icon: LuShieldCheck },
  { to: '/settings/change-password', label: 'Change Password', hint: 'Update the password used to sign in.', icon: LuKeyRound },
  { to: '/settings/stakes', label: 'Stakes', hint: 'Set your quick stake presets.', icon: LuSettings },
  { label: 'Notification Center', hint: 'Alerts and preferences will be available soon.', icon: LuBell },
]

/** /settings — General Settings list. */
export const SettingsHub = () => (
  <div className='ua-ui'>
    <Back />
    <div className={`${card} tw-mx-auto tw-max-w-4xl`}>
      <p className='tw-m-0 tw-mb-3 tw-text-body tw-text-muted-fg'>Manage account security and betting preferences.</p>
      <ul className='tw-m-0 tw-list-none tw-overflow-hidden tw-rounded-ua tw-border tw-border-solid tw-border-line tw-p-0'>
        {ITEMS.map(({ to, label, hint, icon: Icon }) => {
          const body = (
            <>
              <span className='tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-row-active'>
                <Icon className='tw-h-5 tw-w-5 tw-text-primary' />
              </span>
              <span className='tw-min-w-0 tw-flex-1'>
                <span className='tw-block tw-text-strong'>{label}</span>
                <span className='tw-block tw-text-meta tw-text-muted-fg'>{hint}</span>
              </span>
            </>
          )
          const rowClass = 'tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-4'
          return (
            <li key={label} className='tw-border-0 tw-border-t tw-border-solid tw-border-line first:tw-border-t-0'>
              {to ? (
                <Link to={to} className={`${rowClass} hover:tw-bg-muted`}>
                  {body}
                  <LuChevronRight className='tw-h-5 tw-w-5 tw-text-muted-fg' />
                </Link>
              ) : (
                <div className={`${rowClass} tw-opacity-70`} aria-disabled>
                  {body}
                  <span className='tw-rounded-full tw-bg-gray-200 tw-px-3 tw-py-1 tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider'>Coming soon</span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  </div>
)

// Same rules as the reference site; the server stays the judge of what is accepted.
const RULES: Array<[string, (p: string, repeat: string) => boolean]> = [
  ['Be from 8 up to 255 characters.', (p) => p.length >= 8 && p.length <= 255],
  ['Have at least one upper case and lower case letter.', (p) => /[A-Z]/.test(p) && /[a-z]/.test(p)],
  ['Have at least one number.', (p) => /\d/.test(p)],
  ['Match repeated password.', (p, r) => !!p && p === r],
]

const PasswordInput = ({ value, onChange, label, error }: { value: string; onChange: (v: string) => void; label: string; error?: string }) => {
  const [show, setShow] = React.useState(false)
  return (
    <label className='tw-mb-4 tw-block'>
      <span className='tw-mb-1.5 tw-block tw-text-body'>{label}</span>
      <span className='tw-relative tw-block'>
        <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} tw-pr-10`} autoComplete='off' />
        <button type='button' aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)} className='tw-absolute tw-right-2 tw-top-1/2 -tw-translate-y-1/2 tw-p-1 tw-text-fg'>
          {show ? <LuEyeOff className='tw-h-4 tw-w-4' /> : <LuEye className='tw-h-4 tw-w-4' />}
        </button>
      </span>
      {error && <span className='tw-mt-1 tw-block tw-text-meta tw-text-red-600'>{error}</span>}
    </label>
  )
}

/**
 * /settings/change-password — update-password call (current_password / new_password /
 * confirm_password); success logs out like the legacy page. Save unlocks once every rule passes.
 */
export const ChangePasswordPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const empty = { current_password: '', new_password: '', confirm_password: '' }
  const [form, setForm] = React.useState(empty)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [saving, setSaving] = React.useState(false)
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }))
  const passed = RULES.map(([, test]) => test(form.new_password, form.confirm_password))
  const ready = !!form.current_password && passed.every(Boolean)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready) return
    setErrors({})
    setSaving(true)
    UserService.updateuserpassword(form)
      .then(() => {
        toast.success('Password Updated Successfully')
        dispatch(logout())
        navigate('/login')
      })
      .catch((e) => {
        setErrors(e?.response?.data?.errors || {})
        toast.error(e?.response?.data?.message || 'Could not update the password')
      })
      .finally(() => setSaving(false))
  }

  return (
    <div className='ua-ui'>
      <Back title='Change Password' />
      <div className={card}>
        <div className='tw-mx-auto tw-max-w-3xl'>
          <h2 className='tw-m-0 tw-mb-3 tw-text-strong tw-uppercase tw-tracking-widest'>Change Password</h2>
          <form onSubmit={submit} className='tw-rounded-ua tw-border tw-border-solid tw-border-line tw-bg-muted tw-p-4 sm:tw-p-6'>
            <PasswordInput label='Current password' value={form.current_password} onChange={set('current_password')} error={errors.current_password} />
            <PasswordInput label='New password' value={form.new_password} onChange={set('new_password')} error={errors.new_password} />
            <PasswordInput label='Repeat new password' value={form.confirm_password} onChange={set('confirm_password')} error={errors.confirm_password} />

            <p className='tw-m-0 tw-mb-2 tw-mt-6 tw-text-meta tw-font-bold tw-tracking-wide'>Password must:</p>
            <ul className='tw-m-0 tw-mb-6 tw-flex tw-list-none tw-flex-col tw-gap-2 tw-p-0'>
              {RULES.map(([label], i) => (
                <li key={label} className={`tw-flex tw-items-center tw-gap-2 tw-text-body ${passed[i] ? 'tw-text-success' : 'tw-text-muted-fg'}`}>
                  <span
                    className={`tw-flex tw-h-5 tw-w-5 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-border-2 tw-border-solid ${
                      passed[i] ? 'tw-border-success tw-bg-success tw-text-white' : 'tw-border-gray-400'
                    }`}
                    aria-hidden
                  >
                    {passed[i] && <LuCheck className='tw-h-3 tw-w-3' />}
                  </span>
                  {label}
                  <span className='tw-sr-only'>{passed[i] ? '(met)' : '(not met)'}</span>
                </li>
              ))}
            </ul>

            <div className='tw-grid tw-grid-cols-2 tw-gap-3'>
              <button
                type='button'
                onClick={() => {
                  setForm(empty)
                  setErrors({})
                }}
                className='tw-h-11 tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white tw-text-strong'
              >
                Cancel
              </button>
              <button type='submit' disabled={!ready || saving} className={`${primary} disabled:tw-bg-gray-400`}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
            <p className='tw-m-0 tw-mt-3 tw-text-meta tw-text-muted-fg'>You will be logged out after the password changes.</p>
          </form>
        </div>
      </div>
    </div>
  )
}

type StakeKey = { name: string; value: string }
const GAME_KEYS: StakeKey[] = Array.from({ length: 10 }, (_, i) => ({ name: `name${i + 1}`, value: `value${i + 1}` }))
const CASINO_KEYS: StakeKey[] = Array.from({ length: 6 }, (_, i) => ({ name: `casinoName${i + 1}`, value: `casinoValue${i + 1}` }))

// Shown (and saved with the first edit) for presets the account has no value for — same values as the reference site.
const GAME_DEFAULTS = [1000, 2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 500000]
const CASINO_DEFAULTS = [10, 20, 50, 100, 200, 500]
const withDefaults = (stake: Record<string, any>) => {
  const out = { ...stake }
  const fill = (keys: StakeKey[], defaults: number[]) =>
    keys.forEach((k, i) => {
      if (!(Number(out[k.value]) > 0)) {
        out[k.value] = defaults[i]
        out[k.name] = String(defaults[i])
      }
    })
  fill(GAME_KEYS, GAME_DEFAULTS)
  fill(CASINO_KEYS, CASINO_DEFAULTS)
  return out
}

const presetClass = (active: boolean) =>
  `tw-flex tw-h-12 tw-flex-col tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-bg-white tw-text-strong tw-tabular-nums ${
    active ? 'tw-border-primary tw-ring-2 tw-ring-primary' : 'tw-border-line hover:tw-bg-muted'
  }`

type StakeGroupProps = {
  title: string
  hint: string
  keys: StakeKey[]
  stake: Record<string, any>
  editing: StakeKey | null
  onEdit: (k: StakeKey) => void
  editor: React.ReactNode
}

const StakeGroup = ({ title, hint, keys, stake, editing, onEdit, editor }: StakeGroupProps) => (
  <section className='tw-mb-4 tw-rounded-ua tw-border tw-border-solid tw-border-line tw-bg-muted tw-p-4'>
    <h2 className='tw-m-0 tw-text-section'>{title}</h2>
    <p className='tw-m-0 tw-mb-3 tw-text-body tw-text-muted-fg'>{hint}</p>
    <div className={`tw-grid tw-grid-cols-2 tw-gap-3 sm:tw-grid-cols-3 ${keys.length > 6 ? 'lg:tw-grid-cols-5' : ''}`}>
      {keys.map((k) => {
        const value = stake[k.value]
        const label = stake[k.name]
        return (
          <button key={k.value} type='button' aria-pressed={editing === k} onClick={() => onEdit(k)} className={presetClass(editing === k)}>
            {value ? value : <span className='tw-font-normal tw-text-muted-fg'>Not set</span>}
            {label && String(label) !== String(value) && <span className='tw-text-[11px] tw-font-normal tw-text-muted-fg'>{label}</span>}
          </button>
        )
      })}
    </div>
    {editing && keys.includes(editing) && editor}
  </section>
)

/**
 * /settings/stakes — preset buttons (get-user-stake / save-user-stake). Selecting a preset opens
 * an inline editor for its label and value; the backend stores 10 exchange + 6 casino presets.
 */
export const StakesPage = () => {
  const [stake, setStake] = React.useState<Record<string, any> | null>(null)
  const [editing, setEditing] = React.useState<StakeKey | null>(null)
  const [draft, setDraft] = React.useState({ name: '', value: '' })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    UserService.getUserStake()
      .then((res) => setStake(withDefaults(res.data.data.userStake || {})))
      .catch((e) => {
        setStake(withDefaults({}))
        toast.error(e?.response?.data?.message || 'Could not load stakes')
      })
  }, [])

  const edit = (k: StakeKey) => {
    if (!stake) return
    setEditing(k)
    setErrors({})
    setDraft({ name: String(stake[k.name] ?? ''), value: String(stake[k.value] ?? '') })
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!stake || !editing) return
    if (!(Number(draft.value) > 0)) {
      setErrors({ [editing.value]: 'Enter a value greater than 0' })
      return
    }
    const next = { ...stake, [editing.name]: draft.name || draft.value, [editing.value]: draft.value }
    setSaving(true)
    UserService.updateUserStake(next)
      .then(() => {
        toast.success('Buttons Values Updated Successfully')
        setStake(next)
        setEditing(null)
      })
      .catch((err) => {
        setErrors(err?.response?.data?.errors || {})
        toast.error(err?.response?.data?.message || 'Could not save stakes')
      })
      .finally(() => setSaving(false))
  }

  const editor = editing && (
    <form onSubmit={save} className='tw-mt-3 tw-grid tw-gap-2 tw-rounded-md tw-bg-white tw-p-3 sm:tw-grid-cols-[1fr_1fr_auto_auto] sm:tw-items-end'>
      <label className='tw-block'>
        <span className='tw-mb-1 tw-block tw-text-meta tw-font-semibold tw-text-muted-fg'>Button label</span>
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder={draft.value || 'e.g. 1K'} className={inputClass} />
        {errors[editing.name] && <span className='tw-text-meta tw-text-red-600'>{errors[editing.name]}</span>}
      </label>
      <label className='tw-block'>
        <span className='tw-mb-1 tw-block tw-text-meta tw-font-semibold tw-text-muted-fg'>Stake value</span>
        <input autoFocus type='number' inputMode='numeric' min={1} value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} className={inputClass} />
        {errors[editing.value] && <span className='tw-text-meta tw-text-red-600'>{errors[editing.value]}</span>}
      </label>
      <button type='submit' disabled={saving} className={primary}>
        {saving ? 'Saving…' : 'Save'}
      </button>
      <button type='button' onClick={() => setEditing(null)} className='tw-h-11 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-5 tw-text-strong'>
        Cancel
      </button>
    </form>
  )

  return (
    <div className='ua-ui'>
      <Back title='Stakes' />
      <div className={`${card} tw-mx-auto tw-max-w-5xl`}>
        <h2 className='tw-m-0 tw-mb-3 tw-text-strong tw-uppercase tw-tracking-widest'>Stakes</h2>
        {!stake ? (
          <div className='tw-h-40 tw-animate-pulse tw-rounded tw-bg-gray-100' />
        ) : (
          <>
            <StakeGroup title='Exchange Games' hint='Select a preset to edit the stake used for exchange bets.' keys={GAME_KEYS} stake={stake} editing={editing} onEdit={edit} editor={editor} />
            <StakeGroup title='Casino Games' hint='Select a preset to edit the stake used for casino games.' keys={CASINO_KEYS} stake={stake} editing={editing} onEdit={edit} editor={editor} />
          </>
        )}
      </div>
    </div>
  )
}

const METHODS = [
  { key: 'telegram', label: 'Telegram', text: 'Enter your login password to get a connection ID, then send it to our Telegram bot to link your account.' },
  { key: 'google', label: 'Google Authenticator', text: 'Enter your login password to get a QR code, scan it with Google Authenticator and confirm the 6-digit code.' },
] as const

/**
 * /settings/security — two-factor toggle like the reference site. There is no 2FA API in this
 * backend (the legacy page had none either), so turning it on only previews the setup steps;
 * the status stays "Disabled" and nothing can be submitted.
 */
export const SecurityPage = () => {
  const [on, setOn] = React.useState(false)
  const [method, setMethod] = React.useState<typeof METHODS[number]['key']>('telegram')
  const current = METHODS.find((m) => m.key === method)!
  return (
    <div className='ua-ui'>
      <Back title='Security' />
      <div className={card}>
        <div className='tw-mx-auto tw-max-w-4xl'>
          <h2 className='tw-m-0 tw-mb-3 tw-text-strong tw-uppercase tw-tracking-widest'>Security</h2>
          <section className='tw-rounded-ua tw-border tw-border-solid tw-border-line tw-bg-muted tw-p-4 sm:tw-p-6'>
            <div className='tw-flex tw-items-start tw-gap-4'>
              <button
                type='button'
                role='switch'
                aria-checked={on}
                aria-label='Two-factor authentication'
                onClick={() => setOn((v) => !v)}
                className={`tw-relative tw-mt-0.5 tw-flex tw-h-9 tw-w-[74px] tw-shrink-0 tw-items-center tw-rounded-full tw-px-1 tw-transition-colors ${on ? 'tw-bg-primary' : 'tw-bg-gray-200'}`}
              >
                <span className={`tw-h-7 tw-w-7 tw-rounded-full tw-bg-white tw-shadow tw-transition-transform ${on ? 'tw-translate-x-[38px]' : ''}`} />
                <span className={`tw-absolute tw-text-[11px] tw-font-bold ${on ? 'tw-left-3 tw-text-white' : 'tw-right-3 tw-text-muted-fg'}`}>{on ? 'ON' : 'OFF'}</span>
              </button>
              <div className='tw-min-w-0 tw-flex-1'>
                <h3 className='tw-m-0 tw-text-section'>Two-factor authentication</h3>
                <p className='tw-m-0 tw-mt-1 tw-text-body tw-text-muted-fg'>Turn this on to choose Telegram or Google Authenticator for login verification.</p>
              </div>
              <span className='tw-hidden tw-shrink-0 tw-rounded-full tw-border tw-border-solid tw-border-line tw-bg-white tw-px-4 tw-py-1.5 tw-text-meta tw-font-bold sm:tw-block'>Disabled</span>
            </div>

            {on && (
              <div className='tw-mt-5 tw-border-0 tw-border-t tw-border-solid tw-border-line tw-pt-5'>
                <div role='radiogroup' aria-label='Verification method' className='tw-mb-3 tw-grid tw-gap-2 sm:tw-grid-cols-2'>
                  {METHODS.map((m) => (
                    <button
                      key={m.key}
                      type='button'
                      role='radio'
                      aria-checked={method === m.key}
                      onClick={() => setMethod(m.key)}
                      className={`tw-h-11 tw-rounded-md tw-border tw-border-solid tw-text-strong ${method === m.key ? 'tw-border-primary tw-bg-primary tw-text-white' : 'tw-border-line tw-bg-white'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <p className='tw-m-0 tw-mb-3 tw-text-body'>{current.text}</p>
                <div className='tw-flex tw-flex-col tw-gap-2 sm:tw-flex-row'>
                  <input type='password' placeholder='Enter your login password' aria-label='Login password' className={inputClass} disabled />
                  <button type='button' disabled className={`${primary} tw-shrink-0 tw-whitespace-nowrap disabled:tw-bg-gray-400`}>
                    {method === 'telegram' ? 'Get Connection ID' : 'Get QR Code'}
                  </button>
                </div>
                <p className='tw-m-0 tw-mt-3 tw-rounded-md tw-bg-amber-50 tw-px-3 tw-py-2 tw-text-meta tw-text-amber-800'>
                  Two-factor setup is not connected to the server yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
