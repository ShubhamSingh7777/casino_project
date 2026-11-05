import React from 'react'
import dayjs from 'dayjs'
import casinoService from '../../../services/casino.service'
import { SingleDate } from '../../../shared/DateRange'
import { Card } from '../../ui/PageHeader'
import { Button, labelClass } from '../../ui/Button'
import PendingReport from './PendingReport'

// Spec pages (admin prompt §4.x) whose endpoints this backend does not have yet.

const LIVE_CASINO_PROVIDERS = [
  'Ezugi', 'Super Spade', 'Slot 3 | Holi', 'Evolution', 'CockFight', 'Ludo Classic', 'PopTheBall', 'Binary', 'Slot 2', 'Slot',
  'vivogamepoints-LuckyStreak', 'Rummy', 'Ludo Lands', 'vivo gaming', 'snakes and ladders', 'Smart Soft', 'Astar Game', 'Creedroomz',
  'Dragoon soft', 'Tembo', 'Spribe', 'Pascal Game | Popok', 'Lottery', 'Scratch', 'Bet Core', 'Darwin', 'Jilli', 'Red Carat', 'Gemini',
  'Amigo', 'Pocket Game', 'EGT', 'EXA', 'Studio 21', 'Play Tech', 'GVI', 'Beon Game', 'King Midas', 'Aviator', 'EXA (New)', 'Dim Fantasy',
]

// casino names come from the existing game list API
const casinoNames = () =>
  casinoService.getCasinoList().then((res: any) => (res?.data?.data || []).map((g: any) => g.title).filter(Boolean) as string[])

/** §4.10 */
export const UserHistory = () => (
  <PendingReport title='User History' crumbs={['Reports', 'User History']} tabs={['Login History', 'Change Password History']} user range={{}} columns={['Username', 'Date', 'IP', 'Detail']} />
)

/** §4.12 */
export const OurCasinoResult = () => (
  <PendingReport title='Our Casino Result' crumbs={['Reports', 'Our Casino Result']} date selects={[{ label: 'Casino', options: casinoNames }]} columns={['Market Id', 'Winner']} />
)

/** §4.13 */
export const LiveCasinoResult = () => (
  <PendingReport
    title='Live Casino Result'
    crumbs={['Reports', 'Live Casino Result']}
    tabs={['Settled Bets', 'Unsettled Bets']}
    user
    date
    selects={[{ label: 'Provider', options: LIVE_CASINO_PROVIDERS }]}
    columns={['Game Name', 'Type', 'Amount', 'Total', 'Date', 'Round Id', 'Transaction Id']}
  />
)

/** §4.14 */
export const SportbookReport = () => (
  <PendingReport
    title='Sportbook Report'
    crumbs={['Reports', 'Sportbook Report']}
    tabs={['Settled Bets', 'Unsettled Bets']}
    user
    date
    selects={[{ label: 'Type', options: ['Back', 'Lay'] }]}
    columns={['Round Id', 'Type', 'Amount', 'Total', 'Bet Id', 'Date']}
  />
)

/** §4.15 — date range clamped to 7 days */
export const TurnoverReport = () => (
  <PendingReport
    title='Turn Over'
    crumbs={['Reports', 'Turn Over']}
    info='You will be able to see the data of last 7 days only.'
    user
    range={{ maxDays: 7 }}
    selects={[{ label: 'Type', options: ['Sports', 'Casino'] }]}
    columns={['Loss Turn Over', 'Loss', 'Win Turn Over', 'Win', 'Total Turn Over', 'Total P/L']}
  />
)

/** §4.16 */
export const UserAuthentication = () => <PendingReport title='User Authentication' crumbs={['Reports', 'User Authentication']} loadOnMount columns={['Username', 'Authentication']} />

/** §4.17 */
export const FraudReport = () => (
  <PendingReport
    title='Fraud Report'
    crumbs={['Reports', 'Fraud Report']}
    loadOnMount
    columns={['S.No.', 'User Name', 'Event Name', 'Market Date', 'Market Name', 'Amount', 'Fraud Date', 'Remark', 'Action']}
  />
)

/** §4.6 — assign list + "User Creation" CSV download */
export const AssignAgent = () => {
  const [from, setFrom] = React.useState(dayjs().subtract(7, 'day'))
  const [to, setTo] = React.useState(dayjs())
  return (
    <PendingReport
      title='Assign Agent List'
      crumbs={['Assign Agent']}
      loadOnMount
      columns={['S.No.', 'User Name', 'Assign Agent Settings', 'Mobile Number', 'Depo Mobile Number', 'First Bonus Status']}
    >
      <Card>
        <h2 className='tw-mb-3 tw-text-[14px] tw-font-semibold tw-uppercase'>User Creation</h2>
        <div className='tw-flex tw-flex-wrap tw-items-end tw-gap-2'>
          <label className='tw-block'>
            <span className={labelClass}>From Date</span>
            <SingleDate value={from} onChange={setFrom} />
          </label>
          <label className='tw-block'>
            <span className={labelClass}>To Date</span>
            <SingleDate value={to} onChange={setTo} />
          </label>
          <Button disabled title='No API for this export yet'>
            Download CSV
          </Button>
        </div>
      </Card>
    </PendingReport>
  )
}
