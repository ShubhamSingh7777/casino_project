import React from 'react'
import { useEscape } from '../../user-app/hooks/useClickOutside'
import { LuX } from './icons'

const HEADER = { default: 'tw-bg-ad-bg', success: 'tw-bg-ad-success', danger: 'tw-bg-ad-danger' }

/** Top-sheet modal (spec §5): coloured header + white ✕, navy body. */
export const Modal = ({
  open,
  title,
  onClose,
  tone = 'default',
  width = 'tw-max-w-3xl',
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  tone?: keyof typeof HEADER
  width?: string
  children: React.ReactNode
}) => {
  useEscape(onClose, open)
  if (!open) return null
  return (
    <div className='ad-ui tw-fixed tw-inset-0 tw-z-[90] tw-flex tw-justify-center tw-overflow-y-auto tw-bg-black/60 tw-p-2 sm:tw-p-6'>
      <div role='dialog' aria-modal='true' aria-label={title} className={`tw-h-max tw-w-full ${width} tw-overflow-hidden tw-rounded tw-bg-ad-modal tw-shadow-2xl`}>
        <div className={`tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 ${HEADER[tone]}`}>
          <h2 className='tw-text-[14px] tw-font-semibold tw-uppercase'>{title}</h2>
          <button type='button' aria-label='Close' onClick={onClose} className='tw-p-1'>
            <LuX className='tw-h-5 tw-w-5' />
          </button>
        </div>
        <div className='tw-p-4'>{children}</div>
      </div>
    </div>
  )
}

/** Underline (default) or pill tab row. */
export const Tabs = <T extends string>({
  tabs,
  active,
  onChange,
  variant = 'box',
}: {
  tabs: Array<{ key: T; label: string }>
  active: T
  onChange: (key: T) => void
  variant?: 'box' | 'pill'
}) => (
  <div role='tablist' className='ua-no-scrollbar tw-mb-3 tw-flex tw-gap-1 tw-overflow-x-auto'>
    {tabs.map((t) => {
      const on = t.key === active
      return (
        <button
          key={t.key}
          role='tab'
          type='button'
          aria-selected={on}
          onClick={() => onChange(t.key)}
          className={`tw-h-9 tw-shrink-0 tw-px-4 tw-text-[13px] tw-font-semibold ${
            variant === 'pill'
              ? `tw-rounded-full ${on ? 'tw-bg-ad-pill' : 'tw-bg-ad-item'}`
              : `tw-rounded ${on ? 'tw-bg-black/40' : 'tw-bg-ad-item hover:tw-bg-white/25'}`
          }`}
        >
          {t.label}
        </button>
      )
    })}
  </div>
)

export const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button
    type='button'
    role='switch'
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`tw-relative tw-h-5 tw-w-9 tw-rounded-full tw-transition-colors ${checked ? 'tw-bg-ad-success' : 'tw-bg-white/30'}`}
  >
    <span className={`tw-absolute tw-top-0.5 tw-h-4 tw-w-4 tw-rounded-full tw-bg-white tw-transition-all ${checked ? 'tw-left-[18px]' : 'tw-left-0.5'}`} />
  </button>
)
