import React from 'react'
import { AxiosResponse } from 'axios'
import { useLocation } from 'react-router-dom'
import User from '../../models/User'
import userService from '../../services/user.service'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import { formatMoney } from '../../user-app/utils/format'

const tone = (label: string, n: number) => (label === 'Exposure' || n <= 0 ? 'tw-text-ad-danger' : 'tw-text-ad-success')

/**
 * Balance strip (spec §1.2). Only figures the API actually returns are shown
 * (get-user-balance + the user's credit reference); spec-only figures are not invented.
 */
const BalanceStrip = () => {
  const { user } = useAppSelector<{ user: User }>(selectUserData)
  const { pathname } = useLocation()
  const [bal, setBal] = React.useState<any>(null)

  React.useEffect(() => {
    userService
      .getUserBalance()
      .then((res: AxiosResponse) => setBal(res.data?.data || null))
      .catch(() => setBal(null))
  }, [pathname])

  const items: Array<[string, number]> = [
    ['Balance', Number(bal?.balance ?? 0)],
    ['Exposure', Number(bal?.exposer ?? 0)],
    ['Credit pts', Number(user.creditRefrences ?? 0)],
  ]
  if (bal?.profitLoss != null) items.push(['P/L', Number(bal.profitLoss)])

  return (
    <div className='tw-mb-3 tw-flex tw-flex-wrap tw-gap-x-4 tw-gap-y-1 tw-rounded tw-bg-ad-card tw-px-3 tw-py-2 tw-text-[12px] tw-font-bold'>
      {items.map(([label, value]) => (
        <span key={label}>
          {label} : <span className={tone(label, value)}>{formatMoney(value)}</span>
        </span>
      ))}
    </div>
  )
}

export default BalanceStrip
