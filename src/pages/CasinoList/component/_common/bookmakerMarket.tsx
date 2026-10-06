import React from "react";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { RoleType } from "../../../../models/User";
import { selectCasinoCurrentMatch } from "../../../../redux/actions/casino/casinoSlice";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";
import { nFormatter } from "../../../../utils/helper";
import CasinoPnl from "../casinoPnl";
import { betPopup } from "../../../../redux/actions/bet/betSlice";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router-dom";

const BookmakerMarket = (props: any) => {
  const { oddsMarket, lastOdds, max ,liveMatchData, isFiveCricket} = props;
  const dispatch = useAppDispatch();
  const isSuperOver = window.location.pathname.includes("superover");
  const useB1Odds = isSuperOver || isFiveCricket;
  const userState = useAppSelector(selectUserData);
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const { matchId } = useParams();
 const onBet = (isBack = false, item: any) => {
  const ipAddress = authService.getIpAddress();

  const oddVal = parseFloat(
    useB1Odds
      ? isBack
        ? item.b1
        : item.l1
      : isBack
      ? item.b
      : item.l,
  );

  const odds = oddVal.toString();

  if (userState.user.role === RoleType.user) {
    if (
      parseFloat(odds) <= 0 ||
      item.gstatus === "SUSPENDED" ||
      item.gstatus === "CLOSED"
    ) {
      return;
    }

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: parseFloat(odds),

          volume: parseFloat(
            useB1Odds
              ? isBack
                ? item.bs1
                : item.ls1
              : isBack
              ? item.bs
              : item.ls,
          ),

          marketId: lastOdds.match_id || lastOdds.gmid,
          marketName: oddsMarket.MarketName,
          matchId: Number(matchId),
          selectionName: item.nat,
          selectionId: item.sid,
          pnl: 0,
          stack: 0,

          currentMarketOdds: useB1Odds
            ? isBack
              ? item.b1
              : item.l1
            : isBack
            ? item.b
            : item.l,

          eventId: Number(matchId),
          exposure: -0,
          ipAddress,
          type: IBetType.Match,
          matchName: lastOdds.title,
          betOn: IBetOn.CASINO,
          gtype: lastOdds.slug,
          minbet: lastOdds.min,
          maxbet: lastOdds.max,
        },
      }),
    );
  }
};
  // const boxLayoutCls = isMobile ? "box-2" : "box-4";
 const boxLayoutCls = isFiveCricket
  ? "five-cricket-box"
  : isMobile
  ? "box-2"
  : "box-4";
  const boxLayoutCls2 = isFiveCricket ? "five-cricket-box-backlay" : isMobile ? "box-15" : "box-1";
  const layoutRunner = () => {
    return oddsMarket?.Runners?.map((ItemRunner: any, keyRunner: number) => {
      const gstatus =
        ItemRunner.gstatus == "SUSPENDED" || ItemRunner.gstatus == "CLOSED"
          ? "suspended"
          : "";

      return (
        <div className="table-body" key={keyRunner}>
          <div
            data-title={ItemRunner.gstatus}
            className={`table-row ${gstatus}`}
          >
            <div
              className={`float-left country-name ${
                isSuperOver ? "superover-class" : boxLayoutCls
              } tx-left`}
            >
              <span className="team-name tx-left" style={{fontWeight:isMobile?'400':''}}>{ItemRunner.nat}</span>
              {/* {!isSuperOver && (
                <> */}
                  {" "}
                  <CasinoPnl
                    matchId={lastOdds.match_id}
                    sectionId={ItemRunner.sid}
                  />
                {/* </>
              )} */}
            </div>
          {!isSuperOver && !isFiveCricket && (
  <>
    <div
      className={`${boxLayoutCls2} back2 float-left text-center`}
    />
    <div
      className={`${boxLayoutCls2} back1 back-2 float-left text-center`}
    />
  </>
)}
            {/* <div
              className={`${
                isSuperOver ? "superover-class2" : boxLayoutCls2
              } back float-left back lock text-center betting-disabled`}
              onClick={() => {
                onBet(true, ItemRunner);
              }}
            > */}
              {/* {isSuperOver ? ItemRunner.b1 : ItemRunner.b} */}
            {/* <b>  {(isSuperOver ? ItemRunner.b1 : ItemRunner.b) == 0
                ? "-"
                : isSuperOver
                ? ItemRunner.b1
                : ItemRunner.b}</b>
              <span className="d-block">
                {nFormatter(
                  isSuperOver ? ItemRunner.bs1 || 0 : ItemRunner.bs || 2,
                  2,
                )}
              </span>
            </div> */}
            <div
  className={`${
    isSuperOver ? "superover-class2" : boxLayoutCls2
  } back float-left back lock text-center betting-disabled`}
  onClick={() => {
    onBet(true, ItemRunner);
  }}
>
  <b>
    {(useB1Odds ? ItemRunner.b1 : ItemRunner.b) == 0
  ? "-"
  : useB1Odds
  ? ItemRunner.b1
  : ItemRunner.b}
  </b>

 <span className="d-block" style={{fontSize:!isMobile?'12px':''}}>
{useB1Odds
    ? Number(ItemRunner.bs1 || 0).toFixed(2)
    : nFormatter(ItemRunner.bs || 2, 2)}

</span>

  
</div>
           <div
  className={`${
    isSuperOver ? "superover-class2" : boxLayoutCls2
  } lay float-left text-center betting-disabled`}
  onClick={() => {
    onBet(false, ItemRunner);
  }}
  style={{paddingRight:'0px'}}
>
  <span>
    <b>
     {(useB1Odds ? ItemRunner.l1 : ItemRunner.l) == 0
  ? "-"
  : useB1Odds
  ? ItemRunner.l1
  : ItemRunner.l}
    </b>
  </span>

  <span className="d-block" style={{fontSize:!isMobile?'12px':''}}>
   {useB1Odds
    ? Number(ItemRunner.ls1 || 0).toFixed(2)
    : nFormatter(ItemRunner.ls || 2, 2)}
  </span>

   
</div>
        {!isSuperOver && !isFiveCricket && (
  <>
    <div
      className={`${boxLayoutCls2} lay2 float-left text-center`}
    ></div>
    <div
      className={`${boxLayoutCls2} lay1 float-left text-center`}
    ></div>
  </>
)}
          </div>
        </div>
      );
    });
  };
  const formatMax = (value: number) => {
  if (value >= 100000) {
    return `${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)}L`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  }

  return value;
};
  return (
    <div>
      <div className="table-header">
        <div
          className={`float-left country-name ${
            isSuperOver ? "superover-class" : boxLayoutCls
          }  text-start`}
          style={{ textAlign: "start" ,color:isMobile?'#097c93':'#097c93',fontWeight:isMobile?'bold':'bold',fontSize:isMobile?'12px':'12px',padding:!isMobile?'0px 6px':'',display:'flex',alignItems:'center' }}
        >
         Min: {isFiveCricket ? lastOdds?.event_data?.min : lastOdds?.min} 
    Max: {isFiveCricket
  ? formatMax(Number(lastOdds?.event_data?.max || 0))
  : lastOdds?.max}
        </div>
      {!isSuperOver && !isFiveCricket && (
  <>
    <div className={`${boxLayoutCls2} float-left`}></div>
    <div className={`${boxLayoutCls2} float-left`}></div>
  </>
)}
        <div
          className={`back ${
            isSuperOver ? "superover-class2 superOver-classback" : boxLayoutCls2
          } float-left text-center`}
        >
          <b>Back</b>
        </div>
        <div
          className={`lay ${
            isSuperOver ? "superover-class2 superOver-classback" : boxLayoutCls2
          } float-left text-center`}
        >
          <b>Lay</b>
        </div>
        {!isSuperOver && (
          <>
            {" "}
            <div className={`${boxLayoutCls2} float-left`}></div>
            <div className={`${boxLayoutCls2} float-left`}></div>
          </>
        )}
      </div>
      {layoutRunner()}
    </div>
  );
};
export default React.memo(BookmakerMarket);
