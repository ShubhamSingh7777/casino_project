import React from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { toast } from 'react-toastify'
import casinoService from '../../../services/casino.service'
import authService from '../../../services/auth.service'
import { DEFAULT_CASINO_IMAGE } from '../../../utils/casino-images'
import { useUi } from '../../context/UiContext'
import { useUserSession } from '../../hooks/useUserSession'
import { LuChevronRight, LuLayoutGrid, LuSearch, LuSparkles } from '../../icons'
import { GameGridSkeleton } from '../../components/Skeleton'
import { EmptyCard } from '../../components/ListState'
import { groupBy } from '../../utils/match'
import { categoryLabel, initials, isLobbyType, LobbyGame, LOBBIES, LobbyType } from './lobbies'
import { useLobbyGames } from './useLobbyGames'

const PAGE = 12
const GRID = 'tw-grid tw-grid-cols-2 tw-gap-1.5 sm:tw-grid-cols-3 lg:tw-grid-cols-4 2xl:tw-grid-cols-5'

const ProviderTabs = ({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) => (
  <div role='tablist' className='ua-no-scrollbar tw-mb-2 tw-flex tw-overflow-x-auto tw-rounded-ua tw-bg-white'>
    {tabs.map((t) => {
      const selected = t === active
      return (
        <button
          key={t}
          role='tab'
          type='button'
          aria-selected={selected}
          onClick={() => onChange(t)}
          className={`tw-flex tw-w-[90px] tw-shrink-0 tw-flex-col tw-items-center tw-gap-1 tw-border-0 tw-border-b-2 tw-border-solid tw-py-2 ${
            selected ? 'tw-border-primary tw-text-fg' : 'tw-border-transparent tw-text-muted-fg'
          }`}
        >
          <span className='tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100 tw-text-meta tw-font-bold tw-text-fg'>
            {t === 'All' ? <LuLayoutGrid className='tw-h-4 tw-w-4' /> : t === 'Own' ? <LuSparkles className='tw-h-4 tw-w-4' /> : initials(t)}
          </span>
          <span className='tw-w-full tw-truncate tw-px-1 tw-text-center tw-text-meta tw-font-semibold'>{t}</span>
        </button>
      )
    })}
  </div>
)

const GameCard = ({ game, onOpen }: { game: LobbyGame; onOpen: (g: LobbyGame) => void }) => (
  <button
    type='button'
    onClick={() => onOpen(game)}
    className='tw-group tw-relative tw-aspect-[16/10] tw-overflow-hidden tw-rounded-ua tw-bg-gray-200 tw-text-left'
  >
    <img
      src={game.image}
      alt={game.name}
      loading='lazy'
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = DEFAULT_CASINO_IMAGE
      }}
      className='tw-h-full tw-w-full tw-object-cover'
    />
    {!game.own && (
      <span className='tw-absolute tw-right-1.5 tw-top-1.5 tw-rounded tw-bg-black/60 tw-px-1 tw-text-badge tw-text-white'>
        {initials(game.provider)}
      </span>
    )}
    <span className='tw-absolute tw-inset-x-0 tw-bottom-0 tw-truncate tw-bg-gradient-to-t tw-from-black/80 tw-to-transparent tw-px-2 tw-pb-1.5 tw-pt-4 tw-text-meta tw-font-bold tw-text-white'>
      {game.name}
    </span>
    <span className='tw-absolute tw-inset-0 tw-hidden tw-items-center tw-justify-center tw-bg-black/50 tw-text-strong tw-text-white group-hover:tw-flex'>
      {game.disabled ? 'Suspended' : 'Play Now!'}
    </span>
  </button>
)

const ShowMoreTile = ({ remaining, onClick }: { remaining: number; onClick: () => void }) => (
  <button
    type='button'
    onClick={onClick}
    className='tw-flex tw-aspect-[16/10] tw-flex-col tw-items-center tw-justify-center tw-gap-1 tw-rounded-ua tw-border tw-border-solid tw-border-[rgba(3,7,18,0.2)] tw-bg-[rgba(3,7,18,0.1)]'
  >
    <span className='tw-text-strong'>Show {Math.min(PAGE, remaining)} more</span>
    <span className='tw-text-meta tw-text-muted-fg'>{remaining} remaining</span>
    <span className='tw-mt-1 tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-bg-primary tw-text-white'>
      <LuChevronRight className='tw-h-4 tw-w-4' />
    </span>
  </button>
)

/** One category: 11 games + "Show more" tile when there are more than 12; each click appends 12. */
const CategorySection = ({ title, games, onOpen }: { title: string; games: LobbyGame[]; onOpen: (g: LobbyGame) => void }) => {
  const [visible, setVisible] = React.useState(PAGE)
  const overflow = games.length > visible
  const shown = overflow ? games.slice(0, visible - 1) : games
  return (
    <section className='tw-px-2 tw-pb-3 md:tw-px-3'>
      <h3 className='tw-py-2 tw-text-section'>{title}</h3>
      <div className={GRID}>
        {shown.map((g) => (
          <GameCard key={g.key} game={g} onOpen={onOpen} />
        ))}
        {overflow && <ShowMoreTile remaining={games.length - shown.length} onClick={() => setVisible((v) => v + PAGE)} />}
      </div>
    </section>
  )
}

/** /casino/live | slots | crash — one template (v2 §5.9); only the provider tabs + categories differ. */
const CasinoLobby = () => {
  const { type } = useParams()
  return isLobbyType(type) ? <Lobby key={type} type={type} /> : <Navigate to='/casino/live' replace />
}

const Lobby = ({ type }: { type: LobbyType }) => {
  const config = LOBBIES[type]
  const navigate = useNavigate()
  const { isLoggedIn } = useUserSession()
  const { setSignInOpen } = useUi()
  const { tabs, loading } = useLobbyGames(type)
  const [tab, setTab] = React.useState(config.defaultTab)
  const [query, setQuery] = React.useState('')
  const [launching, setLaunching] = React.useState(false)

  const tabNames = Object.keys(tabs).filter((t) => tabs[t].length || t === 'All')
  const activeTab = tabs[tab]?.length ? tab : tabNames.find((t) => tabs[t].length) || 'All'

  const categories = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const games = (tabs[activeTab] || []).filter((g) => !q || g.name.toLowerCase().includes(q))
    return Object.entries(groupBy(games, (g) => categoryLabel(g.category)))
  }, [tabs, activeTab, query])

  // Logged out → Sign-In modal, URL unchanged (v2 §9). Own games open our casino page; int games launch the provider URL.
  const openGame = (game: LobbyGame) => {
    if (!isLoggedIn) return setSignInOpen(true)
    if (game.disabled) return toast.warn('This game is suspended by admin, please try again later')
    if (game.own) return navigate(`/casino/${game.own.slug}/${game.own.match_id}`)
    if (launching) return
    setLaunching(true)
    casinoService
      .getplaycasino({ gameCode: game.identifier, lobby_url: game.identifier, ipAddress: authService.getIpAddress(), isMobile })
      .then((res) => {
        const url = res?.data?.data?.url
        // full-screen in-app frame instead of a popup window (v3 "provider game iframe shell")
        if (url) navigate(`/casino-play?url=${encodeURIComponent(url)}&name=${encodeURIComponent(game.name)}`)
        else toast.error(res?.data?.message || 'Could not start the game')
      })
      .catch((e) => toast.error(e?.response?.data?.message || 'Could not start the game'))
      .finally(() => setLaunching(false))
  }

  return (
    <div className='ua-ui'>
      <h1 className='tw-sr-only'>{config.title}</h1>
      <ProviderTabs tabs={tabNames} active={activeTab} onChange={setTab} />
      <label className='tw-mb-2 tw-flex tw-h-11 tw-items-center tw-gap-2 tw-rounded-ua tw-bg-white tw-px-3'>
        <LuSearch className='tw-h-4 tw-w-4 tw-text-muted-fg' aria-hidden />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search games'
          aria-label='Search games'
          className='tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-body tw-outline-none'
        />
      </label>

      {loading && !tabs[activeTab]?.length ? (
        <div className='tw-rounded-ua tw-bg-white tw-p-2'>
          <GameGridSkeleton count={8} />
        </div>
      ) : !categories.length ? (
        <EmptyCard text={query ? 'No games match your search.' : 'No games available.'} />
      ) : (
        <div className='tw-mb-2 tw-rounded-ua tw-bg-white'>
          {categories.map(([title, games]) => (
            <CategorySection key={`${activeTab}-${title}-${query}`} title={title} games={games} onOpen={openGame} />
          ))}
        </div>
      )}

      {launching && (
        <div className='tw-fixed tw-inset-0 tw-z-[80] tw-flex tw-items-center tw-justify-center tw-bg-black/60 tw-text-strong tw-text-white'>
          Starting game…
        </div>
      )}
    </div>
  )
}

export default CasinoLobby
