import authService from '../../../services/auth.service';
import { RoleType } from '../../../models/User';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/actions/login/loginSlice';
import { betPopup } from '../../../redux/actions/bet/betSlice';
import { IBetOn, IBetType } from '../../../models/IBet';
import React from 'react';
import CasinoPnl from './casinoPnl';
import { replacecardstring } from '../../../utils/helper';
import { useParams } from 'react-router-dom'
import { isMobile } from 'react-device-detect';

const LuckyFifteen = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const dispatch = useAppDispatch()
  const userState = useAppSelector(selectUserData)
  const { gameCode } = useParams()

  const pushDataToPositions = React.useCallback(
    (data: string) => {
      const positions = [0, 1, 2, 3, 4, 5, 6, 7]
      const finalString = data?.split(',') || []
      const dataArray: Array<string> = (finalString && finalString.filter((d) => d !== '1')) ?? []
      const indicesToRemove = [8, 16, 24];
      for (const index of indicesToRemove) {
        dataArray.splice(index, 1);
      }
      return dataArray.reduce(
        (acc: Record<number, any>, item, index) => {
          const positionIndex = index % 8
          if (index !== 25) {
            const position: any = positions[positionIndex]
            acc[position].push(item)
          }
          return acc
        },
        {
          '0': [], '1': [], '2': [], '3': [],
          '4': [], '5': [], '6': [], '7': [],
        },
      )
    },
    [lastOdds?.cardsstring],
  )

  const onBet = (isBack = false, item: any) => {
    const ipAddress = authService.getIpAddress()
    const oddVal = parseFloat(isBack ? item.b : item.l);
    const odds = oddVal.toString()
    if (userState.user.role === RoleType.user) {
      if (parseFloat(odds) <= 0 || item.gstatus === '0') return
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: liveMatchData?.event_data?.match_id || 0,
            selectionName: item.nat,
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
const formatIndianNumber = (num:any) => {
  if (!num) return 0;

  if (num >= 10000000) {
    return `${num / 10000000}Cr`;
  }

  if (num >= 100000) {
    return `${num / 100000}L`;
  }

  if (num >= 1000) {
    return `${num / 1000}K`;
  }

  return num;
};
  const laybacklayout = React.useCallback(() => {
    const clsnamehead = 'box-4'
    const clsnamename = 'box-3'
    const heightdata = ''
    const cards = pushDataToPositions(lastOdds?.cardsstring || '')
    let rows: JSX.Element[] = []

    liveMatchData?.defaultMarkets?.forEach((ItemMarketLink: any, keyLink: number) => {
      ItemMarketLink?.Runners?.forEach((ItemNew: any, key: number) => {
        if (keyLink >= 8) return

        const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
        const clsstatus = !Item.gstatus || ['SUSPENDED', 'CLOSED', '0'].includes(Item.gstatus) ? 'suspended' : ''
        const otherMarket = liveMatchData?.defaultMarkets?.[keyLink + 8]?.Runners[0] || {}
        const ItemOther: any = lastOdds?.[otherMarket.SelectionId] || {}

        rows.push(
           <tr key={`${keyLink}-${key}`} className={` ${heightdata} `}>
               <td className={`clsnamehead`} style={{ paddingLeft:isMobile? "5px":"10px",verticalAlign:!isMobile?'unset':''}}>
                  {ItemNew.RunnerName}
                   <CasinoPnl sectionId={Item.sid} matchId={liveMatchData.match_id} classData={'text-center'} />
                  {cards && cards[keyLink] && cards[keyLink].map((ItemCard: any, keyCard: any) => (
                      <span key={keyCard} className={`card-icon ${keyCard === 0 ? 'm-l-20' : 'm-l-1'}`}>
                         <span>{replacecardstring(ItemCard)}</span>
                      </span>
                    ))}
              </td>
              <td className={`back teen-section ${clsnamename} ${clsstatus}`}>
                 <button className='back' style={{height:!isMobile?'36px':'',padding:!isMobile?'0px':''}} onClick={() => onBet(true, Item)}>
                      <span className='odd' style={{fontSize:isMobile?'15px':''}}>{Item.b}</span>
                       <b style={{color:'#333',fontWeight:isMobile?'100':'100',fontSize:isMobile?'11px':'12px'}}> {(Item?.max)}</b>
                      {/* <CasinoPnl sectionId={Item.sid} matchId={liveMatchData.match_id} classData={'text-center'} /> */}
                 </button>
              </td>
              <td className="box-3 text-center" style={{paddingRight:isMobile?'3px':''}}>
                 <div style={{ fontSize:isMobile?"10px": "8px", lineHeight:isMobile?"7px":"6px",color:'#097c93',display:'flex',flexDirection:'column',justifyContent:'end',alignItems:isMobile?'end':'start',paddingLeft:!isMobile?'12px':'',fontWeight:!isMobile?'bold':''}}>
                     <b style={{color:'#097c93'}}>Min: {Item?.min || 0}</b> 
                     <br />
                     <b style={{color:'#097c93'}}> Max: {formatIndianNumber(Item?.max)}</b>
                 </div>
              </td>
           </tr>
        )
      })
    })
    return rows
  }, [lastOdds, liveMatchData])

  // 📌 Generate rows only once
  const rows = laybacklayout()
  const firstTableRows = rows.slice(0, 2)
  const secondTableRows = rows.slice(2,4)
  const thirdTableRows = rows.slice(4)

  return (
    <>
     <div>
       <table style={{width:'100%'}}>
         <thead style={{ borderBottom: "0px" }}>
           <tr style={{ background: '#2c3e50d9'}}>
             <th className="box-4" style={{ color: 'white', paddingLeft: '7px', fontSize: '14px', fontWeight: 'bold',padding:isMobile?'3px 6px':'8px'}}>
               Runs
              </th>
           </tr>
         </thead>
       </table>
     </div>
    <div className='container container-goal luckyfifteen-cont' style={{flexDirection:isMobile?'column':'row'}}>

      {/* FIRST TABLE */}
      <div className='row casino-32A' style={{ marginLeft: `isMobile ? '0px':'-15px'`,marginRight:isMobile? '0px':'8px', width:isMobile ?'100%':'52%' }}>
          <div className='col-lg-12 main-market bg-gray' style={{ padding: '0px' }}>
             <div className='live-poker' style={{padding:isMobile?'0px 5px':''}}>
                  <table className={`table coupon-table table ${isMobile ?'table-bordered':''} suspendwidth`} style={{borderBottom:isMobile?'none':''}}>
                   <tbody>
                  <tr>
                      <th className={`${isMobile?'box-4':'box-30Fifte'}`}></th>
                      <th className="back box-3 text-center" style={{fontSize:isMobile?'16px':'',width:!isMobile?'9%':'',maxWidth:!isMobile?'9%':'',padding:!isMobile?'2px':''}}>Back</th>
                      <th className="box-4"></th> 
                  </tr>
                  {firstTableRows}
                  </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECOND TABLE */}
      <div className='row casino-32A' style={{ marginLeft: '0px', marginRight:isMobile? '0px':'8px', width:isMobile ?'100%':'52%'}}>
         <div className='col-lg-12 main-market bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker' style={{padding:isMobile?'0px 5px':''}}>
            <table className={`table coupon-table table ${isMobile? 'table-bordered':''} suspendwidth`} style={{borderBottom:isMobile?'none':''}}>
              <tbody>
                <tr  style={{display:isMobile ? 'none':''}}>
                  <th className={`${isMobile?'box-4':'box-30Fifte'}`}></th>
                  <th className="back box-3 text-center" style={{fontSize:isMobile?'16px':'',width:!isMobile?'9%':'',maxWidth:!isMobile?'9%':'',padding:!isMobile?'2px':''}}>Back</th>
                  <th className="box-4"></th>  
                </tr>
                {secondTableRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
       {/* THIRD TABLE */}
      <div className='row casino-32A' style={{ marginLeft: '0px', marginRight:isMobile? '0px':'0px', width:isMobile ?'100%':'52%' }}>
         <div className='col-lg-12 main-market bg-gray' style={{ padding: '0px' }}>
          <div className='live-poker' style={{padding:isMobile?'0px 5px':''}}>
            <table className={`table coupon-table table ${isMobile ?'table-bordered':''}  suspendwidth`}>
              <tbody>
                <tr  style={{display:isMobile ? 'none':''}}>
                  <th className={`${isMobile?'box-4':'box-30Fifte'}`}></th>
                  <th className="back box-3 text-center" style={{fontSize:isMobile?'16px':'',width:!isMobile?'9%':'',maxWidth:!isMobile?'9%':'',padding:!isMobile?'2px':''}}>Back</th>
                  <th className="box-4"></th>  
                </tr>
                {thirdTableRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
    </>
  )
}

export default LuckyFifteen;
