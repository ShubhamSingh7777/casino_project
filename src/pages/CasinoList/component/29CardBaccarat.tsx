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
import { isMIUI, isMobile } from "react-device-detect";

const TwennineCard = (props: any) => {
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
            style={{ textAlign: "center", maxWidth: "25%", width: "25%" }}
          >
            <button className="back" onClick={() => onBet(true, item)}>
              <span className="odd">{item.b || "-"}</span>{" "}
              <CasinoPnl
                sectionId={r.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
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
  const allRunnersC = liveMatchData?.defaultMarkets?.[2]?.Runners || [];

  // ✅ Find Red/Black runners (like in LuckSeven)
  const redA = allRunnersA.find((r: any) => r.RunnerName === "Red A");
  const blackA = allRunnersA.find((r: any) => r.RunnerName === "Black A");
  const redB = allRunnersB.find((r: any) => r.RunnerName === "Red B");
  const blackB = allRunnersB.find((r: any) => r.RunnerName === "Black B");
  // ✅ Detect current route

  // ✅ Desired order for Player A and B (dynamic based on route)
  // const orderA = ['Player A', 'High Card A', 'Pair A', 'Color Plus A'];

  // const orderB = ['Player B', 'High Card B', 'Pair B', 'Color Plus B'];

  // ✅ Maintain exact sequence
  const runnerA = allRunnersA;
  const runnerB = allRunnersB;
  const runnerC = allRunnersC;
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
        padding: isMobile ? "5px" : "0px",
        paddingLeft: isMobile ? "5px" : "0px",
        paddingRight: isMobile ? "5px" : "0px",
        marginTop: isMobile ? "5px" : "",
        paddingBottom: isMobile ? "0px" : "",
      }}
    >
      {/* ✅ Row 1: Two side-by-side tables */}
      <div
        className="row casino-32A"
        style={{ marginRight: "0px", marginLeft: "0px", gap: "5px" }}
      >
        {/* Player A Table */}
        <div
          className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
          style={{
            padding: "0px",
            paddingLeft: "0px",
            paddingRight: "0px",
            maxWidth: isMobile ? "100%" : "49%",
          }}
        >
          <div
            className={`live-poker ${isMobile ? "table-bordered" : ""}`}
            style={{ padding: isMobile ? "5px" : "" }}
          >
            <table
              className={`table coupon-table ${
                !isMobile ? "table-bordered" : ""
              } suspendwidth`}
            >
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th
                    className="playerAContBacc"
                    colSpan={runnerA.length}
                    style={{ textAlign: "start", borderLeft: "none" }}
                  >
                    {liveMatchData?.defaultMarkets?.[0]?.MarketName ||
                      "Player A"}
                  </th>
                </tr>
                <tr style={{ background: "#fafafa" }}>
                  {runnerA.map((r: any, i: number) => (
                    <th
                      key={i}
                      style={{
                        textAlign: "center",
                        width: "25%",
                        padding: "5px 0",
                        height: "46px",
                        borderLeft: isMobile ? "1px solid #c7c8ca" : "",
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

        {/* Player B Table */}
        <div
          className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
          style={{ padding: "0px" }}
        >
          <div
            className={`live-poker ${isMobile ? "table-bordered" : ""}`}
            style={{ padding: isMobile ? "5px" : "" }}
          >
            <table
              className={`table coupon-table ${
                !isMobile ? "table-bordered" : ""
              } suspendwidth`}
            >
              <thead>
                <tr style={{ background: "#f8f8f8" }}>
                  <th className="playerAContBaccTextAdmin"
                    colSpan={runnerB.length}
                    style={{ textAlign: "start", borderLeft: "none" }}
                  >
                    {liveMatchData?.defaultMarkets?.[1]?.MarketName ||
                      "Player B"}
                  </th>
                </tr>
                <tr style={{ background: "#fafafa" }}>
                  {runnerB.map((r: any, i: number) => (
                    <th
                      key={i}
                      style={{
                        textAlign: "center",
                        width: "25%",
                        padding: "5px 0",
                        height: "46px",
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
      </div>
      {/* Player C Table */}
      {runnerC.length > 0 && (
        <div
          className="mt-3"
          style={{
            display: "flex",
            justifyContent: "center",
            border: "1px solid #c7c8ca",
            padding: "10px",
            borderBottom:isMobile?'none':'',
            borderLeft:isMobile?'none':'',
            borderRight:isMobile?'none':''
          }}
        >
          <div
            className="col-lg-6 col-md-12 col-sm-12 main-market m-t-10"
            style={{ padding: "0px", borderBottom: "none" }}
          >
            <div className="live-poker">
              <table
                className="table coupon-table suspendwidth"
                style={{ background: "none" }}
              >
                <tbody>
                  {runnerC.map((r: any, i: number) => {
                    const item: any = lastOdds?.[r.SelectionId] || {};
                    const clsstatus =
                      !item.gstatus ||
                      item.gstatus === "SUSPENDED" ||
                      item.gstatus === "CLOSED" ||
                      item.gstatus === "0"
                        ? "suspended"
                        : "";
                    return (
                      <tr
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* Runner Name */}
                        <td
                          style={{
                            fontWeight: "bold",
                            textAlign: isMobile ? "end" : "center",
                            padding: !isMobile ? "0px" : "0px",
                            borderBottom: "none",
                          }}
                        >
                          {/* {r.RunnerName} */}
                          <img
                            src="/lucky9.png"
                            alt=""
                            style={{ height: isMobile ? "60px" : "100px" }}
                          />
                        </td>

                        {/* BACK BUTTON */}
                        <td
                          className={`${clsstatus} text-center`}
                          style={{
                            padding: !isMobile ? "0px" : "0px",
                            borderBottom: "none",
                            minHeight: "46px",
                          }}
                        >
                          <button
                            className="back w-100"
                            onClick={() => onBet(true, item)}
                            disabled={clsstatus === "suspended"}
                            style={{
                              minWidth: isMobile ? "65px" : "78px",
                              fontSize: !isMobile ? "18px" : "",
                            }}
                          >
                            <span className="odd">{item.b || "-"}</span>
                               <CasinoPnl
                sectionId={item.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
              />
                          </button>
                        </td>

                        {/* LAY BUTTON */}
                        <td
                          className={`${clsstatus} text-center`}
                          style={{
                            padding: !isMobile ? "0px" : "0px",
                            borderBottom: "none",
                            minHeight: "46px",
                          }}
                        >
                          <button
                            className="lay w-100"
                            onClick={() => onBet(false, item)}
                            disabled={clsstatus === "suspended"}
                            style={{
                              minWidth: isMobile ? "65px" : "78px",
                              fontSize: !isMobile ? "18px" : "",
                            }}
                          >

                            <span className="odd">{item.l || "-"}</span>
                               <CasinoPnl
                sectionId={item.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
              />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwennineCard;
