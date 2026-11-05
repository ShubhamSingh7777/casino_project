import React, { useState } from "react";
import CasinoPnl from "./casinoPnl";
import UnlimitedJokerCards from "./_common/new/UnlimitedJokerCards";
import LayBackButtonUnlimited from "./_common/new/LayBackButtonUnlimited";

const UnlimitedJoker1Day = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  // console.log("LIVE DATA:", liveMatchData);

  const markets =
    liveMatchData?.event_data?.market?.[0]?.Runners || [];
  // console.log("MARKETS →", markets);
// console.log("🔥 JOKER MARKET", {
//   liveMatchId: liveMatchData?.match_id,
//   eventDataMatchId: liveMatchData?.event_data?.match_id,
//   market: liveMatchData?.event_data?.market?.[0],
//   runners: liveMatchData?.event_data?.market?.[0]?.Runners,
// });
// console.log("🔥 FULL JOKER MARKET", JSON.stringify(
//   liveMatchData?.event_data?.market?.[0],
//   null,
//   2
// ));
  // Selected card state
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

   const showCards =
    lastOdds?.cardsstring
    &&
    lastOdds.cardsstring
      .split(",")
      .every((card: string) => card.trim() === "1");


  const renderRows = (data: any[], showLay = true) => {
    return data.map((item: any, i: number) => {
      const odds = lastOdds?.[item.sid] || {};
      const status =
        !odds.gstatus || ["SUSPENDED", "CLOSED"].includes(odds.gstatus)
          ? "suspended"
          : "";
console.log("JOKER 1 DAY ITEM", item);

      return (
        <tr key={i}>
          <td className="box-6" style={{ paddingLeft: 10 }}>
            <b>{item.nat}</b>
            {/* <CasinoPnl sectionId={item.sid} matchId={liveMatchData?.match_id} /> */}
            <CasinoPnl
  sectionId={item.SelectionId}
  matchId={liveMatchData.match_id}
/>
          </td>

          <LayBackButtonUnlimited
            selectionid={item.sid}
            lastOdds={lastOdds}
            liveMatchData={liveMatchData}
            clsnamename={showLay ? "box-2" : "box-12"}
            showLay={showLay}
            selectedCard={selectedCard} 
            clsstatus ={status}
            // passing selected card
          />
        </tr>
      );
    });
  };

  const renderTable = (
    data: any[],
    showLay = true,
    showHeader = true,
    key: number
  ) => (
    <div
      key={key}
      className="col-lg-12 m-b-10 main-market"
      style={{ padding: 0 }}
    >
      <div className="live-poker">
        <table className="table coupon-table table-bordered">
          <tbody>{renderRows(data, showLay)}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ marginTop: "10px" }}>
      <div className="row casino-32A">

        {/* SHOW CARDS ONLY WHEN ALL = 1 */}
        {showCards && (
          <UnlimitedJokerCards
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        )}

        {/* Market Table */}
        {renderTable(markets, true, true, 0)}

      </div>
    </div>
  );
};
export default UnlimitedJoker1Day;