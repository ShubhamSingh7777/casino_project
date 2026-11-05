import { AxiosResponse } from "axios";
import React, { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LMatch from "../../models/LMatch";
import sportsServices from "../../services/sports.service";
import ISport from "../../models/ISport";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  selectSportList,
  setCurrentMatch,
  selectAllMatches,
} from "../../redux/actions/sports/sportSlice";
import { getMatchListAction } from "../../redux/actions/sports/sport.action";
import { IApiStatus } from "../../models/IApiStatus";
import IMatch from "../../models/IMatch";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { useWebsocket } from "../../context/webSocket";
import GameTab from "../_layout/elements/game-tab";
import { isMobile } from "react-device-detect";
import GameTabMobile from "../_layout/elements/game-tab-mobile";
import MatchList from "./elements/match-list";
import MatchListMobile from "./elements/match-list-mobile";
import CasinoListItem from "../CasinoList/CasinoListItem";
import casinoService from "../../services/casino.service";
import {
  selectCasinoMatchList,
  setHomePageCasinoMatch,
} from "../../redux/actions/casino/casinoSlice";
import Fav from "../_layout/elements/fav";
import { divide } from "lodash";
import Carouselslider from "../../components/Carousel";
import { BannerImage } from "../../components/BannerImage";
import { OurProvider } from "../CasinoList/OurProvider";
import { selectUserData } from "../../redux/actions/login/loginSlice";

const Dashboard = () => {
  const [matchList, setMatchList] = React.useState<LMatch[]>([]);
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);
  const allMatchesState = useAppSelector<any>(selectAllMatches);
  const navigate = useNavigateCustom();
  const dispatch = useAppDispatch();
  const { socket } = useWebsocket();
  const [odds, setOdds] = React.useState<Record<string, Array<any>>>({});
  const location = useLocation();
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  const localSessionId = localStorage.getItem("login-session");

  const { sportId, status } = useParams();
  const userState1 = useAppSelector(selectUserData);
  const navigate1 = useNavigate();

  React.useEffect(() => {
    if (
      allMatchesState.status !== IApiStatus.Done &&
      allMatchesState.status !== IApiStatus.Loading
    ) {
      dispatch(getMatchListAction("all"));
    }
  }, [dispatch, allMatchesState.status]);

  React.useEffect(() => {
    if (allMatchesState.status === IApiStatus.Done) {
      const matches = allMatchesState.matches;
      let filtered = matches;
      if (sportId && sportId !== "all") {
        filtered = matches.filter(
          (m: any) => String(m.sportId) === String(sportId),
        );
      }
      setMatchList(filtered);

      socket.emit("subscribeDashboard", String(sportId));

      return () => {
        socket.emit("unsubscribeDashboard", String(sportId));
      };
    }
  }, [allMatchesState.status, allMatchesState.matches, sportId, status]);

  React.useEffect(() => {
    if (gamesList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        dispatch(setHomePageCasinoMatch(res.data.data));
      });
  }, []);
  React.useEffect(() => {
    const handler = (dashboardMatches: any[]) => {
      console.log("Dashboard matches", dashboardMatches)
      setMatchList((prevList) => {
        // Create a map for quick lookup
        const updatedMatchesMap = new Map(dashboardMatches.map(m => [m.matchId.toString(), m]));

        return prevList.map(match => {
          const updatedMatch = updatedMatchesMap.get(match.matchId.toString());
          if (updatedMatch) {
            // Update the MATCH_ODDS market runners
            return {
              ...match,
              markets: match.markets?.map((m) =>
                m.marketName === "MATCH_ODDS"
                  ? { ...m, runners: updatedMatch.markets?.[0]?.runners || m.runners }
                  : m
              ) || updatedMatch.markets
            };
          }
          return match;
        });
      });
    };

    socket.on("dashboardMatches", handler);

    return () => {
      socket.off("dashboardMatches", handler);
    };
  }, [socket]);
  // Suspended check per row: true if all odds are 0, negative, or missing
  const checkSuspended = (runners: any[]) => {
    if (!runners) return false;
    return runners.every(
      (runner) =>
        (runner.back?.every((o: any) => !o?.odds || o.odds <= 0) ?? true) &&
        (runner.lay?.every((o: any) => !o?.odds || o.odds <= 0) ?? true),
    );
  };

  const memoOdds: any = useCallback((marketData: any[]) => {
    if (!Array.isArray(marketData)) marketData = [];

    let displayRunners: any[] = [];
    if (marketData.length === 1) displayRunners = [marketData[0], null, null];
    else if (marketData.length === 2)
      displayRunners = [marketData[0], null, marketData[1]];
    else if (marketData.length >= 3)
      displayRunners = [marketData[0], marketData[2], marketData[1]];
    else displayRunners = [null, null, null];

    let boxIndex = 0; // GLOBAL index (0–5)

    return (
      <>
        {displayRunners.map((runner, idx) => {
          if (!runner) {
            const backIdx = boxIndex++;
            const layIdx = boxIndex++;
            const isSuspended = backIdx !== 2 && backIdx !== 3;
            return (
              <React.Fragment key={idx}>
                <td>
                  <button
                    className={`back ${backIdx !== 2 && backIdx !== 3 ? "suspended" : ""
                      }`}
                  >
                    <span className="odd">-</span>
                    {isSuspended && (
                      <span className="suspend-icon suspebded-icon-memoods">
                        <i className="fa fa-lock"></i>
                      </span>
                    )}
                  </button>
                </td>
                <td>
                  <button
                    className={`lay ${layIdx !== 2 && layIdx !== 3 ? "suspended" : ""
                      }`}
                  >
                    <span className="odd">-</span>
                  </button>
                </td>
              </React.Fragment>
            );
          }

          const back1 = runner?.odds
            ? runner.odds.find((o: any) => o.otype === "back" && o.tno === 0)
            : runner?.back?.[0];
          const lay1 = runner?.odds
            ? runner.odds.find((o: any) => o.otype === "lay" && o.tno === 0)
            : runner?.lay?.[0];

          const backIdx = boxIndex++;
          const layIdx = boxIndex++;

          const isBackSuspended =
            backIdx !== 2 && backIdx !== 3 && (back1?.odds == null || back1?.odds <= 0);

          const isLaySuspended =
            layIdx !== 2 && layIdx !== 3 && (lay1?.odds == null || lay1?.odds <= 0);

          return (
            <React.Fragment key={idx}>
              <td>
                <button
                  className={`back ${isBackSuspended ? "suspended" : ""}`}
                >
                  <span className="odd">{back1?.odds ?? "-"}</span>
                </button>
              </td>
              <td>
                <button className={`lay ${isLaySuspended ? "suspended" : ""}`}>
                  <span className="odd">{lay1?.odds ?? "-"}</span>
                </button>
              </td>
            </React.Fragment>
          );
        })}
      </>
    );
  }, []);



  const currentMatch = (match: IMatch) => {
    dispatch(setCurrentMatch(match));
    navigate.go(`/odds/${match.matchId}`);
  };

  return (
    <>
      {" "}
      {isMobile ? (
        <GameTabMobile sportId={sportId} sportListState={sportListState} />
      ) : (
        ""
      )}
      {/* {localSessionId ? (
       <div className="d-flex gap-2 py-1">
         <button className="btn w-50 mr-1 btn-depositnew" onClick={() => navigate1('/deposit')}>Deposit</button>
         <button className="btn  w-50 btnwithdraw-new" onClick={() => navigate1('/withdraw')}>Withdraw</button>
       </div>
      ):(
        <></>
      )}  */}
      <div style={{ marginTop: isMobile ? "0px" : "4px" }}>
        {!isMobile ? <Fav /> : ""}
        {/* {!isMobile && !location.pathname.includes('/odds') && !location.pathname.includes('/casino') ? <Carouselslider />:''} */}
        {!isMobile ? (
          <GameTab sportId={sportId} sportListState={sportListState} />
        ) : (
          ""
        )}
        {/**/}

        <div className="tab-content">
          <div
            className="tab-pane active"
            style={{
              height: isMobile ? "230px" : "auto",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            <div className="matchlist coupon-card-first">
              {!isMobile ? (
                <MatchList
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              ) : (
                <MatchListMobile
                  currentMatch={currentMatch}
                  memoOdds={memoOdds}
                  matchList={matchList}
                />
              )}

              {/* {location.pathname.includes("in-play") || !isMobile ? (
                <>
                  <div> */}
              {/* <BannerImage/>  */}
              {/* <div className="home-page">
                      <div
                        className="casino-list mt-2 mb-3"
                        style={{ marginLeft: !isMobile ? "" : "" }}
                      > */}
              {/* <div className='section-title'>Live Casino</div> */}
              {/* <CasinoListItem />
                      </div>
                    </div> */}
              {/* <OurProvider/> */}
              {/* </div>
                </>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </div>
        {!location.pathname.includes("/match") ? (
          <>
            <div>
              {/* <BannerImage/>  */}
              <div className="home-page">
                <div
                  className="casino-list mt-2 mb-2"
                  style={{ marginLeft: !isMobile ? "" : "" }}
                >
                  {/* <div className='section-title'>Live Casino</div> */}
                  <CasinoListItem />
                </div>
              </div>
              {/* <OurProvider/> */}
            </div>
          </>
        ) : (
          ""
        )}
        {location.pathname.includes("match") ? (
          <>
            <div>
              {/* <BannerImage/>  */}
              <div className="home-page">
                <div
                  className="casino-list mt-2 mb-2"
                  style={{ marginLeft: !isMobile ? "" : "" }}
                >
                  {/* <div className='section-title'>Live Casino</div> */}
                  <CasinoListItem />
                </div>
              </div>
              {/* <OurProvider/> */}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default Dashboard;