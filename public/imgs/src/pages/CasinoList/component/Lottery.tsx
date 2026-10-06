import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CardItemLotteryNew from "./_common/new/cardItemNewLottery";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { betPopup, selectPlaceBet } from "../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import authService from "../../../services/auth.service";
import { RoleType } from "../../../models/User";
import { IBetOn, IBetType } from "../../../models/IBet";
import { IApiStatus } from "../../../models/IApiStatus";
import { isMobile } from "react-device-detect";

interface SelectionType {
  runnerIndex: number;
  cards: string[];
}

const Lottery = ({ lastOdds, liveMatchData }: any) => {
  // console.log(lastOdds,'live match data----------->>>>>>>>')
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const getPlaceBet = useAppSelector(selectPlaceBet)

  const runners = liveMatchData?.event_data?.RunnerName || [
    "Single",
    "Double",
    "Triple",
  ];

  const cardNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selection, setSelection] = useState<SelectionType>({
    runnerIndex: -1,
    cards: [],
  });

  const getLimit = (runnerIndex: number) => {
    if (runnerIndex === 0) return 1;
    if (runnerIndex === 1) return 2;
    return 3;
  };
   
  const placeBet = (runnerName: string, cards: string[], ItemMarket: any) => {
  console.log("Placing bet------>", runnerName, cards, ItemMarket);

  const oddsVal = parseFloat(ItemMarket.b);
  const ipAddress = authService.getIpAddress();

  if (userState.user?.role === RoleType.user) {
    if (
      oddsVal <= 0 ||
      ItemMarket.gstatus === "SUSPENDED" ||
      ItemMarket.gstatus === "0" ||
      ItemMarket.gstatus === "CLOSED"
    )
      return;

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack: true,
          odds: oddsVal,
          volume: ItemMarket.bs || 0,
          marketId: ItemMarket.mid,
          marketName: ItemMarket.MarketName,
          matchId: liveMatchData?.event_data?.match_id || 0,

          // Selection name + cards
          selectionName: runnerName + " " + cards.join(""),
          selectionId: ItemMarket.sid,

          pnl: 0,
          stack: 0,
          currentMarketOdds: ItemMarket.b,
          eventId: ItemMarket.mid,
          exposure: 0,
          ipAddress: ipAddress,
          type: IBetType.Match,
          matchName: liveMatchData.title,
          betOn: IBetOn.CASINO,
          gtype: gameCode,

          // --- EXTRA FIELDS FOR CARDS ---
          C1: cards[0] || "",
          C2: cards[1] || "",
          C3: cards[2] || "",
        },
      })
    );
  }
};

  const onCardClick = (card: string) => {
  const runnerName = runners[activeIndex];
  const limit = getLimit(activeIndex);

  // Market key must map Single→1, Double→2, Triple→3
  const marketKey = activeIndex + 1;
  const ItemMarket = lastOdds?.[marketKey];

  if (!ItemMarket) return;

  let updated: SelectionType;

  if (selection.runnerIndex === activeIndex) {
    if (selection.cards.includes(card)) return;
    if (selection.cards.length >= limit) return;

    updated = { runnerIndex: activeIndex, cards: [...selection.cards, card] };
  } else {
    updated = { runnerIndex: activeIndex, cards: [card] };
  }

  setSelection(updated);

  // When card count = limit → FIRE BET
  if (updated.cards.length === limit) {
    const finalItemMarket = lastOdds?.[marketKey];

    placeBet(runnerName, updated.cards, finalItemMarket);

    setSelection({ runnerIndex: -1, cards: [] });
  }
  };
 
  React.useEffect(() => {
      if (getPlaceBet.status === IApiStatus.Done) {
        const cards = selection;
        cards.cards = [];
        setSelection(cards)
      }
    }, [getPlaceBet.status])
    let suspend = (lastOdds?.market[activeIndex]?.Runners[0]?.gstatus)!='OPEN'?'suspended':'';
  //  console.log(suspend,'runners------>>>>>s')

  return (
    <div className="m-b-10 my-bet">
      <div className="new-casino">
        <div className="card-content m-b-10 col-12 live-poker">
          <div className="row">
            {/* Runner Buttons */}
            <div className="col-12 m-b-10" style={{padding:isMobile ?'0px':'',display:'flex'}}>
              {runners.map((name: string, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setSelection({ runnerIndex: -1, cards: [] });
                  }}
                 style={{
                    margin: "0 0px",
                    padding: "10px 12px",
                    borderRadius: "0px",
                    border: "none",
                    borderRight: "1px solid #2C3E50",
                    background: activeIndex === i ? "#2C3E50" : "none",
                    color: activeIndex === i ? "#fff" : "#000",
                    fontWeight: "500",
                    fontSize:isMobile ?'16px':'',
                    cursor: "pointer",
                    width:isMobile ?'100%':''
                  }}
                >
                  {name}(0)
                </button>
              ))}
            </div>
            {/* Cards */}
            <div className={`col-12 d-flex flex-wrap justify-content-around ${suspend}`}>
         {cardNumbers.map((num) => {
  const marketKey = activeIndex + 1;

  // Single = 1
  // Double = 2
  // Triple = 3
  const ItemMarket: any = lastOdds?.[marketKey];

  const isSuspended =
    !ItemMarket ||
    ItemMarket.gstatus === 0 ||
    ItemMarket.gstatus === "SUSPENDED" ||
    ItemMarket.gstatus === "0" ||
    ItemMarket.gstatus === "CLOSED";
console.log(
  "ACTIVE LOTTERY MARKET:",
  activeIndex,
  lastOdds?.market?.[activeIndex]
);

console.log(
  "LOTTERY RUNNERS:",
  lastOdds?.market?.[activeIndex]?.Runners
);
  return (
    <CardItemLotteryNew
      key={`${activeIndex}-${num}`}
      title={String(num)}
      onClick={() => !isSuspended && onCardClick(String(num))}
      isSelected={selection.cards.includes(String(num))}
      lastOdds={ItemMarket}
      liveMatchData={liveMatchData}
    />
  );
})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Lottery);