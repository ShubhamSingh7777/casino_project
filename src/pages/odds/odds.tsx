import React, { useState } from 'react'
import IMarket from '../../models/IMarket'
import LFancy from '../../models/LFancy'
import sportsService from '../../services/sports.service'
import { useParams } from 'react-router-dom'
import IMatch from '../../models/IMatch'
import { IUserBetStake } from '../../models/IUserStake'
import { useDispatch } from 'react-redux'
import { betPopup, selectFancyType } from '../../redux/actions/bet/betSlice'
import IBet from '../../models/IBet'
import { setCurrentMatch } from '../../redux/actions/sports/sportSlice'
import Score from './components/score'
import { useWebsocketUser } from '../../context/webSocketUser'
import { useWebsocket } from '../../context/webSocket'
import { useAppSelector } from '../../redux/hooks'
import { selectUserData } from '../../redux/actions/login/loginSlice'
import { isMobile } from 'react-device-detect'
import MatchDetail from './components/match-detail'
import MatchDetailMobile from './components/match-detail-mobile'
import axios from 'axios'
import { RoleType } from '../../models/User'
import authService from '../../services/auth.service'
import { selectInitApp } from '../../redux/actions/common/commonSlice'
import T20 from '../CasinoList/component/_common/Rules/T20'

type MarketData = {
  markets: IMarket[]
  fancies: LFancy[]
  currentMatch: IMatch
  stake: IUserBetStake
}

const Odds = () => {
  const [marketDataList, setMarketDataList] = React.useState<MarketData>({} as MarketData)
  const [t10Channel, setT10Chanel] = React.useState<any>()
  const [isTvShow, setIsTvShow] = React.useState<boolean>(false)
  const userState = useAppSelector(selectUserData)
  const { matchId } = useParams()
  const dispatch = useDispatch()
  const selectFancyT = useAppSelector(selectFancyType)
  const initApp = useAppSelector(selectInitApp)
  const [iframe, setIframe] = useState('')
  const [urls, setUrls] = useState<any>();

  const { socketUser } = useWebsocketUser()
  const { socket } = useWebsocket()

  React.useEffect(() => {
    const onAddNewMarket = (newMarket: any) => {
      setMarketDataList((prev) => {
        if (prev.markets && prev.markets.find((m: any) => m.marketId?.toString() === newMarket.marketId?.toString())) {
          return prev;
        }
        return { ...prev, markets: [...(prev.markets || []), newMarket] };
      });
    };
    const onRemoveMarket = (removedMarket: any) => {
      setMarketDataList((prev) => {
        if (!prev.markets) return prev;
        return { ...prev, markets: prev.markets.filter((m: any) => m.marketId?.toString() !== removedMarket.marketId?.toString()) };
      });
    };
    const onGetMarketData = (marketData: any) => {
      setMarketDataList((prev) => {
        if (prev.markets && prev.markets.find((m: any) => m.marketId?.toString() === marketData.marketId?.toString())) {
          return prev; // Already exists, match-odds.tsx will handle the odds updates
        }
        // Auto-add the market if it's missing from DB but we have live data
        return { ...prev, markets: [...(prev.markets || []), marketData] };
      });
    };

    socket.on('addNewMarket', onAddNewMarket);
    socket.on('removeMarket', onRemoveMarket);
    socket.on('getMarketData', onGetMarketData);

    return () => {
      socket.off('addNewMarket', onAddNewMarket);
      socket.off('removeMarket', onRemoveMarket);
      socket.off('getMarketData', onGetMarketData);
    };
  }, [socket]);

  const fetchOddsDetail = async () => {
    try {
      axios
        .all([
          sportsService.getMatchById(matchId!),
          sportsService.getMarketList(matchId!),
          sportsService.getFancyList(matchId!),
        ])
        .then(
          axios.spread((currentMatch, marketData, fancyData) => {
            dispatch(setCurrentMatch(currentMatch.data.data.match))
            // console.log(currentMatch.data.data.stake,'stack data')
            setMarketDataList({
              currentMatch: currentMatch.data.data.match,
              fancies: fancyData.data.data,
              markets: marketData.data.data.markets,
              stake: currentMatch.data.data.stake,
            })
          }),
        )
    } catch (error) {
      fetchOddsDetail()
    }
  }

  React.useEffect(() => {
    if (currentMatch?.sportId) {
      let matchId: any = currentMatch.sportId === 7 ? currentMatch?.seriesId?.toString() : currentMatch?.matchId?.toString()
      sportsService.getScoreUrl(currentMatch?.sportId?.toString(), matchId).then((data) => {
        let datas = data.data
        let updates = {
          score: datas?.scoreTv?.scorecard_url
        }
        setUrls(updates);
      })
    }
  }, [marketDataList])

  const updateTv = async () => {
    if (currentMatch?.sportId) {
      let matchId: any = currentMatch?.matchId?.toString()
      sportsService.getUrls(currentMatch?.sportId?.toString(), matchId).then((data) => {
        let datas = data.data
        let tv = datas?.tv?.stream_url
        setUrls((prev: any) => ({ ...prev, tv }))
        setIsTvShow(!isTvShow)

      })
    }
  }

  const tvUpdate = (url: string) => {
    setUrls((prev: any) => ({ ...prev, tv: url }))
  }


  React.useEffect(() => {
    return () => {
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }))
    }
  }, [])


  React.useEffect(() => {
    if (initApp.event) {
      sportsService
        .getFancyList(matchId!, selectFancyT)
        .then((fancyData) => {
          //setMarketDataList({ ...marketDataList, fancies: fancyData.data.data })
        })
        .catch((e) => console.log(e.message))
    }
  }, [initApp])

    React.useEffect(() => {
      if (matchId) {
        (window as any).oddsStartTime = Date.now();
        socket.emit('joinRoom', matchId);
      }
      fetchOddsDetail()
    }, [matchId, socket])

  const fetchT10Stream = async () => {
    if (currentMatch?.isT10) {
      const resp = await authService.gett10Streams()
      if (resp?.data) {
        const dataFilter = resp?.data?.filter(
          (Item: any) => parseInt(Item.gameId) == currentMatch?.matchId,
        )
        setT10Chanel(dataFilter?.[0]?.channel)
      }
    }
  }

  React.useEffect(() => {
    ; (async () => {
      if (selectFancyT && Object.keys(marketDataList).length > 0) {
        const fancyData = await sportsService.getFancyList(matchId!, selectFancyT)
        setMarketDataList({ ...marketDataList, fancies: fancyData.data.data })
      }
    })()
  }, [selectFancyT])

  React.useEffect(() => {
    if (userState.user._id) {
      socketUser.emit('joinRoomMatchIdWUserId', `${userState.user._id}-${matchId}`)
      socketUser.on('connect', () => {
        socketUser.emit('joinRoomMatchIdWUserId', `${userState.user._id}-${matchId}`)
      })
    }
  }, [userState.user])

  React.useEffect(() => {
    fetchT10Stream()
  }, [marketDataList])


  const scoreBoard = () => {

    if (currentMatch) {
      return (
        <iframe
          style={{ width: '100%', height: 'auto' }}
          src={urls?.score}
        ></iframe>
      )
    }


  }

  const t10Tv = (height: string) => {
    if (currentMatch && currentMatch.isT10)
      return (
        <div className='t10-iframe'>
          <iframe
            style={{ height: `${height}px` }}
            src={`https://live.cricketid.xyz/directStream?gmid=${currentMatch.matchId}&key=Snnsksnshiwjsb82773737bdbsnsnsb`}
          ></iframe>
        </div>
      )
    else <div></div>
  }

  const otherTv = () => {
    return (
      !currentMatch?.isT10 && (
        <div className='card m-b-10' style={{ border: '0px none' }}>
          {!isMobile ? (
            <div className='card-header' style={{ borderRadius: "4px" }}>
              <h6 onClick={updateTv} className='card-title'>
                Live Match
                <span className='float-right'>
                  <i className='fa fa-tv' /> live stream started
                </span>
              </h6>
            </div>
          ) : (
            ''
          )}
          {!isMobile && isTvShow && (
            <div className='card-body p0'>
              <iframe
                style={{ width: '100%', height: '250px' }}
                src={`${urls?.tv}`}
              ></iframe>
            </div>
          )}
          {isMobile && (
            <div className='card-body p0'>
              <iframe
                style={{ width: '100%', height: '250px' }}
                src={urls?.tv}
              ></iframe>
            </div>
          )}
        </div>
      )
    )
  }
  const { currentMatch, markets, fancies } = marketDataList

  // React.useEffect(() => {
  //   const fetchIframeUrl = async () => {
  //     if (currentMatch) {
  //       try {
  //         const res = await axios.get(
  //           `https://api.cricketid.xyz/tv_url?gmid=${currentMatch.matchId}&sid=${currentMatch.sportId}&key=Snnsksnshiwjsb82773737bdbsnsnsb`
  //         );
  //         setIframe(res.data.tv_url);
  //       } catch (error) {
  //         console.error('Error fetching scoreboard URL:', error);
  //       }
  //     }
  //   };

  //   fetchIframeUrl();
  // }, [currentMatch]);


  React.useEffect(() => {
    //  console.log(currentMatch,'marketList')
    //  console.log(fancies,'fancies')
    //  console.log(marketDataList,'marketdatalist')
    //  console.log(matchId,'matchid')
  }, [currentMatch, fancies, marketDataList, matchId, markets])

  const role = userState?.user?.role;
  const useMobileView =
    isMobile && (role === RoleType.user || !role);  // <-- important!

  return useMobileView ? (
    <MatchDetailMobile
      currentMatch={currentMatch}
      fancies={fancies}
      scoreBoard={scoreBoard}
      marketDataList={marketDataList}
      matchId={matchId}
      t10Tv={t10Tv}
      markets={markets}
      otherTv={otherTv}
      tvUpdate={tvUpdate}
    />
  ) : (
    <MatchDetail
      currentMatch={currentMatch}
      fancies={fancies}
      scoreBoard={scoreBoard}
      marketDataList={marketDataList}
      matchId={matchId}
      markets={markets}
      t10Tv={t10Tv}
      otherTv={otherTv}

    />
  );
}
export default React.memo(Odds)