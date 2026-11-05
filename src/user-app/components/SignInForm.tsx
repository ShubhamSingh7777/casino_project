import React from 'react'
import { Link } from 'react-router-dom'
import User from '../../models/User'
import api from '../../utils/api'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import { loginAction } from '../../redux/actions/login/login.action'
import { LuEye, LuEyeOff, LuLogIn } from '../icons'
import { DEV_GUEST, isDevGuestCredentials, setDevGuest, USER_DEV_LOGIN } from '../../shared/dev-auth'

const inputWrap =
  'tw-flex tw-h-11 tw-items-center tw-rounded-md tw-border tw-border-solid tw-border-line tw-bg-white tw-px-3 focus-within:tw-border-primary'
const inputClass = 'tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-[15px] tw-outline-none'

/**
 * Real login (same flow as the legacy /login page): loginAction with the IP `logs`
 * payload, plus "Login with Demo ID". Calls onSuccess once the login completes.
 */
const SignInForm = ({ onSuccess, onRegister }: { onSuccess?: () => void; onRegister?: () => void }) => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const [form, setForm] = React.useState<User>({ username: '', password: '', logs: '', isDemo: false })
  const [showPassword, setShowPassword] = React.useState(false)
  const submitted = React.useRef(false)

  React.useEffect(() => {
    api
      .get(`${process.env.REACT_APP_IP_API_URL}`)
      .then((res) => setForm((f) => ({ ...f, logs: res.data })))
      .catch(() => undefined)
  }, [])

  React.useEffect(() => {
    if (submitted.current && userState.status === 'done') {
      submitted.current = false
      onSuccess?.()
    }
  }, [userState.status])

  const submit = (isDemo: boolean) => {
    // dev-only: the guest credentials start a local session instead of calling the API
    if (!isDemo && isDevGuestCredentials(form.username, form.password || '')) {
      setDevGuest(true)
      onSuccess?.()
      return
    }
    submitted.current = true
    localStorage.setItem('isDemo', String(isDemo))
    dispatch(loginAction({ ...form, isDemo }))
  }

  const loading = userState.status === 'loading'
  // only show errors from this form's own attempt (user-info failures also land in userState.error)
  const error = submitted.current && userState.status === 'failed' ? userState.error : ''

  return (
    <form
      className='tw-flex tw-flex-col tw-gap-3'
      onSubmit={(e) => {
        e.preventDefault()
        submit(false)
      }}
    >
      <label className={inputWrap}>
        <input
          name='username'
          autoComplete='username'
          placeholder='Username'
          aria-label='Username'
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className={inputWrap}>
        <input
          name='password'
          type={showPassword ? 'text' : 'password'}
          autoComplete='current-password'
          placeholder='Password'
          aria-label='Password'
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputClass}
        />
        <button
          type='button'
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((s) => !s)}
          className='tw-p-1 tw-text-gray-500'
        >
          {showPassword ? <LuEyeOff className='tw-h-5 tw-w-5' /> : <LuEye className='tw-h-5 tw-w-5' />}
        </button>
      </label>

      {error && <p className='tw-m-0 tw-text-sm tw-text-red-600'>{String(error)}</p>}

      <button
        type='submit'
        disabled={loading}
        className='tw-flex tw-h-11 tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-bg-primary tw-font-bold tw-text-white disabled:tw-opacity-70'
      >
        {loading ? 'Signing in…' : 'Sign in'} <LuLogIn className='tw-h-4 tw-w-4' />
      </button>
      <button
        type='button'
        disabled={loading}
        onClick={() => submit(true)}
        className='tw-flex tw-h-11 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-primary tw-font-bold tw-text-primary disabled:tw-opacity-70'
      >
        Login with Demo ID
      </button>
      {USER_DEV_LOGIN && (
        <p className='tw-m-0 tw-rounded-md tw-bg-amber-50 tw-px-3 tw-py-2 tw-text-center tw-text-xs tw-text-amber-800'>
          Dev only: sign in with <b>{DEV_GUEST.username}</b> / <b>{DEV_GUEST.password}</b> to see the logged-in pages.
        </p>
      )}
      <p className='tw-m-0 tw-text-center tw-text-sm'>
        Don&apos;t have an account?{' '}
        <Link to='/register' onClick={onRegister} className='tw-font-bold tw-text-blue-600'>
          Register here
        </Link>
      </p>
    </form>
  )
}

export default SignInForm
