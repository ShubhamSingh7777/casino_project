import React from 'react'
import { AxiosResponse } from 'axios'
import ISport from '../../../../models/ISport'
import { RoleType } from '../../../../models/User'
import userService from '../../../../services/user.service'
import { useAppSelector } from '../../../../redux/hooks'
import { selectSportList } from '../../../../redux/actions/sports/sportSlice'
import { Modal } from '../../../ui/Modal'
import { Button, inputClass } from '../../../ui/Button'
import { handleModalError, Input, Row, success } from './fields'

type Setting = { minBet: string; maxBet: string; delay: string }
const FIELDS: Array<{ key: keyof Setting; label: string }> = [
  { key: 'minBet', label: 'Min Bet' },
  { key: 'maxBet', label: 'Max Bet' },
  { key: 'delay', label: 'Delay' },
]
// the legacy modal only edits Cricket, Football and Tennis
const SPORT_IDS = [4, 1, 2]

/**
 * General Settings (per-sport min/max bet + delay) — the legacy GeneralSettingsModal rules and
 * save-general-setting payload, in the admin modal style. Limits are capped by the parent's settings.
 */
const GeneralSettingsModal = ({ user, open, onClose }: { user: any; open: boolean; onClose: (changed: boolean) => void }) => {
  const sports = useAppSelector<{ sports: ISport[] }>(selectSportList).sports || []
  const shown = SPORT_IDS.map((id) => sports.find((s) => Number(s.sportId) === id)).filter(Boolean) as ISport[]
  const [values, setValues] = React.useState<Record<number, Setting>>({})
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const parentSetting = user?.parent?.userSetting || {}

  React.useEffect(() => {
    if (!open || !user) return
    const source = user.userSetting || user.parent?.userSetting || {}
    const next: Record<number, Setting> = {}
    SPORT_IDS.forEach((id) => {
      const s = source[id] || {}
      next[id] = { minBet: String(s.minBet ?? ''), maxBet: String(s.maxBet ?? ''), delay: String(s.delay ?? '') }
    })
    setValues(next)
    setPassword('')
    setError('')
  }, [open, user])

  const capOf = (id: number, key: keyof Setting) => (user?.role !== RoleType.admin ? parentSetting?.[id]?.[key] : undefined)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return setError('Transaction Password is required')
    for (const id of SPORT_IDS) {
      for (const f of FIELDS) {
        const cap = capOf(id, f.key)
        if (cap != null && values[id]?.[f.key] !== '' && Number(values[id]?.[f.key]) > Number(cap)) {
          return setError(`${f.label} for ${shown.find((s) => Number(s.sportId) === id)?.name || id} can be at most ${cap}`)
        }
      }
    }
    setError('')
    setSaving(true)
    const userSetting: Record<number, any> = {}
    SPORT_IDS.forEach((id) => {
      userSetting[id] = { minBet: Number(values[id]?.minBet) || 0, maxBet: Number(values[id]?.maxBet) || 0, delay: Number(values[id]?.delay) || 0 }
    })
    userService
      .saveGeneralSetting({ userId: user?._id, userSetting, transactionPassword: password })
      .then((res: AxiosResponse) => {
        success(res.data?.message || 'Settings saved')
        onClose(true)
      })
      .catch((err) => handleModalError(err, setError))
      .finally(() => setSaving(false))
  }

  return (
    <Modal open={open} title={`General Settings · ${user?.username || ''}`} onClose={() => onClose(false)}>
      {!user ? (
        <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
      ) : (
        <form onSubmit={submit}>
          <h3 className='tw-mb-2 tw-text-[13px] tw-font-semibold tw-uppercase'>Sport Settings</h3>
          <div className='tw-mb-4 tw-overflow-x-auto'>
            <table className='tw-w-full tw-border-collapse tw-text-[13px] tw-text-white'>
              <thead>
                <tr className='tw-bg-black/30'>
                  <th className='tw-p-2 tw-text-left' />
                  {shown.map((s) => (
                    <th key={s._id} className='tw-p-2 tw-text-left tw-font-semibold tw-text-white'>
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f) => (
                  <tr key={f.key} className='tw-border-0 tw-border-b tw-border-solid tw-border-white/10'>
                    <td className='tw-p-2 tw-font-semibold tw-text-white'>{f.label}</td>
                    {shown.map((s) => {
                      const id = Number(s.sportId)
                      const cap = capOf(id, f.key)
                      return (
                        <td key={s._id} className='tw-p-2'>
                          <input
                            type='number'
                            min={0}
                            aria-label={`${f.label} ${s.name}`}
                            value={values[id]?.[f.key] ?? ''}
                            placeholder={cap != null ? `max ${cap}` : ''}
                            onChange={(e) => setValues((v) => ({ ...v, [id]: { ...v[id], [f.key]: e.target.value } }))}
                            className={`${inputClass} tw-min-w-[90px]`}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Row label='Master Password' error={error}>
            <Input type='password' autoComplete='off' value={password} onChange={(e) => setPassword(e.target.value)} />
          </Row>
          <div className='tw-flex tw-justify-end tw-gap-2'>
            <Button variant='light' onClick={() => onClose(false)}>
              Back
            </Button>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving…' : 'submit ⇥'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default GeneralSettingsModal
