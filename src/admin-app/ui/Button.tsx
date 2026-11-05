import React from 'react'

type Variant = 'primary' | 'light' | 'success' | 'danger' | 'info' | 'dark' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'tw-bg-ad-bg tw-text-white tw-border tw-border-solid tw-border-white/20 hover:tw-brightness-110',
  light: 'tw-bg-ad-light tw-text-[#212529] hover:tw-brightness-95',
  success: 'tw-bg-ad-success tw-text-white hover:tw-brightness-110',
  danger: 'tw-bg-ad-danger tw-text-white hover:tw-brightness-110',
  info: 'tw-bg-ad-info tw-text-white hover:tw-brightness-110',
  dark: 'tw-bg-ad-dark tw-text-white hover:tw-brightness-110',
  ghost: 'tw-bg-ad-item tw-text-white hover:tw-bg-white/25',
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'icon' }

/** Admin button (spec §2): primary navy, light Reset, green/red/blue/slate actions. */
export const Button = ({ variant = 'primary', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) => (
  <button
    type={type}
    className={`tw-inline-flex tw-items-center tw-justify-center tw-gap-1.5 tw-rounded tw-font-semibold disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${
      size === 'sm' ? 'tw-h-7 tw-px-2 tw-text-[12px]' : size === 'icon' ? 'tw-h-9 tw-w-9 tw-text-[13px]' : 'tw-h-9 tw-px-3 tw-text-[13px]'
    } ${VARIANTS[variant]} ${className}`}
    {...rest}
  />
)

/** Small square action button in tables (G / T / U / S / P). */
export const ActionSquare = ({ variant, label, title, onClick }: { variant: Variant; label: string; title: string; onClick: () => void }) => (
  <button
    type='button'
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`tw-flex tw-h-7 tw-w-7 tw-items-center tw-justify-center tw-rounded tw-text-[12px] tw-font-bold ${VARIANTS[variant]}`}
  >
    {label}
  </button>
)

export const inputClass =
  'tw-h-9 tw-w-full tw-rounded tw-border tw-border-solid tw-border-[#ced4da] tw-bg-white tw-px-3 tw-text-[13px] tw-text-[#495057] tw-outline-none focus:tw-border-ad-info'

export const labelClass = 'tw-mb-1 tw-block tw-text-[12px] tw-font-semibold tw-text-white'
