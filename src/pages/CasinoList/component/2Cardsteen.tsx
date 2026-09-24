import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { selectCasinoCurrentMatch } from '../../../redux/actions/casino/casinoSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import React, { useState } from 'react';
import CasinoPnl from './casinoPnl';
import Limitinfo from './_common/limitinfo';
import { useParams } from 'react-router-dom';
import ButtonItem from './_common/new/ButtonItem';
import { isMobile } from 'react-device-detect';

const TwocardsTeen = (props: any) => {
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
      if (item.gstatus == 'False') return;
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
        })
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

      // 🔹 Only BACK button for Mini Baccarat A/B
      const isMiniBaccarat =
        r.RunnerName === "Mini Baccarat A" ||
        r.RunnerName === "Mini Baccarat B";

      // 🔹 Only BACK button for any “Color Plus”
      const isColorPlus =
        r.RunnerName?.toLowerCase()?.includes("color plus");

      // 🔹 Final condition: hide LAY if Mini Baccarat OR Color Plus
      const isOnlyBack = isMiniBaccarat || isColorPlus;

      return (
        <React.Fragment key={i}>
          {/* BACK BUTTON */}
          <td
            className={`back teen-section ${clsstatus} box-2`}
            style={{ textAlign: "center",width:'20%',maxWidth:'20%',padding:'0px' }}
          >
            <button className="back" onClick={() => onBet(true, item)}>
              <span className="odd">{item.b || "-"}</span>
              <CasinoPnl
                sectionId={r.SelectionId}
                matchId={liveMatchData?.match_id}
                classData={"text-center"}
              />
            </button>
          </td>

          {/* LAY BUTTON — REMOVE FOR COLOR+ & MINI BACCARAT */}
          {!isOnlyBack && (
            <td
              className={`lay teen-section ${clsstatus} box-2`}
              style={{ textAlign: "center",width:'20%',maxWidth:'20%' }}
            >
              <button className="lay" onClick={() => onBet(false, item)}>
                <span className="odd">{item.l || "0"}</span>
                <CasinoPnl
                  sectionId={r.SelectionId}
                  matchId={liveMatchData?.match_id}
                  classData={"text-center"}
                />
              </button>
            </td>
          )}
        </React.Fragment>
      );
    })}
  </tr>
);


  // ✅ Laybacklayout (kept same)
  const laybacklayout = (runnerList: any[]) => (
    <>
      {renderSubMarketRow(runnerList)}
    </>
  );
   
  const allRunnersA = liveMatchData?.defaultMarkets?.[0]?.Runners || [];
  const allRunnersB = liveMatchData?.defaultMarkets?.[1]?.Runners || [];
  const colorPlusMarket = liveMatchData?.defaultMarkets?.find(
  (m: any) => m.MarketName === "Color Plus"
);
//   const isTeenMuf = window.location.pathname.includes("teenmuf");
  // ✅ Find Red/Black runners (like in LuckSeven)
//   const redA = allRunnersA.find((r: any) => r.RunnerName === 'Red A');
//   const blackA = allRunnersA.find((r: any) => r.RunnerName === 'Black A');
//   const redB = allRunnersB.find((r: any) => r.RunnerName === 'Red B');
//   const blackB = allRunnersB.find((r: any) => r.RunnerName === 'Black B');
  // ✅ Detect current route


 // ✅ Desired order for Player A and B (dynamic based on route)
const orderA = ['Player A', 'Mini Baccarat A', 'Total A'];
const orderB = ['Player B', 'Mini Baccarat B', 'Total B'];
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
    if (runner.RunnerName.includes('Red'))
      return (
        <span className="card-icon">
          <span className="card-red">[{'{'}</span>
        </span>
      );
    if (runner.RunnerName.includes('Black'))
      return (
        <span className="card-icon">
          <span className="card-black">{']}'}</span>
        </span>
      );
    return runner.RunnerName;
  };
  const getFixedLastOdds = (selectionid: string | number, runnerName: string) => {
  const oddsObj = lastOdds?.[selectionid] ? { ...lastOdds[selectionid] } : {};
  // ✅ Ensure the correct name goes into ButtonItem and thus betPopup
  oddsObj.runnerName = runnerName;
  return { [selectionid]: oddsObj };
};

 return (
  <div className="container"  style={{
        padding: isMobile ? "5px" : "0px",
        paddingLeft: isMobile ? "5px" : "0px",
        paddingRight: isMobile ? "5px" : "0px",
        marginTop: isMobile ? "5px" : "",
        paddingBottom: isMobile ? "0px" : "",
      }}>
    {/* ✅ Row 1: Two side-by-side tables */}
    <div className="row casino-32A" style={{ marginRight: "0px", marginLeft: "0px", gap:isMobile?"0px": "5px" }}>
      {/* Player A Table */}
      <div
        className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
        style={{ padding: '0px' }}
      >
        <div    className={`live-poker ${isMobile ? "table-bordered" : ""}`}
                    style={{ padding: isMobile ? "0px 5px" : "" }} >
          <table   className={`table coupon-table ${
                          !isMobile ? "table-bordered" : ""
                        } suspendwidth`}>
            <thead>
              {/* <tr style={{ background: '#f8f8f8' }}>
                <th colSpan={runnerA.length} style={{ textAlign: 'center' }}>
                  {liveMatchData?.defaultMarkets?.[0]?.MarketName || 'Player A'}
                </th>
              </tr> */}
              {/* <tr style={{ background: '#fafafa' }}>
                {runnerA.map((r: any, i: number) => (
                  <th key={i} style={{ textAlign: 'center' }}>
                    {r.RunnerName}
                  </th>
                ))}
              </tr> */}
            </thead>
            <tbody>
               {runnerA.map((r: any, i: number) => (
                   <tr key={i}>
                      {/* COLUMN - RUNNER NAME */}
                      <td style={{ textAlign: "start", fontWeight: 600 ,width:'60%',maxWidth:'60%',fontSize:!isMobile?'16px':''}}>
                         {r.RunnerName}
                      </td>

                      {/* COLUMN - BACK/LAY FOR THIS RUNNER */}
                      <td style={{ textAlign: "center" }}>
                         {laybacklayout([r])} 
                      </td>
                   </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Player B Table */}
      <div
        className="col-lg-6 col-md-6 col-sm-12 main-market bg-gray"
        style={{ padding: '0px',maxWidth:!isMobile?'49%':'' }}
      >
          <div    className={`live-poker ${isMobile ? "table-bordered" : ""}`}
                    style={{ padding: isMobile ? "0px 5px" : "" }} >
          <table   className={`table coupon-table ${
                          !isMobile ? "table-bordered" : ""
                        } suspendwidth`}>
            <thead>
              {/* <tr style={{ background: '#f8f8f8' }}>
                <th colSpan={runnerB.length} style={{ textAlign: 'center' }}>
                  {liveMatchData?.defaultMarkets?.[1]?.MarketName || 'Player B'}
                </th>
              </tr> */}
              {/* <tr style={{ background: '#fafafa' }}>
                {runnerB.map((r: any, i: number) => (
                  <th key={i} style={{ textAlign: 'center' }}>
                    {r.RunnerName}
                  </th>
                ))}
              </tr> */}
            </thead>
            <tbody>
               {runnerB.map((r: any, i: number) => (
                   <tr key={i}>
                      {/* COLUMN - RUNNER NAME */}
                      <td style={{ textAlign: "start", fontWeight: 600 ,width:'60%',maxWidth:'60%',fontSize:!isMobile?'16px':''}}>
                         {r.RunnerName}
                      </td>

                      {/* COLUMN - BACK/LAY FOR THIS RUNNER */}
                      <td style={{ textAlign: "center" }}>
                         {laybacklayout([r])} 
                      </td>
                   </tr>
                ))}
           </tbody>
          </table>
        </div>
      </div>
    </div>
   
{/* ⭐ COLOR PLUS MARKET BUTTON USING SAME laybacklayout FUNCTION */}
{/* {colorPlusMarket && colorPlusMarket.Runners?.length > 0 && (
  <div className="col-12" style={{ marginTop: 10, textAlign: "center" }}>
    <table className="table coupon-table table-bordered TwocardTeen-suspended">
      <tbody>
        {colorPlusMarket.Runners.map((r: any, i: number) => (
          <tr key={i}>
         
            <td style={{ textAlign: "center", fontWeight: 600 }}>
              {r.RunnerName}
            </td>

       
            <td style={{ textAlign: "center" }}>
              {laybacklayout([r])}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)} */}
{/* ⭐ COLOR PLUS - ONLY ONE BUTTON */}
{colorPlusMarket && colorPlusMarket.Runners?.length > 0 && (() => {
  const colorPlusRunner = colorPlusMarket.Runners[0];
  const colorPlusItem = lastOdds?.[colorPlusRunner.SelectionId] || {};

  const clsstatus =
    !colorPlusItem.gstatus ||
    colorPlusItem.gstatus === "SUSPENDED" ||
    colorPlusItem.gstatus === "CLOSED" ||
    colorPlusItem.gstatus === "0"
      ? "suspended"
      : "";

  return (
    <div
      className="col-12 cardColorPlus"
      style={{
        marginTop: 10,
        textAlign: "center",
        paddingLeft: isMobile?'none':'0px',
        paddingRight: isMobile?'none':'0px'
      }}
    >
      <button
        type="button"
        className={`back ${clsstatus}`}
        disabled={clsstatus === "suspended"}
        onClick={() => onBet(true, {
          ...colorPlusItem,
          runnerName: colorPlusRunner.RunnerName,
          sid: colorPlusRunner.SelectionId,
          mid: colorPlusMarket.MarketId,
          MarketName: colorPlusMarket.MarketName,
        })}
        style={{
          width: "100%",
          padding: "8px",
          fontWeight: 600,
          border:"none",
          minHeight:"46px",
          fontSize:!isMobile?"16px":"16px"
        }}
      >
        Color Plus
      </button>
    </div>
  );
})()}
 </div>

);

};

export default TwocardsTeen;