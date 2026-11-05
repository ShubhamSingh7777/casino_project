import React from 'react'
import { useUi } from '../context/UiContext'
import { useEscape } from '../hooks/useClickOutside'
import { LuX } from '../icons'
import SignInForm from './SignInForm'

export const SignInHeading = () => (
  <div className='tw-mb-4 tw-flex tw-flex-col tw-items-center tw-gap-1 tw-text-center'>
    <img src='/imgs/logo.png' alt='Logo' className='tw-mb-2 tw-h-10 tw-w-auto tw-rounded tw-bg-primary tw-px-3 tw-py-1' />
    <h2 className='tw-text-xl tw-font-bold'>Sign In</h2>
    <p className='tw-m-0 tw-text-sm tw-text-gray-500'>Sign in to continue</p>
  </div>
)

const SignInModal = () => {
  const { signInOpen, setSignInOpen } = useUi()
  const close = React.useCallback(() => setSignInOpen(false), [setSignInOpen])
  useEscape(close, signInOpen)

  if (!signInOpen) return null

  return (
    <div className='tw-fixed tw-inset-0 tw-z-[70] tw-flex tw-items-center tw-justify-center tw-p-2'>
      <div className='tw-absolute tw-inset-0 tw-bg-black/60' onClick={close} />
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Sign in'
        className='tw-relative tw-w-full tw-max-w-[420px] tw-rounded-xl tw-bg-white tw-p-5 tw-shadow-2xl'
      >
        <button type='button' aria-label='Close sign in' onClick={close} className='tw-absolute tw-right-3 tw-top-3 tw-p-1 tw-text-gray-500'>
          <LuX className='tw-h-5 tw-w-5' />
        </button>
        <SignInHeading />
        <SignInForm onSuccess={close} onRegister={close} />
      </div>
    </div>
  )
}

export default SignInModal
