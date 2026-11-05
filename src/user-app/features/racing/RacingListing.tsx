import React from 'react'
import LMatch from '../../../models/LMatch'
import { getSportName } from '../../constants/sports'
import { useUi } from '../../context/UiContext'
import { useLiveMatches } from '../../hooks/useLiveMatches'
import { useOpenMatch } from '../../hooks/useOpenMatch'
import { formatMatchTime, getStartStatus, StartStatus } from '../../utils/format'
import { getSeriesName, groupBy } from '../../utils/match'
import { EmptyCard, ListSkeleton } from '../../components/ListState'
import { SportHeader } from '../../components/match/SportSection'

/** Racing data: one match = one race; `series` = country code, `name` = venue. */
export const useRacing = (sportId: number) => {
  const { matches, loading } = useLiveMatches()
  const countries = React.useMemo(() => {
    const races = matches
      .filter((m) => Number(m.sportId) === sportId)
      .sort((a, b) => a.matchDateTime.localeCompare(b.matchDateTime))
    return groupBy(races, getSeriesName)
  }, [matches, sportId])
  return { countries, loading: loading && !matches.length }
}

const DOT: Record<StartStatus, string> = { live: 'tw-bg-success', soon: 'tw-bg-warning', scheduled: '' }

export const RaceLegend = ({ className = '' }: { className?: string }) => (
  <div className={`tw-flex tw-items-center tw-gap-3 tw-text-meta tw-text-muted-fg ${className}`}>
    <span className='tw-flex tw-items-center tw-gap-1'>
      <span className='tw-h-2 tw-w-2 tw-rounded-full tw-bg-success' /> Live
    </span>
    <span className='tw-flex tw-items-center tw-gap-1'>
      <span className='tw-h-2 tw-w-2 tw-rounded-full tw-bg-warning' /> Starts within ±5 min
    </span>
  </div>
)

export const RaceTimeChip = ({ race, dark, onOpen }: { race: LMatch; dark?: boolean; onOpen: (r: LMatch) => void }) => {
  const { timezone } = useUi()
  const status = getStartStatus(race.matchDateTime)
  return (
    <button
      type='button'
      onClick={() => onOpen(race)}
      className={`tw-flex tw-h-8 tw-min-w-[54px] tw-items-center tw-justify-center tw-gap-1 tw-rounded-md tw-px-2 tw-text-[13px] tw-font-bold tw-tabular-nums ${
        dark ? 'tw-bg-primary tw-text-white' : 'tw-bg-gray-100 tw-text-fg'
      }`}
    >
      {DOT[status] && <span className={`tw-h-1.5 tw-w-1.5 tw-rounded-full ${DOT[status]}`} />}
      {formatMatchTime(race.matchDateTime, timezone).time}
    </button>
  )
}

export const RaceVenueRow = ({ venue, races, dark, onOpen }: { venue: string; races: LMatch[]; dark?: boolean; onOpen: (r: LMatch) => void }) => (
  <div className='tw-flex tw-flex-col tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-3 last:tw-border-b-0 sm:tw-flex-row'>
    <div className='tw-w-40 tw-shrink-0'>
      <p className='tw-m-0 tw-text-[15px] tw-font-bold'>{venue}</p>
      <p className='tw-m-0 tw-text-meta tw-text-muted-fg'>
        {races.length} {races.length === 1 ? 'race' : 'races'}
      </p>
    </div>
    <div className='tw-flex tw-flex-1 tw-flex-wrap tw-gap-1.5'>
      {races.map((r) => (
        <RaceTimeChip key={r.matchId} race={r} dark={dark} onOpen={onOpen} />
      ))}
    </div>
  </div>
)

const venuesOf = (races: LMatch[]) => Object.entries(groupBy(races, (r) => r.name))

/** Picks the first country with races and keeps the choice while data refreshes. */
const useCountry = (countries: Record<string, LMatch[]>) => {
  const codes = Object.keys(countries)
  const [country, setCountry] = React.useState('')
  const active = codes.includes(country) ? country : codes[0] || ''
  return [active, setCountry, codes] as const
}

/** /exchange/10 and /exchange/65 (v2 §5.4). */
const RacingListing = ({ sportId }: { sportId: number }) => {
  const { countries, loading } = useRacing(sportId)
  const openRace = useOpenMatch()
  const [country, setCountry, codes] = useCountry(countries)
  const name = getSportName(sportId)

  return (
    <div className='ua-ui'>
      <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
        <div className='tw-flex tw-h-11 tw-items-center tw-gap-2 tw-bg-primary tw-px-3 tw-text-header tw-text-white'>
          <span className='tw-flex tw-h-7 tw-w-7 tw-items-center tw-justify-center tw-rounded-full tw-bg-white/15 tw-text-strong'>
            {name[0]}
          </span>
          {name}
        </div>
        <div className='tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-0 tw-border-b tw-border-solid tw-border-line tw-p-3'>
          <div className='ua-no-scrollbar tw-flex tw-gap-2 tw-overflow-x-auto'>
            {codes.map((c) => {
              const active = c === country
              return (
                <button
                  key={c}
                  type='button'
                  onClick={() => setCountry(c)}
                  className={`tw-flex tw-h-8 tw-shrink-0 tw-items-center tw-gap-1.5 tw-rounded-full tw-px-3 tw-text-strong ${
                    active ? 'tw-bg-primary tw-text-white' : 'tw-bg-slate-100 tw-text-fg'
                  }`}
                >
                  {c}
                  <span className={`tw-rounded-full tw-px-1.5 tw-text-badge ${active ? 'tw-bg-white/20' : 'tw-bg-white'}`}>
                    {countries[c].length}
                  </span>
                </button>
              )
            })}
          </div>
          <RaceLegend />
        </div>
        {loading ? (
          <ListSkeleton rows={3} />
        ) : !codes.length ? (
          <p className='tw-m-0 tw-py-10 tw-text-center tw-text-body tw-text-muted-fg'>No races scheduled.</p>
        ) : (
          venuesOf(countries[country]).map(([venue, races]) => (
            <RaceVenueRow key={venue} venue={venue} races={races} onOpen={openRace} />
          ))
        )}
      </div>
    </div>
  )
}

/** Compact variant for the /exchange hub: dark country tabs, dark time chips, legend at the bottom. */
export const RacingCompact = ({ sportId }: { sportId: number }) => {
  const { countries, loading } = useRacing(sportId)
  const openRace = useOpenMatch()
  const [country, setCountry, codes] = useCountry(countries)

  if (loading) return <ListSkeleton />
  if (!codes.length) return <EmptyCard text='No races scheduled.' />

  return (
    <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
      <SportHeader sportId={sportId} sportName={getSportName(sportId)} />
      <div className='ua-no-scrollbar tw-flex tw-overflow-x-auto tw-bg-primary'>
        {codes.map((c) => (
          <button
            key={c}
            type='button'
            onClick={() => setCountry(c)}
            className={`tw-h-10 tw-shrink-0 tw-px-4 tw-text-strong tw-text-white ${c === country ? 'tw-bg-white/15' : 'tw-opacity-70'}`}
          >
            {c}
          </button>
        ))}
      </div>
      {venuesOf(countries[country]).map(([venue, races]) => (
        <RaceVenueRow key={venue} venue={venue} races={races} dark onOpen={openRace} />
      ))}
      <RaceLegend className='tw-px-3 tw-py-2' />
    </div>
  )
}

export default RacingListing
