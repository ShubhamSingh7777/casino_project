import React from 'react'
import { AxiosResponse } from 'axios'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import UserService from '../../../../services/user.service'
import { Modal } from '../../../ui/Modal'
import { Button } from '../../../ui/Button'
import { handleModalError, Input, ReadonlyBox, Row, success, TextArea } from './fields'

type Form = { amount: string; narration: string; transactionPassword: string }

/**
 * GIVE (deposit, green) / TAKE (withdraw, red) — spec §5.2/5.3.
 * Validation, payload (balanceUpdateType D/W) and API are the legacy DepositModal / WithdrawModal ones.
 */
const GiveTakeModal = ({ variant, user, open, onClose }: { variant: 'give' | 'take'; user: any; open: boolean; onClose: (changed: boolean) => void }) => {
  const give = variant === 'give'
  const parentBal = Number(user?.parentBalance?.balance || 0)
  const childBal = Number(user?.balance?.balance || 0)
  const pl = Number(user?.balance?.profitLoss || 0)

  const schema = React.useMemo(() => {
    let amount = Yup.number()
      .required('Amount is required')
      .transform((v) => (isNaN(v) ? 0 : +v))
      .min(1, 'Amount is required')
    // give: limited by the parent's balance (not for admin); take: limited by the child's balance
    if (give && user?.role !== 'admin') amount = amount.max(parentBal, `Max ${parentBal} limit`)
    if (!give) amount = amount.max(childBal, `Max ${childBal} limit`)
    return Yup.object().shape({
      narration: give ? Yup.string().required('Remark is required') : Yup.string().required('Remark is required').trim(),
      transactionPassword: Yup.string().required('Transaction Password is required'),
      amount,
    })
  }, [give, user, parentBal, childBal])

  const { register, handleSubmit, reset, watch, formState } = useForm<Form>({ resolver: yupResolver(schema) as any })
  const [passwordError, setPasswordError] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const amount = Number(watch('amount')) || 0

  React.useEffect(() => {
    if (!open) {
      reset()
      setPasswordError('')
    }
  }, [open])

  const onSubmit = handleSubmit((data) => {
    setSaving(true)
    UserService.updateDepositBalance({
      ...data,
      userId: user?._id,
      parentUserId: user?.role === 'admin' ? user?._id : user?.parentId,
      balanceUpdateType: give ? 'D' : 'W',
    })
      .then((res: AxiosResponse) => {
        if (res.data?.error === true) return setPasswordError(res.data?.message || 'Transaction Password not matched')
        success(give ? 'Deposit Balance Updated Successfully' : 'Balance Withdrawal Successfully')
        onClose(true)
      })
      .catch((e) => handleModalError(e, setPasswordError))
      .finally(() => setSaving(false))
  })

  const after = (base: number, sign: 1 | -1) => (amount ? (base + sign * amount).toFixed(2) : base.toFixed(2))

  return (
    <Modal open={open} title={give ? 'Deposit' : 'Withdraw'} tone={give ? 'success' : 'danger'} onClose={() => onClose(false)}>
      {!user ? (
        <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
      ) : (
        <form onSubmit={onSubmit}>
          <Row label={user?.parent?.username || 'Parent'}>
            <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
              <ReadonlyBox value={parentBal.toFixed(2)} />
              <ReadonlyBox value={after(parentBal, give ? -1 : 1)} />
            </div>
          </Row>
          <Row label={user?.username}>
            <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
              <ReadonlyBox value={childBal.toFixed(2)} />
              <ReadonlyBox value={after(childBal, give ? 1 : -1)} />
            </div>
          </Row>
          <Row label='Profit/Loss'>
            <div className='tw-grid tw-grid-cols-2 tw-gap-2'>
              <ReadonlyBox value={pl.toFixed(2)} />
              <ReadonlyBox value={pl.toFixed(2)} />
            </div>
          </Row>
          <Row label='Amount' error={formState.errors.amount?.message}>
            <Input type='number' inputMode='decimal' className='tw-text-right' {...register('amount')} />
          </Row>
          <Row label='Remark' error={formState.errors.narration?.message}>
            <TextArea {...register('narration')} />
          </Row>
          <Row label='Master Password' error={formState.errors.transactionPassword?.message || passwordError}>
            <Input type='password' autoComplete='off' {...register('transactionPassword')} />
          </Row>
          <div className='tw-flex tw-justify-end'>
            <Button type='submit' variant={give ? 'success' : 'danger'} disabled={saving}>
              {saving ? 'Saving…' : 'submit ⇥'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default GiveTakeModal
