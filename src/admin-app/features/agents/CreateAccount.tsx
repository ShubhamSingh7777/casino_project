import React from 'react'
import { useParams } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import User, { RoleName, RoleType } from '../../../models/User'
import UserService from '../../../services/user.service'
import { useAppSelector } from '../../../redux/hooks'
import { selectUserData } from '../../../redux/actions/login/loginSlice'
import { Card, PageHeader } from '../../ui/PageHeader'
import { useAdminRole } from '../../dev-auth'
import { Button, inputClass, labelClass } from '../../ui/Button'

// Partnership is only taken for cricket (sport 4), like the legacy add-user page.
const PARTNERSHIP_SPORT = 4

// Validation copied from the legacy add-user page.
const schema = Yup.object().shape({
  username: Yup.string()
    .trim('User name cannot include leading and trailing spaces')
    .strict(true)
    .required('Username is required')
    .matches(/^(?=.*\d)[A-Z][A-Za-z0-9]*$/, 'Must start with a capital letter and contain a number'),
  transactionPassword: Yup.string().required('Transaction Password is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[A-Za-z0-9]{8,32}$/, 'Use upper case, lower case and a digit (letters/digits only)'),
  passwordConfirmation: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
  role: Yup.string().required('Role is required'),
  fullname: Yup.string().required('Full name is required'),
  creditRefrences: Yup.string().required('Credit Reference is required'),
  exposerLimit: Yup.string().when('role', { is: 'user', then: Yup.string().required('Exposer Limit is required') }),
})

/** Roles the logged-in level may create — legacy roleOption() rule (never admin; only levels below yours). */
const childRoles = (role?: string) => {
  const all = Object.keys(RoleName).filter((r) => r !== RoleType.admin)
  if (!role || role === RoleType.admin) return all
  return all.slice(all.indexOf(role) + 1)
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className='tw-mb-3 tw-block'>
    <span className={labelClass}>{label}</span>
    {children}
    {error && <span className='tw-mt-1 tw-block tw-text-[12px] tw-text-ad-danger'>{error}</span>}
  </label>
)

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='tw-rounded tw-bg-white/5 tw-p-3'>
    <h2 className='tw-mb-3 tw-border-0 tw-border-b tw-border-solid tw-border-white/10 tw-pb-2 tw-text-[13px] tw-font-semibold tw-uppercase'>{title}</h2>
    {children}
  </section>
)

/** Create Account (spec §4.4). /admin/add-user/:username creates under that agent. */
const CreateAccount = () => {
  const { username } = useParams()
  const me = useAppSelector<{ user: User }>(selectUserData).user
  const [parentUser, setParentUser] = React.useState<User>()
  const parent = parentUser || me
  const role0 = useAdminRole()

  React.useEffect(() => {
    if (username) UserService.getUserDetail(username).then((res: AxiosResponse<any>) => setParentUser(res.data.data))
  }, [username])

  const { register, handleSubmit, reset, watch, formState } = useForm<any>({ resolver: yupResolver(schema), mode: 'onChange' })
  const [saving, setSaving] = React.useState(false)
  const role = watch('role')
  const isUser = role === RoleType.user
  const upline = Number(parent?.partnership?.[PARTNERSHIP_SPORT]?.ownRatio ?? 0)
  const downline = Number(watch(`partnership.${PARTNERSHIP_SPORT}`) || 0)
  const e = formState.errors as any

  const onSubmit = handleSubmit((form: any) => {
    const data = { ...form }
    if (data.role !== RoleType.user) {
      // { [sportId]: ratio } — same shape the legacy page sends
      const partnership: Record<string, any> = {}
      ;(Array.isArray(data.partnership) ? data.partnership : []).forEach((v: any, i: number) => v !== undefined && (partnership[i] = v))
      data.partnership = partnership
      data.userSetting = {}
    }
    data.parent = parent?.username
    delete data.maxbet
    delete data.minbet
    delete data.delay
    delete data.partnershipOur
    setSaving(true)
    UserService.addUser(data)
      .then(() => {
        toast.success('User created Successfully', { position: 'top-right', autoClose: 1000, hideProgressBar: true, closeButton: false })
        reset()
      })
      .catch((err) => toast.error(err?.response?.data?.message || 'Could not create the account'))
      .finally(() => setSaving(false))
  })

  return (
    <div>
      <PageHeader title='Create Account' crumbs={['Users', 'Create Account']} />
      <Card>
        {username && <p className='tw-mb-3 tw-text-ad-muted'>Creating under {parent?.username}</p>}
        <form onSubmit={onSubmit} autoComplete='off'>
          <div className='tw-grid tw-gap-3 md:tw-grid-cols-2 xl:tw-grid-cols-4'>
            <Panel title='Information'>
              <Field label='Login Name *' error={e.username?.message}>
                <input placeholder='User Name' className={inputClass} {...register('username')} />
              </Field>
              <Field label='Full Name *' error={e.fullname?.message}>
                <input className={inputClass} {...register('fullname')} />
              </Field>
              <Field label='Password *' error={e.password?.message}>
                <input type='password' autoComplete='new-password' className={inputClass} {...register('password')} />
              </Field>
              <Field label='Confirm Password *' error={e.passwordConfirmation?.message}>
                <input type='password' autoComplete='new-password' className={inputClass} {...register('passwordConfirmation')} />
              </Field>
              <Field label='City'>
                <input className={inputClass} {...register('city')} />
              </Field>
              <Field label='Mobile Number'>
                <input inputMode='tel' className={inputClass} {...register('phone')} />
              </Field>
            </Panel>

            <Panel title='Credit'>
              <Field label='Credit Reference *' error={e.creditRefrences?.message}>
                <input type='number' className={inputClass} {...register('creditRefrences')} />
              </Field>
              {isUser && (
                <Field label='Exposure Limit *' error={e.exposerLimit?.message}>
                  <input type='number' className={inputClass} {...register('exposerLimit')} />
                </Field>
              )}
            </Panel>

            <Panel title='Account Details'>
              <Field label='User Type *' error={e.role?.message}>
                <select className={inputClass} {...register('role')} defaultValue=''>
                  <option value=''>Select User Type</option>
                  {childRoles(role0).map((r) => (
                    <option key={r} value={r}>
                      {RoleName[r]}
                    </option>
                  ))}
                </select>
              </Field>
              {role && !isUser && (
                <>
                  <p className='tw-mb-2 tw-text-[12px] tw-font-semibold'>Partnership Information (Cricket)</p>
                  <div className='tw-grid tw-grid-cols-3 tw-gap-2 tw-text-center tw-text-[12px]'>
                    <span className='tw-text-ad-muted'>Upline</span>
                    <span className='tw-text-ad-muted'>Downline</span>
                    <span className='tw-text-ad-muted'>Our</span>
                    <span className='tw-flex tw-h-9 tw-items-center tw-justify-center tw-rounded tw-bg-white/10'>{upline}</span>
                    <input type='number' min={0} max={upline} defaultValue={0} className={`${inputClass} tw-text-center`} {...register(`partnership.${PARTNERSHIP_SPORT}`)} />
                    <span className='tw-flex tw-h-9 tw-items-center tw-justify-center tw-rounded tw-bg-white/10'>{upline - downline}</span>
                  </div>
                </>
              )}
            </Panel>

            <Panel title='Confirm'>
              <Field label='Master Password *' error={e.transactionPassword?.message}>
                <input type='password' autoComplete='off' className={inputClass} {...register('transactionPassword')} />
              </Field>
              <Button type='submit' disabled={saving} className='tw-w-full'>
                {saving ? 'Creating…' : 'Submit'}
              </Button>
            </Panel>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default CreateAccount
