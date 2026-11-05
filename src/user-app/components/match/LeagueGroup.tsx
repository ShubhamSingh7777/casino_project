import React from 'react'
import { LuChevronDown, LuClock } from '../../icons'
import LMatch from '../../../models/LMatch'
import { hasDraw } from '../../utils/match'
import MatchCard, { oddsAreaWidth } from './MatchCard'

type LeagueGroupProps = {
  name: string
  matches: LMatch[]
  sportName: string
  onOpenMatch: (match: LMatch) => void
  /** Sport Listing tabs: green LIVE tag or blue clock before the league name. */
  variant?: 'live' | 'upcoming'
}

export const LiveTag = () => (
  <span className='tw-rounded tw-bg-success tw-px-1.5 tw-py-0.5 tw-text-badge tw-text-white'>LIVE</span>
)

const LeagueGroup = ({ name, matches, sportName, onOpenMatch, variant }: LeagueGroupProps) => {
  const [open, setOpen] = React.useState(true)
  const threeWay = matches.some(hasDraw)
  const labels = threeWay ? ['1', 'x', '2'] : ['1', '2']

  return (
    <section className='tw-border-0 tw-border-b tw-border-solid tw-border-line last:tw-border-b-0'>
      <button
        type='button'
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className='tw-flex tw-h-10 tw-w-full tw-items-center tw-gap-2 tw-bg-muted tw-px-3 tw-text-left'
      >
        {variant === 'live' && <LiveTag />}
        {variant === 'upcoming' && <LuClock className='tw-h-4 tw-w-4 tw-shrink-0 tw-text-sky-500' aria-label='Upcoming' />}
        <span className='tw-min-w-0 tw-flex-1 tw-truncate tw-text-strong'>{name}</span>
        {open && (
          <span className={`tw-hidden tw-shrink-0 tw-justify-between tw-text-center tw-text-meta tw-font-bold tw-text-muted-fg md:tw-flex ${oddsAreaWidth(threeWay)}`}>
            {labels.map((l) => (
              <span key={l} className='tw-w-[98px]'>
                {l}
              </span>
            ))}
          </span>
        )}
        <LuChevronDown className={`tw-h-4 tw-w-4 tw-shrink-0 tw-transition-transform ${open ? '' : '-tw-rotate-90'}`} />
      </button>
      {open &&
        matches.map((m) => (
          <MatchCard key={m.matchId} match={m} sportName={sportName} threeWay={threeWay} onOpen={onOpenMatch} />
        ))}
    </section>
  )
}

export default LeagueGroup
