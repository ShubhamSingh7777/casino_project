import React, { useState } from "react";
import CasinoPnl from "./casinoPnl";
import LayBackButton from "./_common/new/LayBackButton";
import UnlimitedJokerCards from "./_common/new/UnlimitedJokerCards";
import LayBackButtonUnlimited from "./_common/new/LayBackButtonUnlimited";
import { isMIUI, isMobile } from "react-device-detect";

const UnlimitedJoker2020 = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  // console.log("LIVE DATA:", lastOdds);
  
  const markets =
    liveMatchData?.event_data?.market?.[0]?.Runners || [];
  // console.log("MARKETS →", markets);

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

      return (
        <tr key={i} style={{width:!isMobile?'50%':''}}>
          <td className="box-6" style={{ paddingLeft: 10 ,width:!isMobile?'62%':'',maxWidth:!isMobile?'62%':'',fontSize:!isMobile?'16px':''}}>
            <b>{item.nat}</b>
          </td>

          <LayBackButtonUnlimited
            selectionid={item.sid}
            lastOdds={lastOdds}
            liveMatchData={liveMatchData}
            clsnamename={showLay ? "box-2" : "box-12"}
            showLay={showLay}
            selectedCard={selectedCard} // passing selected card
            clsstatus={status}
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
      className={`col-lg-12 col-12 ${!isMobile?'m-b-0':'m-b-10'} main-market`}
      style={{ padding: 0 }}
    >
      <div className="live-poker" style={{padding:isMobile?'0px 5px':''}}>
        <table className="table coupon-table table-bordered">
          <tbody style={{display:!isMobile?'flex':''}}>{renderRows(data, showLay)}</tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ marginTop: "10px" ,paddingLeft:isMobile?'0px':'',paddingRight:isMobile?'0px':''}}>
      <div className="row casino-32A" style={{marginLeft:isMobile?'0px':'',marginRight:isMobile?'0px':''}}>

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

export default UnlimitedJoker2020;