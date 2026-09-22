import { isMobile } from "react-device-detect";
import BackButtonPnl from "./component/_common/new/BackButtonPnl";
import LaybackBoxNote from "./component/_common/new/LaybackBoxNote";


const ROW_HEIGHT = "46px";

const Mogambo = (props: any) => {
  const { lastOdds, liveMatchData } = props;

  const market0 = liveMatchData?.defaultMarkets?.[0]?.Runners?.[0];
  const market1 = liveMatchData?.defaultMarkets?.[1]?.Runners?.[0];
  const market3Card = liveMatchData?.defaultMarkets?.[2]?.Runners?.[0];

  return (
    <div className="container" style={{paddingLeft:isMobile?'0px':'',paddingRight:isMobile?'0px':''}}>
      <div className="casino-32A" style={{marginTop:!isMobile?'5px':'7px'}}>

        {/* ================= ROW 1 : MOGAMBO & DAGA/TEJA ================= */}
        <div
          className={`row mb-2 main-market}`}
          style={{ height: ROW_HEIGHT ,marginRight:isMobile?'0px':'',marginLeft:isMobile?'0px':'',padding:isMobile?'0px 5px':'0'}}
        >
          <div className="col-4 col-lg-3 d-flex align-items-center fw-bold border text-table-color">
            <b>{market0?.RunnerName}</b>
          </div>
          <div className="col-2 col-lg-3 p-0">
            <div className="mogambo-suspended h-100 d-flex justify-content-center align-items-center bg-info fw-bold">
              <BackButtonPnl
                selectionid={market0?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>

          <div className="col-4 col-lg-3 d-flex align-items-center fw-bold border text-table-color">
            <b>{market1?.RunnerName}</b>  
          </div>
          <div className="col-2 col-lg-3 p-0">
            <div className="mogambo-suspended h-100 d-flex justify-content-center align-items-center bg-info fw-bold">
              <BackButtonPnl
                selectionid={market1?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>
        </div>

        {/* ================= ROW 2 : 3 CARD TOTAL ================= */}
        <div
          className={`row justify-content-center mb-2 main-market p-0}`}
          style={{ height: ROW_HEIGHT }}
        >
          <div className="col-4 col-lg-3 justify-content-center d-flex align-items-center fw-bold border text-table-color">
           <b> {market3Card?.RunnerName}</b>
          </div>
          {/* BACK  and lay*/}
          <div className="col-3 p-0 m-0"> 
            <div className="mogambo-suspended h-100 d-flex align-items-center justify-content-center text-center bg-light">
              <LaybackBoxNote
                selectionid={market3Card?.SelectionId}
                lastOdds={lastOdds}
                liveMatchData={liveMatchData}
                clsnamename=""
                needSuspend={true}
                titleStatus={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mogambo;