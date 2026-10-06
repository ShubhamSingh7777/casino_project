import authService from "../../../services/auth.service";
import { RoleType } from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { selectCasinoCurrentMatch } from "../../../redux/actions/casino/casinoSlice";
import { betPopup } from "../../../redux/actions/bet/betSlice";
import { IBetOn, IBetType } from "../../../models/IBet";
import React, { useState } from "react";
import CasinoPnl from "./casinoPnl";
import Limitinfo from "./_common/limitinfo";
import { useParams } from "react-router-dom";
import ButtonItem from "./_common/new/ButtonItem";
import { isMobile } from "react-device-detect";

const TeenPatti20 = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
  const [updateOdds, setUpdateOdds] = useState<any>(undefined);

  // ✅ onBet stays same
  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return;
      if (item.gstatus == "False") return;
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: oddsVal,
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.runnerName,
            selectionId: parseInt(item.sid),
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: item.mid,
            exposure: 0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: liveMatchData.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
          },
        }),
      );
    }
  };

  // ✅ Render each runner’s submarket odds
  const renderSubMarketRow = (runnerList: any[]) => (
    <tr>
      {runnerList.map((r: any, i: number) => {
        const item: any = lastOdds?.[r.SelectionId] || {};
        const clsstatus =
          !item.gstatus ||
            item.gstatus === "SUSPENDED" ||
            item.gstatus === "CLOSED" ||
            item.gstatus === "0"
            ? "suspended"
            : "";

        return (
          <td
            key={i}
            className={`back teen-section ${clsstatus} box-2`}
            style={{ textAlign: "center" }}
          >
            <button className="back" onClick={() => onBet(true, item)}>
              <span className="odd">{item.b || "-"}</span>{" "}
              <CasinoPnl
                sectionId={r.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={'text-center'}
              />
            </button>
          </td>
        );
      })}
    </tr>
  );

  // ✅ Laybacklayout (kept same)
  const laybacklayout = (runnerList: any[]) => (
    <>{renderSubMarketRow(runnerList)}</>
  );

  const allRunnersA = liveMatchData?.defaultMarkets?.[0]?.Runners || [];
  const allRunnersB = liveMatchData?.defaultMarkets?.[1]?.Runners || [];
  const isTeenMuf = window.location.pathname.includes("teenmuf");
  // ✅ Find Red/Black runners (like in LuckSeven)
  const redA = allRunnersA.find((r: any) => r.RunnerName === "Red A");
  const blackA = allRunnersA.find((r: any) => r.RunnerName === "Black A");
  const redB = allRunnersB.find((r: any) => r.RunnerName === "Red B");
  const blackB = allRunnersB.find((r: any) => r.RunnerName === "Black B");
  // ✅ Detect current route

  // ✅ Desired order for Player A and B (dynamic based on route)
  const orderA = isTeenMuf
    ? ["Player A", "Top 9 A", "M Baccarat A"]
    : ["Player A", "3 Baccarat A", "Total A", "Pair plus A"];

  const orderB = isTeenMuf
    ? ["Player B", "Top 9 B", "M Baccarat B"]
    : ["Player B", "3 Baccarat B", "Total B", "Pair plus B"];

  // ✅ Maintain exact sequence
  const runnerA = orderA
    .map((name) => allRunnersA.find((r: any) => r.RunnerName === name))
    .filter(Boolean);
  const runnerB = orderB
    .map((name) => allRunnersB.find((r: any) => r.RunnerName === name))
    .filter(Boolean);

  // ✅ Define red/black icons like in LuckSeven
  const renderTitle = (runner: any) => {
    if (!runner?.RunnerName) return null;
    if (runner.RunnerName.includes("Red"))
      return (
        <span className="card-icon">
          <span className="card-red">[{"{"}</span>
        </span>
      );
    if (runner.RunnerName.includes("Black"))
      return (
        <span className="card-icon">
          <span className="card-black">{"]}"}</span>
        </span>
      );
    return runner.RunnerName;
  };
  const getFixedLastOdds = (
    selectionid: string | number,
    runnerName: string,
  ) => {
    const oddsObj = lastOdds?.[selectionid] ? { ...lastOdds[selectionid] } : {};
    // ✅ Ensure the correct name goes into ButtonItem and thus betPopup
    oddsObj.runnerName = runnerName;
    return { [selectionid]: oddsObj };
  };

  return (
    <div
      className="container"
      style={{
        paddingLeft: isMobile ? "0px" : "",
        paddingRight: isMobile ? "0px" : "",
      }}
    >
      {/* ✅ Row 1: Two side-by-side tables   */}
      {isMobile ? (
        <>
          <div
            className="row casino-32A"
            style={{
              marginLeft: isMobile ? "0px" : "",
              marginRight: isMobile ? "0px" : "",
            }}
          >
            {/* Player A Table */}
            <div
              className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
              style={{
                padding: isMobile ? "8px 5px" : "0px"
              }}
            >
              <div className="live-poker" style={{padding:isMobile?'0px 5px':'5px',border:isMobile?'1px solid #c7c8ca':'',borderBottom:isMobile?'none':''}}>
                <table className={`table coupon-table ${!isMobile ?'table-bordered':''} suspendwidth`}>
                  <thead>
                    <tr style={{ background: "#f8f8f8" }}>
                      <th
                        className="text-table-color"
                        colSpan={runnerA.length}
                        style={{
                          textAlign: "start",
                          padding: isMobile ? "2px 5px" : "",
                          borderTop: isMobile?"none":""
                        }}
                      >
                        {liveMatchData?.defaultMarkets?.[0]?.MarketName ||
                          "Player A"}
                      </th>
                    </tr>
                    <tr
                      style={{
                        background: "#fafafa",
                        height: isMobile ? "46px" : "",
                      }}
                    >
                      {runnerA.map((r: any, i: number) => (
                        <th
                          className="text-table-color"
                          key={i}
                          style={{ textAlign: "center",borderLeft:isMobile?'1px solid #c7c8ca':'',width:isMobile?'25.4%':'25.4%'
                           }}
                        >
                          {r.RunnerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{laybacklayout(runnerA)}</tbody>
                </table>
              </div>
            </div>

            {!window.location.pathname.includes("teenmuf") && (
              // <div className="row m-t-20 text-center" style={{flexWrap:isMobile?'nowrap':'wrap',marginLeft: isMobile ? "0px" : "",
              // marginRight: isMobile ? "0px" : "",gap:'5px'}}>
              <>
                {[redA, blackA].map((r: any, idx: number) => {
                  if (!r) return null;
                  const selectionid = r.SelectionId;
                  const scopedLastOdds = getFixedLastOdds(
                    selectionid,
                    r.RunnerName,
                  );

                  return (
                    <div
                      className="col-6 col-lg-3 teenpatti2020-cont"
                      key={idx}
                      style={{
                        paddingLeft: isMobile ? "10px" : "",
                        paddingRight: isMobile ? "10px" : "",
                        maxWidth: isMobile ? "50%" : "50%",
                        paddingTop: isMobile ? "4px" : "",
                      }}
                    >
                      <ButtonItem
                        selectionid={selectionid}
                        title={renderTitle(r)}
                        lastOdds={scopedLastOdds}
                        liveMatchData={liveMatchData}
                      />
                    </div>
                  );
                })}
              </>
            )}
            {/* Player B Table */}
            <div
              className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
              style={{ padding: isMobile ? "3px 5px" : "0px" }}
            >
              <div className="live-poker" style={{padding:isMobile?'0px 5px':'5px',border:isMobile?'1px solid #c7c8ca':'',borderBottom:isMobile?'none':''}}>
                <table className={`table coupon-table ${!isMobile ? 'table-bordered' : ''} suspendwidth`}>
                  <thead>
                    <tr style={{ background: "#f8f8f8" }}>
                      <th
                        className="text-table-color"
                        colSpan={runnerB.length}
                        style={{
                            textAlign: "start",
                          padding: isMobile ? "2px 5px" : "",
                          borderTop: isMobile?"none":""
                          
                        }}
                      >
                        {liveMatchData?.defaultMarkets?.[1]?.MarketName ||
                          "Player B"}
                      </th>
                    </tr>
                    <tr
                      style={{
                        background: "#fafafa",
                        height: isMobile ? "46px" : "",
                      }}
                    >
                      {runnerB.map((r: any, i: number) => (
                        <th
                          className="text-table-color"
                          key={i}
                          style={{ textAlign: "center",borderLeft:isMobile?'1px solid #c7c8ca':'',width:isMobile?'25.4%':'25.4%'
                           }}
                        >
                          {r.RunnerName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{laybacklayout(runnerB)}</tbody>
                </table>
              </div>
            </div>
            {!window.location.pathname.includes("teenmuf") && (
              // <div className="row m-t-20 text-center" style={{flexWrap:isMobile?'nowrap':'wrap',marginLeft: isMobile ? "0px" : "",
              // marginRight: isMobile ? "0px" : "",gap:'5px'}}>
              <>
                {[redB, blackB].map((r: any, idx: number) => {
                  if (!r) return null;
                  const selectionid = r.SelectionId;
                  const scopedLastOdds = getFixedLastOdds(
                    selectionid,
                    r.RunnerName,
                  );

                  return (
                    <div
                      className="col-6 col-lg-3 teenpatti2020-cont"
                      key={idx}
                      style={{
                        paddingLeft: isMobile ? "10px" : "",
                        paddingRight: isMobile ? "10px" : "",
                        paddingTop: isMobile ? "4px" : "",
                        maxWidth: isMobile ? "50%" : "",
                      }}
                    >
                      <ButtonItem
                        selectionid={selectionid}
                        title={renderTitle(r)}
                        lastOdds={scopedLastOdds}
                        liveMatchData={liveMatchData}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div></>
      ) : (
        <div
          className="row casino-32A"
          style={{
            marginLeft: isMobile ? "0px" : "",
            marginRight: isMobile ? "0px" : "",
            marginTop: '5px',
            gap: '3px'
          }}
        >
          {/* Player A Table */}
          <div
            className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
            style={{
              padding: isMobile ? "3px 5px" : "0px", maxWidth: !isMobile ? '49.5%' : ''
            }}
          >
            <div className="live-poker">
              <table className="table coupon-table table-bordered suspendwidth">
                <thead>
                  <tr style={{ background: "#f8f8f8" }}>
                    <th
                      className="text-table-color"
                      colSpan={runnerA.length}
                      style={{
                        textAlign: "start",
                        padding: isMobile ? "2px 5px" : "",
                        paddingLeft: '5px'
                      }}
                    >
                      {liveMatchData?.defaultMarkets?.[0]?.MarketName ||
                        "Player A"}
                    </th>
                  </tr>
                  <tr
                    style={{
                      background: "#fafafa",
                      height: isMobile ? "46px" : "",
                      
                    }}
                  >
                    {runnerA.map((r: any, i: number) => (
                      <th
                        className="text-table-color"
                        key={i}
                        style={{ textAlign: "center",width:isMobile?'25.4%':'25.4%' }}
                      >
                        {r.RunnerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{laybacklayout(runnerA)}</tbody>
              </table>
            </div>
          </div>
          {/* Player B Table */}
          <div
            className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
            style={{ padding: isMobile ? "3px 5px" : "0px", paddingLeft: !isMobile ? '0px' : '', paddingRight: !isMobile ? '0p' : '' }}
          >
            <div className="live-poker">
              <table className="table coupon-table table-bordered suspendwidth">
                <thead>
                  <tr style={{ background: "#f8f8f8" }}>
                    <th
                      className="text-table-color"
                      colSpan={runnerB.length}
                      style={{
                        textAlign: "start",
                        padding: isMobile ? "2px 5px" : "",
                      }}
                    >
                      {liveMatchData?.defaultMarkets?.[1]?.MarketName ||
                        "Player B"}
                    </th>
                  </tr>
                  <tr
                    style={{
                      background: "#fafafa",
                      height: isMobile ? "46px" : "",
                    }}
                  >
                    {runnerB.map((r: any, i: number) => (
                      <th
                        className="text-table-color"
                        key={i}
                        style={{ textAlign: "center" }}
                      >
                        {r.RunnerName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{laybacklayout(runnerB)}</tbody>
              </table>
            </div>
          </div>

          {!window.location.pathname.includes("teenmuf") && (
            // <div className="row m-t-20 text-center" style={{flexWrap:isMobile?'nowrap':'wrap',marginLeft: isMobile ? "0px" : "",
            // marginRight: isMobile ? "0px" : "",gap:'5px'}}>
            <>
              {[redA, blackA].map((r: any, idx: number) => {
                if (!r) return null;
                const selectionid = r.SelectionId;
                const scopedLastOdds = getFixedLastOdds(
                  selectionid,
                  r.RunnerName,
                );

                return (
                  <div
                    className="col-6 col-lg-3 teenpatti2020-cont"
                    key={idx}
                    style={{
                      paddingLeft: isMobile ? "5px" : "0px",
                      paddingRight: isMobile ? "5px" : "0px",
                      maxWidth: isMobile ? "50%" : "24.5%",
                      paddingTop: isMobile ? "4px" : "10px",
                    }}
                  >
                    <ButtonItem
                      selectionid={selectionid}
                      title={renderTitle(r)}
                      lastOdds={scopedLastOdds}
                      liveMatchData={liveMatchData}
                    />
                  </div>
                );
              })}
            </>
          )}

          {!window.location.pathname.includes("teenmuf") && (
            // <div className="row m-t-20 text-center" style={{flexWrap:isMobile?'nowrap':'wrap',marginLeft: isMobile ? "0px" : "",
            // marginRight: isMobile ? "0px" : "",gap:'5px'}}>
            <>
              {[redB, blackB].map((r: any, idx: number) => {
                if (!r) return null;
                const selectionid = r.SelectionId;
                const scopedLastOdds = getFixedLastOdds(
                  selectionid,
                  r.RunnerName,
                );

                return (
                  <div
                    className="col-6 col-lg-3 teenpatti2020-cont"
                    key={idx}
                    style={{
                      paddingLeft: isMobile ? "5px" : "0px",
                      paddingRight: isMobile ? "5px" : "0px",
                      paddingTop: isMobile ? "4px" : "10px",
                      maxWidth: isMobile ? "50%" : "24.5%",
                    }}
                  >
                    <ButtonItem
                      selectionid={selectionid}
                      title={renderTitle(r)}
                      lastOdds={scopedLastOdds}
                      liveMatchData={liveMatchData}
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}


      {/* ✅ Row 2: Four Buttons in One Row (after both tables) */}
    </div>
  );
};

export default TeenPatti20;
