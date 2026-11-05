import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import ICasinoMatch from '../../../models/ICasinoMatch'
import casinoService from '../../../services/casino.service'
import { DEFAULT_CASINO_IMAGE, getCasinoImage, sortCasinoGames } from '../../../utils/casino-images'
import { Card, PageHeader } from '../../ui/PageHeader'
import { inputClass } from '../../ui/Button'
import { LuSearch } from '../../ui/icons'

// Same lists the legacy admin header menu loaded.
const SOURCES = {
  our: { title: 'Our Casino', load: () => casinoService.getCasinoList() },
  virtual: { title: 'Virtual Casino', load: () => casinoService.getVirtualCasinoList() },
  premium: { title: 'Premium Casino', load: () => casinoService.getPremiumCasinoList() },
}
type Source = keyof typeof SOURCES

/** /admin/casinos/our | virtual | premium (spec §4.18 / §4.21 / §4.22): searchable tile grid → admin game view. */
const CasinoGrid = () => {
  const { type } = useParams()
  return type && type in SOURCES ? <Grid key={type} source={type as Source} /> : <Navigate to='/admin/casinos/our' replace />
}

const Grid = ({ source }: { source: Source }) => {
  const { title, load } = SOURCES[source]
  const [games, setGames] = React.useState<ICasinoMatch[] | null>(null)
  const [query, setQuery] = React.useState('')

  React.useEffect(() => {
    load()
      .then((res: AxiosResponse<any>) => setGames(sortCasinoGames(res.data?.data || [])))
      .catch(() => setGames([]))
  }, [source])

  const q = query.trim().toLowerCase()
  const shown = (games || []).filter((g) => !q || g.title?.toLowerCase().includes(q))

  return (
    <div>
      <PageHeader title={title} />
      <Card>
        <label className='tw-mb-3 tw-ml-auto tw-flex tw-max-w-xs tw-items-center tw-gap-2'>
          <span>Search</span>
          <span className='tw-relative tw-flex-1'>
            <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label='Search games' className={`${inputClass} tw-pr-8`} />
            <LuSearch className='tw-absolute tw-right-2 tw-top-2.5 tw-h-4 tw-w-4 tw-text-[#6c757d]' aria-hidden />
          </span>
        </label>
        {games === null ? (
          <p className='tw-py-6 tw-text-center tw-text-ad-muted'>Loading…</p>
        ) : !shown.length ? (
          <p className='tw-py-6 tw-text-center tw-text-ad-muted'>There are no records to show</p>
        ) : (
          <div className='tw-grid tw-grid-cols-2 tw-gap-2 sm:tw-grid-cols-3 lg:tw-grid-cols-4 2xl:tw-grid-cols-6'>
            {shown.map((g) => (
              <Link key={`${g.slug}-${g.match_id}`} to={`/admin/casino/${g.slug}`} className='tw-group tw-relative tw-aspect-square tw-overflow-hidden tw-rounded tw-bg-black/30'>
                <img
                  src={getCasinoImage(g)}
                  alt={g.title}
                  loading='lazy'
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src = DEFAULT_CASINO_IMAGE
                  }}
                  className='tw-h-full tw-w-full tw-object-cover tw-transition-transform group-hover:tw-scale-105'
                />
                <span className='tw-absolute tw-inset-x-0 tw-bottom-0 tw-truncate tw-bg-black/60 tw-px-2 tw-py-1 tw-text-[12px] tw-font-semibold'>{g.title}</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default CasinoGrid
