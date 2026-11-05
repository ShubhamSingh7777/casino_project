import React from 'react'
import { Link } from 'react-router-dom'
import LMatch from '../../../models/LMatch'
import { getSeriesName, groupBy } from '../../utils/match'
import SportIcon from '../SportIcon'
import { useInView } from '../../hooks/useInView'
import LeagueGroup from './LeagueGroup'

type SportSectionProps = {
  sportId: number | string
  sportName: string
  matches: LMatch[]
  onOpenMatch: (match: LMatch) => void
  emptyText?: string
}

export const SportHeader = ({ sportId, sportName, count }: { sportId: number | string; sportName: string; count?: number }) => (
  <Link
    to={`/exchange/${sportId}`}
    className='ua-sport-header tw-flex tw-h-11 tw-items-center tw-gap-2 tw-px-3 tw-text-header tw-text-white'
  >
    <SportIcon name={sportName} className='tw-h-5 tw-w-5' />
    {sportName}
    {count != null && <span className='tw-ml-auto tw-rounded-full tw-bg-white/20 tw-px-2 tw-text-meta'>{count}</span>}
  </Link>
)

/** Sport header bar + collapsible league groups (Home and Exchange Hub). Body renders once scrolled near. */
const SportSection = ({ sportId, sportName, matches, onOpenMatch, emptyText = 'No live events.' }: SportSectionProps) => {
  const [ref, inView] = useInView<HTMLDivElement>()
  const leagues = React.useMemo(() => Object.entries(groupBy(matches, getSeriesName)), [matches])

  return (
    <div ref={ref} className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
      <SportHeader sportId={sportId} sportName={sportName} count={matches.length} />
      {!matches.length ? (
        <p className='tw-m-0 tw-py-8 tw-text-center tw-text-body tw-text-muted-fg'>{emptyText}</p>
      ) : inView ? (
        leagues.map(([league, list]) => (
          <LeagueGroup key={league} name={league} matches={list} sportName={sportName} onOpenMatch={onOpenMatch} />
        ))
      ) : (
        <div style={{ height: Math.min(matches.length, 6) * 120 }} />
      )}
    </div>
  )
}

export default SportSection
