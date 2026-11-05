import React from 'react'
import betService from '../../../services/bet.service'
import { AxiosResponse } from 'axios'
import mobileSubheader from '../_layout/elements/mobile-subheader'

const AdminDashboard = () => {
  const [marketdata, setmarketData] = React.useState([])
  React.useEffect(() => {
    betService.getMarketAnalysis().then((res: AxiosResponse) => {
      setmarketData(res.data.data)
    })
  }, [])
  const listItem = () => {
    const htmlRender: any = []
    marketdata.map((Item: any, index: number) => {
      const htmlOutput = (
        <tr key={index} style={{display:'flex',flexDirection:'column'}}>
          <td style={{background:'#2C3E50'}}>
            <div>
              <a href={`/admin/odds/${Item.matchId}`} style={{background:'none',textTransform:'capitalize',fontSize:'16px',padding:'0px'}}>
                {Item.matchName} ({Item.betCount})
              </a>
            </div>
          </td>
          <td>
            <div className='table-borderedless table-responsive'>
              <table className='table'>
                <tbody>
                  {marketlist(
                    Item.filterMarketByMatch,
                    Item.matchWiseMarket,
                    Item.completemarket_list,
                  )}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )

      htmlRender.push(htmlOutput)
    })
    return htmlRender
  }
  const marketlist = (market: any, userbook: any, marketallow: any) => {
    return market.map((ItemMarket: any, index: number) => {
      return (
        marketallow.indexOf(ItemMarket.marketId) > -1 && (
          <tr key={index} style={{display:'flex',flexDirection:'column',marginBottom:'10px'}}>
            <td colSpan={4} style={{ whiteSpace: 'nowrap',background:'#f9f9f9',border:'none',color:'#4B3B99',fontWeight:'700',textDecoration:'underline',padding:'9px 6px' }}>
              {ItemMarket.marketName}
            </td>
            {ItemMarket.runners.map((ItemRunners: any, indexn: number) => {
              const selId = ItemRunners.selectionId || ItemRunners.sid || ItemRunners.SelectionId || ItemMarket.marketId;
              const pnlVal = userbook[`${ItemMarket.marketId}_${selId}`];

              return (
                <td key={indexn} style={{border:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  {ItemRunners.runnerName || ItemRunners.nat} {' '}
                  <span
                    className={
                      pnlVal != null && -pnlVal > 0
                        ? 'green'
                        : 'red'
                    }
                  >
                    {pnlVal != null
                      ? (-pnlVal).toFixed(2)
                      : ''}
                  </span>
                </td>
              )
            })}
          </tr>
        )
      )
    })
  }
  return (
    <>
      {mobileSubheader.subheaderdesktopadmin(
        <>
          Market Analysis <i className="fa fa-sync ms-2"></i>
        </>,
        // "You can view your cricket card books from sport menu."
      )}

      <div className='container-fluid' style={{ paddingLeft: '0px', paddingRight: '0px' }}>
        <div className='row' style={{ marginLeft: '0px', marginRight: '0px' }}>
          <div className='col-md-12 main-container'>
            <div className='card-body'>
              <div className='table-responsive data-table' style={{ overflow: 'hidden' }}>
                <table className='table table-bordered' style={{boxShadow:'inset 0 1px 1px rgba(0, 0, 0, 0.075)'}}>
                  {/* <thead>
                    <tr>
                      <th className='' style={{ padding: '10px', border: 'none', borderBottom: '1px solid #1e1e1e' }}>
                        Event Name
                      </th>
                      <th className='' style={{ padding: '10px', border: 'none', borderBottom: '1px solid #1e1e1e' }}>
                        Team
                      </th>
                    </tr>
                  </thead> */}
                  <tbody>{listItem()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default AdminDashboard;