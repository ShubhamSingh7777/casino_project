import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useLocation, useParams } from 'react-router-dom'
import { isMobile } from "react-device-detect";
import { styled } from "@mui/material";

const ButtonItem = (props: any) => {
    const { selectionid,bs, title, lastOdds, liveMatchData } = props;
     const { gameCode } = useParams()
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    const location = useLocation();
    const currentSlug =
    gameCode ||
    (location?.pathname ? location.pathname.split("/").filter(Boolean)[0] : "");
     // list of slugs for which we WANT TO HIDE the size span
    const hideSlugs = ["teen20"]; // add more slugs here
    const onBet = (isBack = false, item: any) => {
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b : item.l);
            if (oddsVal <= 0) return
            if (!item.gstatus || item.gstatus == 'SUSPENDED' || item.gstatus=='0') return
            dispatch(
                betPopup({
                    isOpen: true,
                    betData: {
                        isBack,
                        odds: oddsVal,
                        volume: isBack ? item.bs : item.ls,
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
            )
        }
    }
    
    const ItemMarket: any = lastOdds?.[selectionid] || {}
    const suspend = !ItemMarket.gstatus || ItemMarket.gstatus == 0 || ItemMarket.gstatus == "SUSPENDED" || ItemMarket.gstatus == "CLOSED" ? 'suspended' : '';

    return <>
    {
  gameCode === "teen20c" || gameCode === "teen20" ? (
    <>
      {/* Your JSX for teen20c */}
        {/* <div
        className={`row ${isMobile ? "m-b-0" : "m-b-10"}`}
        style={{
          marginLeft: isMobile ? "0px" : "",
          marginRight: isMobile ? "0px" : "",
        }}
      >
        <div className="col-12 text-center">
          <b>{ItemMarket?.b || 0.0}</b>
        </div>
      </div> */}

      <button
        className={`text-capitalize btn-theme btn-theme-teen20 ${suspend} text-table-color`}
        onClick={() => onBet(true, ItemMarket)}
        style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'#72bbef'}}
      >
        <b style={{fontSize:'23px'}}>{title}</b> <b className="text-table-color">{ItemMarket?.b || 0.0}</b>
      </button>

    </>
  ) : gameCode !== "dolidana" && gameCode !== "btable2" ? (
    <>
      <div
        className={`row ${isMobile ? "m-b-0" : "m-b-0"}`}
        style={{
          marginLeft: isMobile ? "0px" : "",
          marginRight: isMobile ? "0px" : "",
        }}
      >
        <div className="col-12 text-center"  style={{fontSize:!isMobile?'18px':'14px',height:!isMobile?'20px':'20px',color:'#333'}}>
          <b>{ItemMarket?.b || 0.0}</b>
        </div>
      </div>

      <button
        className={`text-capitalize btn-theme ${suspend}`}
        onClick={() => onBet(true, ItemMarket)}
      >
        <b>{title}</b>
      </button>
    </>
  ) :  gameCode == "btable2" ? (
    <>
      <div
        className={`row ${isMobile ? "m-b-0" : "m-b-0"}`} 
        style={{
          marginLeft: isMobile ? "0px" : "0px",
          marginRight: isMobile ? "0px" : "0px",
        }}
      >
        <div className="col-12 text-center" style={{fontSize:isMobile?'14px':''}}>
          <b>{ItemMarket?.b || 0.0}</b>
        </div>
      </div>

      <button
        className={`text-capitalize btn-theme ${suspend}`}
        onClick={() => onBet(true, ItemMarket)}
      >
        <b>{title}</b>
      </button>
    </>):(
    <button
      className={`text-uppercase bg-transparent border-0 w-100 h-100 ${suspend}`}
      onClick={() => onBet(true, ItemMarket)}
    >
      <b style={{ fontSize: isMobile ? "16px" : "" }}>{title}</b>
      <br />
      {bs && (
        <small style={{ fontSize: "12px" }}>
          {ItemMarket.bs || 0}
        </small>
      )}
    </button>
  )
}
    </> 
}
export default React.memo(ButtonItem)