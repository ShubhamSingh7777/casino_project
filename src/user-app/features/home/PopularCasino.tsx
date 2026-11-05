import React from 'react'
import { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LuSparkles } from '../../icons'
import ICasinoMatch from '../../../models/ICasinoMatch'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectCasinoMatchList, setHomePageCasinoMatch } from '../../../redux/actions/casino/casinoSlice'
import casinoService from '../../../services/casino.service'
import { DEFAULT_CASINO_IMAGE, getCasinoImage, sortCasinoGames } from '../../../utils/casino-images'
import { GameGridSkeleton } from '../../components/Skeleton'
import { useUserSession } from '../../hooks/useUserSession'

const POPULAR_COUNT = 12

const GameTile = ({ game, onOpen }: { game: ICasinoMatch; onOpen: (g: ICasinoMatch) => void }) => (
  <button
    type='button'
    onClick={() => onOpen(game)}
    className='tw-group tw-relative tw-overflow-hidden tw-rounded-[10px] tw-bg-gray-200 tw-text-left'
  >
    <img
      src={getCasinoImage(game)}
      alt={game.title}
      loading='lazy'
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = DEFAULT_CASINO_IMAGE
      }}
      className='tw-aspect-[4/3] tw-w-full tw-object-cover tw-transition-transform group-hover:tw-scale-105'
    />
    <span className='tw-absolute tw-inset-x-0 tw-bottom-0 tw-truncate tw-bg-gradient-to-t tw-from-black/80 tw-to-transparent tw-px-2 tw-pb-1.5 tw-pt-4 tw-text-xs tw-font-bold tw-text-white'>
      {game.title}
    </span>
    {game.isDisable && (
      <span className='tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-black/50 tw-text-xs tw-font-bold tw-text-white'>
        Suspended
      </span>
    )}
  </button>
)

const PopularCasino = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const games = useAppSelector<ICasinoMatch[]>(selectCasinoMatchList)
  const { isLoggedIn } = useUserSession()

  React.useEffect(() => {
    if (games.length) return
    casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
      dispatch(setHomePageCasinoMatch(res.data.data))
    })
  }, [])

  const popular = React.useMemo(() => sortCasinoGames(games || []).slice(0, POPULAR_COUNT), [games])

  // Same suspended rule as the legacy CasinoListItem. Logged out → standalone Sign-In page (v2 §9).
  const openGame = (game: ICasinoMatch) => {
    if (game.isDisable || game.match_id === -1) return toast.warn('This game is suspended by admin, please try again later')
    const path = `${game.slug}/${game.match_id}`
    navigate(isLoggedIn ? `/casino/${path}` : `/casino-detail/${path}`)
  }

  return (
    <section className='tw-mb-2'>
      <h2 className='tw-flex tw-items-center tw-gap-2 tw-px-1 tw-py-2 tw-text-header'>
        <LuSparkles className='tw-h-5 tw-w-5 tw-text-amber-500' /> Popular
      </h2>
      {!games.length ? (
        <GameGridSkeleton count={4} />
      ) : (
        <div className='tw-grid tw-grid-cols-2 tw-gap-1.5 sm:tw-grid-cols-3 lg:tw-grid-cols-4'>
          {popular.map((game) => (
            <GameTile key={game.match_id ?? game.title} game={game} onOpen={openGame} />
          ))}
        </div>
      )}
    </section>
  )
}

export default PopularCasino
