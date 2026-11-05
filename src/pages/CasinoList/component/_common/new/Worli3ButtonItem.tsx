import React from "react";
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { getPlaceBetAction } from "../../../../../redux/actions/bet/bet.action";
import authService from "../../../../../services/auth.service";
import { useParams } from "react-router-dom";
import { calculateWorliPnl } from "../../../../../utils/calculateWorliPnl";
import { toast } from "react-toastify";
import { isMobile } from "react-device-detect";

const Worli3ButtonItem = ({
  selectionName,
  label,
  item,
  isSelected,
  onSelect,
  market,
  activeMenu,
  stake,
  subtitle,
   liveMatchData,
  isPana = false,
}: any) => {
  const { gameCode, matchId } = useParams();
  const matchIdNumber = Number(matchId) || 0;
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  /* ================= POPUP AUTO HIDE ================= */
  const popupTimer = React.useRef<any>(null);

  const [popup, setPopup] = React.useState({
    show: false,
    message: "",
  });

  const showPopup = (message: string) => {
    // clear previous popup
    if (popupTimer.current) {
      clearTimeout(popupTimer.current);
    }

    setPopup({ show: true, message });

    popupTimer.current = setTimeout(() => {
      setPopup({ show: false, message: "" });
    }, 2500);
  };

  const onClickHandler = () => {
    onSelect?.();
    onBet();
  };

  const onBet = () => {
    if (userState.user.role !== RoleType.user) return;
    if (!market || !market.mid) return;
    if (!stake || stake <= 0) {
      showPopup("Please select coin");
      return;
    }

    const ipAddress = authService.getIpAddress();

    const betObj = {
      isBack: true,
      odds: 0,
      volume: 0,

      marketId: market.mid,
      marketName: market.mname,
      eventId: liveMatchData?.event_data?.match_id || 0,

      matchId: matchIdNumber,
      selectionName,
      selectionId: market.mid,

      stack: stake,
      currentMarketOdds: 0,

      exposure: 0,
      pnl: 0,

      ipAddress,
      type: IBetType.Match,
      matchName: "Matka",
      betOn: IBetOn.CASINO,
      gtype: gameCode,
        minbet: market.min,
            maxbet: market.max,
    };

    // ✅ OPEN / CLOSED SAFE CALC
    const cal = calculateWorliPnl(betObj, activeMenu);

    if (!cal.odds) return;

    betObj.odds = cal.odds;
    betObj.currentMarketOdds = cal.odds;
    betObj.pnl = cal.pnl;
    betObj.exposure = cal.exposure;

    dispatch(getPlaceBetAction(betObj))
      .unwrap()
      .then((res: any) => {
        if (res?.error) {
          showPopup(res.message);
        }
      })
      .catch((err: any) => {
        const apiMessage =
          err?.response?.data?.message || err?.payload?.message || err?.message;
        showPopup(apiMessage || "Bet failed");
      });
  };

  return (
    <>
      {/* POPUP – ONLY ONE */}
      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%) translateY(-20px)",
            zIndex: 9999,
            background: "#ffffff",
            padding: "10px 14px",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif",
            gap: 8,
            fontSize: 14,
            animation: "slideDown 0.2s ease-out forwards",
          }}
        >
          <style>
            {`
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
      `}
          </style>

          <span
            style={{
              background: "#e53935",
              color: "#fff",
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            ✖
          </span>

          {popup.message}
        </div>
      )}
      {/* BUTTON */}
      <div
        onClick={onClickHandler}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: item?.mtype === "CLOSED" ? "not-allowed" : "pointer",
          background: stake && stake > 0 && isSelected ? "#086f3f" : "#79c2f2",
          color: stake && stake > 0 && isSelected ? "#fff" : "#000",
          userSelect: "none",
          fontSize: isPana
            ? isMobile
              ? "20px"
              : "20px"
            : !isMobile
            ? "30px"
            : "",
        }}
      >
        {label}
        <div>
          {activeMenu === "Single" && (
            <div style={{ fontSize: 13, fontFamily: "inherit" }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(Worli3ButtonItem);
