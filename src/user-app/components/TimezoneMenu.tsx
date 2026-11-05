import React from 'react'
import { LuChevronDown } from '../icons'
import { useUi } from '../context/UiContext'
import { TIMEZONES } from '../utils/format'
import { useClickOutside } from '../hooks/useClickOutside'

const TimezoneMenu = () => {
  const { timezone, setTimezone } = useUi()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className='tw-relative'>
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className='tw-flex tw-h-9 tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-white/25 tw-px-2 tw-text-[13px] tw-font-bold tw-text-white hover:tw-bg-white/10'
      >
        {timezone.label}
        <LuChevronDown className='tw-h-4 tw-w-4' />
      </button>
      {open && (
        <div
          role='menu'
          className='tw-absolute tw-right-0 tw-top-11 tw-z-50 tw-w-56 tw-overflow-hidden tw-rounded-ua tw-bg-white tw-py-1 tw-text-fg tw-shadow-xl'
        >
          {TIMEZONES.map((tz) => {
            const selected = tz.id === timezone.id
            return (
              <button
                key={tz.id}
                type='button'
                role='menuitemradio'
                aria-checked={selected}
                onClick={() => {
                  setTimezone(tz)
                  setOpen(false)
                }}
                className='tw-flex tw-w-full tw-items-center tw-gap-3 tw-px-3 tw-py-2 tw-text-left hover:tw-bg-muted'
              >
                <span className='tw-flex tw-h-4 tw-w-4 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-gray-400'>
                  {selected && <span className='tw-h-2 tw-w-2 tw-rounded-full tw-bg-primary' />}
                </span>
                <span className='tw-flex tw-flex-col'>
                  <span className='tw-text-sm tw-font-semibold'>{tz.title}</span>
                  <span className='tw-text-xs tw-text-gray-500'>{tz.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TimezoneMenu
