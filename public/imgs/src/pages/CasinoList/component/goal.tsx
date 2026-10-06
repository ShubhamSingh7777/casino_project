import authService from "../../../services/auth.service";
import { RoleType } from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { betPopup } from "../../../redux/actions/bet/betSlice";
import { IBetOn, IBetType } from "../../../models/IBet";
import React from "react";
import CasinoPnl from "./casinoPnl";
import { replacecardstring } from "../../../utils/helper";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

const Goal = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { gameCode } = useParams();

//   console.log("🔥 Goal MARKET", {
//   liveMatchId: liveMatchData?.match_id,
//   eventDataMatchId: liveMatchData?.event_data?.match_id,
//   market: liveMatchData?.event_data?.market?.[0],
//   runners: liveMatchData?.event_data?.market?.[0]?.Runners,
// });

  const pushDataToPositions = React.useCallback(
    (data: string) => {
      const positions = [0, 1, 2, 3, 4, 5, 6, 7];
      const finalString = data?.split(",") || [];
      const dataArray: Array<string> =
        (finalString && finalString.filter((d) => d !== "1")) ?? [];
      const indicesToRemove = [8, 16, 24];
      for (const index of indicesToRemove) {
        dataArray.splice(index, 1);
      }
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 8;
          if (index !== 25) {
            const position: any = positions[positionIndex];
            acc[position].push(item);
          }
          return acc;
        },
        {
          "0": [],
          "1": [],
          "2": [],
          "3": [],
          "4": [],
          "5": [],
          "6": [],
          "7": [],
        },
      );
    },
    [lastOdds?.cardsstring],
  );

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    const oddVal = parseFloat(isBack ? item.b : item.l);
    const odds = oddVal.toString();
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.gstatus === "0") return;
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.nat,
            selectionId: item.sid,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: liveMatchData?.event_data?.match_id || 0,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: liveMatchData.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
            minbet: liveMatchData.min,
            maxbet: liveMatchData.max,
          },
        }),
      );
    }
  };
  const formatIndianNumber = (num: any) => {
    if (!num) return 0;

    if (num >= 10000000) {
      return `${num / 10000000}Cr`;
    }

    if (num >= 100000) {
      return `${num / 100000}L`;
    }

    if (num >= 1000) {
      return `${num / 1000}K`;
    }

    return num;
  };
  const laybacklayout = React.useCallback(() => {
    const clsnamehead = "box-4";
    const clsnamename = "box-3";
    const heightdata = "";
    const cards = pushDataToPositions(lastOdds?.cardsstring || "");
    let rows: JSX.Element[] = [];

    liveMatchData?.defaultMarkets?.forEach(
      (ItemMarketLink: any, keyLink: number) => {
        ItemMarketLink?.Runners?.forEach((ItemNew: any, key: number) => {
          if (keyLink >= 8) return;

          const Item: any = lastOdds?.[ItemNew.SelectionId] || {};
          const clsstatus =
            !Item.gstatus || ["SUSPENDED", "CLOSED", "0"].includes(Item.gstatus)
              ? "suspended"
              : "";
          const otherMarket =
            liveMatchData?.defaultMarkets?.[keyLink + 8]?.Runners[0] || {};
          const ItemOther: any = lastOdds?.[otherMarket.SelectionId] || {};

          rows.push(
            <tr key={`${keyLink}-${key}`} className={` ${heightdata}`}>
              <td
                className={`${
                  gameCode === "goal2"
                    ? isMobile
                      ? "box-3"
                      : "box-2Goal2Title"
                    : isMobile
                    ? "box-4"
                    : "box-3"
                }`}
                style={{
                  paddingLeft: "10px",
                  verticalAlign: !isMobile ? "unset" : "",
                  width: !isMobile ? "57%":"",
                  maxWidth:!isMobile ? "57%":"",
                  color:!isMobile ? "#333":""
                }}
              >
                {ItemNew.RunnerName}
                     <CasinoPnl
                    sectionId={Item.sid}
                    matchId={liveMatchData.match_id}
                    classData={"text-center"}
                  />
                {cards &&
                  cards[keyLink] &&
                  cards[keyLink].map((ItemCard: any, keyCard: any) => (
                    <span
                      key={keyCard}
                      className={`card-icon ${
                        keyCard === 0 ? "m-l-20" : "m-l-1"
                      }`}
                    >
                      <span>{replacecardstring(ItemCard)}</span>
                    </span>
                  ))}
              </td>
              <td
                className={`back teen-section ${
                  gameCode === "goal2"
                    ? isMobile
                      ? "box-3"
                      : "box-2Goal2Back"
                    : isMobile
                    ? "box-3"
                    : "box3-goal"
                } ${clsstatus}`}
              >
                <button className="back" onClick={() => onBet(true, Item)}>
                  <span className="odd">{Item.b}</span>
                       <b style={{ fontSize:"11px",fontWeight:"100",color:"#333"}}>
                    {" "}
                     {(Item?.max)}{" "}
                  </b>
                
                </button>
              </td>
              {gameCode === "goal2" && (
                <td
                  className={`lay teen-section ${
                    gameCode === "goal2"
                      ? isMobile
                        ? "box-3"
                        : "box-2Goal2Back"
                      : isMobile
                      ? "box-3"
                      : "box3-goal"
                  } ${clsstatus}`}
                >
                  <button className="lay" onClick={() => onBet(false, Item)}>
                    <span className="odd">{Item.l}</span>
                    <CasinoPnl
                      sectionId={Item.sid}
                      matchId={liveMatchData.match_id}
                      classData="text-center"
                    />
                  </button>
                </td>
              )}
              <td
                className={`${
                  gameCode === "goal2"
                    ? isMobile
                      ? "box-3"
                      : "box-2Goal2Back"
                    : isMobile
                    ? "box-3"
                    : "box3"
                }text-center`}
              >
                <div
                  style={{
                    fontSize: isMobile ? "10px" : "9px",
                    lineHeight:isMobile ?"8px":"7px",
                    color: isMobile ? "#070808" : "#097c93",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent:isMobile ?"end":"start",
                    alignItems: isMobile ? "end" : "start",
                    padding: !isMobile ? "0px 5px" : "",
                    marginLeft:!isMobile?"10px":""
                  }}
                >
                  <b style={{ color: "#097c93" }}>Min: {Item?.min || 0} </b>
                  <br />
                  <b style={{ color: "#097c93" }}>
                    {" "}
                    Max: {formatIndianNumber(Item?.max)}{" "}
                  </b>
                </div>
              </td>
            </tr>,
          );
        });
      },
    );
    return rows;
  }, [lastOdds, liveMatchData]);

  // 📌 Generate rows only once
  const rows = laybacklayout();
  const firstTableRows = rows.slice(0, 10);
  const secondTableRows = rows.slice(10);
  const paddingRight = gameCode === "goal2" ? "0px" : !isMobile ? "0px" : "";
  const paddingLeft = gameCode === "goal2" ? "0px" : !isMobile ? "15px" : "";
  const renderMarketTable = (market: any, showLay: boolean = true) => {
    if (!market) return null;

    const hideTitle = market.hideTitle;
    return (
      <div className="main-market bg-gray">
        <div className="live-poker">
          <table className="table coupon-table suspendwidth">
            <thead style={{ borderBottom: 0 }}>
              {!hideTitle && (
                <tr style={{ background: "#2c3e50d9" }}>
                  <th colSpan={4} style={{ color: "#fff", paddingLeft: "4px",fontSize: !isMobile?"15px":"" }}>
                    {market.MarketName === "Bookmaker"
                      ? "Who Will Goal Next?"
                      : market.MarketName === "method"
                      ? "Method Of Next Goal"
                      : market.MarketName === "combo"
                      ? "Method of Combination Goal"
                      : market.MarketName}
                  </th>
                </tr>
              )}

              <tr>
                <th className={`${showLay?'box-2Goal2Title':'box-2Goal2TitleShowLayNew'}`}></th>
                <th className={`back ${showLay?'box-2Goal2Back': 'box-2Goal2BackLay'} text-center`}>Back</th>
                {showLay && (
                  <th className="lay box-2Goal2Back text-center">Lay</th>
                )}
                {/* <th className="lay box-2Goal2Back text-center">Lay</th> */}
                <th className="box-4 box-2Goal2Back"></th>
              </tr>
            </thead>

            <tbody>
              {market.Runners?.map((runner: any) => {
                const Item = lastOdds?.[runner.SelectionId] || {};

                const clsstatus =
                  !Item.gstatus ||
                  ["SUSPENDED", "CLOSED", "0"].includes(Item.gstatus)
                    ? "suspended"
                    : "";
console.log("🔥 UNLIMITED Goal PNL", {
      itemSid: Item?.sid,
      matchId: liveMatchData?.match_id,
      pnlKey: `${liveMatchData?.match_id}_${Item?.sid}`,
    });
                return (
                  <tr key={runner.SelectionId}>
                    <td
                      className={`${
                        showLay ? "box-2Goal2Title" : "box-2Goal2TitleShowLay"
                      } ${market.MarketName === "combo" ? "combo-runner-name" : ""}`}
                      style={{ color: "#333",fontSize:isMobile?'13px':'' }}
                    >
                      {runner.RunnerName}
                        <CasinoPnl
                    sectionId={Item.sid}
                    matchId={liveMatchData.match_id}
                    classData={"text-center"}
                  />
                    </td>

                    <td
                      className={`back teen-section ${
                        isMobile ? "box-2Goal2Back" : "box-2Goal2Back"
                      } ${clsstatus}`}
                    >
                      <button
                        className="back"
                        onClick={() => onBet(true, Item)}
                        style={{display:!isMobile?'flex':'',flexDirection:isMobile?'column':'column'}}
                      >
                        <span className="odd">{Item.b}</span>
                                <span style={{ color: "#333",fontSize:isMobile?'11px':'12px',fontWeight:'100' }}>
                    {" "}
                   {(Item?.bs)}{" "}
                  </span>
                        {/* <CasinoPnl
                          sectionId={Item.sid}
                          matchId={liveMatchData?.match_id}
                          classData="text-center"
                        /> */}
                      </button>
                    </td>

                    {/* <td
                    className={`lay teen-section ${
                      isMobile ? "box-3" : "box-2Goal2Back"
                    } ${clsstatus}`}
                  >
                    <button
                      className="lay"
                      onClick={() => onBet(false, Item)}
                    >
                      <span className="odd">{Item.l}</span>

                      <CasinoPnl
                        sectionId={Item.sid}
                        matchId={liveMatchData?.match_id}
                        classData="text-center"
                      />
                    </button>
                  </td> */}
                    {showLay && (
                      <td
                        className={`lay teen-section ${
                          isMobile ? "box-2Goal2Back" : "box-2Goal2Back"
                        } ${clsstatus}`}
                      >
                        <button
                          className="lay"
                          onClick={() => onBet(false, Item)}
                          style={{display:!isMobile?'flex':'',flexDirection:isMobile?'column':'column'}}
                        >
                          <span className="odd">{Item.l}</span>
                          <span style={{ color: "#333",fontSize:'12px',fontWeight:'100' }}>
                    {" "}
                   {(Item?.bs)}{" "}
                  </span>
                          {/* <CasinoPnl
                            sectionId={Item.sid}
                            matchId={liveMatchData?.match_id}
                            classData="text-center"
                          /> */}
                        </button>
                      </td>
                    )}
                    <td className="text-end box-2Goal2Back">
                      <div
                        style={{
                          fontSize: isMobile ? "10px" : "9px",
                          color: "#097c93",
                          padding: "0 5px",
                        }}
                      >
                        <b>Min: {Item.min || 0}</b>
                        <br />
                        <b>Max: {formatIndianNumber(Item.max || 0)}</b>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
const renderCombinationMarket = () => {
  const runners = liveMatchData?.defaultMarkets?.[2]?.Runners || [];

  return (
    <div className="combination-market-wrapper">
      <div className="combination-grid">
        {runners.map((runner: any) => {
          const Item = lastOdds?.[runner.SelectionId] || {};

          const isSuspended =
            !Item.gstatus ||
            ["SUSPENDED", "CLOSED", "0"].includes(Item.gstatus);

          return (
            <div
              key={runner.SelectionId}
              className={`combination-card ${
                isSuspended ? "combination-suspended" : ""
              }`}
            >
              {/* NAME */}
              <div className="combination-name">
                {runner.RunnerName}
                  <CasinoPnl
                    sectionId={Item.sid}
                    matchId={liveMatchData.match_id}
                    classData={"text-center"}
                  />

                <span className="combination-info">i</span>
              </div>

              {/* ODDS */}
              <button
                className="combination-odds-button"
                onClick={() => onBet(true, Item)}
                disabled={isSuspended}
              >
                <span className="combination-odd">
                  {Item?.b || "-"}
                </span>

                <span className="combination-max">
                  {Item?.max || 0}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
  return (
    <div
      className="container container-goal"
      style={{
        paddingRight,
        paddingLeft,
        display: gameCode === "goal2" ? "unset" : "flex",
      }}
    >
      {gameCode === "goal2" ? (
        <>
          <div
            className="row casino-32A"
            style={{ width: "100%", marginLeft: !isMobile ? "0px" : "0px" }}
          >
            <div
              className="col-lg-6"
              style={{
                paddingRight: !isMobile ? "3px" : "0px",
                paddingLeft: !isMobile ? "0px" : "0px",
              }}
            >
              {renderMarketTable(liveMatchData?.defaultMarkets?.[0])}
            </div>

            <div
              className="col-lg-6"
              style={{
                paddingRight: !isMobile ? "0px" : "0px",
                paddingLeft: !isMobile ? "3px" : "0px",
              }}
            >
              {renderMarketTable(liveMatchData?.defaultMarkets?.[1])}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              background: "#2c3e50d9",
              color: "#fff",
              padding: "8px 10px",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Method of Combination Goal
          </div>
          {!isMobile?(
            <div
            className={`row ${
              gameCode === "goal2" ? "casino32AGoal2" : "casino-32A"
            }`}
            style={{ marginLeft: !isMobile ? "0px" : "0px" }}
          >
            <div
              className="col-lg-6"
              style={{
                paddingRight: !isMobile ? "0px" : "0px",
                paddingLeft: !isMobile ? "3px" : "0px",
              }}
            >
              {renderMarketTable(
                {
                  ...liveMatchData?.defaultMarkets?.[2],
                  hideTitle: true,
                  Runners: liveMatchData?.defaultMarkets?.[2]?.Runners.slice(
                    0,
                    Math.ceil(
                      (liveMatchData?.defaultMarkets?.[2]?.Runners.length ||
                        0) / 2,
                    ),
                  ),
                },
                false, // Hide Lay
              )}
            </div>

            <div
              className="col-lg-6"
              style={{
                paddingRight: !isMobile ? "0px" : "0px",
                paddingLeft: !isMobile ? "3px" : "0px",
              }}
            >
              {renderMarketTable(
                {
                  ...liveMatchData?.defaultMarkets?.[2],
                  hideTitle: true,
                  Runners: liveMatchData?.defaultMarkets?.[2]?.Runners.slice(
                    Math.ceil(
                      (liveMatchData?.defaultMarkets?.[2]?.Runners.length ||
                        0) / 2,
                    ),
                  ),
                },
                false, // Hide Lay
              )}
            </div>
          </div>
          )
          :(

         <div
  className="row casino32AGoal2"
  style={{
    marginLeft: "0px",
    marginRight: "0px",
  }}
>
  <div
    className="col-12"
    style={{
      paddingLeft: "8px",
      paddingRight: "8px",
    }}
  >
    {renderCombinationMarket()}
  </div>
</div>
          )}
      
        </>
      ) : (
        <>
          {/* // Existing Goal UI */}
          {/* FIRST TABLE */}

          <div
            className="row casino-32A"
            style={{ marginRight: !isMobile ? "5px" : "" }}
          >
            <div
              className="col-lg-12 main-market bg-gray"
              style={{ padding: "0px" }}
            >
              <div
                className="live-poker"
                style={{ paddingRight: isMobile ? "8px" : "" }}
              >
                <table className={`table coupon-table table ${isMobile? 'table-bordered':''} suspendwidth`}>
                  <thead style={{ borderBottom: "0px" }}>
                    <tr style={{ background: "#2c3e50d9" }}>
                      <th
                        className="box-4"
                        style={{
                          color: "white",
                          paddingLeft: "7px",
                          fontSize: isMobile ? "13px" : "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Who Will Goal Next?
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th
                        className={`${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-4"
                            : "box-4"
                        }`}
                      ></th>
                      <th
                        className={`back ${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-3"
                            : "box3-goal"
                        } text-center fs-12`}
                        style={{fontSize:isMobile?'16px':''}}
                      >
                        Back
                      </th>
                      {gameCode === "goal2" && (
                        <th
                          className={`lay ${
                            gameCode === "goal2"
                              ? isMobile
                                ? "box-3"
                                : "box-2Goal2Title"
                              : isMobile
                              ? "box-3"
                              : "box3-goal"
                          } text-center fs-12`}
                        >
                          Lay
                        </th>
                      )}
                      <th
                        className={`${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-4"
                            : "box-4"
                        }`}
                      ></th>
                    </tr>
                    {firstTableRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SECOND TABLE */}
          <div
            className="row casino-32A"
            style={{ marginLeft: !isMobile ? "0px" : "" }}
          >
            <div
              className={`col-lg-12 main-market ${isMobile?'bg-gray':''}`}
              style={{ padding: "0px" }}
            >
              <div
                className="live-poker"
                style={{ paddingRight: isMobile ? "8px" : "" }}
              >
                <table className={`table coupon-table table ${isMobile? 'table-bordered':''} suspendwidth`}>
                  <thead style={{ borderBottom: "0px" }}>
                    <tr style={{ background: "#2c3e50d9" }}>
                      <th
                        className="box-4"
                        style={{
                          color: "white",
                          paddingLeft: "7px",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        Method Of Next Goal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th
                        className={`${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-4"
                            : "box-4"
                        }`}
                      ></th>
                      <th
                        className={`back ${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-3"
                            : "box3-goal"
                        } text-center fs-12`}
                        style={{fontSize:isMobile?'16px':''}}
                      >
                        Back
                      </th>
                      {gameCode === "goal2" && (
                        <th
                          className={`lay ${
                            gameCode === "goal2"
                              ? isMobile
                                ? "box-3"
                                : "box-2Goal2Title"
                              : isMobile
                              ? "box-3"
                              : "box3-goal"
                          } text-center fs-12`}
                        >
                          Lay
                        </th>
                      )}
                      <th
                        className={`${
                          gameCode === "goal2"
                            ? isMobile
                              ? "box-3"
                              : "box-2Goal2Title"
                            : isMobile
                            ? "box-4"
                            : "box-4"
                        }`}
                      ></th>
                    </tr>
                    {secondTableRows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Goal;