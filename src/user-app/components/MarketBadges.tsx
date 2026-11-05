import React from 'react'
import { LuTv } from '../icons'
import LMatch from '../../models/LMatch'
import { hasStarted } from '../utils/format'

const badge = 'tw-inline-flex tw-h-[18px] tw-items-center tw-rounded tw-px-1 tw-text-[10px] tw-font-bold tw-leading-none'

export const InPlayBadge = () => (
  <span className={`${badge} tw-gap-1 tw-rounded-full tw-bg-success tw-px-2 tw-text-white`}>
    <span className='tw-h-1.5 tw-w-1.5 tw-animate-pulse tw-rounded-full tw-bg-white' />
    In Play
  </span>
)

/** TV / BM / F / T10 flags — same rules as the legacy match list. */
const MarketBadges = ({ match }: { match: LMatch }) => (
  <span className='tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-1'>
    {match.inPlay && <LuTv className='tw-h-4 tw-w-4 tw-text-gray-700' aria-label='Live TV' />}
    {match.isBookMaker && <span className={`${badge} tw-bg-gray-800 tw-text-white`}>BM</span>}
    {match.isFancy && <span className={`${badge} tw-bg-amber-500 tw-text-white`}>F</span>}
    {match.isT10 && <span className={`${badge} tw-bg-violet-600 tw-text-white`}>T10</span>}
  </span>
)

export const isLive = (match: LMatch) => !!match.inPlay || hasStarted(match.matchDateTime)

export default MarketBadges
