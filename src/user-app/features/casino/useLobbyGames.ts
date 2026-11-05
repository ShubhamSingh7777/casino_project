import React from 'react'
import { AxiosResponse } from 'axios'
import ICasinoMatch from '../../../models/ICasinoMatch'
import casinoService from '../../../services/casino.service'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { selectCasinoMatchList, setHomePageCasinoMatch } from '../../../redux/actions/casino/casinoSlice'
import { getCasinoImage, sortCasinoGames } from '../../../utils/casino-images'
import { LOBBIES, LobbyGame, LobbyType, ownCategory } from './lobbies'

/** Games of a lobby grouped by tab (provider). The live lobby adds an "Own" tab with our own games. */
export const useLobbyGames = (type: LobbyType) => {
  const config = LOBBIES[type]
  const dispatch = useAppDispatch()
  const ownList = useAppSelector<ICasinoMatch[]>(selectCasinoMatchList)
  const [intGames, setIntGames] = React.useState<LobbyGame[] | null>(null)

  React.useEffect(() => {
    setIntGames(null)
    let cancelled = false
    casinoService
      .getIntCasinoList(config.apiType)
      .then((res: AxiosResponse<any>) => {
        if (cancelled) return
        const games: LobbyGame[] = (res.data?.result || []).flatMap((p: any) =>
          (p.games || [])
            .filter((g: any) => g.identifier)
            .map((g: any) => ({
              key: `${p._id}-${g.identifier}`,
              name: g.game_name,
              image: g.game_image1 || g.game_image,
              provider: p._id || 'Other',
              category: g.category,
              identifier: g.identifier,
            })),
        )
        setIntGames(config.filter ? games.filter(config.filter) : games)
      })
      .catch(() => !cancelled && setIntGames([]))
    return () => {
      cancelled = true
    }
  }, [config])

  React.useEffect(() => {
    if (!config.withOwn || ownList.length) return
    casinoService.getCasinoList().then((res: AxiosResponse<any>) => dispatch(setHomePageCasinoMatch(res.data.data)))
  }, [config.withOwn])

  const tabs = React.useMemo(() => {
    const byTab: Record<string, LobbyGame[]> = {}
    if (config.withOwn) {
      byTab.Own = sortCasinoGames(ownList || []).map((g) => ({
        key: `own-${g.match_id}-${g.slug}`,
        name: g.title,
        image: getCasinoImage(g),
        provider: 'Own',
        category: ownCategory(g.title),
        disabled: g.isDisable || g.match_id === -1,
        own: g,
      }))
    }
    byTab.All = intGames || []
    ;(intGames || []).forEach((g) => (byTab[g.provider] = byTab[g.provider] || []).push(g))
    return byTab
  }, [config.withOwn, ownList, intGames])

  return { tabs, loading: intGames === null }
}
