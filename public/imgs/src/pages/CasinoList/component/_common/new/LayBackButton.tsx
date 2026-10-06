// ✅ LayBackButton.tsx
import React from "react";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { nFormatter } from "../../../../../utils/helper";
import { useLocation, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import CasinoPnl from "../../casinoPnl";

const LayBackButton = (props: any) => {
  const {
    selectionid,
    lastOdds,
    liveMatchData,
    clsnamename,
    clsstatus,
    showLay = true,
  } = props;
  const { gameCode } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const currentSlug =
    gameCode ||
    (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");

  // list of slugs for which we WANT TO HIDE the size span
  const hideSlugs = [
    "poison",
    "poison20",
    "joker20",
    "teen1",
    "joker1",
    "trap",
    "btable2",
    "teen33",
    "poker",
    "dt6",
    "card32",
    "card32eu",
    "dum10",
    "teen3",
    "aaa2",
    "teen41",
    "btable2",
    "teen42",
    "teen",
    "teen32",
  ]; // add more slugs here
  const hideCasinoPnlSlugs = [
  "btable2",
  "poker","card32eu","card32","poison20","joker20","teen3","aaa","aaa2","dt6","dum10","teen1","trap","teen41","teen42","teen33","teen32","teen"
];

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress();
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0 || !item.gstatus || item.gstatus === "SUSPENDED") return;

      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: oddsVal,
            volume: isBack
              ? item.bs > 1000000
                ? 1
                : item.bs
              : item.ls > 1000000
              ? 1
              : item.ls,
            marketId: item?.mid || item?.marketId,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.runnerName,
            selectionId: item?.sid ? parseInt(item?.sid) : item?.sectionId,
            pnl: 0,
            stack: 0,
            currentMarketOdds: isBack ? item.b : item.l,
            eventId: liveMatchData?.event_data?.match_id || 0,
            exposure: -0,
            ipAddress,
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

  const ItemMarket: any = lastOdds?.[selectionid] || {};

  return (
    <>
      {/* BACK */}
      <td
        className={`back teen-section ${clsnamename} ${clsstatus}`}
        style={{ height: !isMobile ? "46px" : "" }}
      >
        <button className="back" onClick={() => onBet(true, ItemMarket)}>
          <span className="odd">{ItemMarket.b}</span>
        {!hideCasinoPnlSlugs.includes(currentSlug) && (
  <CasinoPnl
    sectionId={ItemMarket.sid}
    matchId={liveMatchData.match_id}
    classData={"text-center"}
  />
)}
          {/* 🔥 Hide this when URL = poison */}
          {!hideSlugs.includes(currentSlug) && (
            <span className="fw-12 laysize" style={{ display: "block" }}>
              {nFormatter(ItemMarket.bs, 2)}
            </span>
          )}
        </button>
      </td>

      {/* LAY — only if showLay is true */}
      {showLay && (
        <td
          className={`lay teen-section ${clsnamename} ${clsstatus}`}
          style={{ height: !isMobile ? "46px" : "" }}
        >
          <button className="lay" onClick={() => onBet(false, ItemMarket)}>
            <span className="odd">
              <b>{ItemMarket.l}</b>
            </span>
        {!hideCasinoPnlSlugs.includes(currentSlug) && (
  <CasinoPnl
    sectionId={ItemMarket.sid}
    matchId={liveMatchData.match_id}
    classData={"text-center"}
  />
)}
            {!hideSlugs.includes(currentSlug) && (
              <span className={`fw-12 laysize`} style={{ display: "block" }}>
                {nFormatter(ItemMarket.ls, 2)}
              </span>
            )}
          </button>
        </td>
      )}
    </>
  );
};

export default React.memo(LayBackButton);
