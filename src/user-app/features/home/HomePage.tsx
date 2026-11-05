import React from 'react'
import { HOME_SPORTS, getSportName } from '../../constants/sports'
import { useLiveMatches } from '../../hooks/useLiveMatches'
import { useOpenMatch } from '../../hooks/useOpenMatch'
import { isLive } from '../../components/MarketBadges'
import { ListSkeleton } from '../../components/ListState'
import SportSection from '../../components/match/SportSection'
import BannerCarousel from './BannerCarousel'
import PopularCasino from './PopularCasino'

/** Home (v2 §5.1): banner → Cricket → Popular → Football → Tennis; in-play events only. */
const HomePage = () => {
  const { matches, loading } = useLiveMatches()
  const openMatch = useOpenMatch()

  const liveBySport = React.useMemo(() => {
    const live = matches.filter(isLive)
    return Object.fromEntries(HOME_SPORTS.map((id) => [id, live.filter((m) => Number(m.sportId) === id)]))
  }, [matches])

  return (
    <div className='ua-ui'>
      <BannerCarousel />
      {HOME_SPORTS.map((id, index) => (
        <React.Fragment key={id}>
          {loading && !matches.length ? (
            <ListSkeleton />
          ) : (
            <SportSection sportId={id} sportName={getSportName(id)} matches={liveBySport[id]} onOpenMatch={openMatch} />
          )}
          {index === 0 && <PopularCasino />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default HomePage
