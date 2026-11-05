import React from 'react'
import { IconType } from '../icons'

const EmptyState = ({ icon: Icon, title, subtitle }: { icon: IconType; title: string; subtitle?: string }) => (
  <div className='tw-flex tw-flex-col tw-items-center tw-gap-2 tw-rounded-ua tw-bg-white tw-px-4 tw-py-10 tw-text-center'>
    <Icon className='tw-h-10 tw-w-10 tw-text-gray-400' aria-hidden />
    <p className='tw-m-0 tw-text-base tw-font-bold'>{title}</p>
    {subtitle && <p className='tw-m-0 tw-text-sm tw-text-gray-500'>{subtitle}</p>}
  </div>
)

export default EmptyState
