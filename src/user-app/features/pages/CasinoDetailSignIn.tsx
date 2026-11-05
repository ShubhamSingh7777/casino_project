import React from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useUserSession } from '../../hooks/useUserSession'
import SignInForm from '../../components/SignInForm'
import { SignInHeading } from '../../components/SignInModal'
import '../../styles/user-app.css'

/**
 * /casino-detail/:gameCode/:matchId (v2 §5 / §9): standalone page without the app shell.
 * Logged in (or once signed in here) → the game itself.
 */
const CasinoDetailSignIn = () => {
  const { gameCode, matchId } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn } = useUserSession()
  const gamePath = `/casino/${gameCode}/${matchId}`

  if (isLoggedIn) return <Navigate to={gamePath} replace />

  return (
    <div id='ua-root'>
      <div className='ua-ui tw-flex tw-min-h-[100dvh] tw-items-center tw-justify-center tw-bg-white tw-p-4'>
        <div className='tw-w-full tw-max-w-[420px] tw-rounded-xl tw-border tw-border-solid tw-border-line tw-p-5'>
          <SignInHeading />
          <SignInForm onSuccess={() => navigate(gamePath, { replace: true })} />
          <Link to='/' className='tw-mt-4 tw-block tw-text-center tw-text-body tw-font-semibold tw-underline'>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CasinoDetailSignIn
