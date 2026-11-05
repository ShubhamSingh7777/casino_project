import React from 'react'
import { useParams } from 'react-router-dom'
import IMarket from '../../../models/IMarket'
import LFancy from '../../../models/LFancy'
import { IFancy } from '../../../models/IFancy'
import IBet from '../../../models/IBet'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectCurrentMatch } from '../../../redux/actions/sports/sportSlice'
import { betPopup } from '../../../redux/actions/bet/betSlice'
import { useUi } from '../../context/UiContext'
import { isRacingSport, SPORT_IDS } from '../../constants/sports'
import { LuSearch } from '../../icons'
import { EmptyCard, ListSkeleton } from '../../components/ListState'
import { useEventData } from './useEventData'
import { useMyBets } from './useMyBets'
import { fancyBet, marketBet } from './bet-payload'
import { FANCY_GROUPS, fancyGroupOf, isBookmaker, Level, marketTitle } from './market-utils'
import MarketTable from './MarketTable'
import FancyTable, { visibleFancies } from './FancyTable'
import { EventBreadcrumb, EventTab, MarketVideoTabs, RulesDialog, ScorePanel, VideoPanel } from './EventHeader'

export type EventVariant = 'standard' | 'virtual' | 'tp-virtual'

// Provider URLs used by the legacy odds screen.
const tvUrl = (matchId: number) => `https://tv.777exch.live/sports/${matchId}`
const scoreUrl = (matchId: number, sportId: number | string) => `https://tv.777exch.live/scorecard/?gmid=${matchId}&etid=${sportId}`
const t10Url = (matchId: number) => `https://live.cricketid.xyz/directStream?gmid=${matchId}&key=Snnsksnshiwjsb82773737bdbsnsnsb`

const chipClass = (active: boolean) =>
  `tw-h-9 tw-shrink-0 tw-rounded-full tw-px-3 tw-text-body tw-font-semibold ${
    active ? 'tw-bg-primary tw-text-white' : 'tw-border tw-border-solid tw-border-line tw-bg-gray-200 tw-text-fg'
  }`

type Block =
  | { kind: 'market'; key: string; group: string; market: IMarket; search: string }
  | { kind: 'fancy'; key: string; group: string; title: string; fancies: LFancy[]; search: string }

/**
 * Event / market page (v2 §5.5–5.8) — one template, variants by flags:
 * racing (saddle cloths), virtual (scoreboard | video split), tp-virtual (Rules + scoreboard + video).
 */
const EventPage = ({ variant = 'standard' }: { variant?: EventVariant }) => {
  const { matchId = '' } = useParams()
  const dispatch = useAppDispatch()
  const { setBetslipOpen, setBetStake } = useUi()
  const loaded = useEventData(matchId)
  // The listing already put this match (name, series, MATCH_ODDS runners) in redux; use it when the
  // event APIs return nothing (e.g. browsing without a login in dev), so the page still renders.
  const listed = useAppSelector(selectCurrentMatch) as any
  const fallback = !loaded.match && String(listed?.matchId) === matchId ? listed : null
  const data: typeof loaded = fallback ? { ...loaded, match: fallback, markets: loaded.markets.length ? loaded.markets : fallback.markets || [] } : loaded
  const { match } = data
  useMyBets(match?.matchId)

  const [tab, setTab] = React.useState<EventTab>('market')
  const [chip, setChip] = React.useState('all')
  const [query, setQuery] = React.useState('')
  const [rulesOpen, setRulesOpen] = React.useState(false)

  React.useEffect(() => {
    setBetStake(data.stake)
    return () => setBetStake(null)
  }, [data.stake])

  const openSlip = (bet: IBet | null) => {
    if (!bet) return
    dispatch(betPopup({ isOpen: true, betData: bet }))
    setBetslipOpen(true)
  }
  const onMarketBet = (market: IMarket, runner: any, isBack: boolean, price: Level) =>
    openSlip(marketBet(market, runner, isBack, price, match?.name || ''))
  const onFancyBet = (fancy: LFancy, live: IFancy, isBack: boolean) => openSlip(fancyBet(fancy, live, isBack, match?.name || ''))

  // every market/fancy table as a block with its filter group and search text
  const blocks = React.useMemo<Block[]>(() => {
    const marketBlocks: Block[] = data.markets.map((m) => {
      const runners = data.live[m.marketId]?.runners || m.runners || []
      return {
        kind: 'market',
        key: m.marketId,
        group: isBookmaker(m) ? 'bookmaker' : 'match',
        market: m,
        search: `${marketTitle(m)} ${runners.map((r: any) => r.runnerName || r.nat).join(' ')}`.toLowerCase(),
      }
    })
    const shown = visibleFancies(data.fancies, data.fancyLive)
    const fancyBlocks: Block[] = FANCY_GROUPS.map((g) => {
      const list = shown.filter((f) => fancyGroupOf(f) === g.key)
      return {
        kind: 'fancy' as const,
        key: `fancy-${g.key}`,
        group: g.key,
        title: g.label,
        fancies: list,
        search: list.map((f) => f.fancyName).join(' ').toLowerCase(),
      }
    }).filter((b) => b.fancies.length)
    return [...marketBlocks, ...fancyBlocks]
  }, [data.markets, data.live, data.fancies, data.fancyLive])

  const chips = React.useMemo(() => {
    const groups = Array.from(new Set(blocks.map((b) => b.group)))
    const label = (g: string) => (g === 'match' ? 'Match' : g === 'bookmaker' ? 'Bookmaker' : FANCY_GROUPS.find((f) => f.key === g)?.label || g)
    return [{ key: 'all', label: `All (${blocks.length})` }, ...groups.map((g) => ({ key: g, label: label(g) }))]
  }, [blocks])

  const q = query.trim().toLowerCase()
  const visible = blocks.filter((b) => (chip === 'all' || b.group === chip) && (!q || b.search.includes(q)))

  if (data.loading && !match) {
    return (
      <div className='ua-ui'>
        <ListSkeleton rows={4} />
      </div>
    )
  }
  if (!match) {
    return (
      <div className='ua-ui'>
        <EmptyCard text={data.failed ? 'Could not load this event.' : 'Event not found.'} />
      </div>
    )
  }

  const sportId = Number(match.sportId)
  const racing = isRacingSport(sportId) ? (sportId === SPORT_IDS.GREYHOUND_RACING ? 'greyhound' : 'horse') : undefined
  const videoSrc = match.isT10 ? t10Url(match.matchId) : tvUrl(match.matchId)
  const hasVideo = !!match.isT10 || String((match as any).tv) === 'true'
  const hasScore = !racing && [SPORT_IDS.CRICKET, SPORT_IDS.FOOTBALL, SPORT_IDS.TENNIS].includes(sportId as any)
  const scoreTitle = sportId === SPORT_IDS.CRICKET ? 'Scoreboard' : 'Graphics'
  const scoreHeight = sportId === SPORT_IDS.CRICKET ? 190 : 270

  return (
    <div className='ua-ui'>
      <EventBreadcrumb match={match} onRules={variant === 'tp-virtual' ? () => setRulesOpen(true) : undefined} />

      {variant === 'standard' && (
        <>
          <MarketVideoTabs tab={tab} onChange={setTab} hasVideo={hasVideo} />
          {tab === 'video' ? (
            <div className='tw-mb-2 tw-overflow-hidden tw-rounded-b-ua'>
              <VideoPanel src={videoSrc} />
            </div>
          ) : hasScore ? (
            <ScorePanel title={scoreTitle} src={scoreUrl(match.matchId, sportId)} height={scoreHeight} />
          ) : (
            <div className='tw-mb-2' />
          )}
        </>
      )}

      {variant === 'virtual' && (
        <div className='tw-mb-2 tw-grid tw-gap-2 md:tw-grid-cols-2'>
          <div className='md:tw-order-2'>
            <VideoPanel src={hasVideo ? videoSrc : undefined} />
          </div>
          <ScorePanel title='Scoreboard' src={scoreUrl(match.matchId, sportId)} height={scoreHeight} />
        </div>
      )}

      {variant === 'tp-virtual' && (
        <>
          <ScorePanel title='Scoreboard' src={scoreUrl(match.matchId, sportId)} height={scoreHeight} />
          <div className='tw-mb-2 tw-overflow-hidden tw-rounded-ua'>
            <VideoPanel src={match.isT10 ? videoSrc : undefined} />
          </div>
          <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </>
      )}

      <div className='tw-mb-2 tw-flex tw-flex-col tw-gap-2 tw-rounded-ua tw-bg-white tw-p-2 md:tw-flex-row md:tw-items-center'>
        <label className='tw-flex tw-h-10 tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-line tw-px-3 md:tw-w-72 md:tw-shrink-0'>
          <LuSearch className='tw-h-4 tw-w-4 tw-text-muted-fg' aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search markets or selections'
            aria-label='Search markets or selections'
            className='tw-h-full tw-w-full tw-border-0 tw-bg-transparent tw-text-body tw-outline-none'
          />
        </label>
        <div className='ua-no-scrollbar tw-flex tw-gap-2 tw-overflow-x-auto'>
          {chips.map((c) => (
            <button key={c.key} type='button' aria-pressed={chip === c.key} onClick={() => setChip(c.key)} className={chipClass(chip === c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className='tw-mb-2 tw-flex tw-flex-wrap tw-justify-between tw-gap-2 tw-px-1 tw-text-meta tw-text-muted-fg'>
        <span>
          {visible.length} of {blocks.length} markets
        </span>
        <span>BM = Bookmaker · F/F1 = Fancy</span>
      </div>

      {!blocks.length ? (
        data.loading ? <ListSkeleton /> : <EmptyCard text='No markets open right now.' />
      ) : !visible.length ? (
        <EmptyCard text='No markets match your search.' />
      ) : (
        visible.map((b) =>
          b.kind === 'market' ? (
            <MarketTable key={b.key} market={b.market} live={data.live[b.market.marketId]} onBet={onMarketBet} racing={racing} />
          ) : (
            <FancyTable key={b.key} title={b.title} fancies={b.fancies} live={data.fancyLive} onBet={onFancyBet} />
          ),
        )
      )}
    </div>
  )
}

export default EventPage
