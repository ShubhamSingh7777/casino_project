import { isMobile } from 'react-device-detect'
import CasinoPnl from './casinoPnl'
import ButtonItem from './_common/new/ButtonItem'
import LaybackBox from './_common/new/LaybackBox'
import CardItem from './_common/new/CardItem'
import Limitinfo from './_common/limitinfo'
import LayBackButton from './_common/new/LayBackButton'

const BollywoodCasino = (props: any) => {
  const { lastOdds, liveMatchData } = props
  const cardMarketIndex: any = [6, 7, 8, 9];
  const laybacklayout = (index: any, className: string) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.[index]?.Runners || []
    return (
      finalMarketList.map((ItemNew: any, index: number) => {
        let runner = 'A'
        runner = ItemNew.RunnerName == 'Amar Akbar Anthony' ? 'B' : runner
        runner = ItemNew.RunnerName == 'Sahib Bibi Aur Ghulam' ? 'C' : runner
        runner = ItemNew.RunnerName == 'Dharam Veer' ? 'D' : runner
        runner = ItemNew.RunnerName == 'Kis KisKo Pyaar Karoon' ? 'E' : runner
        runner = ItemNew.RunnerName == 'Ghulam' ? 'F' : runner
        return (
          <div className={`${className} text-center mb-10`} key={index} style={{ paddingRight: '0px', paddingLeft: '0px' }}>
            <div>
              <span className='d-block'>
                <b>
                  <span className='text-danger'>{runner}.</span> {ItemNew.RunnerName}
                </b>
              </span>
            </div>
            <LaybackBox selectionid={ItemNew.SelectionId} title={runner} lastOdds={lastOdds} liveMatchData={liveMatchData} />
            <div className='tx-16 mt30'>
              <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} />
            </div>
          </div>
        )
      })
    )
  }
  const laybacklayoutmobile = (keyType: number) => {
    return liveMatchData?.defaultMarkets?.[keyType]?.Runners?.map((ItemNew: any, key: number) => {
      const Item: any = lastOdds?.[ItemNew.SelectionId] || {}
      let runner = "A";
      runner = ItemNew.RunnerName == "Amar Akbar Anthony" ? 'B' : runner;
      runner = ItemNew.RunnerName == "Sahib Bibi Aur Ghulam" ? 'C' : runner;
      runner = ItemNew.RunnerName == "Dharam Veer" ? 'D' : runner;
      runner = ItemNew.RunnerName == "Kis KisKo Pyaar Karoon" ? 'E' : runner;
      runner = ItemNew.RunnerName == "Ghulam" ? 'F' : runner;
      const clsstatus = !Item.gstatus || Item.gstatus === 'SUSPENDED' || Item.gstatus === 'CLOSED' ? "suspended" : "";
      return <tr data-title="SUSPENDED" className='live-poker' key={key}>
        <td className={"box-6"} style={{ paddingLeft: "3px", verticalAlign: "unset" }}><b ><span className="">{runner}</span>. {ItemNew.RunnerName}</b>
          <CasinoPnl sectionId={ItemNew?.SelectionId || 0} matchId={liveMatchData?.match_id} />
        </td>
        <LayBackButton selectionid={ItemNew.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} clsnamename={'box-2'}
          clsstatus={clsstatus} />
      </tr>
    })
  }

  const className3 = isMobile ? 'col-12 ' : 'col-6'
  const capitalizeString = (str: any) => {
    return str && str.charAt(0).toUpperCase() + str.slice(1);
  }

  const singleCard = (MarketName: any, marketIndex: any) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.filter((ItemN: any, index: number) => marketIndex.indexOf(index) > -1) || []
    return (
      <>
        <div className='col-lg-12 col-12'>
          <p className='m-b-0 text-center text-uppercase' style={{ display: "flex", alignItems: "center", justifyContent: "space-around", fontSize: isMobile ? '16px' : '', fontWeight: isMobile ? 'bold' : '' }}>
            <div>
              {/* {MarketName}  */}
              {`3.75`}</div>
            {/* <Limitinfo nameString={"cards"} min={liveMatchData.min} max={liveMatchData.max} /> */}
          </p>
        </div>
        <div className='card-dt col-lg-12  col-12 text-center m-t-10 card-seven'>
          {finalMarketList.map((Item: any, key: number) => {
            const market = Item?.Runners?.[0] || {}
            const runName = market.RunnerName
            return (
              <div className={`${isMobile ? 'm-r-0' : 'm-r-5'} card-image d-inline-block live-poker`} key={key}>
                <CardItem selectionid={market.SelectionId} title={runName} lastOdds={lastOdds} liveMatchData={liveMatchData} />
                <div>
                  <div className='m-t-5'>
                    <CasinoPnl sectionId={market.SelectionId} matchId={liveMatchData.match_id} />
                  </div>
                </div>
              </div>
            )
          })
          }
        </div>
      </>
    )
  }

  const buttonLayout = (marketIndex: any) => {
    const finalMarketList = liveMatchData?.defaultMarkets?.filter((ItemN: any, index: number) => marketIndex.indexOf(index) > -1) || []
    return finalMarketList.map((ItemNew: any, index: number) => {
      const market = ItemNew?.Runners?.[0] || {}
      let title = market.RunnerName == 'Red' ? <span className="card-icon"> <span className={"card-red"}>{"[{"}</span> </span> : market.RunnerName;
      title = market.RunnerName == 'Black' ? <span className="card-icon"> <span className={"card-black"}>{"]}"}</span> </span> : title;
      return (
        <>
          <div className={`row ${isMobile ? 'm-t-0' : 'm-t-0'} live-poker`} style={{ marginLeft: isMobile ? '0px' : '0px', marginRight: isMobile ? '0px' : '0px', padding: !isMobile ? '5px 0px' : ''}}>
            <div className='col-12 text-center' style={{ paddingLeft: isMobile ? '0px' : '0px', paddingRight: isMobile ? '0px' : '0px' }}>
              <ButtonItem selectionid={market.SelectionId} title={title} lastOdds={lastOdds} liveMatchData={liveMatchData} />
            </div>
          </div>
          <div className='row'>
            <div className='col-12 text-center'>
              <div className='m-t-5' style={{ marginTop: '10px' }}>
                <CasinoPnl sectionId={market.SelectionId} matchId={liveMatchData.match_id} />
              </div>
            </div>
          </div>
        </>
      )
    })
  }
  const layoutForMobile = () => {
    return <div className='mobile-layout' style={{ margin: '8px 5px' }}>
      <table className="table coupon-table table table-bordered btabl-casino live-poker2">
        {/* <thead >
              <tr >
                <th colSpan={3} style={{ textAlign: "left", paddingLeft:"3px" }} >
                  MIN : {liveMatchData?.min} Max : {liveMatchData?.max}
                </th>
              </tr>
            </thead> */}
        <tbody>
          {laybacklayoutmobile(0)}
        </tbody>
      </table>
      <table className="table coupon-table table table-bordered btabl-casino" style={{ marginTop: isMobile ? '24px' : '0px' }}>
        {/* <thead >
              <tr >
                <th colSpan={3} style={{ textAlign: "left", paddingLeft:"3px" }}>
                  MIN : {liveMatchData?.min} Max : {liveMatchData?.max}
                </th>
              </tr>
            </thead> */}
        <tbody className='layBackTablebollywood'>
          {laybacklayoutmobile(1)}
        </tbody>
      </table>
      <div className='row row5' style={{ marginLeft: isMobile ? '0px' : '', marginRight: isMobile ? '0px' : '', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        <div className='col-lg-12' style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '' }}>
          <div className='aaa-content m-t-10' style={{ padding: isMobile ? '5px 5px 25px' : '', borderBottom: isMobile ? 'none' : '' }}>
            <div className='row row5' style={{ marginLeft: isMobile ? '0px' : '', marginRight: isMobile ? '0px' : '', flexWrap: isMobile ? 'nowrap' : 'wrap', gap: isMobile ? '8px' : '', marginBottom: isMobile ? '15px' : '' }}>
              <div className='col-6' style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '', maxWidth: isMobile ? '49%' : '' }}>
                {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl6"} clsName={"tx-right"}/> */}
                <div className='text-center m-t-5'>{buttonLayout([4])}</div>
              </div>
              <div className='col-6' style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '', maxWidth: isMobile ? '49%' : '' }}>
                {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl7"} clsName={"tx-right"}/> */}

                <div className='text-center m-t-5'>
                  <div className='text-center '>
                    {buttonLayout([5])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
  const layoutForDesktop = () => {
    return <div className='desktop-layout'>
      <div className='aaa-content m-t-10' style={{ padding: !isMobile ? '5px 0px' : '' }}>
        {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl8"} clsName={"tx-right"}/> */}
        <div className='row' style={{ marginLeft: '0px', marginRight: '0px', gap: '10px' }}>
          {laybacklayout(0, 'col-customBolly')}
        </div>
      </div>
      <div className='row row5' style={{ marginLeft: '0px', marginRight: '0px',display:!isMobile?'flex':'',gap:!isMobile?'5px':'' }}>
        <div className={` col-lg-3 aaa-content`} style={{border:!isMobile?'1px solid #c7c8ca':'',borderBottom:!isMobile?'none':''}}>
          {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl3"} clsName={"tx-right"}/> */}
          {laybacklayout(1, '')}
        </div>
        <div className={`col-lg-9 aaa-content col-12`} style={{ padding: '0px', border: '1px solid #c7c8ca', borderBottom: 'none',maxWidth:!isMobile?'74%':''}}>
          <div className='row' style={{ marginLeft: '0px', marginRight: '0px', flexWrap: 'nowrap', padding: '0px 5px', gap: '5px' }}>
            <div className='col-6' style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: ' calc(50% - 5px)' }}>
              {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl2"} clsName={"tx-right"}/> */}
              <div className='text-center m-t-5'>{buttonLayout([4])}</div>
            </div>
            <div className='col-6' style={{ paddingLeft: '0px', paddingRight: '0px', maxWidth: '49%' }}>
              {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl5"} clsName={"tx-right"}/> */}
              <div className='text-center m-t-5'>
                <div className='text-center '>
                  {buttonLayout([5])}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  }

  return (<>
    {!isMobile ? layoutForDesktop() : ""}
    {isMobile ? layoutForMobile() : ""}
    <div className='row row5' style={{ margin: isMobile ? '8px 5px' : '13px 0px 0px 0px', gap: isMobile ? '5px' : '5px', flexWrap: !isMobile ? 'nowrap' : 'wrap' }}>
      <div className={'col-lg-6 aaa-content col-12'} style={{ paddingLeft: isMobile ? '0px' : '5px', paddingRight: isMobile ? '0px' : '5px', padding:!isMobile?'5px':'',border:!isMobile?'1px solid #c7c8ca':'',borderBottom:!isMobile?'none':'none'}}>
        {/* <Limitinfo min={liveMatchData?.event_data?.min} max={liveMatchData?.event_data?.max} nameString={"lbl"} clsName={"tx-right"}/> */}
        <div className='row row5' style={{ marginLeft: isMobile ? '0px' : '0px', marginRight: isMobile ? '0px' : '0px', flexWrap: isMobile ? 'nowrap' : 'nowrap', gap: isMobile ? '5px' : '5px', marginBottom: isMobile ? '20px' : '' }}>
          <div className='col-6' style={{ paddingLeft: isMobile ? '0px' : '0px', paddingRight: isMobile ? '0px' : '0px', maxWidth: isMobile ? '49%' : 'calc(50% - 5px)' }}>
            <div className='text-center'>{buttonLayout([2])}</div>
          </div>
          <div className='col-6' style={{ paddingLeft: isMobile ? '0px' : '', paddingRight: isMobile ? '0px' : '', maxWidth: isMobile ? '49%' : 'calc(50% - 5px)' }}>
            <div className='text-center '>{buttonLayout([3])}</div>
          </div>
        </div>
      </div>
      <div className={`${className3} col-lg-6 aaa-content`} style={{ borderBottom: isMobile ? "none" : "none", padding: !isMobile ? '5px' : '5px 5px 5px 5px' ,border:!isMobile?'1px solid #c7c8ca':'',maxWidth:!isMobile?'49.5%':''}}>
        <div style={{ minHeight: isMobile ? "80px" : '' }}>
          {singleCard('Cards', cardMarketIndex)}
        </div>
      </div>
    </div>
  </>
  )
}
export default BollywoodCasino