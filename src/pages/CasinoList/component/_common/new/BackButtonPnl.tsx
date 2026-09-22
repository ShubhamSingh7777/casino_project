import React from "react";
import { isMobile } from "react-device-detect";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import CasinoPnl from "../../casinoPnl";
import { useLocation, useParams } from "react-router-dom";

const BackButtonPnl = (props: any) => {
  const {
    selectionid,
    lastOdds,
    liveMatchData,
    clsnamename,
    needSuspend,
    titleStatus,
    textname,
  } = props;
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const location = useLocation();
  const currentSlug =
    gameCode ||
    (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");
  const hidebackcls = location.pathname === "/casino/teen1";
  // list of slugs for which we WANT TO HIDE the size span
  const hideSlugs = [
    "poison",
    "poison20",
    "joker20",
    "teen1",
    "poker",
    "poker20",
    "dt6",
  ]; // add more slugs here
  const hideSpace = ["poker20"];
  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return;
      if (!item.gstatus || item.gstatus == "SUSPENDED") return;
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: oddsVal,
            volume: isBack ? item.b : item.l,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.runnerName,
            selectionId: item.sid,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: item.mid,
            exposure: -0,
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
  const ItemMarket: any = lastOdds?.[selectionid] || {};
  const clsstatus =
    !ItemMarket.gstatus ||
    ItemMarket.gstatus === "0" ||
    ItemMarket.gstatus === "SUSPENDED" ||
    ItemMarket.gstatus === "CLOSED"
      ? "suspended"
      : "";
  return (
    <>
      {gameCode === "mogambo" ? (
        <td
          className={`back teen-section h-100 w-100 p-0 m-0  ${clsnamename} ${
            needSuspend == undefined || (needSuspend && needSuspend == true)
              ? clsstatus
              : ""
          }`}
        >
          <button
            className="back h-100 w-100 border-0 p-0 m-0 cursor-pointer"
            onClick={() => onBet(true, ItemMarket)}
          >
            {ItemMarket?.b ?? "--"}
          </button>
        </td>
      ) : (
        <td
           className={`${
    gameCode !== "teen1" ? "back" : "teenSectionTheTrap"
  }  teen-section ${clsnamename} ${
    needSuspend === undefined || needSuspend === true
      ? clsstatus
      : ""
  }`}
          style={{ width: gameCode === "teen1" ? "50%" : "20%" }}
        >
          <button
            className={`${
    gameCode !== "teen1" ? "back" : ""
  } `}
            onClick={() => onBet(true, ItemMarket)}
            style={{
              border: gameCode === "teen1" ? "2px solid #72bbef" : "",
              height: !isMobile ? "50px" : "50px",
              minHeight: isMobile ? "50px" : "",
              
            }}
          >
            <span
              className="odd"
              style={{ fontSize: isMobile ? "16px" : "16px" }}
            >
              {titleStatus != undefined ? ItemMarket.runnerName : ItemMarket.b}
            </span>{" "}
            {/* 🔥 SHOW TEXTNAME HERE */}
       {!hideSpace.includes(currentSlug) && currentSlug == "admin/casino/dt6" && <br />}
            {textname && (
              <span
                className="text-label"
                style={{
                  marginRight: "0px",
                  fontWeight: 400,
                  fontSize: isMobile ? "12px" : "16px",
                }}
              >
                {textname}
              </span>
            )}
            {/* 🔥 Hide this when URL = poison */}
            {!hideSlugs.includes(currentSlug) && (
              <span className="fw-12 laysize">
                <CasinoPnl
                  sectionId={selectionid}
                  matchId={liveMatchData?.match_id}
                />
              </span>
            )}
          </button>
        </td>
      )}
    </>
  );
};
export default React.memo(BackButtonPnl);
