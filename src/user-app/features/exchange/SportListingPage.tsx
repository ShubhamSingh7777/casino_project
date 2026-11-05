import React from 'react'
import { useParams } from 'react-router-dom'
import { LuClock, LuPlay } from '../../icons'
import { getSportName, isRacingSport } from '../../constants/sports'
import { useLiveMatches } from '../../hooks/useLiveMatches'
import { useOpenMatch } from '../../hooks/useOpenMatch'
import { getSeriesName, groupBy } from '../../utils/match'
import { isLive } from '../../components/MarketBadges'
import LeagueGroup from '../../components/match/LeagueGroup'
import { EmptyCard, ListSkeleton } from '../../components/ListState'
import RacingListing from '../racing/RacingListing'

type Tab = 'live' | 'upcoming'

const TAB_STYLE: Record<Tab, { active: string; pill: string }> = {
  live: { active: 'ua-grad-live tw-text-white', pill: 'tw-bg-green-100 tw-text-green-700' },
  upcoming: { active: 'ua-grad-upcoming tw-text-white', pill: 'tw-bg-sky-100 tw-text-sky-700' },
}

export const LiveUpcomingTabs = ({ tab, onChange, counts }: { tab: Tab; onChange: (t: Tab) => void; counts: Record<Tab, number> }) => (
  <div role='tablist' className='tw-mb-2 tw-grid tw-grid-cols-2 tw-gap-2 tw-rounded-ua tw-bg-white tw-p-2'>
    {(['live', 'upcoming'] as Tab[]).map((t) => {
      const active = t === tab
      return (
        <button
          key={t}
          role='tab'
          type='button'
          aria-selected={active}
          onClick={() => onChange(t)}
          className={`tw-flex tw-h-12 tw-items-center tw-justify-center tw-gap-2 tw-rounded-xl tw-text-strong ${
            active ? TAB_STYLE[t].active : 'tw-border tw-border-solid tw-border-line tw-bg-white tw-text-fg'
          }`}
        >
          {t === 'live' ? 'Live' : 'Upcoming'}
          <span className={`tw-rounded-full tw-px-2 tw-text-meta tw-font-bold ${active ? 'tw-bg-white/25 tw-text-white' : TAB_STYLE[t].pill}`}>
            {counts[t]}
          </span>
        </button>
      )
    })}
  </div>
)

/** One template for every non-racing sport (v2 §5.3): Live / Upcoming tabs, league groups, 3 states. */
const SportListing = ({ sportId }: { sportId: string }) => {
  const { matches, loading } = useLiveMatches()
  const openMatch = useOpenMatch()
  const [tab, setTab] = React.useState<Tab>('live')
  const sportName = getSportName(sportId)

  React.useEffect(() => setTab('live'), [sportId])

  const { live, upcoming } = React.useMemo(() => {
    const ofSport = matches.filter((m) => String(m.sportId) === sportId)
    return { live: ofSport.filter(isLive), upcoming: ofSport.filter((m) => !isLive(m)) }
  }, [matches, sportId])

  const list = tab === 'live' ? live : upcoming
  const leagues = React.useMemo(() => Object.entries(groupBy(list, getSeriesName)), [list])

  return (
    <div className='ua-ui'>
      <LiveUpcomingTabs tab={tab} onChange={setTab} counts={{ live: live.length, upcoming: upcoming.length }} />

      {loading && !matches.length ? (
        <>
          <SectionTitle tab={tab} />
          <ListSkeleton />
        </>
      ) : !list.length ? (
        <EmptyCard text={tab === 'live' ? 'No live events.' : 'No upcoming events.'} />
      ) : (
        <>
          <SectionTitle tab={tab} />
          <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua tw-bg-white'>
            {leagues.map(([league, ms]) => (
              <LeagueGroup key={league} name={league} matches={ms} sportName={sportName} onOpenMatch={openMatch} variant={tab} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const SectionTitle = ({ tab }: { tab: Tab }) => (
  <h2 className='tw-flex tw-items-center tw-gap-2 tw-px-1 tw-py-2 tw-text-section'>
    {tab === 'live' ? (
      <LuPlay className='tw-h-4 tw-w-4 tw-fill-success tw-text-success' />
    ) : (
      <LuClock className='tw-h-4 tw-w-4 tw-text-sky-500' />
    )}
    {tab === 'live' ? 'Live' : 'Upcoming'}
  </h2>
)

/** /exchange/:sportId — racing ids (10, 65) use the Racing template, everything else the Sport Listing. */
const SportListingPage = () => {
  const { sportId = '' } = useParams()
  return isRacingSport(sportId) ? <RacingListing sportId={Number(sportId)} /> : <SportListing sportId={sportId} />
}

export default SportListingPage
