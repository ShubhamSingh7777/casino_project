import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useUserSession } from '../hooks/useUserSession'
import SignInForm from '../components/SignInForm'
import { SignInHeading } from '../components/SignInModal'

/** Pages behind login: logged-out visitors get a full-page Sign-In card instead of the page. */
const RequireAuth = () => {
  const { isLoggedIn } = useUserSession()
  if (isLoggedIn) return <Outlet />

  return (
    <div className='ua-ui tw-flex tw-justify-center tw-py-6'>
      <div className='tw-w-full tw-max-w-[420px] tw-rounded-xl tw-bg-white tw-p-5 tw-shadow-sm'>
        <SignInHeading />
        <SignInForm />
        <Link to='/' className='tw-mt-4 tw-block tw-text-center tw-text-sm tw-font-semibold tw-underline'>
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default RequireAuth
