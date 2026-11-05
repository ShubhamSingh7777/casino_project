import React, { useMemo } from "react";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { RoleType } from "../../../../models/User";
import { betPopup } from "../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";
import { isMobile } from "react-device-detect";
import { useLocation } from "react-router-dom";
import CasinoPnl from "../casinoPnl";

const RaceSeventeen = ({ lastOdds, liveMatchData }: any) => {
  console.log(lastOdds, "live match data");
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  

  /* ✅ 1. MERGE DATA PROPERLY (KEY FIX) */
  // const markets = useMemo(() => {
  //   if (!liveMatchData?.event_data?.market) return [];

  //   return liveMatchData.event_data.market.map((market: any) => ({
  //     ...market,
  //     Runners: market.Runners.map((item: any) => ({
  //       ...item,
  //       ...(lastOdds?.[item.sid] || {}), // 🔥 live update
  //     })),
  //   }));
  // }, [liveMatchData?.event_data?.market, lastOdds]);

  const onBet = (isBack: boolean, item: any, marketName: string) => {
    if (userState.user.role !== RoleType.user) return;
    if (item.gstatus !== "OPEN") return; // item should be liveItem
    // 🔥 Get live odds from lastOdds using sid
    const liveOdds = lastOdds?.[item.sid];
    // console.log(liveOdds.mid,'reace17----------------')
    const oddsVal = Number(isBack ? item.b : item.l);
    if (oddsVal <= 0) return;

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: oddsVal,
          volume: isBack ? item.bs : item.ls,
          marketName,
          marketId: liveOdds.mid,
          matchId: liveMatchData?.event_data?.match_id || 0,
          selectionName: item.nat,
          selectionId: item.sid,
          pnl: 0,
          stack: 0,
          currentMarketOdds: oddsVal,
          eventId: item.sid,
          exposure: 0,
          ipAddress: authService.getIpAddress(),
          type: IBetType.Match,
          matchName: liveMatchData.title,
          betOn: IBetOn.CASINO,
          gtype: liveMatchData.slug,
            minbet: liveMatchData.min,
            maxbet: liveMatchData.max,
        },
      }),
    );
  };

  const marketRow = (item: any, marketName: string) => {
    const suspended =
      item.gstatus !== "OPEN" || item.visible !== 1 ? "suspended" : "";

    return (
      <>
      <div className="casino-odds-box casino-yn mogambo-suspended">
        <div
          className={`back  ${suspended}`}
          onClick={() => onBet(true, item, marketName)}
        >
          <span className="casino-odds-box-odd">{item.b}</span>
          {/* <span className="fw-12 laysize">{item.bs}</span> */}
            {/* <CasinoPnl
                  sectionId={item.sid ?? item.SelectionId}
                  matchId={liveMatchData?.match_id}
                  classData={"text-center"}
                /> */}
        </div>

        <div
          className={`lay ${suspended}`}
          onClick={() => onBet(false, item, marketName)}
        >
          <span className="casino-odds-box-odd">{item.l}</span>
          {/* <span className="fw-12 laysize">{item.ls}</span> */}
           {/* <CasinoPnl
                 sectionId={item.sid ?? item.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
              /> */}
        </div>
        
      </div>
       <CasinoPnl
                 sectionId={item.sid ?? item.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
              />
              </>
    );
  };
 const location = useLocation();
  return (
    <div className="new-casino" style={{marginTop:isMobile?'5px':'5px',padding:isMobile?'3px':''}}>
      <div
        className="card-content"
        style={{ padding: isMobile ? "5px 2px" : "5px 0px 0px 0px" }}
      >
        <div className="row row5">
          {/* {lastOdds?.market?.map((market: any) =>
            market.Runners?.map((item: any) => {
              const odds = lastOdds?.market
                ?.flatMap((m: any) => m.Runners)
                .find((r: any) => r.sid === item.sid);

              const liveItem = {
                ...item,
                nat: odds?.nat ?? item.nat,
                b: odds?.b ?? item.b,
                l: odds?.l ?? item.l,
                bs: odds?.bs ?? item.bs,
                ls: odds?.ls ?? item.ls,
                gstatus: odds?.gstatus ?? item.gstatus,
                visible: odds?.visible ?? item.visible,
              };

              return (
                <div
                  className={`${isMobile && location.pathname === "/casino/race2/86"? "col-6Duskadum": "col-lg-3 col-6"}`}
                  key={`${market.MarketName}-${item.sid}`}
                >
                  <div className="casino-odds-box-container casino-odds-box-container-extra">
                    <div className="casino-yn">
                      <div className="casino-odds-box-bhav">
                        <b>{liveItem.nat}</b>
                      </div>
                    </div>
                    {marketRow(liveItem, market.MarketName)}
                  </div>
                </div>
              );
            }),
          )} */}
      {liveMatchData?.event_data?.market?.map((market: any) => {
  // Apply filter only for these markets
  const isSingleRunnerMarket =
    market.MarketName === "Big Card" ||
    market.MarketName === "Zero Card";

  const runners = isSingleRunnerMarket
    ? market.Runners.filter((runner: any) => runner.gstatus === "OPEN")
    : market.Runners;

  return runners.map((item: any) => {
    const liveItem = {
      ...item,
      ...(lastOdds?.[item.sid] || {}),
    };

    return (
      <div
        className={
          isMobile && location.pathname === "/casino/race2/86"
            ? "col-6Duskadum"
            : "col-lg-3 col-6"
        }
        style={{maxWidth:'50%',paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px'}}
        key={`${market.MarketName}-${item.sid}`}
      >
        <div className="casino-odds-box-container casino-odds-box-container-extra">
          <div className="casino-yn">
            <div className="casino-odds-box-bhav">
              <b>{liveItem.runnerName || liveItem.nat}</b>
            </div>
          </div>

          {marketRow(liveItem, market.MarketName)}
        </div>
      </div>
    );
  });
})}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RaceSeventeen);
