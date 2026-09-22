// import CasinoPnl from './casinoPnl';
// import LayBackButton from './_common/new/LayBackButton';
// import { isMobile } from 'react-device-detect';

// const OneDayTeen = (props: any) => {
//   const { lastOdds, liveMatchData } = props

//   const laybacklayout = () => {
//     const clsnamehead = 'box-6'
//     const clsnamename = 'box-2'
//     const heightdata = ''
//     const markets = liveMatchData?.defaultMarkets?.[0]?.Runners || []
//     return (markets.map((ItemNew: any, key: number) => {
//       const Item: any = lastOdds && lastOdds[ItemNew.SelectionId] ? lastOdds[ItemNew.SelectionId] : {}
//       const clsstatus =
//       !Item.gstatus || Item.gstatus === 'SUSPENDED' || Item.gstatus === 'CLOSED' ? 'suspended' : ''
//       return (
//         (
//           <tr key={key} className={` ${heightdata}`}>
//             <td className={clsnamehead} style={{ paddingLeft: "10px" }}>
//               <b>{ItemNew.RunnerName}</b>
//               {/* <CasinoPnl sectionId={ItemNew.SelectionId} matchId={liveMatchData.match_id} /> */}
//             </td>
//             <LayBackButton selectionid={ItemNew.SelectionId} lastOdds={lastOdds} liveMatchData={liveMatchData} clsnamename={clsnamename} clsstatus={clsstatus}/>
//           </tr>
//         )
//       )
//     })
//     )
//   }
//   return (
//     <div className='container ' style={{ marginTop: "-10px" }}>
//       <div className='row casino-32A '>
//         <div className='col-lg-12 m-b-10 main-market  bg-gray' style={{ padding: '0px',marginTop:isMobile ? '10px':'' }}>
//           <div className='live-poker'>
//             <table className='table coupon-table table table-bordered'>
//               <thead>
//                 <tr>
//                   <th className={"box-6"}>
//                   </th>
//                   <th className={`back ${"box-2"}`}>BACK</th>
//                   <th className={`lay-color ${"box-2"}`}>LAY</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {laybacklayout()}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
// export default OneDayTeen

import CasinoPnl from "./casinoPnl";
import LayBackButton from "./_common/new/LayBackButton";
import { isMobile } from "react-device-detect";
import BackButton from "./_common/new/BackButton";

const OneDayTeen = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const markets = liveMatchData?.defaultMarkets?.[0]?.Runners || [];

  const desktopLayout = () => {
    const getOdds = (runner: any) => {
      const odds = lastOdds?.[runner.SelectionId] || {};

      const clsstatus =
        !odds.gstatus ||
          odds.gstatus === "SUSPENDED" ||
          odds.gstatus === "CLOSED"
          ? "suspended"
          : "";

      return { odds, clsstatus };
    };

    const playerA = markets.find((x: any) =>
      x.RunnerName.toLowerCase().includes("player a")
    );

    const playerB = markets.find((x: any) =>
      x.RunnerName.toLowerCase().includes("player b") &&
      !x.RunnerName.toLowerCase().includes("under") &&
      !x.RunnerName.toLowerCase().includes("over")
    );

    const under21 = markets.find((x: any) =>
      x.RunnerName.toLowerCase().includes("under 21")
    );

    const over21 = markets.find((x: any) =>
      x.RunnerName.toLowerCase().includes("over 21")
    );

    return (
      <>
        {/* Player A & Player B */}
        <div className="desktop-market-row">
          {[playerA, playerB].map((runner: any) => {
            if (!runner) return null;

            const { clsstatus } = getOdds(runner);

            return (
              <div className="desktop-market-card" key={runner.SelectionId}>
                <table className="table table-bordered m-0">
                  <thead>
                    <tr>
                      <th className="box-6" style={{paddingLeft:!isMobile?'5px':''}}>{runner.RunnerName}</th>
                      <th className="back box-2">Back</th>
                      <th className="lay-color box-2">Lay</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td style={{paddingLeft:!isMobile?'5px':''}}>
                        <b>Main</b>
                        <CasinoPnl
                          sectionId={runner.SelectionId}
                          matchId={liveMatchData.match_id}
                        />
                      </td>

                      <LayBackButton
                        selectionid={runner.SelectionId}
                        lastOdds={lastOdds}
                        liveMatchData={liveMatchData}
                        clsnamename="box-2"
                        clsstatus={clsstatus}
                      />
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Under / Over 21 */}
        <div className="desktop-bottom-row">
          <div className="desktop-left-space"></div>

          <div className="desktop-right-panel">
            {[under21, over21].map((runner) => {
              if (!runner) return null;

              const odds = lastOdds?.[runner.SelectionId] || {};
              const clsstatus =
                !odds.gstatus ||
                  odds.gstatus === "SUSPENDED" ||
                  odds.gstatus === "CLOSED"
                  ? "suspended"
                  : "";

              return (
                <div className="under-over-row" key={runner.SelectionId}>
                  <div className="runner-name">{runner.RunnerName}</div>

                  <BackButton
                    selectionid={runner.SelectionId}
                    lastOdds={lastOdds}
                    liveMatchData={liveMatchData}
                    clsnamename="box-3"
                    clsstatus={clsstatus}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const mobileLayout = () => {
    const rows = [];

    for (let i = 0; i < markets.length; i++) {
      const runner = markets[i];

      // Pair Under 21 & Over 21 in one row
      if (
        runner.RunnerName.includes("Under 21") &&
        markets[i + 1] &&
        markets[i + 1].RunnerName.includes("Over 21")
      ) {
        rows.push(
          <div className="mobile-double-row" key={i}>
            {[runner, markets[i + 1]].map((item) => {
              const odds = lastOdds?.[item.SelectionId] || {};

              const clsstatus =
                !odds.gstatus ||
                  odds.gstatus === "SUSPENDED" ||
                  odds.gstatus === "CLOSED"
                  ? "suspended"
                  : "";

              return (
                <div className="mobile-half-card" key={item.SelectionId}>
                  <div className="market-name">{item.RunnerName}</div>

                  {/* <LayBackButton
                    selectionid={item.SelectionId}
                    lastOdds={lastOdds}
                    liveMatchData={liveMatchData}
                    clsnamename="mobile-box"
                    clsstatus={clsstatus}
                  /> */}
                  <BackButton selectionid={item.SelectionId}
                    lastOdds={lastOdds}
                    liveMatchData={liveMatchData}
                    clsnamename="mobile-box"
                    clsstatus={clsstatus}
                  />
                </div>
              );
            })}
          </div>,
        );

        i++; // Skip next because already rendered
        continue;
      }

      const odds = lastOdds?.[runner.SelectionId] || {};

      const clsstatus =
        !odds.gstatus ||
          odds.gstatus === "SUSPENDED" ||
          odds.gstatus === "CLOSED"
          ? "suspended"
          : "";

      rows.push(
        <div className="mobile-market-card" key={runner.SelectionId}>
          <div className="mobile-header">
            <div className="mobile-header-title">{runner.RunnerName}</div>
            <div className="back">Back</div>
            <div className="lay">Lay</div>
          </div>

          <div className="mobile-body">
            <div className="main-title">Main</div>

            <LayBackButton
              selectionid={runner.SelectionId}
              lastOdds={lastOdds}
              liveMatchData={liveMatchData}
              clsnamename="mobile-box"
              clsstatus={clsstatus}
            />
          </div>
        </div>,
      );
    }

    return rows;
  };

  return (
    <div
      className="container"
      style={{
        paddingTop: isMobile ? "9px" : "5px",
        paddingRight: isMobile ? "6px" : "0px",
        paddingLeft: isMobile ? "6px" : "0px",
      }}
    >
      {isMobile ? (
        mobileLayout()
      ) : (
        <div className="desktop-layout">
          {desktopLayout()}
        </div>
      )}
    </div>
  );
};

export default OneDayTeen;