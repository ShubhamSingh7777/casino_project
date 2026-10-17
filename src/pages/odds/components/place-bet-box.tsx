import React, { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  betPopup,
  selectBetCount,
  selectBetPopup,
  selectPlaceBet,
  setBetCount,
} from "../../../redux/actions/bet/betSlice";
import { IUserBetStake } from "../../../models/IUserStake";
import IBet, { IBetOn, IBetType } from "../../../models/IBet";
import { getPlaceBetAction } from "../../../redux/actions/bet/bet.action";
import { IApiStatus } from "../../../models/IApiStatus";
import { useWebsocketUser } from "../../../context/webSocketUser";
import { OddsType } from "../../../models/IMarket";
import { isMobile } from "react-device-detect";
import { current } from "@reduxjs/toolkit";
import { cssTransition, toast } from "react-toastify";
   const slideDownUp = cssTransition({
  enter: "toast-slide-down",
  exit: "toast-slide-up",
  appendPosition: false,
  collapse: true,
});
const PlaceBetBox = ({ stake }: { stake: IUserBetStake }) => {
  const [betObj, setBetObj] = React.useState<IBet>({} as IBet);
  const betValues = useAppSelector(selectBetPopup) as {
    isOpen: boolean;
    betData: CashoutBetData;
  };
  type CashoutBetData = IBet & {
    runnersPnl?: {
      selectionId: number;
      selectionName: string;
      pnl: number;
    }[];
    matchName?: string;
  };

  const getPlaceBet = useAppSelector(selectPlaceBet);
  const betCount = useAppSelector(selectBetCount);
  const { socketUser } = useWebsocketUser();

  const dispatch = useAppDispatch();
  React.useEffect(() => {
    console.log(betValues, betObj, "bet Value-------------");
  }, [betValues]);

  // React.useEffect(() => {
  //   setBetObj({
  //     ...betValues.betData,
  //     odds:
  //       typeof betValues.betData.odds === 'string'
  //         ? parseFloat(betValues.betData.odds)
  //         : betValues.betData.odds,
  //   })
  // }, [betValues.betData])
  // React.useEffect(() => {
  //   // either betData or data (for CASHOUT)
  //   const betData = betValues.betData ?? (betValues as any).data
  //   console.log(betData,'Bet data after popup------------------------->');
  //   // check that we have either a selectionId or marketId
  //   if (betData && (betData.selectionId != null || betData.marketId)) {
  //     setBetObj({
  //       ...betData,
  //       selectionId: betData.selectionId,
  //       odds: typeof betData.odds === 'string' ? parseFloat(betData.odds) : betData.odds,
  //       stack: betData.stack || 0,
  //       selectionName: betData.selectionName || 'CASHOUT',
  //     })
  //   }
  // }, [betValues])
  const marketBook = useAppSelector(
    (state) => state.betReducer.userBookMarketList as Record<string, number>,
  );

  React.useEffect(() => {
    if (betValues.betData?.type === "CASHOUT") {
      console.log("✅ FINAL CASHOUT MARKET BOOK:", marketBook);
    }
  }, [marketBook]);
  // inside PlaceBetBox, replace this useEffect:
  React.useEffect(() => {
    // either betData or data (for CASHOUT)
    const betData = betValues.betData ?? (betValues as any).data;
    console.log(
      betData,
      "Bet data after popup cashout------------------------->",
    );

    // If betData is an array (CASHOUT multiple runners)
    if (Array.isArray(betData)) {
      // pick the first one as main state (you can modify to allow navigation between runners later)
      const firstBet = betData[0];
      setBetObj({
        ...firstBet,
        selectionId: firstBet.selectionId,
        odds:
          typeof firstBet.odds === "string"
            ? parseFloat(firstBet.odds)
            : firstBet.odds,
        stack: firstBet.stack || 0,
        selectionName: firstBet.selectionName || "CASHOUT",
        pnl: firstBet.pnl || 0,
      });
    } else if (betData && (betData.selectionId != null || betData.marketId)) {
      setBetObj({
        ...betData,
        selectionId: betData.selectionId,
        odds:
          typeof betData.odds === "string"
            ? parseFloat(betData.odds)
            : betData.odds,
        stack: betData.stack || 0,
        selectionName: betData.selectionName || "CASHOUT",
      });
    }
  }, [betValues]);

  React.useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      socketUser.emit("place-bet", getPlaceBet.bet);
      // dispatch(setBookMarketList({}))
      dispatch(betPopup({ isOpen: false, betData: {} as IBet }));
      dispatch(setBetCount(betCount + 1));
    }
  }, [getPlaceBet.status]);

  const reset = () => {
    setBetObj({ ...betObj, stack: 0, pnl: 0 });
    dispatch(
      betPopup({
        ...betValues,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    );
  };

  const onStack = (stack: number) => {
    const betObjItem = { ...betObj };
    betObjItem.stack = betObjItem.stack + stack;
    const calPnl = calculatePnlF(betObjItem);

    betObjItem.pnl = calPnl.pnl;
    betObjItem.exposure = calPnl.exposure;
    setBetObj(betObjItem);
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }));
  };


  const incrementDecrementOdds = (type = "inc") => {
    const betObjItem = { ...betObj };

    if (
      betObjItem.oddsType === OddsType.BM ||
      betObjItem.oddsType === OddsType.F
    ) {
      return true;
    }
    switch (type) {
      case "inc":
        betObjItem.odds = parseFloat((betObjItem.odds + 0.01).toFixed(4));
        break;
      case "dec":
        betObjItem.odds = parseFloat((betObjItem.odds - 0.01).toFixed(4));
        break;
    }
    const calPnl = calculatePnlF(betObjItem);
    betObjItem.pnl = calPnl.pnl;
    betObjItem.exposure = calPnl.exposure;
    betObjItem.type =
      betObjItem.odds !== betObjItem.currentMarketOdds
        ? IBetType.UnMatch
        : IBetType.Match;
    dispatch(betPopup({ ...betValues, betData: { ...betObjItem } }));

    setBetObj(betObjItem);
  };

  const calculatePnlF = (betValue: IBet) => {
    let pnl = 0,
      exposure = 0;
    if (Object.keys(betValue).length > 0) {
      // if (betValue.betOn == IBetOn.MATCH_ODDS || betValue.gtype === 'fancy1') {
      if (
        betValue.marketName == "MATCH_ODDS" ||
        betValue.marketName == "fancy1" ||
        betValue.marketName == "oddeven"
      ) {
        if (betValue.isBack) {
          pnl = betValue.odds * betValue.stack - betValue.stack;
          exposure = -1 * betValue.stack;
        } else {
          pnl = betValue.stack;
          exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
        }
      } else if (
        betValue.marketName == "Bookmaker" &&
        betValue.betOn != IBetOn.CASINO
      ) {
        console.log("step1");
        if (betValue.isBack) {
          pnl = (betValue.odds * betValue.stack) / 100;
          exposure = -betValue.stack;
        } else {
          exposure = -((betValue.odds * betValue.stack) / 100);
          pnl = betValue.stack;
        }
      } else if (betValue.betOn != IBetOn.CASINO) {
        if (betValue.isBack) {
          pnl = (betValue.volume * betValue.stack) / 100;
          exposure = -betValue.stack;
        } else {
          exposure = -((betValue.volume * betValue.stack) / 100);
          pnl = betValue.stack;
        }
      } else if (betValue.betOn == IBetOn.CASINO) {
        if (betValue.matchId == 33) {
          //// specific condition for cmeter game
          pnl = 0;
          exposure = -50 * betValue.stack * 1.0;
          // } else if (betValue.matchId == 9) {
        } else if (betValue.matchId == 1000) {
          //// specific condition for tp1day game
          if (betValue.isBack) {
            pnl = (betValue.odds / 100) * betValue.stack;
            exposure = -betValue.stack;
          } else {
            pnl = betValue.stack;
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
          }
        } else if (betValue.fancystatus == "yes") {
          console.log("step2");
          //// specific condition for cmeter game
          if (betValue.isBack) {
            pnl = (betValue.volume * betValue.stack) / 100;
            exposure = -betValue.stack;
          } else {
            exposure = -((betValue.volume * betValue.stack) / 100);
            pnl = betValue.stack;
          }
        } else {
          console.log("step3");
          if (betValue.isBack) {
            pnl = betValue.odds * betValue.stack - betValue.stack;
            exposure = -1 * betValue.stack;
          } else {
            pnl = betValue.stack;
            exposure = -1 * (betValue.odds * betValue.stack - betValue.stack);
          }
        }
      }
    }
    return {
      pnl: parseInt(pnl.toFixed()),
      exposure: parseInt(exposure.toFixed()),
    };
  };

  const onChangeStack = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetObj({ ...betObj, stack: parseInt(e.target.value) });
  };

  const onBlurStack = () => {
    onStack(0);
  };

 
// const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();

//   const maxBet = Number(betObj.maxbet);
//   const currentStake = Number(betObj.stack);

//   console.log("BET SUBMISSION:", {
//     stake: currentStake,
//     maxbet: betObj.maxbet,
//     marketName: betObj.marketName,
//     eventId: betObj.eventId,
//   });

//   if (
//     Number.isFinite(maxBet) &&
//     maxBet > 0 &&
//     currentStake > maxBet
//   ) {
//     toast.error(`Maximum bet allowed is ${maxBet}`, {
//   className: "error-toast-old success-toast",
//   bodyClassName: "error-toast-body",
//   autoClose: 1000,
//   icon: "⚠",
//   transition: slideDownUp,
// });

//     return;
//   }

//   dispatch(getPlaceBetAction(betObj));
// };



const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const minBet = Number(betObj.minbet) > 0
    ? Number(betObj.minbet)
    : 100;

  const maxBet = Number(betObj.maxbet) > 0
    ? Number(betObj.maxbet)
    : Number(betObj.maxb) > 0
      ? Number(betObj.maxb)
      : 0;

  const currentStake = Number(betObj.stack);

  console.log("BET SUBMISSION:", {
    stake: currentStake,
    minbet: minBet,
    maxbet: maxBet,
    marketName: betObj.marketName,
    eventId: betObj.eventId,
  });

  // Validate empty, invalid, or zero stake
  if (!Number.isFinite(currentStake) || currentStake <= 0) {
    toast.error("Please enter a valid bet amount", {
      className: "error-toast-old success-toast",
      bodyClassName: "error-toast-body",
      autoClose: 1000,
      icon: "⚠",
      transition: slideDownUp,
    });
    return;
  }

  // Minimum bet validation
  if (currentStake < minBet) {
    toast.error(`Minimum bet allowed is ${minBet}`, {
      className: "error-toast-old success-toast",
      bodyClassName: "error-toast-body",
      autoClose: 1000,
      icon: "⚠",
      transition: slideDownUp,
    });
    return;
  }

  // Maximum bet validation
  if (maxBet > 0 && currentStake > maxBet) {
    toast.error(`Maximum bet allowed is ${maxBet}`, {
      className: "error-toast-old success-toast",
      bodyClassName: "error-toast-body",
      autoClose: 1000,
      icon: "⚠",
      transition: slideDownUp,
    });
    return;
  }

  dispatch(getPlaceBetAction(betObj));
};

  const formatStake = (value: any) => {
    const num = Number(value);

    if (num >= 1000000) {
      return `${num / 1000000}M`;
    }

    if (num >= 1000) {
      return `${num / 1000}K`;
    }

    return num;
  };

  const renderStakeButtons = () => {
    const buttons = [];
    const isCasino = betObj.betOn == IBetOn.CASINO;

    if (isCasino) {
      const casinoButtons = [];
      for (let i = 1; i <= 6; i++) {
        const val = (stake as any)[`casinoValue${i}`];
        if (val) {
          casinoButtons.push(
            <button
              key={`casino-${i}`}
              type="button"
              onClick={() => onStack(val)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '5px',marginTop:!isMobile?'0px':'',height:!isMobile?'auto':'' }}
            >
              +{(stake as any)[`casinoName${i}`] || val}
            </button>,
          );
        }
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns:isMobile? 'repeat(4, 1fr)':'repeat(5,1fr)', gap: '2px', width: '100%' }}>
          {casinoButtons}
        </div>
      );
    } else {
      for (let i = 1; i <= 10; i++) {
        const val = (stake as any)[`value${i}`];
        if (val) {
          buttons.push(
            <button
              key={`game-${i}`}
              type="button"
              onClick={() => onStack(val)}
              className="btn btn-secondary m-l-5 m-b-5" style={{marginTop:'0px'}}
            >
              +{(stake as any)[`name${i}`] || val}
            </button>,
          );
        }
      }
    }
    return buttons;
  };

  const closeBetPopup = () => {
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    );
  };
  const onBackDrop = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dispatch(
      betPopup({
        ...betValues,
        isOpen: false,
        betData: { ...betValues.betData, stack: 0, pnl: 0 },
      }),
    );
  };
  const isCashout = betValues.betData?.type === "CASHOUT";
  const formatAmount = (value: number) =>
    `${value >= 0 ? "+" : ""}${Number(value).toFixed(2)}`;
  const cashoutAmount = betValues.betData?.pnl ?? 0;
  const calculateLocalCashoutPnl = (
    runnerSelectionId: number,
    oldPnl: number,
    bet: IBet,
  ) => {
    let delta = 0;

    if (!bet || !bet.stack || !bet.odds) return oldPnl;

    const isSameRunner = runnerSelectionId === bet.selectionId;
    let colorVal = "";
    let current = 0;
    // MATCH_ODDS / fancy / odds-even
    if (
      bet.marketName === "MATCH_ODDS" ||
      bet.marketName === "fancy1" ||
      bet.marketName === "oddeven"
    ) {
      if (bet.isBack) {
        delta = isSameRunner ? bet.odds * bet.stack - bet.stack : -bet.stack;
        colorVal = current > 0 ? "green" : "red";
      } else {
        delta = !isSameRunner
          ? bet.stack
          : -1 * (bet.odds * bet.stack - bet.stack);
        colorVal = current > 0 ? "green" : "red";
      }
    }

    // BOOKMAKER
    else if (bet.marketName === "Bookmaker" && bet.betOn !== IBetOn.CASINO) {
      if (bet.isBack) {
        delta = isSameRunner ? (bet.odds * bet.stack) / 100 : -bet.stack;
        colorVal = current > 0 ? "green" : "red";
      } else {
        delta = !isSameRunner ? bet.stack : -((bet.odds * bet.stack) / 100);
        colorVal = current > 0 ? "green" : "red";
      }
    }
    const newPnl = oldPnl + delta;
    // Set color based on updated PnL
    colorVal = newPnl > 0 ? "green" : "red";
    console.log(oldPnl, delta, "OLD PNL AND DELTA CASHOUT LOCAL");

    return Number(newPnl.toFixed(2));
  };
  

  return (
    <>
      {betValues.isOpen && (
        <>
          <div onClick={onBackDrop} className="backdrop-custom"></div>

          <div className="card m-b-10 place-bet">
            <div className="card-header" style={{display:'flex'}}>
              <h6 className="card-title d-inline-block col-10">Place Bet</h6>
              <span
                className="card-title d-inline-block col-1"
                onClick={closeBetPopup}
                style={{ paddingLeft:isMobile? "44px":"60px" }}
              >
               <img className="closebtnbetplace" src="/imgs/closeIcon.svg" alt="" style={{width:isMobile?'1em':'15px',height:isMobile?'1em':'15px'}}/>
              </span>
            </div>
            <div
              className={`table-responsive ${betObj.isBack ? "back" : "lay"}`} style={{ padding: isMobile ? '10px' : '' }}
            >
              <form onSubmit={onSubmit} style={{marginBottom:'0px'}}>
                <table className="coupon-table table table-borderedless">
                  <thead>
                    <tr style={{ backgroundColor: isMobile ? 'unset' : '' }}>
                      {/* <th style={{ width: "10%", textAlign: "left" }}> */}
                      {/* (Bet for) */}
                      {/* </th> */}
                      {/* <th style={{ width: "25%", textAlign: "left" }}> */}
                      {/* Odds */}
                      {/* </th> */}
                      <th style={{ width: "10%", textAlign: "left",padding:"3px 0px" }}>
                        {/* Stake */}
                        {(betObj.gtype === "teenunique" || betValues.betData?.gtype === "teenunique") ? (
                          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            {[betObj.C1, betObj.C2, betObj.C3]
                              .filter(Boolean)
                              .map((cardNum, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    width: "36px",
                                    height: "46px",
                                    border: "1.5px solid #ffcc00",
                                    borderRadius: "3px",
                                    position: "relative",
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "#fff",
                                  }}
                                >
                                  <img
                                    src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/1.jpg"
                                    alt={`Card ${cardNum}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      display: "block",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.onerror = null;
                                      e.currentTarget.src = "/imgs/card/patti_back.jpg";
                                    }}
                                  />
                                  <div
                                    style={{
                                      position: "absolute",
                                      width: "22px",
                                      height: "22px",
                                      borderRadius: "50%",
                                      background: "rgba(213, 213, 213, 0.85)",
                                      color: "#000",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontSize: "15px",
                                      fontWeight: 700,
                                      boxShadow: "0 0 2px rgba(0,0,0,0.25)",
                                      zIndex: 1,
                                    }}
                                  >
                                    {cardNum}
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          betObj.selectionName || betValues.betData?.selectionName || ""
                        )}
                      </th>
                      <th style={{ width: "25%", textAlign: "right", fontWeight: "400" }}>
                        Profit : {betValues.betData.pnl}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: isMobile ? '#ffffff45' : '' }}>
                      {/* <td className="text-center">
                        <a onClick={closeBetPopup} className="text-danger">
                          <i className="fa fa-times" />
                        </a>
                        {betObj.selectionName || "CASHOUT"}
                      </td> */}
                    
                      <td className="bet-stakes" style={{ width: '50%' }}>
                        <div className="form-group bet-stake" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{color:'black',fontSize:isMobile?'12px':'16px',fontWeight:!isMobile?'400':''}}>Amount</div>
                          <input className='mt-1'
                            maxLength={10}
                            required
                            type="number"
                            value={betObj.stack || ""}
                            onBlur={onBlurStack}
                            onChange={onChangeStack}
                            style={{width:'100%',marginLeft:'0px',border:'1px solid #666',height:'28px' }}
                          />
                        </div>
                      </td>
                        <td className="bet-odds" style={{ width: '50%' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{color:'black',fontSize:isMobile?'12px':'16px',fontWeight:!isMobile?'400':''}}>Odds</div>
                          <div className='mt-1' style={{ display: "flex" }}>
                            {/* <button
                              type="button"
                              className="custom-btn-spinner btn btn-xs btn-default"
                              onClick={() => incrementDecrementOdds("dec")}
                            >
                              <i
                                className="fa fa-minus"
                                style={{ color: "white" }}
                              />
                            </button> */}
                            <input
                              value={parseFloat(betObj?.odds?.toFixed(4)) || ""}
                              type="text"
                              required
                              maxLength={4}
                              readOnly
                              className="amountint"
                              style={{ width:isMobile? '45%':'100%', verticalAlign: "middle",border:'1px solid #666',height:'28px',marginLeft:'34px' }}
                            />{" "}
                            {/* <button
                              type="button"
                              className="custom-btn-spinner btn btn-xs btn-default"
                              onClick={() => incrementDecrementOdds("inc")}
                            >
                              <i
                                className="fa fa-plus"
                                style={{ color: "white" }}
                              />
                            </button> */}
                          </div>

                          {/* <div className="spinner-buttons input-group-btn btn-group-vertical">
                            <button
                              type="button"
                              className="custom-btn-spinner btn btn-xs btn-default"
                              onClick={() => incrementDecrementOdds("inc")}
                            >
                              <i className="fa fa-angle-up" />
                            </button>
                            <button
                              type="button"
                              className="custom-btn-spinner btn btn-xs btn-default"
                              onClick={() => incrementDecrementOdds("dec")}
                            >
                              <i className="fa fa-angle-down" />
                            </button>
                          </div> */}
                        </div>
                      </td>
                      {/* <td className="text-right bet-profit">
                        {betValues.betData.pnl}
                      </td> */}
                    </tr>
                    <tr>
                      <td
                        colSpan={5}
                        className="value-buttons"
                        style={{ padding:isMobile? '5px 0px':'5px 4px' }}
                      >
                        {renderStakeButtons()}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className="col-md-12"
                  style={{ minHeight: isMobile ? "4vh" : "", paddingLeft: isMobile ? '0px' : '', padding: isMobile ? '0px' : '' }}
                >


                  <button
                    type="submit"
                    className="btn btn-sm  btn-clearLink  m-b-5" style={{ width:isMobile? '25%':'auto' }}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-editplace btn-success m-b-5" style={{ width:isMobile? '25%':'auto' }}
                  >
                    Edit

                  </button>
                  <button
                    onClick={reset}
                    type="button"
                    className="btn btn-sm btn-resetPlace m-b-5 btn-danger" style={{ width:isMobile? '25%':'auto' }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={getPlaceBet.status === IApiStatus.Loading}
                    className="btn btn-sm btn-success m-b-5 btn-palcebet" style={{ width:isMobile? '25%':'auto' }}
                  >
                    Place Bet
                    {getPlaceBet.status === IApiStatus.Loading ? (
                      <i className="mx-5 fas fa-spinner fa-spin"></i>
                    ) : (
                      ""
                    )}
                  </button>


                </div>

                {/* <div className="mt-3 d-flex justify-content-between align-items-center" style={{fontSize:isMobile?'12px':'16px',color:'#000000'}}>
                   <b>
  <span>
    Range: {betObj.minbet} to {formatStake(betObj.maxbet)}
  </span>
</b>
                </div> */}
                <div
  className="mt-3 d-flex justify-content-between align-items-center"
  style={{
    fontSize: isMobile ? "12px" : "16px",
    color: "#000000",
  }}
>
  <b>
    Range: {Number(betObj.minbet) > 0 ? betObj.minbet : 100}
    {" to "}
    {formatStake(
      Number(betObj.maxbet) > 0
        ? Number(betObj.maxbet)
        : Number(betObj.maxb) > 0
          ? Number(betObj.maxb)
          : 0
    )}
  </b>
</div>
                {/* //here i want to show */}
                {isCashout && betValues.betData?.runnersPnl && (
                  <div
                    style={{
                      borderTop: "1px solid #ddd",
                      paddingTop: 8,
                      background: "#ffb6c1",
                      padding: "10px",
                    }}
                  >
                    {betValues.betData.runnersPnl.map((runner) => {
                      const key = `${betValues.betData.marketId}_${runner.selectionId}`;
                      const finalCashoutValue =
                        marketBook?.[key] ??
                        calculateLocalCashoutPnl(
                          runner.selectionId,
                          runner.pnl,
                          betObj,
                        );

                      // const finalValue = Number(
                      //   (finalCashoutValue + runner.pnl).toFixed(2)
                      // )
                      // const finalCashoutValue =
                      //   marketBook?.[key] ??
                      //   calculateLocalCashoutPnl(
                      //     runner.selectionId,
                      //     runner.pnl,
                      //     betObj,
                      //   )
                      //  console.log(finalCashoutValue,'FINAL CASHOUT VALUE ------------------>');
                      const cashoutPnlFinal = calculateLocalCashoutPnl(
                        runner.selectionId,
                        runner.pnl,
                        betValues.betData,
                      );

                      return (
                        <div
                          key={runner.selectionId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 4,
                          }}
                        >
                          <div style={{ flex: 1 }}>{runner.selectionName}</div>

                          {/* OLD */}
                          <div
                            style={{
                              width: 90,
                              textAlign: "right",
                              color: runner.pnl >= 0 ? "green" : "red",
                              fontWeight: 600,
                            }}
                          >
                            {formatAmount(runner.pnl)}
                          </div>

                          {/* NEW (LOCAL → SERVER SYNCED) */}
                          <div
                            style={{
                              width: 90,
                              textAlign: "right",
                              color:
                                cashoutPnlFinal > 0
                                  ? "green"
                                  : cashoutPnlFinal < 0
                                    ? "red"
                                    : "#333",
                              fontWeight: 600,
                            }}
                          >
                            {/* {formatAmount(calculateLocalCashoutPnl(
              runner.selectionId,
              runner.pnl,
              betValues.betData,
            ))} */}
                            {formatAmount(cashoutPnlFinal)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PlaceBetBox;
