import React from 'react'
import CasinoPnl from './casinoPnl'
import Minmax from './_common/minmax'
import ButtonItem from './_common/new/ButtonItem'
import CardItem from './_common/new/CardItem'
import { isMIUI, isMobile } from 'react-device-detect'
import { useParams } from 'react-router-dom'

const LuckSeven = (props: any) => {
    const { lastOdds, liveMatchData } = props
     const { gameCode } = useParams()
    const layout1 = () => {
        const eventData = liveMatchData?.defaultMarkets || []
        const market: any = eventData?.[0]?.Runners?.[0] || {}
        const market2: any = eventData?.[1]?.Runners?.[0] || {}
        return <div className="card-content lucky-seven-content col-12" style={{ marginBottom: !isMobile ? '16px' : '' }}>
            <div className={`row m-b-10 ${isMobile ? 'm-t-0' : 'm-t-0'}`} style={{ marginRight: !isMobile ? '0px' : '', marginLeft: !isMobile ? '0px' : '' }}>
                <div className="col-5 text-center" style={{ paddingRight: !isMobile ? '0px' : '', paddingLeft: !isMobile ? '0px' : '' }}>
                    <ButtonItem selectionid={market.SelectionId} title={market.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId}  slug={gameCode}/>
                </div>
                <div className="col-2 text-center card-seven" style={{ paddingLeft: !isMobile ? '0px' : '', paddingRight: !isMobile ? '0px' : '' }}>
                    <img src="/imgs/casino/cards/7all.jpg" className="card-seven-single" style={{
                        width: isMobile ? '100%' : '51px', height: isMobile ? '50px' : ''
                    }} />
                </div>
                <div className="col-5 text-center" style={{ paddingRight: !isMobile ? '0px' : '', paddingLeft: !isMobile ? '0px' : '' }}>
                    <ButtonItem selectionid={market2.SelectionId} title={market2.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market2.SelectionId} slug={gameCode}/>
                </div>
            </div>
            {/* <div className="row m-t-10">
                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
            </div> */}
        </div>
    }
    const layoutTwoMarket = (markets1: number, markets2: number) => {
        const market: any = liveMatchData?.defaultMarkets?.[markets1]?.Runners?.[0] || {}
        const market2: any = liveMatchData?.defaultMarkets?.[markets2]?.Runners?.[0] || {}

        let title = market.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market.RunnerName;
        title = market.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title;
        let title2 = market2.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market2.RunnerName;
        title2 = market2.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title2;

        return <div className={`${isMobile?'mt-4':''} lucky-seven-content  col-lg-6 col-5Lucky7P`} style={{ padding: '10px',marginRight:isMobile?'5px':'',maxWidth:!isMobile?"49%":"" }}>

            <div className={`row ${!isMobile?'mt-0':'mt-3'} mb-3`} style={{ marginLeft: isMobile ? '0px' : '0px', marginRight: isMobile ? '0px' : '0px', gap: isMobile ? '8px' : '8px', flexWrap: isMobile ? 'nowrap' : 'nowrap',justifyContent:"center" }}>
                <div className={`${isMobile ? 'col-6' : 'col-6Luckyseven'} text-center`} style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '' }}>
                    <ButtonItem selectionid={market.SelectionId} title={title} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                     <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} />

                </div>
                <div className={`${isMobile ? 'col-6' : 'col-6Luckyseven'} text-center`} style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '' }}>
                    <ButtonItem selectionid={market2.SelectionId} title={title2} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                     <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} />
                </div>
            </div>
            {/* <div className="row">
                <div className="col-6 text-center">
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market.SelectionId} />
                </div>
                <div className="col-6 text-center">
                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={market2.SelectionId} />
                </div>
            </div> */}
            {/* <div className="row">
                <Minmax min={liveMatchData.min} max={liveMatchData.max} />
            </div> */}
        </div>
    }
    const layout4 = () => {
        const market = liveMatchData?.defaultMarkets?.filter((Itemc: any) => Itemc.MarketName.includes('Card ')) || []
        return <div className={`${isMobile?'mt-4':''} card-content lucky-seven-content col-12`}>
            <div className={`row m-b-10 ${isMobile ? 'm-t-1' : 'm-t-10'}`} style={{marginLeft:isMobile?'0px':'',marginRight:isMobile?'0px':''}}>
                <div className="col-12 text-center m-b-10"><b >12.00</b></div>
                <div className="col-12 text-center card-seven" style={{ paddingRight: isMobile ? '0px' : '', paddingLeft: isMobile ? '0px' : ''}}>
                    {market &&
                        market.map((ItemN: any, indexRunner: number) => {
                            const currentRunner: any = ItemN?.Runners?.[0] || {}
                            return <div className="d-inline-block" key={indexRunner}>
                                <CardItem className='mb-1' selectionid={currentRunner.SelectionId} title={currentRunner.RunnerName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                                <div >
                                    <CasinoPnl matchId={liveMatchData.match_id} sectionId={currentRunner.SelectionId} />
                                </div>
                            </div>
                        })
                    }
                </div>
                {/* <Minmax min={liveMatchData.min} max={liveMatchData.max} /> */}
            </div>
        </div>
    }
    return (
        <div>
            <div className="m-b-10 my-bet">
                <div className="new-casino" style={{ marginTop: !isMobile ? '5px' : '5px',backgroundColor:isMobile ?'#f7f7f7':'' }}>
                    <div className="row row6" style={{ gap: !isMobile ? '5px' : '' }}>
                        {layout1()}
                        {layoutTwoMarket(2, 3)}
                        {layoutTwoMarket(4, 5)}
                        {layout4()}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default React.memo(LuckSeven)