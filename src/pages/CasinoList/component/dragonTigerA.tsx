import { useState } from "react";
import { isMobile } from "react-device-detect";
import CasinoPnl from "./casinoPnl";
import ButtonItem from "./_common/new/ButtonItem";
import Minmax from "./_common/minmax";
import CardItem from "./_common/new/CardItem";

const DragonTigerA = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const drgonCard: any = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const tigerCard: any = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37];
  const [activeTab, setActiveTab] = useState("dragon");
  const singleCard = (MarketName: any, marketIndex: any) => {
    const finalMarketList =
      liveMatchData?.defaultMarkets?.filter(
        (ItemN: any, index: number) => marketIndex.indexOf(index) > -1,
      ) || [];
    return (
      <>
        <div className="col-lg-12 col-12" style={{paddingLeft:!isMobile?'0px':'',paddingRight:!isMobile?'0px':''}}>
          <h4
            className={`m-b-0 text-center text-uppercase ${
              isMobile ? "fs-12" : "fs-20"
            }`}
          >
            <b>
              {MarketName} &nbsp;
              {`12`}
            </b>
          </h4>
        </div>
        <div
          className={`card-dt col-lg-12  col-12 text-center m-t-10 card-seven ${
            isMobile ? "p-0" : ""
          }`}  style={{paddingLeft:!isMobile?'0px':'',paddingRight:!isMobile?'0px':''}}
        >
          {finalMarketList.map((Item: any, key: number) => {
            const market = Item?.Runners?.[0] || {};
            let runName = market.RunnerName
              ? market.RunnerName.replace("Tiger ", "")
              : market.RunnerName.replace("Dragon ", "");
            runName = runName
              ? runName.replace("Dragon ", "")
              : runName.replace("Dragon ", "");
            return (
              <div
                className={`${
                  isMobile ? "m-r-0" : "m-r-0"
                } dragonTiger-dt20 card-image d-inline-block`}
                key={key}
              >
                <CardItem
                  selectionid={market.SelectionId}
                  title={runName}
                  lastOdds={lastOdds}
                  liveMatchData={liveMatchData}
                />
                <div>
                  <div className="m-t-5">
                    <CasinoPnl
                      sectionId={market.SelectionId}
                      matchId={liveMatchData.match_id}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };
  const buttonLayout = (classData: string, marketIndex: any) => {
    const finalMarketList =
      liveMatchData?.defaultMarkets?.filter(
        (ItemN: any, index: number) => marketIndex.indexOf(index) > -1,
      ) || [];
    return finalMarketList.map((Item: any, key: number) => {
      const market = Item?.Runners?.[0] || {};
      let title =
        market.RunnerName == "Dragon Red" ? (
          <span className="card-icon">
            {" "}
            <span className={"card-red"}>{"[{"}</span>{" "}
          </span>
        ) : (
          market.RunnerName
        );
      title =
        market.RunnerName == "Dragon Black" ? (
          <span className="card-icon">
            {" "}
            <span className={"card-black"}>{"]}"}</span>{" "}
          </span>
        ) : (
          title
        );
      title =
        market.RunnerName == "Tiger Black" ? (
          <span className="card-icon">
            {" "}
            <span className={"card-black"}>{"]}"}</span>{" "}
          </span>
        ) : (
          title
        );
      title =
        market.RunnerName == "Tiger Red" ? (
          <span className="card-icon">
            {" "}
            <span className={"card-red"}>{"[{"}</span>{" "}
          </span>
        ) : (
          title
        );
      return (
        <>
          {" "}
          <div key={key} className={`${classData} text-center`}>
            <div className={`row ${!isMobile?'m-t-0':'m-t-5'}`}>
              <div className="col-12 dt20-suspended text-center">
                <ButtonItem
                  selectionid={market.SelectionId}
                  title={title}
                  lastOdds={lastOdds}
                  liveMatchData={liveMatchData}
                />
              </div>
            </div>
            {/* <div className='row'>
                <div className='col-12 text-center'>
                  <div className='m-t-5' style={{ marginTop: '10px' }}>
                    <CasinoPnl sectionId={market.SelectionId} matchId={liveMatchData.match_id} />
                  </div>
                </div>
              </div> */}
          </div>
        </>
      );
    });
  };

  return (
    <div style={{background:'#f7f7f7',marginTop:isMobile?'5px':''}}>
      <div
        className="d-t-box m-b-10 buttonsuspended"
        style={{ padding: !isMobile ? "4px" : "4px" }}
      >
        <div
          className="row row6"
          style={{ marginRight: "0px", marginLeft: "0px" }}
        >
          {/* {buttonLayout('col-lg-3 col-3', [0, 1, 2])} */}
          {buttonLayout("col-lg-3 col-3 PaddingLeftdtFirst", [0])}
          {buttonLayout("col-lg-2 col-3 PaddingLeftdtSecond", [1])}
          {buttonLayout("col-lg-3 col-3 PaddingLeftdtthird", [2])}
          {buttonLayout("col-lg-3 col-3 borderLeftCustom", [3])}
          {/* <Minmax min={liveMatchData.min} max={liveMatchData.max} /> */}
        </div>
      </div>
      {/* {isMobile ? (
        <div className="home_mobile">
          <div className="mobile-header-for-casino dt20-navtabs">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  onClick={() => setActiveTab("dragon")}
                  data-toggle="tab"
                  href="#dragon"
                  className={
                    activeTab === "dragon" ? "nav-link active" : "nav-link"
                  }
                >
                  Dragon
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={() => setActiveTab("tiger")}
                  data-toggle="tab"
                  href="#tiger"
                  className={
                    activeTab === "tiger" ? "nav-link active" : "nav-link"
                  }
                >
                  Tiger
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        ""
      )} */}
      <div className="row row5" style={{marginRight:!isMobile?"0px":"0px",marginLeft:!isMobile?"0px":"0px",padding:isMobile?'5px':''}}>
        {/* {(isMobile && activeTab === "dragon") || !isMobile ? ( */}
          <div className="col-lg-6 col-12" style={{paddingRight:'0px',paddingLeft:'0px',background:isMobile?"#f2f2f2":""}}>
            <div className="d-t-box m-b-10 buttonsuspended"  style={{ padding: !isMobile ? "4px" : "",marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":"" }}> 
              <div className="row row6" style={{marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":""}}>
                <div className="col-12" style={{paddingRight:'0px',paddingLeft:'0px'}}>
                  <h4
                    className={`m-b-0 text-center text-uppercase ${
                      isMobile ? "fs-12" : "fs-20"
                    }`} style={{color:'#333'}}
                  >
                    <b> Dragon</b>
                  </h4>
                </div>
                {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding ${isMobile ? "mt-0" : "mt-10"}`,
                  [4],
                )}
                {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding5 ${isMobile ? "mt-0" : "mt-10"}`,
                  [5],
                )}
                {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding6 ${isMobile ? "mt-0" : "mt-10"}`,
                  [6],
                )}
                {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding7 ${isMobile ? "mt-0" : "mt-10"}`,
                  [7],
                )}
                {/* {buttonLayout("col-lg-6 col-3", [6, 7])} */}
                {/* <Minmax min={liveMatchData.min} max={liveMatchData.max} /> */}
              </div>
            </div>
          </div>
        {/* ) : (
          ""
        )} */}
        {/* {(isMobile && activeTab === "tiger") || !isMobile ? ( */}
          <div className="col-lg-6 col-12" style={{paddingRight:'0px',paddingLeft:'0px',background:isMobile?"#f2f2f2":""}}>
            <div className="d-t-box m-b-10 buttonsuspended"  style={{ padding: !isMobile ? "4px" : "",marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":"" }}>
              <div className="row row6" style={{marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":""}}>
                <div className="col-12" style={{paddingRight:'0px',paddingLeft:'0px'}}>
                  <h4
                    className={`m-b-0 text-center text-uppercase ${
                      isMobile ? "fs-12" : "fs-20"
                    }`}
                    style={{color:'#333'}}
                  >
                    <b> Tiger</b>
                  </h4>
                </div>
                {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding ${isMobile ? "mt-0" : "mt-10"}`,
                  [21],
                )}
                 {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding5 ${isMobile ? "mt-0" : "mt-10"}`,
                  [22],
                )}
                 {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding6 ${isMobile ? "mt-0" : "mt-10"}`,
                  [23],
                )}
                 {buttonLayout(
                  `col-lg-3 col-3 mb-10 dragonContPadding7 ${isMobile ? "mt-0" : "mt-10"}`,
                  [24],
                )}
                {/* {buttonLayout("col-lg-6 col-3", [23, 24])} */}
                {/* <Minmax min={liveMatchData.min} max={liveMatchData.max} /> */}
              </div>
            </div>
          </div>
        {/* ) : (
          ""
        )} */}
      </div>
      <div className="row row5" style={{marginLeft:isMobile?'0px':'',marginRight:isMobile?'0px':''}}>
        {/* {(isMobile && activeTab === "dragon") || !isMobile ? ( */}
          <div className="col-lg-6 col-12" style={{padding:isMobile?'5px':''}}>
            <div className={`d-t-box d-t-box2 ${isMobile?'m-b-0':'m-b-10'} buttonsuspended`}  style={{ padding: !isMobile ? "4px" : "12px 5px" }}>
              <div className={`row ${isMobile ? "m-0" : ""}`} style={{marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":"",border:!isMobile?'1px solid #cccccc':'',padding:"10px 10px 0 10px"}}>
                {singleCard("Dragon", drgonCard)}
              </div>
            </div>
          </div>
        {/* ) : (
          ""
        )} */}
        {/* {(isMobile && activeTab === "tiger") || !isMobile ? ( */}
          <div className="col-lg-6 col-12" style={{padding:isMobile?'5px':''}}>
            <div className={`d-t-box d-t-box2 ${isMobile?'m-b-0':'m-b-10'} buttonsuspended`} style={{ padding: !isMobile ? "4px" : "" ,marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":""}} >
              <div className={`row ${isMobile ? "m-0" : ""}`} style={{marginRight:!isMobile?"0px":"",marginLeft:!isMobile?"0px":"",border:!isMobile?'1px solid #cccccc':'',padding:"10px 10px 0 10px"}}>
                {singleCard("Tiger", tigerCard)}
              </div>
            </div>
          </div>
        {/* ) : (
          ""
        )} */}
      </div>
    </div>
  );
};
export default DragonTigerA;