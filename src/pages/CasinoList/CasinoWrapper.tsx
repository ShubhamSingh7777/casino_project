import React, { MouseEvent, useState } from "react";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import MyBetComponent from "../odds/components/my-bet.component";
import { useParams } from "react-router-dom";
// import SoRules from './component/_common/Rules/SoRules'
import CasinoRulesDetail from "./CasinoRulesDetail";
import casinoService from "../../services/casino.service";
import { useDispatch } from "react-redux";
import { setCasinoCurrentMatch } from "../../redux/actions/casino/casinoSlice";
import LuckSeven from "./component/LuckSeven";
import CasinoQueenLayout from "./component/casinoQueen/CasinoQueenLayout";
import AaaCasino from "./component/AaaCasino";
import BollywoodCasino from "./component/BollywoodCasino";
import PlaceBetBox from "../odds/components/place-bet-box";
import IMarket from "../../models/IMarket";
import { IUserBetStake } from "../../models/IUserStake";
import userService from "../../services/user.service";
import LastResults from "./component/LastResults";
import Baccarat from "./component/Baccarat";
import Card32A from "./component/Card32A";
import DragonTigerA from "./component/dragonTigerA";
import OneDayTeen from "./component/onDayTeen";
import CasinoTitle from "./component/CasinoTitle";
import CasinoTimer from "./CasinoTimer";
import Onedaypoker from "./component/Onedaypoker";
import Twentydaypoker from "./component/Twentydaypoker";
import { isMobile } from "react-device-detect";
import { Tab, Tabs } from "react-bootstrap";
import {
  betPopup,
  selectBetCount,
  selectBetPopup,
  setBetCount,
  setbetlist,
  setBookMarketList,
} from "../../redux/actions/bet/betSlice";
import { useAppSelector } from "../../redux/hooks";
import OnedaypokerRules from "./component/_common/Rules/Onedaypoker";
import Dtl20Layout from "./component/dtl20";
import Dragontiger1Day from "./component/dragontiger1Day";
import TeenPatti20 from "./component/teen20";
import Cmeter20 from "./component/cmeter20";
import Sixplayerpoker from "./component/sixplayerpoker";
import Race20 from "./component/race20";
import TestTp from "./component/testtp";
import Card3JLayout from "./component/card3j";
import SoRules from "./component/_common/Rules/SoRules";
import OpenTeen from "./component/openTeen";
import SuperOver from "./component/superOver";
import Score from "./component/_common/score";
import Openteenpatti from "./component/_common/Rules/Openteenpatti";
import Cricketv from "./component/_common/Rules/Crickettv";
import TwentyCricket from "./component/20Cricket";
import { calculateTotalNumbersFromString } from "../../utils/helper";
import { toast } from "react-toastify";
import Card32B from "./component/Card32B";
import Casinowar from "./component/casinowar";
import AndarBhar from "./component/andarBhar";
import AndarBhar2 from "./component/andarBhar2";
import T20 from "./component/_common/Rules/T20";
import CricketVideoPopup20 from "./component/20CricketVideoPopup";
import Instantworli from "./component/instantworli";
import Worli from "./component/worli";
import { selectUserData } from "../../redux/actions/login/loginSlice";
import { useWebsocketUser } from "../../context/webSocketUser";
import axios from "axios";
import TwocardsTeen from "./component/2Cardsteen";
import TwennineCard from "./component/29CardBaccarat";
import RaceSeventeen from "./component/casinoQueen/race17";
import Goal from "./component/goal";
import LuckyFifteen from "./component/LuckyFifteen";
import BallByBall from "./component/BallbyBall";
import Trio from "./component/trio";
import Kbc from "./component/kbc";
import Duskadum from "./component/duskadum";
import TeenpattiPoison1Day from "./component/teenpattiPoison";
import Cmeter1 from "./component/cmeter1";
import TeenpattiJoker from "./component/teenpattijoker";
import OneCard1Day from "./component/oneCardOneDay";
import Lottery from "./component/Lottery";
import NoteNumber from "./component/noteNumber";
import OneCard2020 from "./component/oneCard2020";
import Teenpatti2O from "./component/Teenpatti2.0";
import UnlimitedJoker1Day from "./component/unlimitedJoker1Day";
import UnlimitedJoker2020 from "./component/unlimitedjoker2020";
import TheTrap from "./component/Thetrap";
import Roulette from "./component/roulette";
import Mogambo from "./Mongambo";
import Dolidana from "./component/doliDana";
import VipTeenPattiOneDay from "./component/VipTeenPattiOneDay";
import RouletteFrame from "./component/RouletteFrame";
import Worli3 from "./component/worli3";
import MarketStrip from "./component/MarketStrip";
import Sicbo from "./component/Sicbo";
// import datajson from './Casinojson'

type MarketData = {
  markets: IMarket[];
  stake: IUserBetStake;
};
const CasinoWrapper = (props: any) => {
  const navigate = useNavigateCustom();
  const [rulesModel, setRulesModel] = React.useState<boolean>(false);
  const [casinoMatchData, setCasinoMatchData] = React.useState<any>({} as any);
  const { gameCode } = useParams();
  const dispatch = useDispatch();
  const [liveMatchData, setLiveMatchData] = React.useState<any>({} as any);
  const [marketDataList, setMarketDataList] = React.useState<MarketData>(
    {} as MarketData
  );
  // worli 3
  const [worli3Data, setWorli3Data] = React.useState<any[]>([])
  const [worli3Results, setWorli3Results] = React.useState<any[]>([])
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null)
  const [updateOdds, setUpdateOdds] = React.useState<any>(undefined);
  const betValues = useAppSelector(selectBetPopup);
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const [tv, setTv] = React.useState("");
  const isFetching = React.useRef(false);
  const [showBetPopup, setShowBetPopup] = React.useState(false);
  const key = btoa(`https://stream-s-43.uhdmovies.online/casino-stream?id=${gameCode}`);

  const marketList = React.useMemo<any[]>(() => {
    if (Array.isArray(worli3Data)) return worli3Data
    if (Array.isArray((worli3Data as any)?.data)) return (worli3Data as any).data
    return []
  }, [worli3Data])

  React.useEffect(() => {
    if (!selectedMarket && marketList.length > 0) {
      setSelectedMarket(marketList[0])
    }
  }, [marketList, selectedMarket])

  const [checkRoundIdChange, setCheckRoundIdChange] = useState("");

  const isMobileRoulette =
    isMobile &&
    ["roulette11", "roulette12", "roulette13","ourroullete"].includes(String(gameCode));

  let interValCasino: any = null;
  ///const [interVal, setIntervalObj] = React.useState<any>(null)
  const betCount = useAppSelector(selectBetCount);
  const showRules = () => {
    setRulesModel(true);
  };
  const showAllBet = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate.go("/unsettledbet");
  };
  React.useEffect(() => {
    if (userState.user._id) {
      socketUser.emit(
        "joinRoomMatchIdWUserId",
        `${userState.user._id}-${parseInt(casinoMatchData?.match_id)}`
      );
      socketUser.on("connect", () => {
        socketUser.emit(
          "joinRoomMatchIdWUserId",
          `${userState.user._id}-${parseInt(casinoMatchData?.match_id)}`
        );
      });
    }
  }, [userState.user, casinoMatchData?.match_id]);

  const getMatchLiveInfoInterval = async () => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;
    /// const ref = useRef();
    casinoService
      .getLiveCasinoData(gameCode)
      .then((res) => {
        // console.log(res.data,'_________api data')
        isFetching.current = false;
        const fullMarketData = res?.data?.data;
        /* ================== ✅ ADD THIS BLOCK ================== */
      if (gameCode === 'worli3') {
        const apiData = fullMarketData?.data
        const results = fullMarketData?.results
        setWorli3Data(apiData || [])
        setWorli3Results(results || [])
        isFetching.current = false
        return
      }
      /* ================== ✅ END ADD ================== */
        if (casinoMatchData?.match_id != fullMarketData.match_id) {
          dispatch(
            betPopup({
              isOpen: false,
              betData: { ...betValues.betData, stack: 0, pnl: 0 },
            })
          );
          dispatch(setBookMarketList({}));
          setLiveMatchData(fullMarketData);
          dispatch(setCasinoCurrentMatch(res?.data?.data));
        }
        setCasinoMatchData(fullMarketData);
        const liveMarket = fullMarketData?.event_data;
        const run: any = {};

        if (liveMarket?.market?.length > 0) {
          liveMarket?.market?.map((m: any) =>
            m?.Runners?.map((r: any) => {
              const data: any = { ...r };
              data["MarketName"] = m.MarketName;
              data["mid"] = fullMarketData.match_id;
              run[r?.sid || r?.sectionId] = data;
            })
          );
        }
        run["market"] = liveMarket?.market;
        run["desc"] = fullMarketData?.desc;

        run["cardsstring"] = fullMarketData?.cards;
        run["cards"] = {
          C1: fullMarketData?.C1,
          C2: fullMarketData?.C2,
          C3: fullMarketData?.C3,
          C4: fullMarketData?.C4,
          C5: fullMarketData?.C5,
          C6: fullMarketData?.C6,
          C7: fullMarketData?.C7,
          C8: fullMarketData?.C8,
          C9: fullMarketData?.C9,
          C10: fullMarketData?.C10,
          C11: fullMarketData?.C11,
          C12: fullMarketData?.C12,
          C13: fullMarketData?.C13,
          C14: fullMarketData?.C14,
          C15: fullMarketData?.C15,
          C16: fullMarketData?.C16,
          C17: fullMarketData?.C17,
        };
        setUpdateOdds(run);
      })
      .catch(() => {
        isFetching.current = false;
      });
  };

  const getMatchLiveInfo = async () => {
    casinoService.getCasinoDataById(gameCode).then((res) => {
      if (res?.data?.data?.isDisable) {
        toast.warn("This game is suspended by admin, please try again later");
        return navigate.go("/");
      }
    });

    casinoService.getLiveCasinoData(gameCode).then((res) => {
      if (res?.data?.data?.isDisable) {
        toast.warn("This game is suspended by admin, please try again later");
        return navigate.go("/");
      }
      setCasinoMatchData(res?.data?.data);
      setLiveMatchData(res?.data?.data);
      dispatch(setCasinoCurrentMatch(res?.data?.data));
    });
  };

  React.useEffect(() => {
    if (updateOdds && updateOdds["1"]) {
      if (updateOdds["1"].mid != checkRoundIdChange)
        setCheckRoundIdChange(updateOdds["1"].mid);
    }
  }, [updateOdds, checkRoundIdChange]);

  React.useEffect(() => {
    if (!interValCasino && gameCode)
      interValCasino = setInterval(getMatchLiveInfoInterval, 900);
    return () => {
      clearInterval(interValCasino);
    };
  }, [gameCode, casinoMatchData]);

  React.useEffect(() => {
    if (gameCode) getMatchLiveInfo();
    getUserStake();
    return () => {
      dispatch(setCasinoCurrentMatch({}));
      dispatch(setbetlist([] as any));
      dispatch(setBookMarketList({}));
      dispatch(setBetCount(0));
      //setIntervalObj(null)
    };
  }, [gameCode]);

  const getUserStake = () => {
    userService
      .getUserStake()
      .then((res) => {
        setMarketDataList({
          markets: [],
          stake: res.data.data.userStake,
        });
      })
      .catch((e) => {
        const error = e.response.data.message;
      });
  };
  const oneDayPokerDescription = (descript: string) => {
    const splitDesc = descript && descript != "" ? descript.split("##") : [];
    return (
      <div className="video-overlay-new right">
        <div className="winnertext mbc-5">
          <span className="tx-green">Winner</span> :{" "}
          {splitDesc?.length >= 0 && splitDesc[0]}
        </div>
        <div className="playeratexta mbc-5">
          {" "}
          <span className="tx-yello">A</span> :{" "}
          {splitDesc?.length >= 1 && splitDesc[1]}
        </div>
        <div className="playeratextb">
          <span className="tx-red">B</span> :{" "}
          {splitDesc?.length >= 2 && splitDesc[2]}
        </div>
      </div>
    );
  };
  const race2020Mobile = () => {
    const cardExtra = casinoMatchData?.desc
      ?.split(",")
      .filter((Item: string) => Item != "1");
    return (
      <span className="float-right">
        Total Card: {cardExtra && cardExtra.length} Total Point:{" "}
        {cardExtra && cardExtra.length > 0
          ? calculateTotalNumbersFromString(cardExtra.join(","))
          : 0}
      </span>
    );
  };
  const renderUiData = (gamecode: any) => {
    switch (gamecode) {
      case "queen":
        return (
          <CasinoQueenLayout
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "race17": //done
      case "race2":
        return (
          <RaceSeventeen lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "lucky7eu":
      case "lucky7":
      case "lucky5":
      case "lucky7eu2":
      case"plucky7":  
      case "vlucky7":
        return (
          <LuckSeven lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teen120":  //done
        return (
          <OneCard2020 lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "cmeter1": //done
        return <Cmeter1 lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "dt20": //done
      case "dt202": //done
      case "pdt20":  
        return (
          <DragonTigerA lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "aaa":
      case "aaa2":
      case "vaaa":  
        return (
          <AaaCasino lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "dum10":
        return <Duskadum lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "trio":
      case "vtrio":  
        return <Trio lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "pokerle": //done
      case "btable2": //done
      case "vbtable":          
        return (
          <BollywoodCasino
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "kbc":
        return <Kbc lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "teen": 
      case "teen3":   //done
      case "teen32":  //done
      case "teen33":  //done
      case "teen41":  //done
      case "teen42":  //done
      case "pteen": 
      case "vteen":
        return (
          <OneDayTeen lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "mogambo":
        return(
          <Mogambo lastOdds={updateOdds} liveMatchData={liveMatchData}/>
        )  
      case "teen62" :
        return(
          <VipTeenPattiOneDay lastOdds={updateOdds} liveMatchData={liveMatchData}/>
        ) 
      case "joker1":
        return (
          <UnlimitedJoker1Day
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "joker120":
        return (
          <UnlimitedJoker2020
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "baccarat":
      case "baccarat2":
        case "pbaccarat":
        return <Baccarat lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "poker6": //done
        return (
          <Sixplayerpoker lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "superover":
      case "cricketv3":
        case "superover2":
          case "superover3":  
        return (
          <SuperOver lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "trap": //done
        return <TheTrap lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "card32":
        case "pcard32":
        return <Card32A lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "race20": //done
        return <Race20 lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "cmatch20":
        return (
          <TwentyCricket
            checkRoundIdChange={checkRoundIdChange}
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "cmeter": //done
        return <Cmeter20 lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "card32eu":
        return <Card32B lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "poker":
        return (
          <Onedaypoker lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "poker20":
        return (
          <Twentydaypoker lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "sicbo":
      case "sicbo2":  
        return(
          <Sicbo lastOdds={updateOdds} liveMatchData={liveMatchData} />
        )  
      case "goal":
      case "goal2":  //done
        return <Goal lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "lucky15":
        return (
          <LuckyFifteen lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "ballbyball":
        return (
          <BallByBall lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teen8": //done
        return <OpenTeen lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "teen9": //done
        return <TestTp lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "dt6": //done
      case "pdt6":  
      case "vdt6":
        return (
          <Dragontiger1Day
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "poison":
      case "poison20":
        return (
          <TeenpattiPoison1Day
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
          />
        );
      case "joker20":
        return (
          <TeenpattiJoker lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "3cardj":
        return (
          <Card3JLayout lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "dtl20": //done
      case "vdtl20":  
        return (
          <Dtl20Layout lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "war":
        return (
          <Casinowar lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "lottcard":
        return <Lottery lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "ab20":
        return (
          <AndarBhar lastOdds={updateOdds} liveMatchData={casinoMatchData} />
        );
      case "abj":
        return (
          <AndarBhar2 lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teen20": //done
      case "teen20c": //done
      case "teen20b": //done
      case "teenmuf": //done
      case "pteen20":  
      case "vteenmuf":  
      case "vteen20":
        return (
          <TeenPatti20 lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teen1":
        return (
          <OneCard1Day lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teensin": //done
        return (
          <TwennineCard lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "patti2": //done
        return (
          <TwocardsTeen lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
        case "dolidana":
             return (
          <Dolidana lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "teen6":
        return (
          <Teenpatti2O lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "worliabc":
        return <Worli lastOdds={updateOdds} liveMatchData={liveMatchData} />;
      case "notenum":
        return (
          <NoteNumber lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
        case "roulette12":
      case "roulette13":
      case "roulette11":
        case "ourroullete":
        return(
         <Roulette lastOdds={updateOdds} liveMatchData={liveMatchData} />
        );
      case "worli2":
        return (
          <Instantworli
            lastOdds={updateOdds}
            liveMatchData={liveMatchData}
            checkRoundIdChange={checkRoundIdChange}
          />
        );
        case 'worli3':
        return <Worli3 markets={worli3Data} selectedMarket={selectedMarket} />
      default:
        break;
    }
  };
  return (
    <>
      {!isMobile ? (
        <div
          className={`row mtc-5 row5 casino-container-box ${
            gameCode === "cricket2020" ? "cc-20" : ""
          }`}
        >
                   {/* CENTER PLACE BET */}
  <div className="center-place-bet">
  {marketDataList.stake && (
    <PlaceBetBox stake={marketDataList.stake} />
  )}
</div>
          <div className="col-8 col-lg-8">
            <div className="card my-bet">
              <div className="card-header casino">
                <h6 className="card-title d-inline-block">
                 <b style={{textTransform: 'uppercase'}}>{gameCode === 'worli3' ? 'Matka Market' : liveMatchData?.title || ''}</b> 
                  <span
                    className="fw-12 text-underlin"
                    onClick={showRules}
                    style={{ marginLeft: "5px",textDecoration: 'underline',fontSize:'12px'}}
                  >
                   Rules
                  </span>
                  <span className="float-right" style={{marginTop:'5px'}}>
                   {gameCode === 'worli3' ? '' : <small> Round ID: {casinoMatchData.match_id} </small>}
                    {/* | Min:{" "}
                    {casinoMatchData.min} | Max: {casinoMatchData.max} */}
                  </span>
                </h6>
              </div>
              {gameCode === 'worli3' && (
                <MarketStrip
                  markets={marketList}
                  selectedMarketId={selectedMarket?.mid ?? null}
                  onSelect={(m) => setSelectedMarket(m)}
                />
              )}
              <div
                className={`card-body ${gameCode}`}
                style={{
                  padding: "0px",
                  position: "relative",
                  minHeight: "400px",
                }}
              >
                {!isMobile && casinoMatchData && casinoMatchData.scoreCard ? (
                  <Score scoreData={casinoMatchData.scoreCard} />
                ) : (
                  ""
                )}
                <div
                  style={{
                    padding: "0px",
                    position: "relative",
                    minHeight: "400px",
                    background: "#000",
                  }}
                >
                  {liveMatchData && (
                    <iframe
                      title="stream"
                      width="100%"
                      height={isMobile ? "220" : "420"}
                      style={{ border: "0px" }}
                     src={`https://tv.betsclub.online/${gameCode}`}
                    ></iframe>
                  )}
                {casinoMatchData && gameCode !== 'worli3' && <CasinoTimer lastOdds={casinoMatchData} />}
                  {casinoMatchData && (
                    <CasinoTitle lastResult={casinoMatchData} />
                  )}
                  {(gameCode == "onedaypoker" && casinoMatchData?.desc != "") ||
                  (gameCode == "onedaypoker20" && casinoMatchData?.desc != "")
                    ? oneDayPokerDescription(casinoMatchData.desc)
                    : ""}

                  {gameCode == "cricket2020" && (
                    <CricketVideoPopup20
                      data={updateOdds}
                      checkRoundIdChange={checkRoundIdChange}
                      betCount={betCount}
                    />
                  )}
                </div>
              </div>
            </div>
            <div
              className={`card-body ${gameCode}`}
              style={{ padding: "0px", position: "relative", marginTop: isMobile ? "4px" : "4px" }}
            >
              {renderUiData(gameCode)}

              {(liveMatchData.remark != "" &&
                liveMatchData?.slug != "Superover" &&
                liveMatchData?.slug != "fivewicket") ||
              (liveMatchData?.event_data?.remark != "" &&
                liveMatchData?.slug != "Superover" &&
                liveMatchData?.slug != "fivewicket") ? (
                <div className="notice-casino-odds">
                  <div className="marqueeN">
                    <p>
                      {liveMatchData?.remark ||
                        liveMatchData?.event_data?.remark}
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          {gameCode === 'worli3' ? (
              <LastResults lastResult={{ results: worli3Results }} gameId={gameCode} />
            ) : (
              casinoMatchData?.id && (
                <LastResults lastResult={casinoMatchData} gameId={gameCode} />
              )
            )}
          </div>
          <div className="col-4 col-lg-4">
            <div id="sidebar-right" className=" ">
              <div className="ps">
                <div className="sidebar-right-inner">
                  <div className="sidebar-place-bet">
                  {marketDataList.stake && (
                    <PlaceBetBox stake={marketDataList.stake} />
                  )}
                  </div>
                  <div className={`card  my-bet ${isMobile ? "m-b-5" : "m-b-10"}`}>
                    <div className="card-header">
                      <h6 className="card-title d-inline-block">My Bet</h6>
                      <a
                        href="#"
                        onClick={showAllBet}
                        className="card-title d-inline-block float-right"
                      >
                        View All
                      </a>
                    </div>
                    <div className="card-body">
                      <MyBetComponent />
                    </div>
                  </div>
                  {gameCode == "onedaypoker" && <OnedaypokerRules />}
                  {gameCode == "Superover" && <SoRules />}
                  {gameCode == "opentp" && <Openteenpatti />}
                  {gameCode == "fivewicket" && <Cricketv />}
                  {gameCode == "teen20" && <T20 />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="prelative casino-container-box">
          <Tabs>
            <Tab eventKey="home" title="Game">
              <div className={`card m-b-${isMobileRoulette ? 5 : 0} my-bet`}>
                {gameCode === 'worli3' && (
                <MarketStrip
                  markets={marketList}
                  selectedMarketId={selectedMarket?.mid ?? null}
                  onSelect={(m) => setSelectedMarket(m)}
                />
              )}
                <div className="card-header casino d-flex">
                  <h6 className="card-title d-inline-block">  
                    {gameCode === 'worli3' ? 'Matka Market' : liveMatchData?.title || ''}
                    {gameCode == "race2020" &&
                      casinoMatchData &&
                      race2020Mobile()}
                  </h6>
                    <span
                    className="fw-12 text-underlin"
                    onClick={showRules}
                    style={{ marginLeft: "5px",textDecoration: 'underline',fontSize:'12px'}}
                  >
                   Rules
                  </span>
                </div>
                <div
                  className={`card-body ${gameCode}`}
                  style={{
                    padding: "0px",
                    position: "relative",
                    minHeight: isMobile ? "212" : "420",
                    display: isMobileRoulette ? "none" : "block",
                  }}
                >
                  <div
                    style={{
                      padding: "0px",
                      position: "relative",
                      minHeight:isMobile?"212": "250",
                      background: "#000",
                    }}
                  >
                    {liveMatchData && (
                      <iframe
                        title="stream"
                        width="100%"
                       
                        style={{ border: "0px" , height:isMobile ? "212": "250px",}}
                        src={`https://tv.betsclub.online/${gameCode}`}
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        seamless
                      />
                    )}
                    {casinoMatchData && gameCode !== 'worli3' && <CasinoTimer lastOdds={casinoMatchData} />}
                    {casinoMatchData && (
                      <CasinoTitle lastResult={casinoMatchData} />
                    )}
                    {casinoMatchData && casinoMatchData.scoreCard ? (
                      <Score scoreData={casinoMatchData.scoreCard} />
                    ) : (
                      ""
                    )}
                    {(gameCode == "onedaypoker" && casinoMatchData?.desc) ||
                    (gameCode == "onedaypoker20" && casinoMatchData?.desc)
                      ? oneDayPokerDescription(casinoMatchData.desc)
                      : ""}
                    {gameCode == "cricket2020" && (
                      <CricketVideoPopup20
                        data={updateOdds}
                        checkRoundIdChange={checkRoundIdChange}
                        betCount={betCount}
                      />
                    )}
                  </div>
                </div>
               {isMobileRoulette && casinoMatchData && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12vh',
                      left: '-4vw',
                      zIndex: 10,
                      width: "30%",
                      display: "flex",
                      justifyContent: "center",
                      backgroundColor: "red"
                    }}
                  >
                    <CasinoTimer lastOdds={casinoMatchData} />
                  </div>
                )}
              </div>
              <div
                className={`card-body ${gameCode}`}
                style={{ padding:isMobile ? "0px 0px" : "0px", position: "relative" }}
              >
         
                {renderUiData(gameCode)}
                {(liveMatchData.remark != "" && gameCode != "Cards3J") ||
                (liveMatchData?.event_data?.remark != "" &&
                  gameCode != "Cards3J") ? (
                  <div
                    className="notice-casino-odds"
                    style={{ display: isMobileRoulette ? "none" : "block" }}
                  >
                    <div className="marqueeN">
                      <p>
                        {liveMatchData?.remark ||
                          liveMatchData?.event_data?.remark}
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              {marketDataList.stake && (
                <PlaceBetBox stake={marketDataList.stake} />
              )}
              
              {isMobileRoulette ? (
                <div className='d-flex justify-content-end'>
                  <RouletteFrame liveMatchData={liveMatchData} lastOdds={updateOdds} />
                  <div>
                    <LastResults lastResult={casinoMatchData} gameId={gameCode} />
                  </div>
                </div>
              ) : (
               gameCode === 'worli3' ? (
                  <LastResults lastResult={{ results: worli3Results }} gameId={gameCode} />
                ) : (
                  <LastResults lastResult={casinoMatchData} gameId={gameCode} />
                )
              )}
              {gameCode == "onedaypoker" && <OnedaypokerRules />}
              {gameCode == "opentp" && <Openteenpatti />}
              {gameCode == "fivewicket" && <Cricketv />}
              {gameCode == "teen20" && <T20 />}
              {gameCode == "Superover" && <SoRules />}
            </Tab>
            <Tab eventKey="profile" title={`PLACED BET (${betCount})`}>
              <div className="card my-bet">
                <div className="card-header">
                  <h6 className="card-title d-inline-block">My Bet</h6>
                </div>
                <div className="card-body">
                  <MyBetComponent />
                </div>
              </div>
            </Tab>
          </Tabs>
          <div className="csmobileround">
            {!isMobile?(
              <span
              className="fw-12 text-underlin"
              onClick={showRules}
              style={{ marginLeft: "10px" }}
              >
              RULES
            </span>
            ):''}
           
           {gameCode === 'worli3' ? '' : <span>Round ID: {casinoMatchData.match_id}</span>}
          </div>
        </div>
      )}
      {rulesModel ? (
        <CasinoRulesDetail
          title={casinoMatchData.title}
          gameId={gameCode}
          isOpen={rulesModel}
          setIsOpen={setRulesModel}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default CasinoWrapper;