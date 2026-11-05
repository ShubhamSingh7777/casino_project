import React from 'react'
import { useEscape } from '../hooks/useClickOutside'

type SheetProps = {
  open: boolean
  onClose: () => void
  side: 'left' | 'right' | 'bottom'
  label: string
  className?: string
  /** right sheet only: 560px, 680px from 2xl (search drawer) */
  wide?: boolean
  children: React.ReactNode
}

const PANEL_POSITION: Record<SheetProps['side'], string> = {
  left: 'tw-inset-y-0 tw-left-0 tw-w-[82%] tw-max-w-[330px]',
  right: 'tw-inset-y-0 tw-right-0 tw-w-[86%] tw-max-w-[360px]',
  bottom: 'tw-inset-x-0 tw-bottom-0 tw-max-h-[85dvh] tw-rounded-t-2xl',
}

const PANEL_HIDDEN: Record<SheetProps['side'], string> = {
  left: '-tw-translate-x-full',
  right: 'tw-translate-x-full',
  bottom: 'tw-translate-y-full',
}

/** Minimal slide-over panel with overlay, Esc-to-close and body scroll lock. */
const Sheet = ({ open, onClose, side, label, className = '', wide, children }: SheetProps) => {
  useEscape(onClose, open)

  React.useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className={`tw-fixed tw-inset-0 tw-z-50 ${open ? '' : 'tw-pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`tw-absolute tw-inset-0 tw-bg-black/60 tw-transition-opacity tw-duration-200 ${
          open ? 'tw-opacity-100' : 'tw-opacity-0'
        }`}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-label={label}
        className={`tw-absolute tw-flex tw-flex-col tw-bg-white tw-shadow-2xl tw-transition-transform tw-duration-200 ${
          wide && side === 'right' ? 'tw-inset-y-0 tw-right-0 tw-w-full tw-max-w-[560px] 2xl:tw-max-w-[680px]' : PANEL_POSITION[side]
        } ${open ? 'tw-translate-x-0 tw-translate-y-0' : PANEL_HIDDEN[side]} ${className}`}
      >
        {open && children}
      </div>
    </div>
  )
}

export default Sheet
