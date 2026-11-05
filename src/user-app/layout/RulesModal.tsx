import React from 'react'
import { LuX } from '../icons'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectRules, setRules } from '../../redux/actions/common/commonSlice'
import { useEscape } from '../hooks/useClickOutside'
import Rules from '../../pages/Rules/rules'

/**
 * Rules popup opened from odds/casino pages via `setRules({ open: true })`.
 * The legacy header used to own it; the shell owns it now.
 */
const RulesModal = () => {
  const dispatch = useAppDispatch()
  const rules = useAppSelector(selectRules)
  const close = React.useCallback(() => dispatch(setRules({ open: false, type: '' })), [dispatch])
  useEscape(close, rules.open)

  if (!rules.open) return null

  return (
    <div className='tw-fixed tw-inset-0 tw-z-[60] tw-flex tw-items-center tw-justify-center tw-bg-black/60 tw-p-2'>
      <div role='dialog' aria-modal='true' aria-label='Rules' className='tw-flex tw-h-[90dvh] tw-w-full tw-max-w-5xl tw-flex-col tw-overflow-hidden tw-rounded-ua tw-bg-white'>
        <div className='ua-ui tw-flex tw-items-center tw-justify-between tw-bg-primary tw-px-4 tw-py-3 tw-font-bold tw-text-white'>
          Rules
          <button type='button' aria-label='Close rules' onClick={close} className='tw-p-1'>
            <LuX className='tw-h-5 tw-w-5' />
          </button>
        </div>
        <div className='tw-flex-1 tw-overflow-y-auto'>
          <Rules classData='col-md-12' />
        </div>
      </div>
    </div>
  )
}

export default RulesModal
