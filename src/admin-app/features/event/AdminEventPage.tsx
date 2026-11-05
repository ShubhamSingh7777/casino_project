import React from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import IBet, { IBetType } from '../../../models/IBet'
import BetLock from '../../pages/bet-lock/bet-lock'
import UserBookPopup from '../../../pages/odds/components/user-book-popup'
import { useEventData } from '../../../user-app/features/event/useEventData'
import { useMyBets } from '../../../user-app/features/event/useMyBets'
import { FANCY_GROUPS, fancyGroupOf } from '../../../user-app/features/event/market-utils'
import MarketTable from '../../../user-app/features/event/MarketTable'
import FancyTable, { visibleFancies } from '../../../user-app/features/event/FancyTable'
import { getSeriesName } from '../../../user-app/utils/match'
import { useAppSelector } from '../../../redux/hooks'
import { selectBookMarketUser } from '../../../redux/actions/bet/betSlice'
import { Card } from '../../ui/PageHeader'
import { Button } from '../../ui/Button'
import { Column, DataTable } from '../../ui/DataTable'
import { Modal, Tabs } from '../../ui/Modal'

type BetTab = 'matched' | 'unmatched'
const noop = () => undefined
const rate = (b: IBet) => (b.marketName === 'Fancy' && b.gtype !== 'fancy1' ? b.volume : b.odds)

const betColumns: Column<IBet>[] = [
  { key: 'userName', header: 'UserName', sortable: true },
  { key: 'selectionName', header: 'Nation' },
  { key: 'rate', header: 'Rate', align: 'right', value: rate },
  { key: 'stack', header: 'Amount', align: 'right', sortable: true },
  { key: 'createdAt', header: 'Date', value: (b) => (b.createdAt ? moment(b.createdAt).format('DD/MM HH:mm:ss') : '') },
]

/**
 * Admin event view (spec §4.24): read-only markets (book from the agent side), legacy Bet Lock /
 * User Book tools, and the match's bets. Same data + socket hooks as the user event page.
 */
const AdminEventPage = () => {
  const { matchId = '' } = useParams()
  const data = useEventData(matchId)
  const bets = useMyBets(data.match?.matchId)
  const bookUser = useAppSelector(selectBookMarketUser)
  const [tab, setTab] = React.useState<BetTab>('matched')
  const [moreOpen, setMoreOpen] = React.useState(false)

  const { match } = data
  if (data.loading && !match) return <p className='tw-py-10 tw-text-center tw-text-ad-muted'>Loading…</p>
  if (!match) return <p className='tw-py-10 tw-text-center tw-text-ad-muted'>{data.failed ? 'Could not load this event.' : 'Event not found.'}</p>

  const fancies = visibleFancies(data.fancies, data.fancyLive)
  const shownBets = (bets || []).filter((b) => (tab === 'unmatched' ? b.type === IBetType.UnMatch : b.type !== IBetType.UnMatch))
  const sportTone = Number(match.sportId) === 1 ? 'tw-bg-[#2bb57a]' : 'tw-bg-black/40'

  return (
    <div>
      <div className={`tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-rounded tw-px-3 tw-py-2 ${sportTone}`}>
        <h1 className='tw-text-[14px] tw-font-semibold tw-uppercase'>
          {getSeriesName(match)} &gt; {match.name}
        </h1>
        <span className='tw-text-[12px]'>{moment.utc(match.matchDateTime).add(60, 'minutes').format('DD/MM/YYYY HH:mm:ss')}</span>
      </div>

      <div className='tw-grid tw-gap-3 xl:tw-grid-cols-[minmax(0,1fr)_380px]'>
        <div className='tw-min-w-0'>
          {/* legacy bet lock / user book buttons (react-bootstrap), on a light strip */}
          <div className='ad-legacy-surface tw-mb-3 !tw-min-h-0'>
            <BetLock markets={data.markets} />
          </div>
          <div className='ua-ui'>
            {data.markets.map((m) => (
              <MarketTable key={m.marketId} market={m} live={data.live[m.marketId]} onBet={noop} bookSign={-1} />
            ))}
            {FANCY_GROUPS.map((g) => {
              const list = fancies.filter((f) => fancyGroupOf(f) === g.key)
              return list.length ? <FancyTable key={g.key} title={g.label} fancies={list} live={data.fancyLive} onBet={noop} bookSign={-1} /> : null
            })}
            {!data.markets.length && !fancies.length && <p className='tw-py-6 tw-text-center tw-text-ad-muted'>No markets open right now.</p>}
          </div>
        </div>

        <Card className='tw-h-max'>
          <div className='tw-mb-2 tw-flex tw-items-center tw-justify-between'>
            <h2 className='tw-text-[13px] tw-font-semibold tw-uppercase'>My Bets</h2>
            <Button variant='dark' size='sm' onClick={() => setMoreOpen(true)}>
              View More
            </Button>
          </div>
          <Tabs<BetTab>
            tabs={[
              { key: 'matched', label: 'Matched Bets' },
              { key: 'unmatched', label: 'Unmatched Bets' },
            ]}
            active={tab}
            onChange={setTab}
          />
          <DataTable
            columns={betColumns}
            rows={shownBets}
            rowKey={(b, i) => String(b._id || i)}
            searchable={false}
            emptyText='No records found'
            rowClassName={(b) => (b.isBack ? 'tw-bg-[#72bbef]/25' : 'tw-bg-[#faa9ba]/25')}
          />
        </Card>
      </div>

      <Modal open={moreOpen} title='View More' onClose={() => setMoreOpen(false)} width='tw-max-w-5xl'>
        <Tabs<BetTab>
          variant='pill'
          tabs={[
            { key: 'matched', label: 'Matched Bets' },
            { key: 'unmatched', label: 'Unmatched Bets' },
          ]}
          active={tab}
          onChange={setTab}
        />
        <DataTable
          columns={[...betColumns, { key: 'ip', header: 'IP', value: (b) => b.ipAddress }, { key: 'marketName', header: 'Market' }]}
          rows={shownBets}
          rowKey={(b, i) => String(b._id || i)}
          rowClassName={(b) => (b.isBack ? 'tw-bg-[#72bbef]/25' : 'tw-bg-[#faa9ba]/25')}
        />
      </Modal>

      {bookUser?.matchId ? <UserBookPopup /> : null}
    </div>
  )
}

export default AdminEventPage
