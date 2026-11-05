import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuArrowLeft, LuCompass, LuHouse } from '../../icons'

/** Unknown routes (v2 §5.11). */
const NotFoundPage = () => {
  const navigate = useNavigate()
  return (
    <div className='ua-ui tw-mb-2 tw-flex tw-justify-center tw-rounded-ua tw-bg-white tw-px-4 tw-py-12'>
      <div className='tw-flex tw-max-w-[420px] tw-flex-col tw-items-center tw-gap-2 tw-text-center'>
        <span className='tw-flex tw-h-14 tw-w-14 tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100'>
          <LuCompass className='tw-h-7 tw-w-7 tw-text-muted-fg' />
        </span>
        <p className='tw-m-0 tw-text-meta tw-uppercase tw-tracking-[0.2em] tw-text-muted-fg'>Error 404</p>
        <h1 className='tw-text-title'>Page not found</h1>
        <p className='tw-m-0 tw-text-body tw-text-muted-fg'>
          The page may have moved, the event may have finished, or the address may be incorrect.
        </p>
        <div className='tw-mt-3 tw-flex tw-gap-2'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='tw-flex tw-h-10 tw-items-center tw-gap-1.5 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-4 tw-text-strong'
          >
            <LuArrowLeft className='tw-h-4 tw-w-4' /> Go back
          </button>
          <Link to='/' className='tw-flex tw-h-10 tw-items-center tw-gap-1.5 tw-rounded-md tw-bg-primary tw-px-4 tw-text-strong tw-text-white'>
            <LuHouse className='tw-h-4 tw-w-4' /> Go to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
