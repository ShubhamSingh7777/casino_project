import React from 'react'
import { Link } from 'react-router-dom'
import { SPORT_IDS, SPORTS, getSportName, isRacingSport } from '../../constants/sports'
import { useLiveMatches } from '../../hooks/useLiveMatches'
import { useOpenMatch } from '../../hooks/useOpenMatch'
import SportIcon from '../../components/SportIcon'
import SportSection from '../../components/match/SportSection'
import { ListSkeleton } from '../../components/ListState'
import { RacingCompact } from '../racing/RacingListing'

const chipClass = (active: boolean) =>
  `tw-flex tw-h-9 tw-shrink-0 tw-items-center tw-gap-1.5 tw-rounded-full tw-px-3 tw-text-body tw-font-semibold ${
    active ? 'tw-bg-primary tw-text-white' : 'tw-bg-gray-100 tw-text-fg'
  }`

/** /exchange (v2 §5.2): sport chips switch the section below as local state — the URL stays /exchange. */
const ExchangeHub = () => {
  const [sportId, setSportId] = React.useState<number>(SPORT_IDS.CRICKET)
  const { matches, loading } = useLiveMatches()
  const openMatch = useOpenMatch()
  const activeChip = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    activeChip.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [sportId])

  const sportMatches = React.useMemo(() => matches.filter((m) => Number(m.sportId) === sportId), [matches, sportId])

  return (
    <div className='ua-ui'>
      <div className='ua-no-scrollbar tw-mb-2 tw-flex tw-gap-2 tw-overflow-x-auto tw-rounded-ua tw-bg-white tw-p-2'>
        {SPORTS.map((s) =>
          s.template === 'casino' ? (
            <Link key={s.id} to={s.to} className={chipClass(false)}>
              <SportIcon name={s.name} className='tw-h-4 tw-w-4' />
              {s.name}
            </Link>
          ) : (
            <button
              key={s.id}
              ref={s.id === sportId ? activeChip : undefined}
              type='button'
              aria-pressed={s.id === sportId}
              onClick={() => setSportId(s.id as number)}
              className={chipClass(s.id === sportId)}
            >
              <SportIcon name={s.name} className='tw-h-4 tw-w-4' />
              <span className='tw-whitespace-nowrap'>{s.name}</span>
            </button>
          ),
        )}
      </div>

      {isRacingSport(sportId) ? (
        <RacingCompact sportId={sportId} />
      ) : loading && !matches.length ? (
        <ListSkeleton />
      ) : (
        <SportSection
          key={sportId}
          sportId={sportId}
          sportName={getSportName(sportId)}
          matches={sportMatches}
          onOpenMatch={openMatch}
          emptyText='No events right now.'
        />
      )}
    </div>
  )
}

export default ExchangeHub
