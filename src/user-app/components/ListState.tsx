import React from 'react'
import { Shimmer } from './Skeleton'

/** Shared `empty` state: one white card with centred gray text (v2 §5.3). */
export const EmptyCard = ({ text }: { text: string }) => (
  <div className='tw-mb-2 tw-rounded-ua tw-bg-white tw-py-10 tw-text-center tw-text-body tw-text-muted-fg'>{text}</div>
)

/** Shared `loading` state for match lists: 3 skeleton rows (4 odds blocks mobile, 6 on ≥md). */
export const ListSkeleton = ({ rows = 3 }: { rows?: number }) => (
  <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className='tw-flex tw-flex-col tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-3 md:tw-flex-row md:tw-items-center'>
        <div className='tw-flex tw-flex-1 tw-flex-col tw-gap-1.5'>
          <Shimmer className='tw-h-3.5 tw-w-2/5' />
          <Shimmer className='tw-h-3.5 tw-w-1/3' />
        </div>
        <Shimmer className='tw-hidden tw-h-4 tw-w-14 md:tw-block' />
        <div className='tw-grid tw-grid-cols-4 tw-gap-1.5 md:tw-flex md:tw-gap-0.5'>
          {Array.from({ length: 6 }, (_, j) => (
            <Shimmer key={j} className={`tw-h-14 md:tw-h-9 md:tw-w-12 ${j > 3 ? 'tw-hidden md:tw-block' : ''}`} />
          ))}
        </div>
      </div>
    ))}
  </div>
)
