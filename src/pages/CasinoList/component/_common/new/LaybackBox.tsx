import React from "react"
import { IBetOn, IBetType } from "../../../../../models/IBet";
import { RoleType } from "../../../../../models/User";
import { betPopup } from "../../../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../../../redux/actions/login/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import authService from "../../../../../services/auth.service";
import { useLocation, useParams } from 'react-router-dom'
import { isMobile } from "react-device-detect";

const LaybackBox = (props: any) => {
    const { selectionid, title, lastOdds, liveMatchData ,showLay = true, showBack = true  } = props;
     const { gameCode } = useParams()
    const dispatch = useAppDispatch()
    const userState = useAppSelector(selectUserData)
    
    const onBet = (isBack = false, item: any) => {
        const ipAddress = authService.getIpAddress()
        if (userState.user.role === RoleType.user) {
            const oddsVal = parseFloat(isBack ? item.b : item.l);
            if (oddsVal <= 0) return
            if (item.gstatus == 'SUSPENDED' || item.gstatus== 'CLOSED') return
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
            )
        }
    }
    const ItemMarket: any = lastOdds?.[selectionid] || {}
    const location = useLocation();
    const suspend = !ItemMarket.gstatus || ItemMarket.gstatus == 'SUSPENDED' || ItemMarket.gstatus == 'CLOSED' ? 'suspended' : '';
    return <div className={`aaa-button clearfix ${suspend}  ${
    location.pathname === "/casino/btable2/64" ? "my-location-class" : ""
  }`} style={{marginTop:!isMobile?'0px':'',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      {showBack && (
    <button  className={`back ${!showLay ? 'full-width' : ''}`} style={{minHeight:!isMobile?'46px':'',width:!isMobile?"48%":""}} onClick={() => onBet(true, ItemMarket)}>
      <span className='odd'>{ItemMarket.b}</span>
    </button>
      )}  
    {showLay && (
    <button className={`lay ${!showBack ? "full-width" : ""}`}  style={{minHeight:!isMobile?'46px':'',width:!isMobile?"48%":""}} onClick={() => onBet(false, ItemMarket)}>
      <span className='odd'>{ItemMarket.l}</span>
    </button>
    )}
  </div>
}
export default React.memo(LaybackBox)