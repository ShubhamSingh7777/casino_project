import React from 'react'
import ButtonItemCmeter1 from './_common/new/ButtonItemCmeter1'
import { useParams } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import CasinoPnl from './casinoPnl'

const Cmeter1 = (props: any) => {
    const { lastOdds, liveMatchData } = props
    const { gameCode } = useParams()
    const layout1 = () => {
        const eventData = liveMatchData?.defaultMarkets || []
        const market: any = eventData?.[0]?.Runners?.[0] || {}
        const market2: any = eventData?.[1]?.Runners?.[0] || {}

        const colClass = isMobile ? "col-12" : "col-6";

        return <div className={`card-content lucky-seven-content ${isMobile ? 'm-b-0 p-0':'m-b-0'} col-12 bg-transparent`} style={{paddingLeft:'0px',paddingRight:'0px'}}>
            <div className={`row ${isMobile ?'m-t-5' : 'm-t-0'} `} style={{gap: isMobile ? "20px" : "5px",marginRight:'0px',marginLeft:'0px'}}>
                <div className={`${colClass} text-center`} style={{paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px',maxWidth:!isMobile?'49%':''}}>
                    <ButtonItemCmeter1 type="A" selectionid={market.SelectionId} title={market.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl
  sectionId={market.SelectionId}
  matchId={liveMatchData.match_id}
/>
                </div>
                <div className={`${colClass} text-center`} style={{maxWidth:!isMobile?'49%':'',paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px'}}>
                    <ButtonItemCmeter1 type="B" selectionid={market2.SelectionId} title={market2.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl
  sectionId={market2.SelectionId}
  matchId={liveMatchData.match_id}
/>
                </div>
            </div>
        </div>
    }
    return (
        <div>
            <div className={`my-bet ${isMobile ? 'm-b-0':'m-b-0'}`}>
                <div className="new-casino border-0">
                    <div className="row row6" style={{marginLeft:'0px',marginRight:'0px'}}>
                        {layout1()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(Cmeter1)
