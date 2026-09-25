import React from "react";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { RoleType } from "../../../../models/User";
import { selectCasinoCurrentMatch } from "../../../../redux/actions/casino/casinoSlice";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";

import { betPopup } from "../../../../redux/actions/bet/betSlice";
import CasinoPnl from "../casinoPnl";
import { isMobile } from "react-device-detect";
import Limitinfo from "./limitinfo";
import { useParams } from "react-router-dom";

const FancyMarket = (props: any) => {
  const { oddsMarket, lastOdds, max} = props;
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const isSuperOver = window.location.pathname.includes("superover");
  const getCurrentMatch = useAppSelector(selectCasinoCurrentMatch);
    const { matchId } = useParams();
  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    const oddVal = parseFloat(
      isSuperOver ? (isBack ? item.b1 : item.l1) : isBack ? item.b : item.l,
    );
    const odds = oddVal.toString();
    console.log("Bet Payload:", {
      isBack,
      odds: parseFloat(odds),
      volume: parseFloat(
        isSuperOver
          ? isBack
            ? item.bs1
            : item.ls1
          : isBack
          ? item.bs
          : item.ls,
      ),
      marketId: item.mid,
      marketName: oddsMarket.MarketName,
      selectionId: item.sid,
      selectionName: item.nat,
      currentMarketOdds: isSuperOver
        ? isBack
          ? item.b1
          : item.l1
        : isBack
        ? item.b
        : item.l,
      fancystatus: "yes",
      gtype: lastOdds.slug,
    });
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.status === "SUSPENDED") return;
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: parseFloat(
              isSuperOver 
                ? isBack
                  ? item.bs1
                  : item.ls1
                : isBack
                ? item.bs
                : item.ls,
            ),
            marketId: lastOdds.match_id,
            marketName: oddsMarket.MarketName,
            matchId: Number(matchId),
            selectionName: item.nat,
            selectionId: item.sid,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isSuperOver
              ? isBack
                ? item.b1
                : item.l1
              : isBack
              ? item.b
              : item.l,
            eventId: Number(matchId),
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: lastOdds.title,
            betOn: IBetOn.CASINO,
            gtype: lastOdds.slug,
            fancystatus: "yes",
          },
        }),
      );
    }
  };
  // Add here 👇
  const isFancy1 = oddsMarket?.MarketName?.includes("Fancy1");
  const isSuperOver3 = window.location.pathname.includes("superover3");
 const marketName =
  oddsMarket?.MarketName?.trim()?.toLowerCase() || "";


const isTie = marketName === "tie";

// SuperOver3:
// Fancy1 + Tie => Back/Lay
// Fancy => No/Yes
const showBackLay = isSuperOver3 ? (isFancy1 || isTie) : isFancy1;

const hasAnyGscode = oddsMarket?.Runners?.some(
  (runner: any) =>
    runner.gscode !== undefined &&
    runner.gscode !== null
);

if (!hasAnyGscode) {
  return null; // Hide full table
}

// if (!hasAnyValidGscode) return null;
  const layoutRunner = () => {
    
    return (
      oddsMarket &&
      oddsMarket.Runners &&
      oddsMarket.Runners.length > 0 &&
      oddsMarket.Runners.map((ItemRunner: any, keyRunner: number) => {
        const noValue = Number(isSuperOver ? ItemRunner.l1 : ItemRunner.l) || 0;
        const yesValue =
          Number(isSuperOver ? ItemRunner.b1 : ItemRunner.b) || 0;
const hasGscode =
  ItemRunner.gscode !== undefined &&
  ItemRunner.gscode !== null;

if (!hasGscode) {
  return null;
}
  
        const gstatus =
          ItemRunner.gstatus == "SUSPENDED" || ItemRunner.gstatus == "CLOSED"
            ? "suspended"
            : "";
        return (
          <div className="table-body" key={keyRunner}>
            <div className="fancy-tripple">
              <div
                data-title={ItemRunner.gstatus}
                className={`table-row ${gstatus}`}
              >
                <div
                  className={`float-left country-name  ${
                    !isMobile ? "box-6New" : "box-6"
                  }`}
                >
                  <p className="m-b-0 tx-left">{ItemRunner.nat}</p>
                  <CasinoPnl
                    matchId={lastOdds.match_id}
                    sectionId={ItemRunner.sid}
                    clsName={'tx-left'}
                  />
                </div>
                {isFancy1 || isTie ?(
                  <>
                    <div
                      className={`back ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left back text-center`}
                      onClick={() => onBet(true, ItemRunner)}
                    >
                      <span className="odd d-block" style={{fontSize:!isMobile?'16px':''}}>
                        {(isSuperOver ? ItemRunner.b1 : ItemRunner.b) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.b1
                          : ItemRunner.b}
                      </span>
                      <span>
                           {(isSuperOver ? ItemRunner.bs1 : ItemRunner.bs) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.bs1
                          : ItemRunner.bs}
                        {/* {isSuperOver ? ItemRunner.bs1 : ItemRunner.bs} */}
                      </span>
                    </div>
                    <div
                      className={`lay ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left text-center`}
                      onClick={() => onBet(false, ItemRunner)}
                    >
                      <span className="odd d-block" style={{fontSize:!isMobile?'16px':''}}>
                           {(isSuperOver ? ItemRunner.l1 : ItemRunner.l) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.l1
                          : ItemRunner.l}
                        {/* {isSuperOver ? ItemRunner.l1 : ItemRunner.l} */}
                      </span>
                      <span>
                           {(isSuperOver ? ItemRunner.ls1 : ItemRunner.ls) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.ls1
                          : ItemRunner.ls}
                        {/* {isSuperOver ? ItemRunner.ls1 : ItemRunner.ls} */}
                      </span>
                    </div>
                    <div
                      className={` ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left text-center`}
                    >
                      <span className="fancy-max">
                        Min: {isSuperOver ? ItemRunner.min : ""}
                      </span>
                      <span className="odd d-block fancy-max">
                        Max: {isSuperOver ? ItemRunner.max : ""}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`lay ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left  text-center`}
                      onClick={() => onBet(false, ItemRunner)}
                    >
                      <span className="odd d-block" style={{fontSize:!isMobile?'16px':''}}>
                           {(isSuperOver ? ItemRunner.l1 : ItemRunner.l) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.l1
                          : ItemRunner.l}
                        {/* {isSuperOver ? ItemRunner.l1 : ItemRunner.l} */}
                      </span>
                      <span>
                           {(isSuperOver ? ItemRunner.ls1 : ItemRunner.ls) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.ls1
                          : ItemRunner.ls}
                        {/* {isSuperOver ? ItemRunner.ls1 : ItemRunner.ls} */}
                      </span>
                    </div>

                    <div
                      className={`back ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left back text-center`}
                      onClick={() => onBet(true, ItemRunner)}
                    >
                      <span className="odd d-block">
                        {/* {isSuperOver ? ItemRunner.b1 : ItemRunner.b} */}
                           {(isSuperOver ? ItemRunner.b1 : ItemRunner.b) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.b1
                          : ItemRunner.b}
                      </span>
                      <span>
                           {(isSuperOver ? ItemRunner.bs1 : ItemRunner.bs) == 0
                          ? "-"
                          : isSuperOver
                          ? ItemRunner.bs1
                          : ItemRunner.bs}
                        {/* {isSuperOver ? ItemRunner.bs1 : ItemRunner.bs} */}
                      </span>
                    </div>
                    <div
                      className={` ${
                        !isMobile ? "box-1" : "box-2"
                      } float-left text-center`}
                    >
                      <span className="fancy-max" style={{fontWeight:'bold'}}>
                        Min: {isSuperOver ? ItemRunner.min : ""}
                      </span>
                      <span className="odd d-block fancy-max">
                        Max: {isSuperOver ? ItemRunner.max : ""}
                      </span>
                    </div>
                  </>
                )}

                {!isMobile ? (
                  <div className="box-2 float-left text-right min-max"></div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );
      })
    );
  };
  return (
    <div>
      <div className="table-header" style={{display:!isMobile?'flex':'unset'}}>
        <div
          className={`float-left country-name ${
            isMobile ? "bg-theme2 tx-white text-left box-6Fancy " : "box-6New"
          }`}
        >
          {isMobile && (
            <h6 className="card-title d-inline-block" style={{ width: "100%",padding:isMobile?'2px 6px':'' }}>
              {/* {oddsMarket.MarketName} */}
               {oddsMarket.MarketName.replace(" Market", "")}
              <span className="float-right">
                <Limitinfo
                  max={lastOdds.max}
                  min={lastOdds.min}
                  nameString={oddsMarket.MarketName.replace(" ", "")}
                />
              </span>
            </h6>
          )}
        </div>
       
        {/* {isFancy1 && (
          <>
          <div style={{display:isMobile?'flex':'',flexDirection:isMobile?'row':'row',padding:isMobile?'0px':''}}>
                <div
          className={`float-left country-name ${
            isMobile ? "tx-white text-left box-6" : "box-6New"
          }`}
        >
        </div>
            <div
              className={`back ${
                !isMobile ? "box-1NewFancy" : "box-2"
              } float-left back text-center`} style={{fontSize:isMobile?'16px':'',padding:isMobile?'5px 0px':''}}
            >
              <b>Back</b>
            </div>
              <div
              className={`lay ${
                !isMobile ? "box-1" : "box-2"
              } float-left  text-center`} style={{fontSize:isMobile?'16px':'',padding:isMobile?'5px 0px':''}}
            >
              <b>Lay</b>
            </div>
            <div
              className={`${
                !isMobile ? "box-1" : "box-2"
              } float-left  text-center`}
            ></div>
            </div>
          </>
        )} */}
       {isFancy1 || isTie ? (

  <div
    style={{
      display: "flex",
      flexDirection: "row",
      width:isMobile? "100%":"24%",
      padding: 0,
      borderBottom:isMobile?"0.01em solid #c7c8ca":""
    }}
  >
      
    {isMobile?(
 <div
      className="text-center"
      style={{
        width:isMobile? "60%":"8%",
        flex:isMobile? "0 0 60%":"8%",
        fontSize: isMobile ? "16px" : "14px",
        padding: isMobile ? "5px 0px" : "5px 0px",
        whiteSpace: "nowrap",
      }}
    >
      
    </div>
    ):''}

    <div
      className="back text-center"
      style={{
        width:isMobile? "20%":"8%",
        flex:isMobile? "0 0 20%":"8%",
        fontSize: isMobile ? "16px" : "14px",
        padding: isMobile ? "5px 0px" : "5px 0px",
        whiteSpace: "nowrap",
      }}
    >
      <b>Back</b>
    </div>

    <div
      className="lay text-center"
      style={{
       width:isMobile? "20%":"8%",
        flex:isMobile? "0 0 20%":"8%",
        fontSize: isMobile ? "16px" : "14px",
        padding: isMobile ? "5px 0px" : "5px 0px",
        whiteSpace: "nowrap",
      }}
    >
      <b>Lay</b>
    </div>
{!isMobile?(  <div
      className="text-center"
      style={{
         width:isMobile? "33.33%":"8%",
        flex:isMobile? "0 0 33.33%":"8%",
      }}
    />):''}
  
  </div>
):('')}
        {/* {isFancy1 && (
          <>
            <div
              className={`lay ${
                !isMobile ? "box-1" : "box-2"
              } float-left  text-center`} style={{fontSize:isMobile?'16px':''}}
            >
              <b>Lay</b>
            </div>
            <div
              className={`${
                !isMobile ? "box-1" : "box-2"
              } float-left  text-center`}
            ></div>
          </>
        )} */}
 {!isFancy1 && !isTie && (
  <div
    style={{
      display: "flex",
      width: isMobile ? "100%" : "30%",
      marginLeft: isMobile ? "0" : "auto",
      padding: 0,
      height: isMobile ? "32px" : "auto",
      overflow: "visible",
      borderBottom: isMobile
        ? "1px solid #c7c8ca"
        : "none",
    }}
  >
      {/* Empty desktop space */}
    {isMobile && (
      <div
        className="text-center"
        style={{
          width: "60%",
          flex: "0 0 60%",
        }}
      />
    )}
    {/* NO */}
    <div
      className="lay text-center"
      style={{
        width: isMobile ? "20%" : "33.33%",
        flex: isMobile ? "0 0 20%" : "0 0 33.33%",
        fontSize: isMobile ? "16px" : "14px",
        padding: "5px 0",
        whiteSpace: "nowrap",
        display: "block",
        visibility: "visible",
      }}
    >
      <b>No</b>
    </div>

    {/* YES */}
    <div
      className="back text-center"
      style={{
        width: isMobile ? "20%" : "33.33%",
        flex: isMobile ? "0 0 20%" : "0 0 33.33%",
        fontSize: isMobile ? "16px" : "14px",
        padding: "5px 0",
        whiteSpace: "nowrap",
        display: "block",
        visibility: "visible",
      }}
    >
      <b>Yes</b>
    </div>

    {/* Empty desktop space */}
    {!isMobile && (
      <div
        className="text-center"
        style={{
          width: "33.33%",
          flex: "0 0 33.33%",
        }}
      />
    )}
  </div>
)}

        {/* {!isMobile ? <div className="box-2 float-left"></div> : ""} */}
      </div>
      {layoutRunner()}
    </div>
  );
};
export default React.memo(FancyMarket);