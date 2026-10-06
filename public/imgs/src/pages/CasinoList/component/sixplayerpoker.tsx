import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import { useState } from 'react';
import CasinoPnl from './casinoPnl';
import { replacecardstring } from '../../../utils/helper';
import { isMobile } from 'react-device-detect';
import { useParams } from 'react-router-dom'

const Sixplayerpoker = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const [activeTab, setActivetab] = useState<any>("hands")
   const { gameCode } = useParams()

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress()
    if (userState.user.role === RoleType.user) {
      const oddsVal = parseFloat(isBack ? item.b : item.l);
      if (oddsVal <= 0) return
      if (!item.gstatus || item.gstatus == 'SUSPENDED' || item.gstatus == '0') return
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
  const laybacklayout = () => {
    const finalMarkets = liveMatchData?.defaultMarkets?.[0]?.Runners || []
    const cards = lastOdds?.[`cards`] || {}
    return (finalMarkets.map((ItemNew: any, key: number) => {
      const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
      const clsstatus = !Item.gstatus || Item.gstatus === '0' || Item.gstatus === "SUSPENDED" ? 'suspended' : ''
      const card = cards[`C${key + 1}`] && cards[`C${key + 1}`] != '1' && cards[`C${key + 1}`];
      const card2 = cards[`C${key + 7}`] && cards[`C${key + 7}`] != 1 && cards[`C${key + 7}`];
    
    console.log("SIX PLAYER PNL", {
  player: ItemNew.RunnerName,
  selectionId: ItemNew.SelectionId,
  sid: Item?.sid,
  mid: Item?.mid,
  matchId: liveMatchData?.match_id,
  pnlItem: Item,
});  return (
        (
          <div className='col-lg-6 col-12 mb-0' style={{ paddingRight: key % 2 == 0 ? "0px" : "0px",paddingLeft: key % 2 == 0 ? "0px" : "0px",maxWidth:!isMobile?'49%':''}} key={key}>
            <button className={`bt-action btn-theme ${clsstatus}`} onClick={() => onBet(true, Item)}>
              {/* <div className="color-card"></div> */}
              <span className="patern-name">{ItemNew.RunnerName}
                {card && <span className="card-icon m-l-20">{replacecardstring(card)} {card.includes('CC') && <span className="card-black">{"}"}</span>} {card.includes('HH') && <span className="card-black">]</span>} {card.includes('DD') && <span className="card-red">{"{"}</span>} {card.includes('SS') && <span className="card-red">[</span>}</span>}
                {card2 && <span className="card-icon m-l-5">{replacecardstring(card2)} {card2.includes('CC') && <span className="card-black">{"}"}</span>}{card2.includes('HH') && <span className="card-black">]</span>}  {card2.includes('DD') && <span className="card-red">{"{"}</span>} {card2.includes('SS') && <span className="card-red">[</span>}</span>}
              </span>
 <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} clsName={'float-left'} />
              <span className="point">{Item.b}</span>
              {/* {isMobile ? <p className="m-b-0 m-t-5 text-right min-max"><span ><b>Min:</b>{Item.min}</span> <span className="m-l-5"><b>Max:</b>{Item.max}</span></p> : ""} */}
            </button>
            {/* <div className={`limit-block ${isMobile ? 'mtc-0':'mtc-5'}`}> */}
             
              {/* {!isMobile? <p className="m-b-0 m-t-5 text-right min-max"><span ><b>Min:</b>{Item.min}</span> <span className="m-l-5"><b>Max:</b>{Item.max}</span></p> : ""} */}
            {/* </div> */}
          </div>
        )
      )
    })
    )
  }

  const patterns = () => {
    const finalMarkets = liveMatchData?.defaultMarkets || []

    return ([1, 2, 3, 4, 5, 6, 7, 8, 9].map((ItemIndex: any) => {
      const runners = finalMarkets?.[ItemIndex]?.Runners || []
      return runners.map((ItemNew: any, key: number) => {
        const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
        const clsstatus =
          !Item.gstatus || Item.gstatus === '0' || Item.gstatus === 'SUSPENDED' ? 'suspended' : ''
        return (
          (
            <div className='col-lg-4 col-6 mb-0' style={{ paddingRight: key % 3 == 0 ? "0px" : "0px",paddingLeft: key % 3 == 0 ? "0px" : "0px",maxWidth:!isMobile?'32.333333%':'48.5%' }} key={key}>
              <button className={`bt-action btn-theme ${clsstatus}  ${isMobile ? 'btn-width-six':''}`} onClick={() => onBet(true, Item)}>
                <span className="patern-name">{ItemNew.RunnerName}
                </span>
                 <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} clsName={'float-left'} />
                <span className="point">{Item.b}</span>
                {/* {isMobile ? <p className="m-b-0 m-t-5 text-right min-max"><span ><b>Min:</b>{Item.min}</span> <span className="m-l-5"><b>Max:</b>{Item.max}</span></p> : ""} */}
              </button>
              {/* <div className='limit-block  mtc-5'> */}
               
                {/* {!isMobile ? <p className="m-b-0 m-t-5 text-right min-max"><span ><b>Min:</b>{Item.min}</span> <span className="m-l-5"><b>Max:</b>{Item.max}</span></p> : ""} */}
              {/* </div> */}
            </div>
          )
        )
      })
    })
    )
  }
  return (
    <div className='container hands-pattern-container' style={{ marginTop: isMobile ? '5px' : '' }}>
      <div className='row' style={{gap:!isMobile?'10px':'10px'}}>
        {lastOdds && lastOdds.desc != '' && <div className='col-lg-12 main-market text-center tx-white bg-theme' style={{ padding: '10px' }}>
          RESULT : {lastOdds.desc}
        </div>}
        <div className={`col-lg-12  ${isMobile ? 'm-b-5':''} main-market`} style={{ padding: '0px',marginBottom:!isMobile?'-10px':'-10px' }}>
          <ul className="nav nav-tabs m-b-5 ">
            <li className="nav-item">
              <a data-toggle="tab" href="#hands" onClick={() => { setActivetab('hands') }}
                className="nav-link active" style={{borderTop:!isMobile?'0px':'',fontWeight:!isMobile?'400':''}}>Hands</a>
            </li>
            <li className="nav-item">
              <a data-toggle="tab" href="#patterns" onClick={() => { setActivetab('patterns') }}
                className="nav-link" style={{borderTop:!isMobile?'0px':'',fontWeight:!isMobile?'400':''}}>Pattern</a>
            </li>
          </ul>
        </div>
        {activeTab == 'hands' && laybacklayout()}
        {activeTab == 'patterns' && patterns()}
      </div>
    </div>
  )
}
export default Sixplayerpoker