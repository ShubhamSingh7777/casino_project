import React from 'react'

export const Shimmer = ({ className = '' }: { className?: string }) => (
  <div className={`tw-relative tw-overflow-hidden tw-rounded-md tw-bg-gray-200 ${className}`}>
    <div className='tw-absolute tw-inset-0 -tw-translate-x-full tw-animate-ua-shimmer tw-bg-gradient-to-r tw-from-transparent tw-via-white/60 tw-to-transparent' />
  </div>
)

export const MatchListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
    <Shimmer className='tw-h-11 tw-rounded-none' />
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className='tw-space-y-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-2'>
        <div className='tw-flex tw-justify-between'>
          <Shimmer className='tw-h-4 tw-w-1/3' />
          <Shimmer className='tw-h-4 tw-w-16' />
          <Shimmer className='tw-h-4 tw-w-1/3' />
        </div>
        <div className='tw-grid tw-grid-cols-4 tw-gap-1.5'>
          {Array.from({ length: 4 }, (_, j) => (
            <Shimmer key={j} className='tw-h-14' />
          ))}
        </div>
      </div>
    ))}
  </div>
)

export const GameGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className='tw-grid tw-grid-cols-2 tw-gap-1.5 sm:tw-grid-cols-3 lg:tw-grid-cols-4'>
    {Array.from({ length: count }, (_, i) => (
      <Shimmer key={i} className='tw-aspect-[4/3] tw-rounded-[10px]' />
    ))}
  </div>
)
