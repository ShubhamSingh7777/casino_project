import React from 'react'
import { useUi } from '../../context/UiContext'
import { useEscape } from '../../hooks/useClickOutside'
import BetslipContent from './BetslipContent'

/**
 * Betslip below xl (v2 §8): bottom sheet on mobile, centred dialog on tablet.
 * On xl the AppShell shows BetslipContent as a fixed right panel instead.
 */
const BetslipOverlay = () => {
  const { betslipOpen, setBetslipOpen } = useUi()
  const hide = React.useCallback(() => setBetslipOpen(false), [setBetslipOpen])
  useEscape(hide, betslipOpen)

  if (!betslipOpen) return null

  return (
    <div className='tw-fixed tw-inset-0 tw-z-50 tw-flex tw-items-end tw-justify-center md:tw-items-center md:tw-p-4 xl:tw-hidden'>
      <div className='tw-absolute tw-inset-0 tw-bg-black/60' onClick={hide} />
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Betslip'
        className='tw-relative tw-flex tw-max-h-[70dvh] tw-w-full tw-flex-col tw-overflow-hidden tw-rounded-t-2xl tw-shadow-2xl md:tw-max-h-[85dvh] md:tw-max-w-[420px] md:tw-rounded-xl'
      >
        <BetslipContent onHide={hide} />
      </div>
    </div>
  )
}

export default BetslipOverlay
