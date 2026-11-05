import React from 'react'
import { LuChevronRight } from '../../icons'
import LMatch from '../../../models/LMatch'
import { useUi } from '../../context/UiContext'
import { formatMatchTime } from '../../utils/format'
import { get1x2, getMainRunners, getRunnerPrices, isSuspended, splitTeams } from '../../utils/match'
import OddsCell from '../OddsCell'
import SportIcon from '../SportIcon'
import MarketBadges, { InPlayBadge, isLive } from '../MarketBadges'
import { SuspendedBlock } from '../SuspendedBlock'

type MatchCardProps = {
  match: LMatch
  sportName: string
  /** Draw column shown for the whole league (1 x 2) */
  threeWay: boolean
  onOpen: (match: LMatch) => void
}

const EMPTY = { price: null, size: null }

const StartTime = ({ match }: { match: LMatch }) => {
  const { timezone } = useUi()
  const { day, time } = formatMatchTime(match.matchDateTime, timezone)
  return (
    <span className='tw-flex tw-flex-col tw-items-center'>
      <span className='tw-text-badge tw-text-muted-fg'>{day}</span>
      <span className='tw-text-strong tw-tabular-nums'>{time}</span>
    </span>
  )
}

const Status = ({ match }: { match: LMatch }) => (isLive(match) ? <InPlayBadge /> : <StartTime match={match} />)

const TeamBlock = ({ name, sportName }: { name: string; sportName: string }) => (
  <span className='tw-flex tw-flex-col tw-items-center tw-gap-1'>
    <span className='tw-flex tw-h-7 tw-w-7 tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100'>
      <SportIcon name={sportName} className='tw-h-4 tw-w-4 tw-text-muted-fg' />
    </span>
    <span className='tw-line-clamp-3 tw-text-strong'>{name}</span>
  </span>
)

/** Mobile (< md): stacked card. 2-way → Back A · Lay A · Back B · Lay B; 3-way → 6 cells (1, x, 2). */
const MobileCard = ({ match, sportName, threeWay, onOpen }: MatchCardProps) => {
  const [teamA, teamB] = splitTeams(match.name, match.sportId)
  const runners = getMainRunners(match)
  const { home, draw, away } = get1x2(runners)
  const open = () => onOpen(match)
  const sides = threeWay ? [home, draw, away] : [home, away]

  return (
    <div className='tw-px-2 tw-py-2.5 md:tw-hidden'>
      <button type='button' onClick={open} className='tw-w-full tw-text-center'>
        {teamB ? (
          <span className='tw-grid tw-grid-cols-[1fr_auto_1fr] tw-items-start tw-gap-2'>
            <TeamBlock name={teamA} sportName={sportName} />
            <span className='tw-flex tw-min-w-[84px] tw-flex-col tw-items-center tw-gap-1 tw-pt-0.5'>
              <Status match={match} />
              <MarketBadges match={match} />
            </span>
            <TeamBlock name={teamB} sportName={sportName} />
          </span>
        ) : (
          // outright: one name, one icon
          <span className='tw-flex tw-flex-col tw-items-center tw-gap-1'>
            <TeamBlock name={teamA} sportName={sportName} />
            <span className='tw-flex tw-items-center tw-gap-2'>
              <Status match={match} />
              <MarketBadges match={match} />
            </span>
          </span>
        )}
      </button>

      <div className='tw-mt-2'>
        {!runners.length ? (
          <button
            type='button'
            onClick={open}
            className='tw-flex tw-h-11 tw-w-full tw-items-center tw-justify-center tw-rounded-md tw-bg-muted tw-text-strong'
          >
            See Markets
          </button>
        ) : isSuspended(runners) ? (
          <SuspendedBlock className='tw-h-14' />
        ) : (
          <div className={`tw-grid tw-gap-1.5 ${threeWay ? 'tw-grid-cols-6' : 'tw-grid-cols-4'}`}>
            {sides.map((runner, i) => {
              const p = runner ? getRunnerPrices(runner) : { back: EMPTY, lay: EMPTY }
              return (
                <React.Fragment key={i}>
                  <OddsCell side='back' cell={p.back} onClick={open} className='tw-h-14' />
                  <OddsCell side='lay' cell={p.lay} onClick={open} className='tw-h-14' />
                </React.Fragment>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const PairColumn = ({ runner, onOpen }: { runner: any; onOpen: () => void }) => {
  const p = runner ? getRunnerPrices(runner) : { back: EMPTY, lay: EMPTY }
  return (
    <div className='tw-grid tw-grid-cols-2 tw-gap-0.5'>
      <OddsCell side='back' cell={p.back} onClick={onOpen} className='tw-h-9 tw-w-12 tw-rounded-r-none' />
      <OddsCell side='lay' cell={p.lay} onClick={onOpen} className='tw-h-9 tw-w-12 tw-rounded-l-none' />
    </div>
  )
}

/** Width of the odds area — shared with the league header so the 1 / x / 2 labels line up. */
export const oddsAreaWidth = (threeWay: boolean) => (threeWay ? 'tw-w-[318px]' : 'tw-w-[210px]')

/** Tablet / desktop (≥ md): one row — teams · badges + status · odds columns. */
const DesktopRow = ({ match, sportName, threeWay, onOpen }: MatchCardProps) => {
  const [teamA, teamB] = splitTeams(match.name, match.sportId)
  const runners = getMainRunners(match)
  const { home, draw, away } = get1x2(runners)
  const open = () => onOpen(match)

  return (
    <div className='tw-hidden tw-items-center tw-gap-3 tw-px-3 tw-py-2 md:tw-flex'>
      <button type='button' onClick={open} className='tw-flex tw-min-w-0 tw-flex-1 tw-flex-col tw-gap-1 tw-text-left'>
        {[teamA, teamB].filter(Boolean).map((team) => (
          <span key={team} className='tw-flex tw-items-center tw-gap-2 tw-text-strong'>
            <SportIcon name={sportName} className='tw-h-4 tw-w-4 tw-shrink-0 tw-text-muted-fg' />
            <span className='tw-truncate'>{team}</span>
          </span>
        ))}
      </button>
      <div className='tw-flex tw-shrink-0 tw-items-center tw-justify-end tw-gap-2'>
        <MarketBadges match={match} />
        <Status match={match} />
      </div>
      <div className={`tw-shrink-0 ${oddsAreaWidth(threeWay)}`}>
        {!runners.length ? (
          <button
            type='button'
            onClick={open}
            className='tw-flex tw-h-9 tw-w-full tw-items-center tw-justify-center tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-sky-300 tw-bg-sky-50 tw-text-strong tw-text-link'
          >
            More Markets <LuChevronRight className='tw-h-4 tw-w-4' />
          </button>
        ) : isSuspended(runners) ? (
          <SuspendedBlock className='tw-h-9' />
        ) : (
          <div className='tw-flex tw-justify-between tw-gap-2'>
            <PairColumn runner={home} onOpen={open} />
            {threeWay && <PairColumn runner={draw} onOpen={open} />}
            <PairColumn runner={away} onOpen={open} />
          </div>
        )}
      </div>
      {/* lines the odds columns up with the league header labels, which sit left of its chevron */}
      <span className='tw-w-3 tw-shrink-0' aria-hidden />
    </div>
  )
}

const MatchCard = (props: MatchCardProps) => (
  <div className='tw-border-0 tw-border-b tw-border-solid tw-border-line last:tw-border-b-0'>
    <MobileCard {...props} />
    <DesktopRow {...props} />
  </div>
)

export default React.memo(MatchCard)
