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

const UniqueTeenpatti = ({ lastOdds, liveMatchData }: any) => {
  // console.log(lastOdds,'live match data----------->>>>>>>>')
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const getPlaceBet = useAppSelector(selectPlaceBet);

  const runners = liveMatchData?.event_data?.RunnerName || [
    "Single",
    "Double",
    "Triple",
  ];

  const cardNumbers = Array.from({ length: 6 }, (_, i) => i + 1);

  // Unique Teen Patti always uses Triple market
  const activeIndex = 2;
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
        }),
      );
    }
  };

  const onCardClick = (card: string) => {
    const runnerName = "Triple";
    const limit = 3;

    // Unique Teen Patti -> Triple market
    const marketKey = 3;
    const ItemMarket = lastOdds?.[marketKey];

    if (!ItemMarket) return;

    if (selection.cards.includes(card)) return;
    if (selection.cards.length >= limit) return;

    const updated: SelectionType = {
      runnerIndex: 2,
      cards: [...selection.cards, card],
    };

    setSelection(updated);

    // Fire bet after selecting 3 cards
    if (updated.cards.length === limit) {
      placeBet(runnerName, updated.cards, ItemMarket);

      setSelection({
        runnerIndex: -1,
        cards: [],
      });
    }
  };

  React.useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      const cards = selection;
      cards.cards = [];
      setSelection(cards);
    }
  }, [getPlaceBet.status]);
  let suspend =
    lastOdds?.market[activeIndex]?.Runners[0]?.gstatus != "OPEN"
      ? "suspended"
      : "";
  //  console.log(suspend,'runners------>>>>>s')

  return (
    <div className="m-b-10 my-bet">
      <div className="new-casino">
        <div className="card-content m-b-10 col-12 live-poker unique-teenpatti-ui">
          {/* Instruction Header */}
          <div className="unique-teenpatti-heading">
            Select any 3 cards of your choice and experience TeenPatti in a
            unique way.<i className="fas fa-hand-point-down ms-1"></i>
          </div>

          {/* Cards */}
          <div className={`unique-teenpatti-cards`}>
            {cardNumbers.map((num) => {
              const marketKey = 3;

              const ItemMarket: any = lastOdds?.[marketKey];

              const isSuspended =
                !ItemMarket ||
                ItemMarket.gstatus === 0 ||
                ItemMarket.gstatus === "0" ||
                ItemMarket.gstatus === "SUSPENDED" ||
                ItemMarket.gstatus === "CLOSED";

              return (
                <div key={num} className="unique-teenpatti-card-wrapper">
                  {/* Number Circle */}
                  <div className="unique-teenpatti-number">{num}</div>

                  {/* Card */}
                  <div
                    className={`unique-teenpatti-card ${
                      isSuspended ? "suspended" : ""
                    }`}
                  >
                    <CardItemLotteryNew
                      title={String(num)}
                      onClick={() => !isSuspended && onCardClick(String(num))}
                      isSelected={selection.cards.includes(String(num))}
                      lastOdds={ItemMarket}
                      liveMatchData={liveMatchData}
                      gameCode={gameCode}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UniqueTeenpatti);
