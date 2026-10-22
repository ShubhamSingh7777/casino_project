import React from "react";
import { isMobile } from "react-device-detect";
import { IBetOn, IBetType } from "../../../../models/IBet";
import { RoleType } from "../../../../models/User";
import { selectUserData } from "../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import authService from "../../../../services/auth.service";
import { betPopup } from "../../../../redux/actions/bet/betSlice";
import CasinoPnl from "../casinoPnl";

const MogamboFancyMarket = (props: any) => {
  const { oddsMarket, lastOdds, liveMatchData } = props;
  console.log("oddsMarket fancymogambo--------", oddsMarket);
  console.log("livematchdata fancymogambo--------", liveMatchData?.event_data?.match_id);
  console.log("lastOdds fancymogambo--------", lastOdds);

  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
const matchId = Number(
  liveMatchData?.event_data?.match_id ??
  liveMatchData?.match_id ??
  lastOdds?.match_id ??
  0
);
  //   const runner = oddsMarket?.Runners?.[0];

  //   if (!runner) return null;

  //   const isSuspended = ["SUSPENDED", "CLOSED"].includes(
  //     runner.gstatus
  //   );
  const runner = lastOdds?.[3];

  if (!runner) return null;

  const status = String(runner.gstatus ?? "")
    .trim()
    .toUpperCase();

  const isSuspended = status !== "OPEN";

  console.log("Status:--mogambo---", status);
  console.log("Suspended:mogambo---", isSuspended);

  const onBet = (isBack: boolean) => {
    if (userState?.user?.role !== RoleType.user || isSuspended) {
      return;
    }

    const odds = Number(isBack ? runner.b : runner.l);
    const volume = Number(isBack ? runner.bbhav : runner.lbhav);

    if (
      !Number.isFinite(odds) ||
      odds <= 0 ||
      !Number.isFinite(volume) ||
      volume < 0
    ) {
      return;
    }

    const ipAddress = authService.getIpAddress();

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack,
          odds,
          volume,
          marketId: runner.mid,
          marketName: oddsMarket?.MarketName,
          matchId: matchId,
          selectionName: runner.nat || runner.runnerName,
          selectionId: runner.sid,
          pnl: 0,
          stack: 0,
          currentMarketOdds: odds,
          eventId:  matchId,
          exposure: 0,
          ipAddress,
          type: IBetType.Match,
          matchName: liveMatchData?.title,
          betOn: IBetOn.CASINO,
          gtype: liveMatchData?.slug,
          fancystatus: "yes",
        },
      }),
    );
  };

  const formatValue = (value: any) => {
    const number = Number(value);
    return Number.isFinite(number) && number !== 0 ? number : "-";
  };

  return (
    <div
      className="h-100 d-flex align-items-center bg-light"
      style={{
        width: "100%",
        minHeight: "46px",
      }}
      data-title={runner.gstatus}
    >
      {/* Lay */}
      <div
        className={`lay text-center d-flex flex-column justify-content-center ${
          isSuspended ? "suspended" : ""
        }`}
        style={{
          width: "50%",
          height: "46px",
          cursor: isSuspended ? "not-allowed" : "pointer",
          padding: "2px",
         
        }}
        onClick={() => onBet(false)}
      >
        <span
          className="odd d-block"
          style={{
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "bold",
          }}
        >
          {formatValue(runner.l)}
        </span>
        <span style={{fontSize:isMobile?'10px':'12px'}}>{formatValue(runner.lbhav)}</span>
      </div>
      {/* Back */}
      <div
        className={`back text-center d-flex flex-column justify-content-center  ${
          isSuspended ? "suspended" : ""
        }`}
        style={{
          width: "50%",
          height: "46px",
          cursor: isSuspended ? "not-allowed" : "pointer",
          padding: "2px",
           borderLeft:"1px solid #c7c8ca"
          
        }}
        onClick={() => onBet(true)}
      >
        <span
          className="odd d-block"
          style={{
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "bold",
          }}
        >
          {formatValue(runner.b)}
        </span>
        <span style={{fontSize:isMobile?'10px':'12px',fontWeight:isMobile?'100':''}}>{formatValue(runner.bbhav)}</span>
      </div>
    </div>
  );
};

export default MogamboFancyMarket;
