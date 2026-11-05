import React from 'react'
import { Link } from 'react-router-dom'
import { useUserSession } from '../hooks/useUserSession'

// A <div>, not <footer>: legacy footer.css styles the bare `footer` element.
const SiteFooter = () => {
  const { isLoggedIn } = useUserSession()
  return (
    <div className='tw-mb-2 tw-flex tw-items-center tw-justify-between tw-rounded-ua tw-bg-white tw-px-4 tw-py-4 tw-text-meta tw-text-muted-fg'>
      <span className='tw-flex tw-gap-4'>
        <Link to='/page/privacy-policy' className='tw-font-semibold tw-text-fg tw-underline'>
          Privacy &amp; Policy
        </Link>
        {isLoggedIn && (
          <Link to='/rules' className='tw-font-semibold tw-text-fg tw-underline'>
            Rules
          </Link>
        )}
      </span>
      <span>© 2016-{new Date().getFullYear()}</span>
    </div>
  )
}

export default SiteFooter
