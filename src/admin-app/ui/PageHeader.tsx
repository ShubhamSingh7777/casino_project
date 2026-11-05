import React from 'react'
import { Link } from 'react-router-dom'

/** UPPERCASE title left, `Home / Page` breadcrumb right (spec §1.4). */
export const PageHeader = ({ title, crumbs = [], actions }: { title: string; crumbs?: string[]; actions?: React.ReactNode }) => (
  <div className='tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2'>
    <div className='tw-flex tw-items-center tw-gap-2'>
      <h1 className='tw-text-[14px] tw-font-semibold tw-uppercase tw-tracking-wide'>{title}</h1>
      {actions}
    </div>
    <nav aria-label='Breadcrumb' className='tw-text-[10px] tw-text-ad-muted'>
      <Link to='/admin' className='hover:tw-text-white'>
        Home
      </Link>
      {(crumbs.length ? crumbs : [title]).map((c) => (
        <span key={c}> / {c}</span>
      ))}
    </nav>
  </div>
)

/** Content card: translucent black over the navy page (spec §2). */
export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`tw-mb-3 tw-rounded tw-bg-ad-card tw-p-3 ${className}`}>{children}</div>
)
