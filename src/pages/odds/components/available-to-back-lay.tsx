import React, { useEffect, useState } from "react";
import { IBetOn, IBetType } from "../../../models/IBet";
import IRunner from "../../../models/IRunner";
import IMarket, { OddsType } from "../../../models/IMarket";
import { betPopup } from "../../../redux/actions/bet/betSlice";
import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import authService from "../../../services/auth.service";
import { nFormatter } from "../../../utils/helper";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { RoleType } from "../../../models/User";
import { isMobile } from "react-device-detect";

type Props = {
  selections: any;
  selectionsPrev: any;
  runner: any;
  market: IMarket;
};

const OddsBox = React.memo(({ odds, size, onClick, cls, classforbox }: any) => {
  const [blink, setBlink] = useState("");
  const prevOdds = React.useRef(odds);

  React.useEffect(() => {
    if (prevOdds.current !== odds) {
      setBlink("blink");
      const t = setTimeout(() => setBlink(""), 300);
      prevOdds.current = odds;
      return () => clearTimeout(t);
    }
  }, [odds]);

  return (
    <div
      onClick={onClick}
      className={`${classforbox} uiFor text-center ${cls} ${blink}`}
    >
      <span className="odd d-block">
        {odds !== null && odds !== undefined ? odds : "-"}
      </span>
      <span className="d-block">
        {size !== null && size !== undefined ? nFormatter(size, 1) : "-"}
      </span>
    </div>
  );
});

export const AvailableToBackLay = React.memo(
  ({ selections, market, runner }: Props) => {
    const dispatch = useAppDispatch();
    const getCurrentMatch = useAppSelector(selectCurrentMatch);
    const userState = useAppSelector(selectUserData);

    useEffect(()=>{
     console.log(selections,'selections')
     console.log(market,'market')
     console.log(runner,'runner')
    },[])
console.log("MARKET DATA BEFORE BET:", market);
console.log("RUNNER DATA BEFORE BET:", runner);
  const onBet = (isBack = false, back: { odds: number; size: number }) => {
  const ipAddress = authService.getIpAddress();

  if (market.oddsType === OddsType.BM && back.size === 0) return;

  if (
    back.odds > 0 &&
    back.size &&
    userState.user.role === RoleType.user
  ) {
    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds: parseFloat(back.odds.toFixed(4)),
          volume: back.size,
          marketId: market.marketId,
          marketName: market.marketName,
          matchId: market.matchId,
          selectionName: runner.runnerName,
          selectionId: runner.selectionId,
          pnl: 0,
          stack: 0,
          currentMarketOdds: back.odds,
          eventId: Number(market.sportId || market.marketId),
          exposure: 0,
          ipAddress,
          type: IBetType.Match,
          matchName: getCurrentMatch.name,

          betOn:
            market.marketName === "MATCH_ODDS" ||
            market.marketName === "Bookmaker" ||
            market.marketName === "TIED_MATCH" ||
            market.marketName === "Top 2 Finish" ||
            market.marketName === "Top 3 Finish" ||
            market.marketName === "Top 4 Finish" ||
            market.marketName === "Top 5 Finish" ||
            market.sportId !== 4
              ? IBetOn.MATCH_ODDS
              : IBetOn.FANCY,

          oddsType: market.oddsType,

          // Minimum and maximum bet limits
          minbet: 100,
          maxbet:
            Number(market.maxbet) > 0
              ? Number(market.maxbet)
              : Number(market.max) > 0
              ? Number(market.max)
              : Number(market.maxb) > 0
              ? Number(market.maxb)
              : 0,
        },
      }),
    );
  }
};
 const isTwoColumnBookmaker =
  market.oddsType === OddsType.BM &&
  runner?.back?.length === 2 &&
  runner?.lay?.length === 2;
  const isSingleBackLay =
  runner?.back?.length === 1 &&
  runner?.lay?.length === 1;

  console.log(OddsType.BM,'oddstype bookmaker')
  //   const availableToBack = () => {
     
  //     const backs = isTwoColumnBookmaker
  // ? runner?.back?.slice(0, 2)
  // : runner?.back

  // // return runner?.back?.map((back: any, index: number) => {
  //    return backs?.map((back: any, index: number)  => {
  //       const i = 2 - index;
  //       const cls = index === 2 ? "back" : `back${i}`;
  //       const blinkCls = back.changed ? "blink" : "";
  //       if (isMobile && market.oddsType == OddsType.B && index != 2) return;
  //       const classforbox =
  //         (!isMobile && market.oddsType != OddsType.BM) ||
  //           market.oddsType == OddsType.BM
  //           ? "box-1"
  //           : "box-2";
  //       return (
  //         <div
  //           onClick={() => onBet(true, back)}
  //           key={index}
  //           className={`${classforbox}  text-center ${cls} ${blinkCls}`}
  //         >
  //           <span className="odd d-block">
  //             {market.oddsType == "bookMaker"
  //               ? back.odds || back.odds === 0
  //                 ? back.odds
  //                 : "-"
  //               : back.odds
  //                 ? back.odds
  //                 : "-"}
  //             {/* {back.odds !== null && back.odds !== undefined
  //   ? back.odds
  //   : '0'} */}
  //           </span>
  //           <span className="d-block">
  //             {back.size ? nFormatter(back.size, 1) : "-"}
  //           </span>
  //         </div>
  //       );
  //     });
  //   };


  const availableToBack = () => {
  const backs = runner?.back || [];

  return backs.map((back: any, index: number) => {
    let cls = "";

    if (backs.length === 1) {
      // Only one Back value
      cls = "back";
    } else if (backs.length === 2) {
      // Keep 2-value positioning
      cls = index === 0 ? "back2" : "back";
    } else {
      // Keep existing 3-value positioning
      const i = 2 - index;
      cls = index === 2 ? "back" : `back${i}`;
    }

    const blinkCls = back.changed ? "blink" : "";

    // const classforbox =
    //   (!isMobile && market.oddsType !== OddsType.BM) ||
    //   market.oddsType === OddsType.BM
    //     ? "box-1"
    //     : "box-2";

    const classforbox =
  isSingleBackLay
    ? "box-single"
    : ((!isMobile && market.oddsType !== OddsType.BM) ||
       market.oddsType === OddsType.BM)
      ? "box-1Odd"
      : "box-2";

    return (
      <OddsBox
        key={index}
        odds={back.odds}
        size={back.size}
        onClick={() => onBet(true, back)}
        cls={cls}
        classforbox={classforbox}
      />
    );
  });
};
  //   const availableToLay = () => {
  //     const lays = isTwoColumnBookmaker
  // ? runner?.lay?.slice(0, 2)
  // : runner?.lay;
  // // return runner?.lay?.map((lay: any, index: number) => {
  //    return lays?.map((lay: any, index: number) => {
  //       const i = index;
  //       const cls = index === 0 ? "lay" : `lay${i}`;
  //       const blinkCls = lay.changed ? "blink" : "";
  //       if (isMobile && market.oddsType == OddsType.B && index != 0) return;
  //       const classforbox =
  //         (!isMobile && market.oddsType != OddsType.BM) ||
  //           market.oddsType == OddsType.BM
  //           ? "box-1"
  //           : "box-2";

  //       return (
  //         <div
  //           onClick={() => onBet(false, lay)}
  //           key={index}
  //           className={`${classforbox}   text-center ${cls} ${blinkCls}`}
  //         >
  //           <span className="odd d-block">
  //             {market.oddsType == "bookMaker"
  //               ? lay.odds || lay.odds === 0
  //                 ? lay.odds
  //                 : "-"
  //               : lay.odds
  //                 ? lay.odds
  //                 : "-"}
  //           </span>
  //           <span className="d-block">
  //             {lay.size ? nFormatter(lay.size, 1) : "-"}
  //           </span>
  //         </div>
  //       );
  //     });
  //   };



const availableToLay = () => {
  const lays = runner?.lay || [];

  return lays.map((lay: any, index: number) => {
    let cls = "";

    if (lays.length === 1) {
      // Only one Lay value
      cls = "lay";
    } else if (lays.length === 2) {
      // Keep 2-value positioning
      cls = index === 0 ? "lay" : "lay2";
    } else {
      // Keep existing 3-value positioning
      cls = index === 0 ? "lay" : `lay${index}`;
    }

    const blinkCls = lay.changed ? "blink" : "";

    const classforbox =
  isSingleBackLay
    ? "box-single"
    : ((!isMobile && market.oddsType !== OddsType.BM) ||
       market.oddsType === OddsType.BM)
      ? "box-1Odd"
      : "box-2";

    return (
      <OddsBox
        key={index}
        odds={lay.odds}
        size={lay.size}
        onClick={() => onBet(false, lay)}
        cls={cls}
        classforbox={classforbox}
      />
    );
  });
};
    return (
      <>
        {availableToBack()}
        {availableToLay()}
    
      </>
    );
  },
);
