import React from 'react'
import { toast } from 'react-toastify'
import { inputClass } from '../../../ui/Button'

/** Label left (≈1/3), control right (≈2/3) — spec §5. */
export const Row = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className='tw-mb-3 tw-grid tw-items-start tw-gap-1 sm:tw-grid-cols-[1fr_2fr] sm:tw-gap-3'>
    <span className='tw-pt-2 tw-text-[13px] tw-font-semibold'>{label}</span>
    <div>
      {children}
      {error && <p className='tw-mt-1 tw-text-[12px] tw-text-ad-danger'>{error}</p>}
    </div>
  </div>
)

export const ReadonlyBox = ({ value }: { value: React.ReactNode }) => (
  <div className='tw-flex tw-h-9 tw-items-center tw-justify-end tw-rounded tw-bg-white/10 tw-px-3 tw-text-[13px] tw-tabular-nums'>{value}</div>
)

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} className={`${inputClass} ${props.className || ''}`} />
))

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
  <textarea ref={ref} rows={3} {...props} className={`${inputClass} tw-h-auto tw-py-2 ${props.className || ''}`} />
))

/**
 * Error handling shared by the legacy modals: a "transaction password" error goes under the
 * Master Password field, anything else becomes a toast.
 */
export const handleModalError = (error: any, setPasswordError: (m: string) => void) => {
  const message = error?.response?.data?.message || 'Something went wrong'
  if (message === 'Transaction Password not matched' || message?.toLowerCase().includes('transaction password')) setPasswordError(message)
  else toast.error(message, { position: 'top-right', autoClose: 2000, hideProgressBar: true, closeButton: false })
}

export const success = (message: string) => toast.success(message, { position: 'top-right', autoClose: 1000, hideProgressBar: true, closeButton: false })
