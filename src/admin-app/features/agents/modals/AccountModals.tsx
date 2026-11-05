import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import UserService from '../../../../services/user.service'
import { Modal, Toggle } from '../../../ui/Modal'
import { Button } from '../../../ui/Button'
import { handleModalError, Input, Row, success } from './fields'

type ModalProps = { user: any; open: boolean; onClose: (changed: boolean) => void }

const PASSWORD_RULE = /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[A-Za-z0-9]{8,32}$/

/** Change Password — legacy PasswordModal rules and update-user call. */
export const PasswordModal = ({ user, open, onClose }: ModalProps) => {
  const schema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(PASSWORD_RULE, 'contains at least one digit,one upper case,one lower case alphabet,'),
    confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password')], 'Passwords must match'),
    transactionPassword: Yup.string().required('Transaction Password is required'),
  })
  const { register, handleSubmit, reset, formState } = useForm<{ password: string; confirmPassword: string; transactionPassword: string }>({ resolver: yupResolver(schema) })
  const [passwordError, setPasswordError] = React.useState('')

  React.useEffect(() => {
    if (!open) reset()
    setPasswordError('')
  }, [open])

  const onSubmit = handleSubmit((data) =>
    UserService.updatePassword({ ...data, username: user?.username })
      .then(() => {
        success('Password Updated Successfully')
        onClose(true)
      })
      .catch((e) => handleModalError(e, setPasswordError)),
  )

  return (
    <Modal open={open} title={`Change Password · ${user?.username || ''}`} onClose={() => onClose(false)}>
      <form onSubmit={onSubmit}>
        <Row label='Password' error={formState.errors.password?.message}>
          <Input type='password' autoComplete='new-password' {...register('password')} />
        </Row>
        <Row label='Confirm Password' error={formState.errors.confirmPassword?.message}>
          <Input type='password' autoComplete='new-password' {...register('confirmPassword')} />
        </Row>
        <Row label='Master Password' error={formState.errors.transactionPassword?.message || passwordError}>
          <Input type='password' autoComplete='off' {...register('transactionPassword')} />
        </Row>
        <div className='tw-flex tw-justify-end'>
          <Button type='submit'>submit ⇥</Button>
        </div>
      </form>
    </Modal>
  )
}

/** User lock / Bet lock — legacy StatusModal (update-user-status). */
export const StatusModal = ({ user, open, onClose }: ModalProps) => {
  const [userActive, setUserActive] = React.useState(false)
  const [betActive, setBetActive] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')

  React.useEffect(() => {
    setUserActive(!!user?.isLogin)
    setBetActive(!!user?.betLock)
    setPassword('')
    setError('')
    setPasswordError('')
  }, [user, open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return setError('Transaction Password is required')
    UserService.updateUserAndBetStatus({ isUserActive: userActive, isUserBetActive: betActive, transactionPassword: password, username: user?.username })
      .then(() => {
        success('Status Updated Successfully')
        onClose(true)
      })
      .catch((err) => handleModalError(err, setPasswordError))
  }

  return (
    <Modal open={open} title={`Change User Status · ${user?.username || ''}`} onClose={() => onClose(false)}>
      <form onSubmit={submit}>
        <Row label='User Active'>
          <div className='tw-pt-2'>
            <Toggle checked={userActive} onChange={setUserActive} label='User active' />
          </div>
        </Row>
        <Row label='Bet Active'>
          <div className='tw-pt-2'>
            <Toggle checked={betActive} onChange={setBetActive} label='Bet active' />
          </div>
        </Row>
        <Row label='Master Password' error={error || passwordError}>
          <Input type='password' autoComplete='off' value={password} onChange={(e) => (setPassword(e.target.value), setError(''))} />
        </Row>
        <div className='tw-flex tw-justify-end'>
          <Button type='submit'>submit ⇥</Button>
        </div>
      </form>
    </Modal>
  )
}

/** Exposure limit (EXP) / Credit reference (CRD) — legacy ExposureCreditModal (update-user-wallet). */
export const LimitModal = ({ user, open, onClose, type }: ModalProps & { type: 'EXP' | 'CRD' }) => {
  const what = type === 'EXP' ? 'limit' : 'credit'
  const schema = Yup.object().shape({
    amount: Yup.number()
      .required(`New ${what} is required`)
      .transform((v) => (isNaN(v) ? 0 : +v))
      .min(0, `New ${what} is required`),
    transactionPassword: Yup.string().required('Transaction Password is required'),
  })
  const { register, handleSubmit, reset, formState } = useForm<{ amount: string; transactionPassword: string }>({ resolver: yupResolver(schema) as any })
  const [passwordError, setPasswordError] = React.useState('')
  const current = type === 'EXP' ? user?.exposerLimit : user?.creditRefrences

  React.useEffect(() => {
    if (!open) reset()
    setPasswordError('')
  }, [open])

  const onSubmit = handleSubmit((data) =>
    UserService.updateUserExposureAndCreditLimit({ ...data, username: user?.username, walletUpdateType: type })
      .then(() => {
        success(`${type === 'EXP' ? 'Limit' : 'Credit Referance'} Updated Successfully`)
        onClose(true)
      })
      .catch((e) => handleModalError(e, setPasswordError)),
  )

  return (
    <Modal open={open} title={`${type === 'EXP' ? 'Exposure Limit' : 'Credit Reference'} · ${user?.username || ''}`} onClose={() => onClose(false)}>
      <form onSubmit={onSubmit}>
        <Row label={`Old ${what}`}>
          <Input readOnly value={Number(current || 0).toFixed(2)} className='tw-text-right' />
        </Row>
        <Row label={`New ${what}`} error={formState.errors.amount?.message}>
          <Input type='number' inputMode='decimal' className='tw-text-right' {...register('amount')} />
        </Row>
        <Row label='Master Password' error={formState.errors.transactionPassword?.message || passwordError}>
          <Input type='password' autoComplete='off' {...register('transactionPassword')} />
        </Row>
        <div className='tw-flex tw-justify-end'>
          <Button type='submit'>submit ⇥</Button>
        </div>
      </form>
    </Modal>
  )
}
